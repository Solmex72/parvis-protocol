#!/usr/bin/env node
//
// PARVIS SIDECAR — the loopback bridge between a browser page and the tree.
//
//   parvis serve                    (preferred)
//   node sidecar/parvis-sidecar.mjs (direct)
//
// Governed by protocol/07-INTERFACE.md. The contract, in one line:
//
//     The page reads. The sidecar writes. The Operator commits.
//
// This process reads the tree for the page and writes what the page submits.
// It NEVER spawns an agent, NEVER runs a command, and NEVER sends anything
// outward. A prompt submitted from the UI is an INDUCTION, not an EXECUTION:
// it becomes a REQ row in the task index and stops there.
//
// Zero dependencies. Node 18+. Identical on Windows, macOS and Linux.
//
// Copyright (c) 2026 Connor Woods. MIT — see LICENSE.

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import * as config from "./config.mjs";
import * as airlock from "../airlock/airlock.mjs";
import { parseIndex, withLedgerLock } from "./ledger.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CONSOLE_HTML = path.join(HERE, "console.html");

// ---------------------------------------------------------------------------
// One session token, minted at startup. The page gets it from the document
// this process served; anything else must present it. 07 §3.
//
// This is NOT user authentication. It proves a request came from the page we
// handed out, which is what defeats a drive-by request from another origin.
// It is not a substitute for keeping the bind address on loopback.
// ---------------------------------------------------------------------------
const TOKEN = crypto.randomBytes(32).toString("hex");

export function createServer(cfg) {
  const ROOT = cfg.root;
  const STATE_FILE = path.join(ROOT, "_os", "estop", "STATE");
  const TASK_INDEX = path.join(ROOT, "_os", "tasks", "INDEX.md");
  const SURFACE_DIR = path.join(ROOT, "_os", "events", "surface");
  const BUS_DIR = path.join(ROOT, "_os", "exchange", "bus");
  const BUS_LOG = path.join(BUS_DIR, "broadcast.log");
  const BOARD_FILE = path.join(ROOT, "_os", "exchange", "board", "BOARD.md");
  const LOCKED = new Set(cfg.lockedFiles);

  // -------------------------------------------------------------------------
  // ESTOP — 01 §2. THE FAIL-SAFE DIRECTION MATTERS MORE THAN ANY OTHER LINE.
  //
  // The original implementation read:
  //     try { return read(STATE)... } catch { return "RUN" }
  // That inverts the fail-safe: every disk error, permission change, rename
  // and typo silently becomes an authorisation to proceed. Recorded as defect
  // D-03 in DECISIONS.md.
  //
  // Unreadable, empty, or unparseable is YELLOW. Never RUN.
  // -------------------------------------------------------------------------
  function estopState() {
    let line;
    try { line = fs.readFileSync(STATE_FILE, "utf8").split("\n")[0].trim(); }
    catch { return { verb: "YELLOW", reason: "STATE unreadable at " + STATE_FILE }; }
    const verb = (line.split(/\s+/)[0] || "").toUpperCase();
    if (verb !== "RUN" && verb !== "YELLOW" && verb !== "STOP") {
      return { verb: "YELLOW", reason: "STATE verb unparseable: " + JSON.stringify(line) };
    }
    return { verb, reason: line.slice(verb.length).trim() };
  }

  // 01 §1 — the sentinel is the fact; STATE is a derived mirror. A regular
  // FILE named exactly `estop`, at the root or ANY parent. Test isFile(),
  // never existsSync: ESTOP.md is doctrine and _os/estop/ is a directory, and
  // neither may trip the check — a matcher that let them would create a stop
  // the Operator cannot clear.
  function sentinelPath() {
    let dir = ROOT;
    for (;;) {
      const p = path.join(dir, "estop");
      try { if (fs.statSync(p).isFile()) return p; } catch { /* keep walking up */ }
      const up = path.dirname(dir);
      if (up === dir) return null;
      dir = up;
    }
  }

  // If any signal says stopped, we are stopped. If we cannot tell, we are not
  // running.
  function gate() {
    const sentinel = sentinelPath();
    if (sentinel) return { verb: "STOP", reason: "sentinel present", sentinel };
    return { ...estopState(), sentinel: null };
  }

  // -------------------------------------------------------------------------
  // PATH SAFETY — 07 §3. Allowlist, then re-resolve and confirm containment.
  // An allowlist alone is not enough where symlinks exist.
  // -------------------------------------------------------------------------
  function editableFiles() {
    const out = [];
    for (const d of cfg.editableDirs) {
      let entries;
      try { entries = fs.readdirSync(path.join(ROOT, d)); } catch { continue; }
      for (const f of entries) if (f.endsWith(".md")) out.push(d.replace(/\\/g, "/") + "/" + f);
    }
    return out.sort();
  }

  function resolveEditable(rel) {
    if (typeof rel !== "string" || !editableFiles().includes(rel)) return null;
    let real, realRoot;
    try {
      real = fs.realpathSync(path.resolve(ROOT, rel));
      realRoot = fs.realpathSync(ROOT);
    } catch { return null; }
    if (real !== realRoot && !real.startsWith(realRoot + path.sep)) return null;
    return real;
  }

  // -------------------------------------------------------------------------
  // HTTP helpers
  // -------------------------------------------------------------------------
  const json = (res, obj, code = 200) => {
    const b = Buffer.from(JSON.stringify(obj));
    res.writeHead(code, {
      "content-type": "application/json; charset=utf-8",
      "content-length": b.length,
      "cache-control": "no-store",
      "content-security-policy": "default-src 'none'",
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
    });
    res.end(b);
  };

  const readBody = (req, limit = 2_000_000) =>
    new Promise((resolve, reject) => {
      let b = "", n = 0;
      req.on("data", (chunk) => {
        n += chunk.length;
        if (n > limit) { reject(new Error("body too large")); req.destroy(); return; }
        b += chunk;
      });
      req.on("end", () => resolve(b));
      req.on("error", reject);
    });

  const readJson = async (req) => { try { return JSON.parse((await readBody(req)) || "{}"); } catch { return {}; } };

  // 07 §3 — Host allowlist defeats DNS rebinding: the attack where a page you
  // visit resolves a hostname to your loopback address and then talks to this
  // service. Built from the configured bind address, so an intentional LAN
  // bind still works while an unexpected Host is still refused.
  const hostNames = config.isLoopback(cfg.host)
    ? ["127.0.0.1", "localhost", "[::1]"]
    : ["127.0.0.1", "localhost", "[::1]", cfg.host];
  const HOST_OK = new Set(hostNames.map((h) => `${h}:${cfg.port}`));
  const ORIGIN_OK = new Set(hostNames.map((h) => `http://${h}:${cfg.port}`));

  const originOk = (req) => {
    const o = req.headers.origin;
    return !o || ORIGIN_OK.has(o);   // same-origin fetches send no Origin
  };

  const tokenOk = (req) => {
    const t = req.headers["x-parvis-token"];
    if (typeof t !== "string" || t.length !== TOKEN.length) return false;
    return crypto.timingSafeEqual(Buffer.from(t), Buffer.from(TOKEN));
  };

  // -------------------------------------------------------------------------
  // State the console renders. 07 §2.2: a value with no live source shows "—",
  // never a plausible-looking number. Hence null rather than 0 on failure.
  // -------------------------------------------------------------------------
  function snapshot() {
    const g = gate();
    let files = null, dirs = null, truncated = false, unreadable = 0;
    try {
      let f = 0, d = 0;
      (function walk(dir, depth) {
        // A depth guard is necessary — a symlink loop would otherwise never
        // return. But a guard that trips makes the count PARTIAL, and 02 §4
        // says a count is a measurement: reporting a truncated total as if it
        // were complete is the quiet inaccuracy this protocol exists to stop.
        // So the trip is recorded and surfaced, not swallowed.
        if (depth > 12) { truncated = true; return; }
        let entries;
        try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
        catch { unreadable++; return; }   // permissions, races, vanished dirs
        for (const e of entries) {
          if (e.name === "node_modules" || e.name === ".git") continue;
          if (e.isDirectory()) { d++; walk(path.join(dir, e.name), depth + 1); }
          else f++;
        }
      })(ROOT, 0);
      files = f; dirs = d;
    } catch { /* leave null -> the UI renders "—" */ }

    return {
      estop: g.verb,
      reason: g.reason || "",
      sentinel: g.sentinel,
      root: ROOT,
      files, dirs,
      // partial === the numbers above are a floor, not a total
      partial: truncated || unreadable > 0,
      truncated,
      unreadable,
      readAt: new Date().toISOString(),
      exposed: !config.isLoopback(cfg.host),
      host: cfg.host,
      port: cfg.port,
      refreshMs: cfg.refreshMs,
      live: true,
    };
  }

  // -------------------------------------------------------------------------
  // READ-ONLY PANELS — the task ledger, the bus, the surface feed, the board.
  // 04 §3: a row is "a claim with an evidence path attached", never proof.
  // -------------------------------------------------------------------------
  function tailLines(file, n) {
    let txt;
    try { txt = fs.readFileSync(file, "utf8"); } catch { return null; }
    return txt.split(/\r?\n/).filter((l) => l.trim()).slice(-n);
  }

  // One parser for every reader (ledger.mjs): a real row carries a real date,
  // so the template's `YYYY-MM-DD | who | ...` example never registers as fleet
  // state; and a REQ with a later DONE/BLOCKED/REFUSED that names it (`closes
  // <key>`) or repeats its text is `closed`, so the floor stops counting it.
  function taskRows(limit = 80) {
    const lines = tailLines(TASK_INDEX, 5000);
    if (lines === null) return null;
    // raw is what /tasks/amend must be pinned to: a client can only amend a row
    // it actually read, so it sends this back verbatim. key is the same row's
    // content hash, the handle the watcher and the manifest use.
    const rows = parseIndex(lines.join("\n")).map((r) => ({
      status: r.status, date: r.date, who: r.who, what: r.what, evidence: r.evidence, raw: r.raw,
      key: r.key, closed: r.closed, taken: r.taken,
    }));
    return rows.slice(-limit).reverse();
  }

  // 03 §2 — time  from > to  VERB  text
  const BUS_RE = /^(\S+)\s+(\S+)\s*>\s*(\S+)\s+(FLASH|ASK|ANS|TELL|GATE|ACK)\s+(.*)$/;

  function busLines(limit = 80) {
    const lines = tailLines(BUS_LOG, 3000);
    if (lines === null) return null;
    const out = lines.map((l) => {
      const m = BUS_RE.exec(l);
      // 03 §1: if you cannot read it with cat, it is malformed. Show that
      // rather than dropping the line — a silently skipped message is worse
      // than a visibly broken one.
      return m
        ? { time: m[1], from: m[2], to: m[3], verb: m[4], text: m[5], malformed: false }
        : { raw: l, malformed: true };
    });
    return out.slice(-limit).reverse();
  }

  function surfaceFeed(limit = 60) {
    let entries;
    try { entries = fs.readdirSync(SURFACE_DIR, { withFileTypes: true }); } catch { return null; }
    const files = entries.filter((e) => e.isFile() && e.name.endsWith(".md")).map((e) => {
      let mtime = null, size = null;
      try { const st = fs.statSync(path.join(SURFACE_DIR, e.name)); mtime = st.mtime.toISOString(); size = st.size; }
      catch { /* raced with a delete */ }
      return { name: e.name, mtime, size };
    });
    files.sort((a, b) => String(b.mtime).localeCompare(String(a.mtime)));
    return files.slice(0, limit);
  }

  // -------------------------------------------------------------------------
  // THE FLOOR — 09-FLOOR.md. One directory level rendered as a warehouse:
  // directories are pallets, live agents are cranes, REQ rows are inducts,
  // surface files are spurs.
  //
  // Every value here is measured from disk this request. Where a thing cannot
  // be determined, the field is null and the renderer draws grey — it never
  // guesses a position or a state, because a floor that shows green over a red
  // zone is lying (09 §3).
  // -------------------------------------------------------------------------

  const SESSION_DIR = path.join(ROOT, "_os", "exchange", "bus", "session");
  const HOT_MS = 10 * 60 * 1000;   // "recently touched" window
  const LIVE_MS = 90 * 1000;       // a crane counts as moving within this

  // A path from the UI is a relative directory inside the root. Same
  // containment discipline as the document editor: resolve, then confirm.
  function resolveDir(rel) {
    const clean = String(rel || "").replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
    if (clean.split("/").includes("..")) return null;
    let real, realRoot;
    try {
      real = fs.realpathSync(path.resolve(ROOT, clean));
      realRoot = fs.realpathSync(ROOT);
    } catch { return null; }
    if (real !== realRoot && !real.startsWith(realRoot + path.sep)) return null;
    try { if (!fs.statSync(real).isDirectory()) return null; } catch { return null; }
    return { abs: real, rel: clean };
  }

  function floor(relPath) {
    const dir = resolveDir(relPath);
    if (!dir) return null;
    const now = Date.now();
    const g = gate();

    // --- pallets: the directories on this level ---------------------------
    const pallets = [];
    let loose = 0;
    let entries = [];
    try { entries = fs.readdirSync(dir.abs, { withFileTypes: true }); } catch { /* unreadable */ }

    for (const e of entries) {
      if (e.name === "node_modules" || e.name === ".git") continue;
      if (!e.isDirectory()) { loose++; continue; }
      const abs = path.join(dir.abs, e.name);
      let dirs = null, files = null, mtime = null;
      try {
        const kids = fs.readdirSync(abs, { withFileTypes: true });
        dirs = kids.filter((k) => k.isDirectory()).length;
        files = kids.length - dirs;
        mtime = fs.statSync(abs).mtime.toISOString();
      } catch { /* leave null -> renders grey */ }
      pallets.push({
        name: e.name,
        rel: dir.rel ? dir.rel + "/" + e.name : e.name,
        dirs, files,
        mtime,
        hot: mtime ? (now - Date.parse(mtime)) < HOT_MS : false,
      });
    }
    pallets.sort((a, b) => a.name.localeCompare(b.name));

    // --- cranes: agents with a session marker ------------------------------
    // A marker is written at sign-on and deleted by its own owner at sign-off
    // (08 §4), so the set of markers is the set of agents that believe they
    // are on the floor.
    const cranes = [];
    let markers = [];
    try { markers = fs.readdirSync(SESSION_DIR).filter((f) => f.endsWith(".on")); } catch { /* none */ }

    // Last bus line per agent gives recency and a hint of what it is doing.
    const lastByAgent = new Map();
    const busAll = tailLines(BUS_LOG, 600) || [];
    for (const l of busAll) {
      const m = BUS_RE.exec(l);
      if (!m) continue;
      lastByAgent.set(m[2], { time: m[1], verb: m[4], text: m[5] });
    }

    // Open REQ rows per agent — scheduled work, blue.
    const openByAgent = new Map();
    for (const r of taskRows(400) || []) {
      if (r.status !== "REQ" || r.closed || r.taken) continue;
      openByAgent.set(r.who, (openByAgent.get(r.who) || 0) + 1);
    }

    const palletNames = new Set(pallets.map((p) => p.name));

    for (const f of markers) {
      // <AGENT>-<id>.on
      const id = f.replace(/\.on$/, "");
      const agent = id.includes("-") ? id.slice(0, id.lastIndexOf("-")) : id;
      let signedOn = null;
      try { signedOn = fs.statSync(path.join(SESSION_DIR, f)).mtime.toISOString(); } catch {}

      const last = lastByAgent.get(agent) || null;
      const lastMs = last ? Date.parse(last.time) : (signedOn ? Date.parse(signedOn) : NaN);
      const recent = Number.isFinite(lastMs) && (now - lastMs) < LIVE_MS;

      // Where is it working? Only if the agent's own last message names a
      // directory on THIS floor. Otherwise null — the crane parks at the dock
      // and renders grey rather than being placed somewhere invented.
      let at = null;
      if (last) {
        for (const name of palletNames) {
          if (new RegExp("(^|[\\s/\"'`])" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([\\s/\"'`,.]|$)").test(last.text)) { at = name; break; }
        }
      }

      const gated = last && last.verb === "GATE";
      cranes.push({
        agent,
        session: id,
        signedOn,
        at,
        state: g.verb === "STOP" ? "stopped"
             : gated ? "gated"
             : recent ? "moving"
             : "idle",
        last: last ? last.time : null,
        note: last ? (last.verb + " " + last.text).slice(0, 120) : null,
        scheduled: openByAgent.get(agent) || 0,
      });
    }
    cranes.sort((a, b) => a.agent.localeCompare(b.agent));

    // Agents with queued work but no session marker: scheduled, not on the
    // floor. Drawn blue at the induct dock.
    //
    // 09 §3 — red outranks the glance, so a stop applies here too. An agent
    // showing blue on a red floor would be the exact lie the rule forbids:
    // "a floor that shows green over a red zone is lying."
    for (const [who, n] of openByAgent) {
      if (cranes.some((cr) => cr.agent === who)) continue;
      cranes.push({
        agent: who, session: null, signedOn: null, at: null,
        state: g.verb === "STOP" ? "stopped" : "scheduled",
        last: null, note: null, scheduled: n,
      });
    }

    const spurs = (surfaceFeed(500) || []).length;
    const inducts = [...openByAgent.values()].reduce((a, b) => a + b, 0);

    const parts = dir.rel ? dir.rel.split("/") : [];
    return {
      path: dir.rel,
      parent: parts.length ? parts.slice(0, -1).join("/") : null,
      breadcrumb: parts,
      pallets,
      looseFiles: loose,
      cranes,
      inducts,
      spurs,
      estop: g.verb,
      reason: g.reason || "",
      readAt: new Date().toISOString(),
    };
  }

  // -------------------------------------------------------------------------
  // INDUCTION — 07 §1. A prompt becomes a REQ row. It does not become a
  // process. This function contains no exec, no spawn, and no network call,
  // and that is load-bearing rather than incidental.
  // -------------------------------------------------------------------------
  // An agent id is a bare name. Anything else could escape the inbox path.
  const AGENT_RE = /^[A-Za-z0-9][A-Za-z0-9_-]{0,39}$/;

  async function induct(prompt, agent) {
    const stamp = new Date().toISOString();
    const day = stamp.slice(0, 10);
    const oneLine = String(prompt).replace(/[\r\n]+/g, " ").trim().slice(0, 500);
    const by = cfg.operator || "parvis-console";
    const target = agent && AGENT_RE.test(agent) ? agent : null;

    fs.mkdirSync(path.dirname(TASK_INDEX), { recursive: true });
    fs.mkdirSync(SURFACE_DIR, { recursive: true });

    // 04 §3 — the REQ row is appended before any work starts, so an
    // interrupted task is still visible. Append-only: this is a log.
    // The row is the canonical record; the inbox line below only points at it.
    const who = target || by;
    const note = target ? `inducted from the crane control by ${by}, awaiting ${target}`
                        : "inducted from the console, awaiting the Operator";
    const row = `REQ     | ${day} | ${who} | ${oneLine} | ${note}\n`;
    // One writer at a time (ledger.mjs): an append that lands mid-rewrite is lost.
    // Awaited, so a foreign holder stalls this request and never the whole server.
    await withLedgerLock(ROOT, async () => fs.appendFileSync(TASK_INDEX, row, "utf8"), "induct");

    // Addressed work also drops a line in that agent's inbox — as a TELL, and
    // deliberately never as an order.
    //
    // 03 §5: an inbox informs, it never commands, and a file that claims the
    // Operator's authority from inside the tree is a security event. So this
    // line reports that a REQ row exists and names who inducted it. The
    // authority is the Operator in conversation; this is a notification that
    // points at the record, which is the only shape a file may take.
    let inbox = null;
    if (target) {
      const dir = path.join(BUS_DIR, "in");
      fs.mkdirSync(dir, { recursive: true });
      inbox = path.join(dir, `${target}.log`);
      fs.appendFileSync(inbox,
        `${stamp}  CONSOLE > ${target}  TELL  REQ row inducted for you by ${by}: ${oneLine}\n`, "utf8");
    }

    // 04 §2 — the substance goes to its home, a pointer goes to the surface.
    const slug = oneLine.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "induction";
    const ptr = path.join(SURFACE_DIR, `${stamp.replace(/[:.]/g, "").slice(0, 15)}-${slug}.md`);
    fs.writeFileSync(ptr,
      `# Induction from the Parvis console\n\n` +
      `- **When:** ${stamp}\n- **By:** ${by}\n` +
      (target ? `- **Addressed to:** ${target}\n` : "") +
      `- **Prompt:** ${oneLine}\n` +
      `- **Row:** appended to \`_os/tasks/INDEX.md\`\n` +
      (inbox ? `- **Notified:** \`${path.relative(ROOT, inbox)}\` (TELL — informs, does not command)\n` : "") +
      `\nNothing was executed and no process was started. This is a request awaiting the Operator.\n`, "utf8");

    return {
      row: row.trim(),
      pointer: path.relative(ROOT, ptr),
      inbox: inbox ? path.relative(ROOT, inbox) : null,
      agent: target,
    };
  }

  // -------------------------------------------------------------------------
  // ROUTES
  // -------------------------------------------------------------------------
  const server = http.createServer(async (req, res) => {
    try {
      if (!HOST_OK.has(String(req.headers.host))) return json(res, { error: "bad host" }, 421);
      if (!originOk(req)) return json(res, { error: "bad origin" }, 403);

      const url = new URL(req.url, `http://${cfg.host}:${cfg.port}`);
      const POST = req.method === "POST";

      // The page itself is the only unauthenticated route — it is what hands
      // out the token.
      if (url.pathname === "/" && req.method === "GET") {
        let html;
        try { html = fs.readFileSync(CONSOLE_HTML, "utf8"); }
        catch { res.writeHead(500); return res.end("console.html missing"); }
        html = html.replace("__PARVIS_TOKEN__", TOKEN);
        res.writeHead(200, {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
          "x-content-type-options": "nosniff",
          "referrer-policy": "no-referrer",
        });
        return res.end(html);
      }

      if (!tokenOk(req)) return json(res, { error: "bad token" }, 401);

      // --- read ------------------------------------------------------------
      if (url.pathname === "/state" && req.method === "GET") return json(res, snapshot());

      if (url.pathname === "/docs" && req.method === "GET") {
        return json(res, editableFiles().map((f) => ({
          file: f, name: f.split("/").pop(), locked: LOCKED.has(f.split("/").pop()),
        })));
      }

      if (url.pathname === "/doc" && req.method === "GET") {
        const real = resolveEditable(url.searchParams.get("f"));
        if (!real) return json(res, { error: "not found" }, 404);
        try { return json(res, { content: fs.readFileSync(real, "utf8") }); }
        catch { return json(res, { error: "unreadable" }, 500); }
      }

      if (url.pathname === "/tasks" && req.method === "GET") {
        const rows = taskRows();
        return json(res, { rows, present: rows !== null, path: path.relative(ROOT, TASK_INDEX) });
      }
      if (url.pathname === "/bus" && req.method === "GET") {
        const lines = busLines();
        return json(res, { lines, present: lines !== null, path: path.relative(ROOT, BUS_LOG) });
      }
      if (url.pathname === "/surface" && req.method === "GET") {
        const files = surfaceFeed();
        return json(res, { files, present: files !== null, path: path.relative(ROOT, SURFACE_DIR) });
      }
      if (url.pathname === "/floor" && req.method === "GET") {
        const f = floor(url.searchParams.get("path") || "");
        if (!f) return json(res, { error: "not a directory inside the root" }, 404);
        return json(res, f);
      }

      // The dock, read-only. 10 §5 — promotion is a human act at a terminal,
      // never a button on a page, so there is no write route here at all.
      if (url.pathname === "/airlock" && req.method === "GET") {
        let held = [], chain = null;
        try { held = airlock.list(ROOT); chain = airlock.verify(ROOT); } catch { /* no dock yet */ }
        return json(res, { held, chain, present: held.length > 0 || (chain && chain.entries > 0) });
      }

      if (url.pathname === "/board" && req.method === "GET") {
        let content = null;
        try { content = fs.readFileSync(BOARD_FILE, "utf8").slice(0, 80000); } catch { /* absent */ }
        return json(res, { content, present: content !== null, path: path.relative(ROOT, BOARD_FILE) });
      }

      // --- settings --------------------------------------------------------
      if (url.pathname === "/config" && req.method === "GET") {
        return json(res, {
          values: Object.fromEntries(config.KEYS.map((k) => [k, cfg[k]])),
          sources: cfg.sources,
          defaults: config.DEFAULTS,
          configPath: cfg.configPath,
          configFound: cfg.configFound,
          warnings: cfg.warnings,
          // Which keys only take effect on restart. Saying so is better than a
          // settings panel that appears to change the bind address live.
          restartRequired: ["root", "host", "port", "editableDirs", "lockedFiles"],
        });
      }

      if (url.pathname === "/config/save" && POST) {
        const g = gate();
        if (g.verb !== "RUN") return json(res, { error: `estop ${g.verb} — no writes`, reason: g.reason }, 423);
        const patch = await readJson(req);
        try {
          const written = config.save(cfg.configPath, patch);
          return json(res, { ok: true, written, path: cfg.configPath, restart: true });
        } catch (e) {
          return json(res, { error: e.message }, 400);
        }
      }

      // --- write -----------------------------------------------------------
      if (url.pathname === "/doc/save" && POST) {
        const g = gate();
        // 07 §2.5 — a red floor takes no orders. YELLOW is not RUN either: the
        // console has nowhere to hold a per-action confirmation, so it refuses
        // rather than inventing consent.
        if (g.verb !== "RUN") return json(res, { error: `estop ${g.verb} — no writes`, reason: g.reason }, 423);

        const { file, content } = await readJson(req);
        if (LOCKED.has(String(file || "").split("/").pop())) {
          return json(res, { error: "safety anchor — not editable from a UI" }, 423);
        }
        const real = resolveEditable(file);
        if (!real) return json(res, { error: "not found" }, 404);
        if (typeof content !== "string") return json(res, { error: "bad content" }, 400);

        try {
          fs.copyFileSync(real, real + ".bak");     // never overwrite without a copy
          fs.writeFileSync(real, content, "utf8");   // 03 §7: full write, idempotent
          return json(res, { ok: true, backup: path.basename(real) + ".bak" });
        } catch (e) { return json(res, { error: String(e.message) }, 500); }
      }

      // --- amend an open REQ row -------------------------------------------
      // NARROW ON PURPOSE. _os is not in editableDirs and must not become so:
      // the governance tree is what constrains the fleet, and a surface able to
      // rewrite it could rewrite its own constraints. This route does exactly
      // two things, and only to rows whose status is REQ: change the text, or
      // cancel.
      //
      // Cancelling does NOT delete. 04 section 3: a refusal belongs in the index
      // permanently, because that is how the fleet stops re-litigating settled
      // questions. A cancelled row becomes REFUSED and stays.
      //
      // The caller must send the row exactly as it last read it. If the file has
      // changed underneath, the match fails and nothing is written - the same
      // pin-to-what-you-read rule 11 section 4 applies to money, for the same
      // reason: amending a row you have not actually seen edits the wrong one.
      if (url.pathname === "/tasks/amend" && POST) {
        const g = gate();
        if (g.verb !== "RUN") return json(res, { error: "estop " + g.verb + " - no writes", reason: g.reason }, 423);

        const payload = await readJson(req);
        const original = payload.original, action = payload.action, text = payload.text;
        if (typeof original !== "string" || !original.trim()) {
          return json(res, { error: "original row required" }, 400);
        }
        if (action !== "edit" && action !== "cancel") {
          return json(res, { error: "action must be edit or cancel" }, 400);
        }

        const LF = String.fromCharCode(10), CR = String.fromCharCode(13);
        // The whole read -> splice -> write happens under the ledger lock, or not at all.
        let held;
        try {
          held = await withLedgerLock(ROOT, async () => {
        let bodyText;
        try { bodyText = fs.readFileSync(TASK_INDEX, "utf8"); }
        catch { return json(res, { error: "task index unreadable" }, 500); }

        const lines = bodyText.split(LF).map((l) => l.split(CR).join(""));
        const want = original.trim();
        const hits = [];
        for (let i = 0; i < lines.length; i++) if (lines[i].trim() === want) hits.push(i);
        if (hits.length === 0) return json(res, { error: "row not found - it may have changed since you read it" }, 409);
        if (hits.length > 1) return json(res, { error: "row is not unique; refusing to guess" }, 409);

        const at = hits[0];
        const parts = lines[at].split("|").map((x) => x.trim());
        if (parts[0] !== "REQ") {
          return json(res, { error: "only REQ rows may be amended; this row is " + parts[0] }, 423);
        }

        const pad = (v) => (v + "       ").slice(0, 7);
        const who = cfg.operator || "parvis-console";
        let rebuilt;
        if (action === "cancel") {
          rebuilt = pad("REFUSED") + " | " + parts[1] + " | " + parts[2] + " | " + parts[3] +
                    " | cancelled from the console by " + who;
        } else {
          const oneLine = String(text || "").split(CR).join(" ").split(LF).join(" ").trim().slice(0, 500);
          if (!oneLine) return json(res, { error: "empty text" }, 400);
          rebuilt = pad("REQ") + " | " + parts[1] + " | " + parts[2] + " | " + oneLine +
                    " | " + (parts[4] || ("amended from the console by " + who));
        }

        lines[at] = rebuilt;
        try {
          fs.copyFileSync(TASK_INDEX, TASK_INDEX + ".bak");
          fs.writeFileSync(TASK_INDEX, lines.join(LF), "utf8");
        } catch (e) {
          return json(res, { error: "write failed: " + e.message }, 500);
        }
        // Nothing is executed here either. This edits a record, not a machine.
        return json(res, { ok: true, action: action, line: at + 1, row: rebuilt, executed: false });
          }, "amend");
        } catch (e) {
          if (e.code === "ELEDGERBUSY") return json(res, { error: "ledger busy — another writer holds _os/tasks/.INDEX.lock; nothing was written, try again" }, 503);
          throw e;
        }
        return held;
      }

      if (url.pathname === "/induct" && POST) {
        const g = gate();
        if (g.verb !== "RUN") return json(res, { error: `estop ${g.verb} — no orders`, reason: g.reason }, 423);
        const { prompt, agent } = await readJson(req);
        if (typeof prompt !== "string" || !prompt.trim()) return json(res, { error: "empty prompt" }, 400);
        if (agent !== undefined && agent !== null && !AGENT_RE.test(String(agent))) {
          return json(res, { error: "bad agent id" }, 400);
        }
        try { return json(res, { ok: true, ...(await induct(prompt, agent)) }); }
        catch (e) {
          if (e.code === "ELEDGERBUSY") return json(res, { error: "ledger busy — another writer holds _os/tasks/.INDEX.lock; nothing was written, try again" }, 503);
          return json(res, { error: String(e.message) }, 500);
        }
      }

      return json(res, { error: "not found" }, 404);
    } catch {
      try { return json(res, { error: "internal" }, 500); } catch { /* socket gone */ }
    }
  });

  server.on("error", (e) => {
    if (e && e.code === "EADDRINUSE") {
      console.error(`\n  Port ${cfg.port} is already in use — sidecar not started.`);
      console.error(`  Set "port" in ${cfg.configPath}, or PARVIS_PORT, to pick another.\n`);
      process.exit(1);
    }
    console.error("server error:", e && e.message);
    process.exit(1);
  });

  return { server, gate, snapshot, token: TOKEN };
}

// Cross-platform browser launch. Deliberately fire-and-forget: a machine with
// no browser (a server, a container, an SSH session) is not an error — the URL
// is already printed.
export function openBrowser(url) {
  import("node:child_process").then(({ spawn }) => {
    const plat = process.platform;
    let cmd, args, opts = { stdio: "ignore", detached: true };
    if (plat === "win32") { cmd = "cmd"; args = ["/c", "start", "", url]; opts.windowsHide = true; }
    else if (plat === "darwin") { cmd = "open"; args = [url]; }
    else { cmd = "xdg-open"; args = [url]; }
    try { const ch = spawn(cmd, args, opts); ch.on("error", () => {}); ch.unref(); }
    catch { /* the printed URL is the fallback */ }
  }).catch(() => {});
}

export async function start(flags = {}) {
  const cfg = config.load(flags);
  const { server, gate } = createServer(cfg);

  return new Promise((resolve) => {
    // Backlog above Node's default 511. A single operator never queues 500
    // connections, but a slow handler over a large tree holds sockets open
    // long enough that a burst can overflow the queue and the OS starts
    // refusing — which looks like the service crashing when it has not.
    // Measured saturation is in reference/README.md.
    server.listen({ port: cfg.port, host: cfg.host, backlog: 1024 }, () => {
      const g = gate();
      const shown = config.isLoopback(cfg.host) ? "127.0.0.1" : cfg.host;
      const url = `http://${shown}:${cfg.port}/`;

      console.log("");
      console.log("  Parvis sidecar");
      console.log("  root    " + cfg.root);
      console.log("  config  " + (cfg.configFound ? cfg.configPath : cfg.configPath + "  (not found — using defaults)"));
      console.log("  bind    " + cfg.host + ":" + cfg.port + (config.isLoopback(cfg.host) ? "  (loopback)" : ""));
      console.log("  open    " + url);
      console.log("  estop   " + g.verb + (g.reason ? "  (" + g.reason + ")" : ""));
      console.log("");

      for (const w of cfg.warnings) console.log("  ! " + w + "\n");

      console.log("  This process reads the tree and writes REQ rows. It never spawns an");
      console.log("  agent, runs a command, or sends anything outward. Ctrl+C stops it.");
      console.log("");

      if (g.verb !== "RUN") {
        console.log("  NOTE: the fleet is not in RUN. The console refuses every write until");
        console.log("        the Operator sets it back. This is intended.");
        console.log("");
      }

      if (cfg.openBrowser) openBrowser(url);
      resolve({ url, server, cfg });
    });
  });
}

// Direct invocation: node sidecar/parvis-sidecar.mjs
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  start().catch((e) => {
    console.error("\n  " + (e && e.message) + "\n");
    process.exit(1);
  });
}
