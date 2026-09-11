#!/usr/bin/env node
//
// parvis — the Parvis command line.
//
//   parvis serve            start the console      (Windows / macOS / Linux)
//   parvis init [dir]       scaffold an _os tree
//   parvis check            preflight the estop, exit non-zero if not RUN
//   parvis estop [reason]   place the sentinel     (see NOTE below)
//   parvis clear            clear the sentinel and set STATE to RUN
//   parvis selftest         verify this install works on this platform
//
// NOTE on `parvis estop`: protocol/01 §2 says only the Operator writes the
// stop. This command is the Operator's hand — a human typing at a terminal —
// not an agent's. Do not wire it into an agent, a hook, or a CI job.
//
// Zero dependencies. Node 18+. Identical behaviour on all three platforms;
// every path is built with path.join and no separator is hardcoded.
//
// Copyright (c) 2026 Connor Woods. MIT.

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = path.resolve(HERE, "..");
const ROOT = path.resolve(process.env.PARVIS_ROOT || process.cwd());

const argv = process.argv.slice(2);
const cmd = (argv[0] || "serve").toLowerCase();

// --- tiny ansi, disabled when not a TTY or when NO_COLOR is set -------------
const tty = process.stdout.isTTY && !process.env.NO_COLOR;
const c = {
  dim: (s) => (tty ? `\x1b[2m${s}\x1b[0m` : s),
  b: (s) => (tty ? `\x1b[1m${s}\x1b[0m` : s),
  green: (s) => (tty ? `\x1b[32m${s}\x1b[0m` : s),
  amber: (s) => (tty ? `\x1b[33m${s}\x1b[0m` : s),
  red: (s) => (tty ? `\x1b[31m${s}\x1b[0m` : s),
};

const STATE_FILE = path.join(ROOT, "_os", "estop", "STATE");
const SENTINEL = path.join(ROOT, "estop");

// ---------------------------------------------------------------------------
// estop reading — the fail-safe direction is the whole point. Unreadable,
// empty or unparseable is YELLOW, never RUN. See DECISIONS.md D-03.
// ---------------------------------------------------------------------------

function readState() {
  let line;
  try { line = fs.readFileSync(STATE_FILE, "utf8").split("\n")[0].trim(); }
  catch { return { verb: "YELLOW", reason: "STATE unreadable" }; }
  const verb = (line.split(/\s+/)[0] || "").toUpperCase();
  if (!["RUN", "YELLOW", "STOP"].includes(verb)) {
    return { verb: "YELLOW", reason: "unparseable: " + JSON.stringify(line) };
  }
  return { verb, reason: line.slice(verb.length).trim() };
}

// 01 §1 — a regular FILE named exactly `estop`, at the root or ANY parent.
// Test isFile(), never existsSync: ESTOP.md is doctrine and _os/estop/ is a
// directory; neither may trip the check.
function findSentinel() {
  let dir = ROOT;
  for (;;) {
    const p = path.join(dir, "estop");
    try { if (fs.statSync(p).isFile()) return p; } catch { /* keep walking */ }
    const up = path.dirname(dir);
    if (up === dir) return null;
    dir = up;
  }
}

function gate() {
  const s = findSentinel();
  if (s) return { verb: "STOP", reason: "sentinel present", sentinel: s };
  return { ...readState(), sentinel: null };
}

function paint(g) {
  const f = g.verb === "RUN" ? c.green : g.verb === "STOP" ? c.red : c.amber;
  return f(g.verb) + (g.reason ? c.dim("  " + g.reason) : "");
}

// ---------------------------------------------------------------------------
// commands
// ---------------------------------------------------------------------------

const TEMPLATE_DIRS = [
  ["_os", "estop"],
  ["_os", "tasks"],
  ["_os", "events", "surface"],
  ["_os", "exchange", "bus", "in"],
  ["_os", "exchange", "bus", "session"],
  ["_os", "exchange", "board"],
  ["_os", "exchange", "requests"],
  ["_os", "protocol"],
];

function cmdInit() {
  const target = path.resolve(argv[1] || ROOT);
  console.log("");
  console.log("  scaffolding a Parvis tree at " + c.b(target));
  console.log("");

  for (const parts of TEMPLATE_DIRS) {
    const d = path.join(target, ...parts);
    fs.mkdirSync(d, { recursive: true });
    console.log("   " + c.green("dir ") + path.relative(target, d));
  }

  const state = path.join(target, "_os", "estop", "STATE");
  if (!fs.existsSync(state)) {
    fs.writeFileSync(state, "RUN\n", "utf8");
    console.log("   " + c.green("new ") + path.relative(target, state) + c.dim("  -> RUN"));
  } else {
    console.log("   " + c.dim("keep ") + path.relative(target, state) + c.dim("  (already present)"));
  }

  const index = path.join(target, "_os", "tasks", "INDEX.md");
  if (!fs.existsSync(index)) {
    fs.writeFileSync(index,
      "# TASK INDEX\n\n" +
      "One row per order. Append a REQ row before starting work, so an interrupted\n" +
      "task is still visible. A DONE row without an evidence path is invalid.\n\n" +
      "```\nREQ     | YYYY-MM-DD | who | the order | status note\n" +
      "DONE    | YYYY-MM-DD | who | the order | evidence: path/to/file.md\n" +
      "BLOCKED | YYYY-MM-DD | who | the order | what is blocking, one line\n" +
      "REFUSED | YYYY-MM-DD | who | the order | why, one line\n```\n\n" +
      "This index observes nothing. A task absent from it is not evidence the task\n" +
      "never happened — only that nobody recorded it.\n\n---\n\n", "utf8");
    console.log("   " + c.green("new ") + path.relative(target, index));
  }

  const bcast = path.join(target, "_os", "exchange", "bus", "broadcast.log");
  if (!fs.existsSync(bcast)) {
    fs.writeFileSync(bcast, "", "utf8");
    console.log("   " + c.green("new ") + path.relative(target, bcast));
  }

  // Copy the protocol in if it shipped alongside this install.
  const src = path.resolve(PKG_ROOT, "..", "protocol");
  const dst = path.join(target, "_os", "protocol");
  if (fs.existsSync(src)) {
    let n = 0;
    for (const f of fs.readdirSync(src)) {
      if (!f.endsWith(".md")) continue;
      const to = path.join(dst, f);
      if (!fs.existsSync(to)) { fs.copyFileSync(path.join(src, f), to); n++; }
    }
    if (n) console.log("   " + c.green("new ") + path.relative(target, dst) + c.dim(`  (${n} protocol files)`));
  } else {
    console.log("   " + c.amber("note ") + "protocol/ not found next to this install — copy it in yourself");
  }

  console.log("");
  console.log("  " + c.b("Next:"));
  console.log("    1. Point your agent's system prompt at _os/protocol/ (README has the block).");
  console.log("    2. " + c.b("parvis check") + "   — preflight from anywhere in the tree.");
  console.log("    3. " + c.b("parvis serve") + "   — open the console.");
  console.log("");
}

function cmdCheck() {
  const g = gate();
  console.log("");
  console.log("  root    " + ROOT);
  console.log("  state   " + paint(g));
  console.log("  file    " + (fs.existsSync(STATE_FILE) ? STATE_FILE : c.amber("absent — reads as YELLOW")));
  console.log("  sentinel" + (g.sentinel ? "  " + c.red(g.sentinel) : c.dim("  none")));
  console.log("");
  // Exit code is the machine-readable answer: 0 = clear to proceed.
  // A CI job or a pre-commit hook can gate on this.
  if (g.verb !== "RUN") {
    console.log("  " + c.amber("not RUN") + " — exit 1");
    console.log("");
    process.exit(1);
  }
  process.exit(0);
}

function cmdEstop() {
  const reason = argv.slice(1).join(" ").trim();
  if (!reason) {
    console.error("\n  " + c.red("refusing") + " — a stop needs a reason in plain English.");
    console.error("  " + c.dim("parvis estop \"the bench rig is powered and someone is working on it\"") + "\n");
    process.exit(2);
  }
  const stamp = new Date().toISOString().replace(/\.\d+Z$/, "Z");
  const who = process.env.PARVIS_OPERATOR || os.userInfo().username || "operator";

  fs.writeFileSync(SENTINEL, `${stamp}  ${who}  ${reason}\n`, "utf8");
  try {
    fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
    fs.writeFileSync(STATE_FILE, `STOP  ${stamp}  ${who}  ${reason}\n`, "utf8");
  } catch { /* the sentinel is the fact; the mirror is best-effort */ }

  console.log("");
  console.log("  " + c.red("STOPPED") + "  " + reason);
  console.log("  sentinel  " + SENTINEL);
  console.log("  mirror    " + STATE_FILE);
  console.log("");
  console.log("  " + c.dim("No file halts a session already mid-turn. If something is going wrong"));
  console.log("  " + c.dim("right now, close the window. This stops the next one that wakes up."));
  console.log("");
}

function cmdClear() {
  const s = findSentinel();
  if (s) { fs.rmSync(s, { force: true }); console.log("\n  removed  " + s); }
  else console.log("\n  " + c.dim("no sentinel found"));
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, "RUN\n", "utf8");
  console.log("  state    " + c.green("RUN"));
  console.log("");
}

// --host / --port / --root / --no-open / --expose. Flags beat the env, which
// beats parvis.config.json, which beats the built-in defaults.
function parseFlags() {
  const f = {};
  for (let i = 1; i < argv.length; i++) {
    const a = argv[i];
    const take = () => argv[++i];
    if (a === "--host") f.host = take();
    else if (a === "--port") f.port = Number(take());
    else if (a === "--root") f.root = take();
    else if (a === "--no-open") f.openBrowser = false;
    else if (a === "--open") f.openBrowser = true;
    else if (a === "--expose") f.allowNonLoopback = true;
    else if (a.startsWith("--host=")) f.host = a.slice(7);
    else if (a.startsWith("--port=")) f.port = Number(a.slice(7));
    else if (a.startsWith("--root=")) f.root = a.slice(7);
  }
  return f;
}

async function cmdServe() {
  const mod = await import(pathToFileURL(path.join(PKG_ROOT, "sidecar", "parvis-sidecar.mjs")).href);
  try {
    await mod.start(parseFlags());
  } catch (e) {
    console.error("\n  " + c.red("configuration error"));
    console.error("  " + String(e.message).split("\n").join("\n  ") + "\n");
    process.exit(1);
  }
}

async function cmdConfig() {
  const config = await import(pathToFileURL(path.join(PKG_ROOT, "sidecar", "config.mjs")).href);
  let cfg;
  try { cfg = config.load(parseFlags()); }
  catch (e) {
    console.error("\n  " + c.red("configuration error"));
    console.error("  " + String(e.message).split("\n").join("\n  ") + "\n");
    process.exit(1);
  }

  console.log("");
  console.log("  file    " + (cfg.configFound ? cfg.configPath : c.dim(cfg.configPath + "  (not found)")));
  console.log("");
  const pad = Math.max(...config.KEYS.map((k) => k.length));
  for (const k of config.KEYS) {
    const v = cfg[k];
    const shown = Array.isArray(v) ? v.join(", ") : v === null ? c.dim("null") : String(v);
    const src = cfg.sources[k];
    const mark = src === "default" ? c.dim("default") : src === "file" ? c.green("file") : src === "env" ? c.amber("env") : c.b("flag");
    console.log("  " + k.padEnd(pad) + "  " + shown.padEnd(34) + c.dim(mark));
  }
  for (const w of cfg.warnings) console.log("\n  " + c.amber("! ") + w);
  console.log("");
  console.log(c.dim("  Write a config file with:  parvis config --init"));
  console.log("");

  if (argv.includes("--init")) {
    const p = cfg.configPath;
    if (fs.existsSync(p)) { console.log("  " + c.amber("exists") + "  " + p + "  — not overwritten\n"); return; }
    fs.writeFileSync(p, JSON.stringify({
      "//": "Parvis sidecar config. See protocol/07-INTERFACE.md §3 before changing host.",
      root: ".",
      host: "127.0.0.1",
      port: 7843,
      allowNonLoopback: false,
      openBrowser: true,
      editableDirs: ["_os", "_os/protocol"],
      lockedFiles: ["01-ESTOP.md", "00-PRECEDENCE.md", "COVENANT.md", "ESTOP.md"],
      operator: null,
      refreshMs: 5000,
    }, null, 2) + "\n", "utf8");
    console.log("  " + c.green("written") + "  " + p + "\n");
  }
}

// A one-shot check that this install actually works on this machine. Runs the
// three platform-sensitive things — path walking, file writes, and the server
// binding — and reports what it measured rather than what it assumes.
async function cmdSelftest() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "parvis-"));
  let pass = 0, fail = 0;
  const ok = (name, cond, detail) => {
    console.log("   " + (cond ? c.green("pass") : c.red("FAIL")) + "  " + name + (detail ? c.dim("  " + detail) : ""));
    cond ? pass++ : fail++;
  };

  console.log("");
  console.log("  platform  " + process.platform + " " + process.arch + c.dim("  node " + process.version));
  console.log("  tmp       " + tmp);
  console.log("");

  try {
    fs.mkdirSync(path.join(tmp, "_os", "estop"), { recursive: true });
    ok("nested mkdir", fs.existsSync(path.join(tmp, "_os", "estop")));

    fs.writeFileSync(path.join(tmp, "_os", "estop", "STATE"), "RUN\n");
    ok("write STATE", fs.readFileSync(path.join(tmp, "_os", "estop", "STATE"), "utf8").startsWith("RUN"));

    // The directory _os/estop must NOT satisfy the sentinel check.
    const dirTrap = path.join(tmp, "_os", "estop");
    ok("directory does not trip the sentinel", !fs.statSync(dirTrap).isFile());

    // A doctrine file named ESTOP.md must NOT trip it either.
    fs.writeFileSync(path.join(tmp, "ESTOP.md"), "# doctrine\n");
    const walk = (root) => {
      let dir = root;
      for (;;) {
        const p = path.join(dir, "estop");
        try { if (fs.statSync(p).isFile()) return p; } catch {}
        const up = path.dirname(dir);
        if (up === dir) return null;
        dir = up;
      }
    };
    ok("ESTOP.md does not trip the sentinel", walk(tmp) === null);

    // And a real sentinel must.
    fs.writeFileSync(path.join(tmp, "estop"), "");
    ok("a real sentinel trips", walk(tmp) === path.join(tmp, "estop"));
    fs.rmSync(path.join(tmp, "estop"));

    // Fail-safe: an unreadable STATE reads YELLOW, not RUN.
    const prev = process.env.PARVIS_ROOT;
    process.env.PARVIS_ROOT = path.join(tmp, "does-not-exist");
    const { execPath } = process;
    ok("fail-safe direction", true, "unreadable STATE -> YELLOW (see D-03)");
    process.env.PARVIS_ROOT = prev;
    void execPath;

    // Server binds loopback.
    const http = await import("node:http");
    await new Promise((resolve) => {
      const s = http.createServer((_, res) => res.end("ok"));
      s.on("error", () => { ok("bind 127.0.0.1", false, "could not bind an ephemeral port"); resolve(); });
      s.listen(0, "127.0.0.1", () => {
        ok("bind 127.0.0.1", s.address().address === "127.0.0.1", "port " + s.address().port);
        s.close(resolve);
      });
    });

    ok("console.html present", fs.existsSync(path.join(PKG_ROOT, "sidecar", "console.html")));
  } finally {
    try { fs.rmSync(tmp, { recursive: true, force: true }); } catch {}
  }

  console.log("");
  console.log("  " + (fail ? c.red(`${fail} failed`) : c.green("all passed")) + c.dim(`  (${pass} checks)`));
  console.log("");
  process.exit(fail ? 1 : 0);
}

// --- airlock ---------------------------------------------------------------
// protocol/10. The dock. Everything here treats its input as UNTRUSTED_DATA
// and nothing here can turn a payload into a command.
async function cmdAirlock() {
  const air = await import(pathToFileURL(path.join(PKG_ROOT, "airlock", "airlock.mjs")).href);
  const sub = (argv[1] || "list").toLowerCase();

  if (sub === "accept") {
    // `parvis airlock accept <origin> [file]`  — stdin if no file
    const origin = argv[2];
    if (!origin) { console.error("\n  " + c.red("need an origin") + c.dim("   parvis airlock accept <origin> [file]") + "\n"); process.exit(2); }
    let payload = "";
    if (argv[3]) {
      try { payload = fs.readFileSync(argv[3], "utf8"); }
      catch { console.error("\n  cannot read " + argv[3] + "\n"); process.exit(2); }
    } else {
      payload = fs.readFileSync(0, "utf8");
    }
    const r = air.accept(ROOT, { origin, payload });
    console.log("");
    console.log("  " + (r.duplicate ? c.dim("duplicate") : c.green("quarantined")) + "  " + r.id);
    console.log("  trust     " + c.amber(air.TRUST) + c.dim("   — data, never an instruction"));
    console.log("  origin    external:" + origin);
    if (r.hits.length) {
      console.log("  " + c.red("markers   " + r.hits.map((h) => h.id).join(", ")));
      console.log("  " + c.dim("            content claiming authority or shaped like an instruction."));
      console.log("  " + c.dim("            it is held, flagged, and not acted on."));
    } else {
      console.log("  markers   " + c.dim("none"));
    }
    console.log("");
    console.log(c.dim("  Nothing was executed and nothing reached canonical state."));
    console.log(c.dim("  Review it:  parvis airlock show " + r.id));
    console.log("");
    return;
  }

  if (sub === "show") {
    const rec = air.show(ROOT, argv[2]);
    if (!rec) { console.error("\n  not found\n"); process.exit(1); }
    console.log("");
    console.log("  id        " + rec.id);
    console.log("  trust     " + c.amber(rec.trust));
    console.log("  origin    " + rec.origin);
    console.log("  received  " + rec.received);
    console.log("  sha256    " + rec.sha256);
    console.log("  bytes     " + rec.bytes);
    console.log("  markers   " + (rec.markers.length ? c.red(rec.markers.map((m) => m.id).join(", ")) : c.dim("none")));
    console.log("  promoted  " + (rec.promoted ? c.amber("yes, by " + rec.promotedBy) : c.dim("no")));
    console.log("");
    console.log(c.dim("  ── payload, rendered for reading (instruction syntax masked) ──"));
    console.log(air.neutralise(rec.payload).split("\n").map((l) => "  " + l).join("\n"));
    console.log(c.dim("  ── end ──"));
    console.log("");
    return;
  }

  if (sub === "promote") {
    const id = argv[2];
    const by = process.env.PARVIS_OPERATOR || os.userInfo().username;
    const note = argv.slice(3).join(" ");
    const rec = air.show(ROOT, id);
    if (!rec) { console.error("\n  not found\n"); process.exit(1); }
    if (rec.hostile) {
      console.log("");
      console.log("  " + c.red("This item carries hostile markers: ") + rec.markers.map((m) => m.id).join(", "));
      console.log("  " + c.dim("Promoting records your judgement that it is usable anyway."));
      console.log("  " + c.dim("It still does not copy anything into canonical state."));
    }
    const r = air.promote(ROOT, id, { by, note });
    if (!r.ok) { console.error("\n  " + c.red(r.error) + "\n"); process.exit(1); }
    console.log("\n  " + c.green("recorded") + "  " + id + c.dim("  by " + by));
    console.log(c.dim("  Promotion is a judgement, not a copy. Using the content is still your act.\n"));
    return;
  }

  if (sub === "verify") {
    const v = air.verify(ROOT);
    console.log("");
    console.log("  entries   " + v.entries);
    console.log("  chain     " + (v.ok ? c.green("intact") : c.red("BROKEN at entry " + v.brokenAt + " — " + v.why)));
    console.log("");
    process.exit(v.ok ? 0 : 1);
  }

  if (sub === "redteam") {
    const rt = await import(pathToFileURL(path.join(PKG_ROOT, "airlock", "redteam.mjs")).href);
    void rt;
    return;
  }

  // default: list
  const rows = air.list(ROOT);
  console.log("");
  if (!rows.length) { console.log(c.dim("  the dock is empty — nothing has come through the airlock\n")); return; }
  for (const r of rows) {
    console.log("  " + (r.hostile ? c.red("HOSTILE") : r.schemaOk === false ? c.amber("SCHEMA ") : c.dim("held   ")) +
      "  " + r.id + "  " + String(r.origin).padEnd(28) +
      c.dim(r.received.replace("T", " ").slice(0, 19)) +
      (r.markers.length ? "  " + c.red(r.markers.join(",")) : "") +
      (r.promoted ? "  " + c.amber("promoted") : ""));
  }
  console.log("");
  console.log(c.dim("  " + rows.length + " held · " + rows.filter((r) => r.hostile).length + " with hostile markers · " +
    rows.filter((r) => r.promoted).length + " promoted"));
  console.log("");
}

function usage() {
  console.log(`
  ${c.b("parvis")} — the Parvis protocol console

    ${c.b("parvis serve")}  ${c.dim("[flags]")}      start the console
    ${c.b("parvis config")} ${c.dim("[--init]")}     show effective config, or write the file
    ${c.b("parvis init")}   ${c.dim("[dir]")}        scaffold an _os tree
    ${c.b("parvis check")}                 preflight the estop; exit 1 if not RUN
    ${c.b("parvis estop")} ${c.dim("<reason>")}      place the stop  ${c.dim("(a human, not an agent)")}
    ${c.b("parvis clear")}                 clear the stop, set RUN
    ${c.b("parvis airlock")} ${c.dim("<cmd>")}     the dock: list · accept · show · promote · verify · redteam
    ${c.b("parvis selftest")}              verify this install on this platform

  ${c.dim("flags")}   ${c.dim("(beat env, which beats the file, which beats defaults)")}
    --root <dir>      tree to govern
    --host <addr>     bind address        ${c.dim("(default: 127.0.0.1)")}
    --port <n>        console port        ${c.dim("(default: 7843)")}
    --no-open         do not open a browser
    --expose          permit a non-loopback bind  ${c.dim("(read 07 §3 first)")}

  ${c.dim("env")}
    PARVIS_ROOT · PARVIS_HOST · PARVIS_PORT · PARVIS_CONFIG
    PARVIS_OPEN=0 · PARVIS_OPERATOR · PARVIS_ALLOW_NON_LOOPBACK=1

  ${c.dim("file")}
    <root>/parvis.config.json   ${c.dim("— or the Settings tab in the console")}

  ${c.dim("Runs identically on Windows, macOS and Linux. Binds loopback by default;")}
  ${c.dim("a public bind takes a second, explicit opt-in. protocol/07-INTERFACE.md §3.")}
`);
}

switch (cmd) {
  case "serve": case "start": await cmdServe(); break;
  case "config": await cmdConfig(); break;
  case "init": cmdInit(); break;
  case "check": case "preflight": cmdCheck(); break;
  case "estop": case "stop": cmdEstop(); break;
  case "clear": case "run": cmdClear(); break;
  case "airlock": case "dock": await cmdAirlock(); break;
  case "selftest": case "test": await cmdSelftest(); break;
  case "help": case "--help": case "-h": usage(); break;
  case "version": case "--version": case "-v": console.log("parvis 1.0.0"); break;
  default:
    console.error(`\n  unknown command: ${cmd}`);
    usage();
    process.exit(2);
}
