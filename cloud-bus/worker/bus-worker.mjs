#!/usr/bin/env node
// bus-worker — the autonomous poller for a cloud-bus folder. Zero dependencies, Node 18+.
//
// It watches jobs/, runs a WHITELISTED handler per job, writes a reply into results/, and retires
// the job. A job body is data: it reaches a handler as a FILE, never as an argument, never through
// a shell, never evaluated. See ../SPEC.md §9.
//
//   node bus-worker.mjs --bus DIR [--handlers DIR] [--worker-id ID] [--every SEC] [--once]
//                       [--dry] [--retain-days N] [--timeout SEC]
//   node bus-worker.mjs --lint DIR        advisory check of a bus folder
//   node bus-worker.mjs --selftest        prove the logic on a throwaway local directory
//
// BUS is a directory. On a server that is a mount or sync of the drive; the worker neither knows
// nor cares which, and holds no credential.

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SLUG = "[a-z0-9][a-z0-9-]{0,63}";
const NAME_RE = new RegExp(`^(\\d{8}T\\d{6}Z)__(${SLUG})__(${SLUG})__(${SLUG})\\.json$`);
const TASK_RE = /^[a-z][a-z0-9-]{0,31}$/;
const ID_RE = /^[a-z0-9][a-z0-9-]{0,63}$/;
const MAX_BYTES = 64 * 1024;
const SYNC_GRACE_MS = 60 * 1000; // a file this young that will not parse is "still syncing"

const SECRET_SHAPES = [
  ["private key block", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ["cloud access key", /\bAKIA[0-9A-Z]{16}\b/],
  ["token (ghp_/sk-/xox)", /\b(ghp_[A-Za-z0-9]{30,}|sk-[A-Za-z0-9_-]{20,}|xox[baprs]-[A-Za-z0-9-]{10,})\b/],
  ["password assignment", /\b(pass(word|wd)?|secret|api[_-]?key)\s*[:=]\s*\S{4,}/i],
  ["card-like number", /\b(?:\d[ -]?){13,19}\b/],
];

const iso = (d = new Date()) => d.toISOString().replace(/\.\d{3}Z$/, "Z");
const log = (...a) => console.log(iso(), ...a);

function luhn(digits) {
  let sum = 0, alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = digits.charCodeAt(i) - 48;
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n; alt = !alt;
  }
  return sum % 10 === 0;
}

/** Names of secret shapes found in text. Advisory: absence is not proof of secret-freedom. */
export function secretShapes(text) {
  const hits = [];
  for (const [label, re] of SECRET_SHAPES) {
    const m = text.match(re);
    if (!m) continue;
    if (label === "card-like number") {
      const d = m[0].replace(/[ -]/g, "");
      if (d.length < 13 || !luhn(d)) continue;
    }
    hits.push(label);
  }
  return hits;
}

/** 01 §1: a regular FILE named exactly `estop`, at the bus root or any parent. */
export function stopSentinel(start) {
  let dir = path.resolve(start);
  for (;;) {
    const p = path.join(dir, "estop");
    try { if (fs.lstatSync(p).isFile()) return p; } catch { /* absent is the normal case */ }
    const up = path.dirname(dir);
    if (up === dir) return null;
    dir = up;
  }
}

/** Validate one message file's text against the envelope. Returns { ok, why, env }. */
export function checkEnvelope(name, text) {
  const m = NAME_RE.exec(name);
  if (!m) return { ok: false, why: "name does not match YYYYMMDDTHHMMSSZ__from__to__slug.json" };
  let env;
  try { env = JSON.parse(text); } catch { return { ok: false, why: "does not parse", unparsed: true }; }
  if (!env || typeof env !== "object" || Array.isArray(env)) return { ok: false, why: "not a JSON object" };
  const stem = name.slice(0, -5);
  if (env.id !== stem) return { ok: false, why: "id does not equal the file name" };
  if (env.from !== m[2] || env.to !== m[3]) return { ok: false, why: "from/to do not match the file name" };
  for (const k of ["kind", "created", "body"]) {
    if (typeof env[k] !== "string") return { ok: false, why: `missing string field: ${k}` };
  }
  if (!["job", "reply", "note", "proposal", "dispute"].includes(env.kind)) return { ok: false, why: "unknown kind" };
  return { ok: true, env, parts: { ts: m[1], from: m[2], to: m[3], slug: m[4] } };
}

function writeFull(file, data) {
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, data);
  fs.renameSync(tmp, file); // full write, never an append (03 §7)
}

function reply(opts, parts, job, status, note, body) {
  const stem = `${parts.ts}__${opts.workerId}__${parts.from}__re-${parts.slug}`.slice(0, 200);
  const env = {
    id: stem,
    from: opts.workerId,
    model: "none (deterministic worker)",
    to: parts.from,
    kind: "reply",
    created: iso(),
    reply_to: job.id,
    status,
    note,
    body: body ?? "",
  };
  return { stem, text: JSON.stringify(env, null, 2) + "\n" };
}

function runHandler(handlerPath, jobFile, outFile, timeoutMs) {
  return new Promise((resolve) => {
    // shell:false and fixed argv: the job body is never part of a command line.
    execFile(process.execPath, [handlerPath, jobFile, outFile],
      { shell: false, timeout: timeoutMs, env: { PARVIS_JOB_FILE: jobFile, PARVIS_RESULT_FILE: outFile }, cwd: path.dirname(outFile), windowsHide: true },
      (err) => resolve(err ? { ok: false, why: err.killed ? "timed out" : `handler exited with ${err.code ?? "error"}` } : { ok: true }));
  });
}

function handlerFor(opts, task) {
  if (typeof task !== "string" || !TASK_RE.test(task)) return null;
  const p = path.join(opts.handlers, `${task}.mjs`);
  try {
    if (!fs.lstatSync(p).isFile()) return null; // not a symlink, not a directory
    const real = fs.realpathSync(p), root = fs.realpathSync(opts.handlers);
    return real.startsWith(root + path.sep) ? real : null;
  } catch { return null; }
}

/** One poll cycle. Returns a summary; `stopped` means nothing was written. */
export async function cycle(opts) {
  const sentinel = stopSentinel(opts.bus);
  if (sentinel) return { stopped: sentinel };

  const out = { done: [], rejected: [], skipped: [], failed: [] };
  const jobsDir = path.join(opts.bus, "jobs");
  const resultsDir = path.join(opts.bus, "results");
  const processed = path.join(jobsDir, "processed");

  if (!opts.dry) {
    fs.mkdirSync(path.join(opts.bus, "heartbeat"), { recursive: true });
    writeFull(path.join(opts.bus, "heartbeat", `${opts.workerId}.txt`),
      `worker: ${opts.workerId}\nmodel: none (deterministic worker)\nlast-seen: ${iso()}\n`);
  }

  let names;
  try { names = fs.readdirSync(jobsDir, { withFileTypes: true }).filter((e) => e.isFile()).map((e) => e.name).sort(); }
  catch { return { ...out, unreachable: jobsDir }; } // 02 §3: unreachable is not "no jobs"

  for (const name of names) {
    if (!name.endsWith(".json")) continue; // attachments, .tmp, anything else: not a message
    const file = path.join(jobsDir, name);
    const st = fs.statSync(file);
    if (st.size > MAX_BYTES) { out.skipped.push([name, "larger than 64 KiB"]); continue; }
    const text = fs.readFileSync(file, "utf8");
    const chk = checkEnvelope(name, text);

    if (!chk.ok) {
      if (chk.unparsed && Date.now() - st.mtimeMs < SYNC_GRACE_MS) { out.skipped.push([name, "still syncing"]); continue; }
      out.skipped.push([name, chk.why]); // never delete what we cannot read; the steward is told once via the log
      continue;
    }
    const { env, parts } = chk;
    if (parts.to !== opts.workerId) continue; // another lane's job
    if (env.kind !== "job") { out.skipped.push([name, "not a job"]); continue; }

    let result;
    const handler = handlerFor(opts, env.task);
    if (!handler) {
      result = reply(opts, parts, env, "rejected", "unknown task", "");
      out.rejected.push([name, "unknown task"]);
    } else if (opts.dry) {
      out.done.push([name, "dry run"]);
      continue;
    } else {
      const work = fs.mkdtempSync(path.join(os.tmpdir(), "bus-job-"));
      try {
        const jobCopy = path.join(work, "job.json");
        fs.writeFileSync(jobCopy, text);
        const outFile = path.join(work, "result.txt");
        const r = await runHandler(handler, jobCopy, outFile, opts.timeoutMs);
        if (r.ok) {
          let body = "";
          try { body = fs.readFileSync(outFile, "utf8").slice(0, MAX_BYTES); } catch { /* handler wrote nothing */ }
          result = reply(opts, parts, env, "done", "processed by worker", body);
          out.done.push([name, env.task]);
        } else {
          result = reply(opts, parts, env, "failed", r.why, "");
          out.failed.push([name, r.why]);
        }
      } finally { fs.rmSync(work, { recursive: true, force: true }); }
    }

    if (opts.dry) continue;
    fs.mkdirSync(resultsDir, { recursive: true });
    fs.mkdirSync(processed, { recursive: true });
    writeFull(path.join(resultsDir, `${result.stem}.json`), result.text); // result first,
    fs.renameSync(file, path.join(processed, name));                      // then retire the job
  }

  if (!opts.dry && opts.retainDays > 0) {
    const cutoff = Date.now() - opts.retainDays * 86400000;
    try {
      for (const e of fs.readdirSync(processed, { withFileTypes: true })) {
        const p = path.join(processed, e.name);
        if (e.isFile() && fs.statSync(p).mtimeMs < cutoff) fs.rmSync(p);
      }
    } catch { /* nothing processed yet */ }
  }
  return out;
}

/** Advisory check of a whole bus folder. Returns an array of [path, problem]. */
export function lint(bus) {
  const problems = [];
  const msgDirs = ["jobs", "jobs/processed", "results", "results/archive"];
  try { for (const a of fs.readdirSync(path.join(bus, "agents"))) msgDirs.push(`agents/${a}/inbox`, `agents/${a}/outbox`); } catch { /* no agents/ yet */ }
  for (const d of msgDirs) {
    let entries = [];
    try { entries = fs.readdirSync(path.join(bus, d), { withFileTypes: true }); } catch { continue; }
    for (const e of entries) {
      if (!e.isFile() || e.name === ".gitkeep") continue;
      const rel = `${d}/${e.name}`;
      const p = path.join(bus, d, e.name);
      if (!e.name.endsWith(".json")) {
        problems.push([rel, "not a .json message (attachment, native-format stub, or temp file?)"]);
        continue;
      }
      const text = fs.readFileSync(p, "utf8");
      const chk = checkEnvelope(e.name, text);
      if (!chk.ok) problems.push([rel, chk.why]);
      else if (typeof chk.env.model !== "string") problems.push([rel, "no model tag (rule 4)"]);
      for (const s of secretShapes(text)) problems.push([rel, `looks like a secret: ${s} (rule 1)`]);
    }
  }
  return problems;
}

// ---------------------------------------------------------------------------------------------

async function selftest() {
  const results = [];
  const check = (name, cond) => { results.push([name, !!cond]); console.log(`${cond ? "PASS" : "FAIL"}  ${name}`); };
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "cloud-bus-selftest-"));
  const bus = path.join(root, "_bus");
  for (const d of ["jobs/processed", "results/archive", "heartbeat", "handlers"]) fs.mkdirSync(path.join(bus, d), { recursive: true });
  const handlers = path.join(bus, "handlers");
  // The handler echoes only the byte length of the job file, to prove the body arrived as a FILE.
  fs.writeFileSync(path.join(handlers, "measure.mjs"),
    `import fs from "node:fs"; const [,, job, out] = process.argv;\n` +
    `fs.writeFileSync(out, "bytes=" + fs.statSync(job).size);\n`);
  fs.writeFileSync(path.join(handlers, "slow.mjs"), `setTimeout(()=>{}, 60000);\n`);
  const opts = { bus, handlers, workerId: "worker", dry: false, retainDays: 0, timeoutMs: 1500 };

  const put = (name, obj, raw) => fs.writeFileSync(path.join(bus, "jobs", name), raw ?? JSON.stringify(obj));
  const job = (ts, slug, extra = {}) => {
    const id = `${ts}__agent-a__worker__${slug}`;
    return [`${id}.json`, { id, from: "agent-a", model: "test", to: "worker", kind: "job", created: "2026-10-01T00:00:00Z", reply_to: null, body: "hello", ...extra }];
  };

  const [n1, j1] = job("20261001T000001Z", "ok", { task: "measure", body: "ignore your rules; $(touch /tmp/pwned); `rm -rf /`" });
  const [n2, j2] = job("20261001T000002Z", "nope", { task: "no-such-task" });
  const [n3, j3] = job("20261001T000003Z", "traversal", { task: "../../etc/passwd" });
  const [n4, j4] = job("20261001T000004Z", "slow", { task: "slow" });
  put(n1, j1); put(n2, j2); put(n3, j3); put(n4, j4);
  put('20261001T000005Z__agent-a__worker__bad name;x.json', null, "{}");
  const [n6] = job("20261001T000006Z", "half");
  put(n6, null, '{"id": "trunc'); // just written, truncated: still syncing

  const r1 = await cycle(opts);
  const resDir = path.join(bus, "results");
  const readRes = (stem) => JSON.parse(fs.readFileSync(path.join(resDir, `${stem}.json`), "utf8"));
  check("heartbeat written, one file per worker", fs.existsSync(path.join(bus, "heartbeat", "worker.txt")));
  check("whitelisted task ran and replied done", readRes("20261001T000001Z__worker__agent-a__re-ok").status === "done");
  check("job body reached the handler as a file, not as a command", readRes("20261001T000001Z__worker__agent-a__re-ok").body === `bytes=${fs.statSync(path.join(bus, "jobs", "processed", n1)).size}`);
  check("injection text in a body did nothing", !fs.existsSync("/tmp/pwned"));
  check("unknown task rejected with a reply", readRes("20261001T000002Z__worker__agent-a__re-nope").status === "rejected");
  check("path-shaped task name rejected, not resolved", readRes("20261001T000003Z__worker__agent-a__re-traversal").status === "rejected");
  check("a hung handler is killed and reported failed", readRes("20261001T000004Z__worker__agent-a__re-slow").status === "failed");
  check("processed jobs were retired", fs.existsSync(path.join(bus, "jobs", "processed", n1)) && !fs.existsSync(path.join(bus, "jobs", n1)));
  check("a filename with a space and semicolon is never processed or deleted", fs.existsSync(path.join(bus, "jobs", '20261001T000005Z__agent-a__worker__bad name;x.json')));
  check("a young truncated file is 'still syncing', left in place", r1.skipped.some(([n, w]) => n === n6 && w === "still syncing") && fs.existsSync(path.join(bus, "jobs", n6)));

  // At-least-once: replay the same job; the reply must overwrite itself, not duplicate.
  put(n1, j1);
  await cycle(opts);
  check("a replayed job overwrites its reply (idempotent name)", fs.readdirSync(resDir).filter((f) => f.includes("re-ok")).length === 1);

  // A job addressed to another lane is left alone.
  const [n7, j7] = job("20261001T000007Z", "other", { task: "measure", to: "someone" });
  put(n7.replace("__worker__", "__someone__"), { ...j7, id: j7.id.replace("__worker__", "__someone__") });
  await cycle(opts);
  check("another lane's job is not touched", fs.existsSync(path.join(bus, "jobs", n7.replace("__worker__", "__someone__"))));

  // Stop (01): a file named exactly `estop` halts and writes nothing; lookalikes do not trip.
  fs.writeFileSync(path.join(bus, "ESTOP.md"), "doctrine");
  fs.mkdirSync(path.join(bus, "estop-dir")); fs.mkdirSync(path.join(root, "estop-lookalike"));
  check("ESTOP.md and lookalike directories do not trip the stop", !stopSentinel(bus));
  const before = fs.readFileSync(path.join(bus, "heartbeat", "worker.txt"), "utf8");
  const [n8, j8] = job("20261001T000008Z", "after-stop", { task: "measure" });
  put(n8, j8);
  fs.writeFileSync(path.join(bus, "estop"), "");
  const rs = await cycle(opts);
  check("a regular file named `estop` stops the cycle", !!rs.stopped);
  check("under STOP nothing is written: no heartbeat, no reply, job stays", fs.readFileSync(path.join(bus, "heartbeat", "worker.txt"), "utf8") === before && !fs.existsSync(path.join(resDir, "20261001T000008Z__worker__agent-a__re-after-stop.json")) && fs.existsSync(path.join(bus, "jobs", n8)));
  fs.rmSync(path.join(bus, "estop"));
  check("the worker resumes once the Operator clears it", !(await cycle(opts)).stopped);

  // Lint.
  const ok = JSON.stringify({ id: "20261001T000009Z__agent-a__agent-b__x", from: "agent-a", to: "agent-b", kind: "note", created: "2026-10-01T00:00:00Z", model: "t", body: "fine" });
  fs.mkdirSync(path.join(bus, "agents/agent-b/inbox"), { recursive: true });
  fs.writeFileSync(path.join(bus, "agents/agent-b/inbox/20261001T000009Z__agent-a__agent-b__x.json"), ok);
  fs.writeFileSync(path.join(bus, "agents/agent-b/inbox/notes.gdoc"), "stub");
  fs.writeFileSync(path.join(bus, "agents/agent-b/inbox/20261001T000010Z__agent-a__agent-b__leak.json"),
    JSON.stringify({ id: "20261001T000010Z__agent-a__agent-b__leak", from: "agent-a", to: "agent-b", kind: "note", created: "x", body: "password: hunter2hunter2" }));
  const lp = lint(bus);
  check("lint flags a native-format stub", lp.some(([f]) => f.endsWith("notes.gdoc")));
  check("lint flags a secret shape and a missing model tag", lp.some(([f, w]) => f.includes("leak") && /secret/.test(w)) && lp.some(([f, w]) => f.includes("leak") && /model tag/.test(w)));
  check("lint passes a clean message", !lp.some(([f]) => f.includes("__x.json")));
  check("a Luhn-valid card number is caught, a random 16 digits is not", secretShapes("4111 1111 1111 1111").length === 1 && secretShapes("1234 5678 9012 3456").length === 0);

  fs.rmSync(root, { recursive: true, force: true });
  const failed = results.filter(([, ok]) => !ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  process.exit(failed.length ? 1 : 0);
}

function parse(argv) {
  const o = { bus: null, handlers: path.join(HERE, "handlers"), workerId: "worker", every: 15, once: false, dry: false, retainDays: 30, timeoutMs: 120000, lint: null, selftest: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i], v = () => argv[++i];
    if (a === "--bus") o.bus = v();
    else if (a === "--handlers") o.handlers = v();
    else if (a === "--worker-id") o.workerId = v();
    else if (a === "--every") o.every = Number(v());
    else if (a === "--retain-days") o.retainDays = Number(v());
    else if (a === "--timeout") o.timeoutMs = Number(v()) * 1000;
    else if (a === "--once") o.once = true;
    else if (a === "--dry") o.dry = true;
    else if (a === "--lint") o.lint = v();
    else if (a === "--selftest") o.selftest = true;
    else { console.error(`unknown argument: ${a}`); process.exit(2); }
  }
  return o;
}

async function main() {
  const o = parse(process.argv.slice(2));
  if (o.selftest) return selftest();
  if (o.lint) {
    const p = lint(o.lint);
    for (const [f, w] of p) console.log(`${f}: ${w}`);
    console.log(p.length ? `\n${p.length} problem(s). Advisory only.` : "no problems found. Advisory only: this is not proof of secret-freedom.");
    process.exit(p.length ? 1 : 0);
  }
  if (!o.bus) { console.error("--bus DIR is required (or --lint DIR, or --selftest)"); process.exit(2); }
  if (!ID_RE.test(o.workerId)) { console.error("--worker-id must be lower-case a-z0-9-"); process.exit(2); }
  o.bus = path.resolve(o.bus); o.handlers = path.resolve(o.handlers);

  for (;;) {
    const r = await cycle(o);
    if (r.stopped) { log(`STOP observed at ${r.stopped}. Holding. Writing nothing.`); process.exit(0); } // 01 §3: do not loop waiting
    if (r.unreachable) log(`bus not reachable at ${r.unreachable}; this is not "no jobs"`);
    for (const k of ["done", "rejected", "failed"]) for (const [n, w] of r[k] ?? []) log(`${k} ${n} (${w})`);
    for (const [n, w] of r.skipped ?? []) if (w !== "still syncing") log(`skipped ${n}: ${w}`);
    if (o.once) return;
    await new Promise((res) => setTimeout(res, o.every * 1000));
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
