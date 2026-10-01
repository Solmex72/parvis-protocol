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
import { parseIndex, withLedgerLock, rowKey } from "./ledger.mjs";

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

  // Warehouses: "main" is the governed tree (cranes, ledger, bus). Any configured secondary
  // is a second storage root the floor LISTS and nothing more — no agents are measured there,
  // nothing is written there, no document is opened from it. A secondary that is not mounted
  // reports offline; it never renders as an empty floor.
  const WAREHOUSES = new Map([["main", { id: "main", label: "Claude tree", root: ROOT, primary: true }]]);
  for (const w of cfg.warehouses || []) {
    WAREHOUSES.set(w.id, { id: w.id, label: w.label || w.id, root: path.resolve(w.root), primary: false });
  }
  const warehouseOnline = (wh) => { try { return fs.statSync(wh.root).isDirectory(); } catch { return false; } };

  // Extra folders expand the MAIN warehouse: each is mounted at its top level as a pallet named
  // "@<alias>" and navigated by that prefix. Re-read from the config file when it changes, so
  // adding one in Settings shows up on the floor without a restart. Listing only — a mount is
  // never writable, never editable, and never joins the ledger or bus paths.
  const EXTRA = { mtime: -1, raw: null, key: "", list: [] };
  function extraFolders() {
    let raw = cfg.extraFolders;
    try {
      const st = fs.statSync(cfg.configPath);
      if (st.mtimeMs !== EXTRA.mtime) {
        EXTRA.mtime = st.mtimeMs;
        try { EXTRA.raw = JSON.parse(fs.readFileSync(cfg.configPath, "utf8")).extraFolders; } catch { /* keep the last good read */ }
      }
      if (Array.isArray(EXTRA.raw)) raw = EXTRA.raw;
    } catch { /* no file: the startup value stands */ }
    const key = JSON.stringify(raw || []);
    if (key === EXTRA.key) return EXTRA.list;
    const used = new Set();
    const list = [];
    for (const p of Array.isArray(raw) ? raw : []) {
      if (typeof p !== "string" || !path.isAbsolute(p)) continue;
      const rootPath = path.resolve(p);
      let alias = (path.basename(rootPath) || rootPath.replace(/[^A-Za-z0-9]+/g, "")).replace(/[\\/]/g, "-") || "folder";
      for (let n = 2; used.has(alias); n++) alias = alias.replace(/~\d+$/, "") + "~" + n;
      used.add(alias);
      list.push({ alias, root: rootPath });
    }
    EXTRA.key = key; EXTRA.list = list;
    return list;
  }

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
    // Protocol rows plus display-only rows under other verbs (NOTE, WAIT, ...), in file order.
    const parsed = parseIndex(lines.join("\n"));
    const rows = parsed.concat(parsed.other || []).sort((a, b) => a.line - b.line).map((r) => ({
      status: r.status, date: r.date, who: r.who, what: r.what, evidence: r.evidence, raw: r.raw,
      key: r.key, closed: r.closed, taken: r.taken, nonstandard: !!r.nonstandard,
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

  // -------------------------------------------------------------------------
  // THE OPERATOR'S QUESTIONS — ASK / ANS on the bus, tied to a ledger row.
  //
  // 03 §3 already has the verbs. An agent that needs a decision appends
  //     <time>  <agent> > OPERATOR  ASK  re:<key> <the question, one line>
  // where <key> is the REQ row's content key (what `closes <key>` uses). The
  // console answers with
  //     <time>  CONSOLE > <agent>  ANS  re:<key> ask:<id> APPROVED|DENIED|NOTED [:: note]
  // <id> is the hash of the ASK line itself, so an answer names the exact
  // question it answers. Anything else carrying `re:<key>` (a TELL, an ACK) is a
  // comment on that row.
  //
  // WHAT AN ANSWER IS. A record that the Operator answered through the console,
  // nothing more. The bus is append-only plain text that any process can write
  // to, so a forged "CONSOLE > x ANS ... APPROVED" is possible; the UI labels
  // whatever did not come from CONSOLE as claimed, and an agent about to do
  // something irreversible still confirms in conversation (03 §5, 01). An
  // approval never lifts a standing refusal or a gate.
  // -------------------------------------------------------------------------
  const RE_TAG = /\bre:([0-9a-f]{12})\b/;
  const ASK_TAG = /\bask:([0-9a-f]{12})\b/;
  const VERDICT_RE = /\b(APPROVED|DENIED|NOTED)\b/;
  const askId = (raw) => crypto.createHash("sha1").update(String(raw).trim()).digest("hex").slice(0, 12);
  const busTime = () => new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

  // Append one line to the broadcast log, keeping it one-line-per-message even if
  // the last writer left no trailing newline.
  function appendBus(line) {
    fs.mkdirSync(BUS_DIR, { recursive: true });
    let lead = "";
    try {
      const fd = fs.openSync(BUS_LOG, "r");
      try {
        const st = fs.fstatSync(fd);
        if (st.size > 0) { const b = Buffer.alloc(1); fs.readSync(fd, b, 0, 1, st.size - 1); if (b[0] !== 10) lead = "\n"; }
      } finally { fs.closeSync(fd); }
    } catch { /* no log yet: the append creates it */ }
    fs.appendFileSync(BUS_LOG, lead + line + "\n", "utf8");
  }

  // key -> { asks: [...], notes: [...] }, read from the bus tail. No writes.
  function threads() {
    const lines = tailLines(BUS_LOG, 6000);
    const by = new Map();
    if (lines === null) return { by, present: false };
    const get = (key) => { let t = by.get(key); if (!t) { t = { asks: new Map(), notes: [] }; by.set(key, t); } return t; };
    for (const l of lines) {
      const m = BUS_RE.exec(l);
      if (!m) continue;
      const rk = RE_TAG.exec(m[5]);
      if (!rk) continue;
      const t = get(rk[1]);
      const body = m[5].replace(RE_TAG, "").trim();
      if (m[4] === "ASK") {
        const id = askId(l);
        t.asks.set(id, { id, time: m[1], from: m[2], to: m[3], text: body, answers: [] });
      } else if (m[4] === "ANS") {
        const ak = ASK_TAG.exec(body);
        const v = VERDICT_RE.exec(body);
        const note = body.replace(ASK_TAG, "").replace(VERDICT_RE, "").replace(/^\s*(::)?\s*/, "").trim();
        const ent = { time: m[1], from: m[2], verdict: v ? v[1] : "NOTED", note, console: m[2] === "CONSOLE" };
        if (ak && t.asks.has(ak[1])) t.asks.get(ak[1]).answers.push(ent);
        else t.notes.push({ time: m[1], from: m[2], to: m[3], verb: "ANS", text: body });
      } else {
        t.notes.push({ time: m[1], from: m[2], to: m[3], verb: m[4], text: body });
      }
    }
    return { by, present: true };
  }

  // A decision is the latest APPROVED/DENIED that came from the console. A NOTED
  // reply, or an answer claimed by anyone else, leaves the question pending.
  function compactThread(t) {
    const asks = [...t.asks.values()].map((a) => {
      const decided = a.answers.filter((x) => x.console && (x.verdict === "APPROVED" || x.verdict === "DENIED"));
      const last = decided.length ? decided[decided.length - 1] : null;
      return { id: a.id, time: a.time, from: a.from, to: a.to, text: a.text,
               status: last ? last.verdict : "PENDING", answers: a.answers };
    });
    return { asks, notes: t.notes.slice(-12) };
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
  const SESSION_TTL_MS = 24 * 60 * 60 * 1000;   // a marker silent this long is a dead session, not a crane

  // Path evidence in free text (a bus line): compare case-insensitively with "/" separators, and
  // require the path to end on a boundary so "G:/My Drive" never matches "G:/My Drive Old".
  const normPath = (s) => String(s).replace(/\\/g, "/").replace(/\/+$/, "").toLowerCase();
  const pathHit = (textN, pathN) =>
    new RegExp("(^|[^a-z0-9_.-])" + pathN.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "($|[/\\s\"'`,.;:)\\]])").test(textN);

  // A path from the UI is a relative directory inside the root. Same
  // containment discipline as the document editor: resolve, then confirm.
  function resolveDir(rel, root = ROOT, mounts = []) {
    const clean = String(rel || "").replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
    const segs = clean.split("/");
    if (segs.includes("..")) return null;
    // "@alias/..." addresses an extra folder; containment is then checked against THAT folder.
    let base = root, sub = clean;
    if (segs[0].startsWith("@")) {
      const m = mounts.find((x) => "@" + x.alias === segs[0]);
      if (!m) return null;
      base = m.root; sub = segs.slice(1).join("/");
    }
    let real, realRoot;
    try {
      real = fs.realpathSync(path.resolve(base, sub));
      realRoot = fs.realpathSync(base);
    } catch { return null; }
    if (real !== realRoot && !real.startsWith(realRoot + path.sep)) return null;
    try { if (!fs.statSync(real).isDirectory()) return null; } catch { return null; }
    return { abs: real, rel: clean };
  }

  // ---- ACTIVITY: what is being written under a pallet, not just in it ----------
  // A directory's own mtime only moves when an entry is added or removed directly
  // in it. An agent editing a file three levels down never touches the top-level
  // pallet's mtime, so the floor showed "nothing is happening" while the fleet was
  // working. This walks below the pallet for the newest write, bounded in depth,
  // entries and wall time; if it runs out of budget it says so (partial) instead
  // of reporting a quiet floor it did not finish checking (07 S2.2).
  const ACT_CACHE = new Map();          // abs path -> { at, val }
  const ACT_TTL_MS = 4000;
  // `slow` = a network-backed root (a secondary warehouse such as a Drive mount), where every stat
  // is expensive: the result is kept for SLOW_TTL_MS even when partial, so a 5 s poll does not
  // re-walk it. A partial result is still marked partial — it is never reported as a quiet floor.
  const SLOW_TTL_MS = 20000;
  function newestWrite(abs, deadline, slow = false) {
    const hit = ACT_CACHE.get(abs);
    if (hit && Date.now() - hit.at < (slow ? SLOW_TTL_MS : ACT_TTL_MS)) return hit.val;
    let newest = 0, partial = false, seen = 0;
    (function walk(d, depth) {
      if (partial) return;
      if (depth > 8 || seen > 8000 || Date.now() > deadline) { partial = true; return; }
      let ents;
      try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
      for (const e of ents) {
        if (e.name === "node_modules" || e.name === ".git") continue;
        seen++;
        const fp = path.join(d, e.name);
        let st; try { st = fs.statSync(fp); } catch { continue; }
        if (st.mtimeMs > newest) newest = st.mtimeMs;
        if (e.isDirectory()) walk(fp, depth + 1);
        if (partial) return;
      }
    })(abs, 0);
    const val = { newest: newest || null, partial };
    if (!partial || slow) ACT_CACHE.set(abs, { at: Date.now(), val });
    return val;
  }

  // ---- CLAIMS: the watcher's pickup/drop record (04 S3) --------------------------
  // <key>.claim = an agent picked a load up at the inductor and has not finished.
  // <key>.done  = it dropped the finished load at a spur.
  // A claim with no .done that is older than CLAIM_TTL_MS is a dead agent's claim,
  // not a working crane: it is reported as stale, never as moving.
  const CLAIM_DIR = path.join(ROOT, "_os", "tasks", "claims");
  const CLAIM_TTL_MS = 30 * 60 * 1000;
  const DELIVER_MS = 2 * 60 * 1000;
  function claimState() {
    const live = new Map(), delivered = new Map();
    let files = [];
    try { files = fs.readdirSync(CLAIM_DIR); } catch { return { live, delivered }; }
    const closed = new Set(files.filter((f) => /\.(done|blocked)$/.test(f)).map((f) => f.replace(/\.(done|blocked)$/, "")));
    const now = Date.now();
    for (const f of files) {
      const m = /^([0-9a-f]+)\.(claim|done)$/.exec(f);
      if (!m) continue;
      let j, st;
      try { j = JSON.parse(fs.readFileSync(path.join(CLAIM_DIR, f), "utf8")); st = fs.statSync(path.join(CLAIM_DIR, f)); } catch { continue; }
      const agent = j && j.agent;
      if (!agent || !AGENT_RE_CLAIM.test(agent)) continue;
      const what = String(j.what || "").slice(0, 120);
      if (m[2] === "claim" && !closed.has(m[1])) {
        const since = Date.parse(j.claimedAt) || st.mtimeMs;
        if (now - since < CLAIM_TTL_MS) live.set(agent, { key: m[1], what, since: new Date(since).toISOString(), session: j.session || null });
      } else if (m[2] === "done" && now - st.mtimeMs < DELIVER_MS) {
        delivered.set(agent, { key: m[1], what, at: new Date(st.mtimeMs).toISOString() });
      }
    }
    return { live, delivered };
  }
  const AGENT_RE_CLAIM = /^[A-Za-z0-9][A-Za-z0-9_-]{0,39}$/;

  // A REQ whose row names a file in the surface drop-dir is REWORK: the agent
  // picks that deliverable up at the spur, modifies it, and drops the result back
  // at the inductor. Only a row that says so counts; nothing is inferred.
  const REWORK_RE = /events[\\/]+surface/i;

  // ---- WORK: which directory an agent is writing to, from facts it left behind ----------------
  // A crane is placed by a directory, not just a name: it goes to the pallet on the way to where
  // it is writing, and sits on that directory's inductor once the floor IS that directory. The
  // directory comes from two measured facts and never from a guess:
  //   (a) its own last bus line, if the line is recent and names a path that exists on disk;
  //   (b) one of its ledger rows dated today that names a FILE which exists and was modified
  //       in the last WORK_MS. A directory named in a row proves nothing (anyone's write moves a
  //       directory's mtime), so a row only counts through a file.
  // Neither can show who wrote the bytes; both show the agent says it did, and the bytes are fresh.
  const WORK_MS = HOT_MS;
  const agentKey = (s) => String(s || "").replace(/\s*\(.*?\)\s*$/, "").trim().toLowerCase();
  const realOf = (p) => { try { return fs.realpathSync.native(p); } catch { return null; } };
  const isDirSync = (p) => { try { return fs.statSync(p).isDirectory(); } catch { return false; } };

  // Where a real absolute path sits: which warehouse, and the relative path the floor would use.
  // Longest root first, so an extra folder mounted inside the main tree wins over the tree.
  function placeOf(realAbs) {
    const roots = [
      ...extraFolders().map((m) => ({ wh: "main", base: m.root, prefix: "@" + m.alias })),
      ...[...WAREHOUSES.values()].map((w) => ({ wh: w.id, base: w.root, prefix: "" })),
    ].sort((a, b) => b.base.length - a.base.length);
    for (const r of roots) {
      const rb = realOf(r.base);
      if (!rb) continue;
      const rel = path.relative(rb, realAbs);
      if (rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel))) {
        return { wh: r.wh, rel: [r.prefix, ...rel.split(path.sep)].filter(Boolean).join("/") };
      }
    }
    return null;
  }

  // Walk an absolute path out of free text ("wrote G:\My Drive\_bus\x.md just now"): each interior
  // segment must exist as written, and trailing words after the last segment are prose.
  function diskPathFrom(s) {
    let cur = s.slice(0, 3), rest = s.slice(3), best = null;
    if (!isDirSync(cur)) return null;
    for (;;) {
      const mm = /^([^\\/]*)([\\/]?)/.exec(rest);
      const seg = mm[1], sep = mm[2];
      if (!seg && !sep) break;
      if (sep) {
        const next = path.join(cur, seg);
        if (isDirSync(next)) { cur = next; best = cur; rest = rest.slice(mm[0].length); if (!rest) break; continue; }
      }
      let cand = seg.replace(/[.,;:)\]"'`]+$/, "");
      while (cand) {
        const next = path.join(cur, cand);
        if (fs.existsSync(next)) { best = next; break; }
        const i = cand.lastIndexOf(" ");
        if (i < 0) break;
        cand = cand.slice(0, i).replace(/[.,;:)\]"'`]+$/, "");
      }
      break;
    }
    return best;
  }

  function evidenceIn(text) {
    const t = String(text || ""), out = [];
    for (const m of t.matchAll(/(?<![A-Za-z0-9_])[A-Za-z]:[\\/]/g)) {
      const p = diskPathFrom(t.slice(m.index));
      if (p) out.push(p);
    }
    // Relative names resolve against the governed tree and must exist there.
    for (const m of t.matchAll(/(?<![A-Za-z0-9_:.\\/~@-])((?:[A-Za-z0-9_.@~-]+[\\/])+[A-Za-z0-9_.@~-]*)/g)) {
      const abs = path.resolve(ROOT, m[1].replace(/[.,;:)\]"'`]+$/, "").replace(/[\\/]+/g, path.sep));
      if (fs.existsSync(abs)) out.push(abs);
    }
    return out;
  }

  function describePath(abs) {
    const real = realOf(abs);
    if (!real) return null;
    let st; try { st = fs.statSync(real); } catch { return null; }
    const file = st.isFile();
    const place = placeOf(file ? path.dirname(real) : real);
    return place ? { wh: place.wh, rel: place.rel, file, mtimeMs: st.mtimeMs } : null;
  }

  const localDay = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const WORK = { at: 0, map: new Map() };
  function workByAgent(lastByAgent, rows) {
    const now = Date.now();
    if (now - WORK.at < 4000) return WORK.map;       // independent of the floor; the disk is not cheap on a mount
    const map = new Map();
    const consider = (key, ev) => { const cur = map.get(key); if (!cur || ev.when > cur.when) map.set(key, ev); };
    for (const [agent, last] of lastByAgent) {
      const when = Date.parse(last.time);
      if (!when || now - when > WORK_MS) continue;
      for (const p of evidenceIn(last.text)) { const d = describePath(p); if (d) consider(agentKey(agent), { ...d, when, src: "bus" }); }
    }
    const today = new Set([new Date().toISOString().slice(0, 10), localDay(new Date())]);
    for (const r of rows) {
      if (!today.has(r.date)) continue;
      const key = agentKey(r.who);
      if (!key) continue;
      for (const p of evidenceIn((r.what || "") + " " + (r.evidence || ""))) {
        const d = describePath(p);
        if (d && d.file && now - d.mtimeMs <= WORK_MS) consider(key, { ...d, when: d.mtimeMs, src: "ledger" });
      }
    }
    WORK.at = now; WORK.map = map;
    return map;
  }

  function floor(relPath, whId = "main") {
    const wh = WAREHOUSES.get(whId);
    if (!wh) return null;
    const mounts = wh.primary ? extraFolders() : [];
    const dir = resolveDir(relPath, wh.root, mounts);
    if (!dir) return null;
    const now = Date.now();
    const g = gate();

    // --- pallets: the directories on this level ---------------------------
    const pallets = [];
    let loose = 0;
    let entries = [];
    try { entries = fs.readdirSync(dir.abs, { withFileTypes: true }); } catch { /* unreadable */ }

    // The governed tree shares one 600 ms walk budget. A secondary root gets a small budget per
    // pallet inside a total cap, so one big folder cannot turn every other pallet partial.
    const actDeadline = Date.now() + 600;
    const slowCap = Date.now() + 1500;
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
      const act = wh.primary && !dir.rel.startsWith("@")
        ? newestWrite(abs, actDeadline)
        : newestWrite(abs, Math.min(Date.now() + 100, slowCap), true);
      const lastMs = Math.max(act.newest || 0, mtime ? Date.parse(mtime) : 0) || null;
      pallets.push({
        name: e.name,
        rel: dir.rel ? dir.rel + "/" + e.name : e.name,
        dirs, files,
        mtime,
        lastWrite: lastMs ? new Date(lastMs).toISOString() : null,
        activityPartial: act.partial,
        hot: lastMs ? (now - lastMs) < HOT_MS : false,
      });
    }
    // Extra folders mount at the main floor's top level, each with its own activity budget so a
    // big mounted drive cannot starve the real pallets of theirs. Offline = null counts = grey.
    if (wh.primary && !dir.rel) {
      for (const m of mounts) {
        let dirs = null, files = null, mtime = null;
        try {
          const kids = fs.readdirSync(m.root, { withFileTypes: true });
          dirs = kids.filter((k) => k.isDirectory()).length;
          files = kids.length - dirs;
          mtime = fs.statSync(m.root).mtime.toISOString();
        } catch { /* not mounted */ }
        const act = dirs === null ? { newest: null, partial: false } : newestWrite(m.root, Date.now() + 400, true);
        const lastMs = Math.max(act.newest || 0, mtime ? Date.parse(mtime) : 0) || null;
        pallets.push({
          name: "@" + m.alias, rel: "@" + m.alias, mounted: true, source: m.root,
          dirs, files, mtime,
          lastWrite: lastMs ? new Date(lastMs).toISOString() : null,
          activityPartial: act.partial,
          hot: lastMs ? (now - lastMs) < HOT_MS : false,
        });
      }
    }
    pallets.sort((a, b) => a.name.localeCompare(b.name));

    // One fleet serves every warehouse. The session markers, the ledger (the inductor) and the
    // surface dir (the spurs) all live under the governed tree, and the same cranes work all
    // of the floors: what changes per floor is WHERE a crane is placed, and that stays measured.
    // On the main floor a bus line naming a pallet is enough (existing rule). Elsewhere folder
    // names are generic ("Memory", "Core"), so a position needs the line to name the FULL path.
    // A crane whose last line names a path in a different warehouse is marked `away`, not placed.

    // --- cranes: agents with a session marker ------------------------------
    // A marker is written at sign-on and deleted by its own owner at sign-off
    // (08 §4), so the set of markers is the set of agents that believe they
    // are on the floor.
    const cranes = [];
    let staleSessions = 0;
    let markers = [];
    try { markers = fs.readdirSync(SESSION_DIR).filter((f) => f.endsWith(".on")); } catch { /* none */ }

    // Last bus line per agent gives recency and a hint of what it is doing.
    const lastByAgent = new Map();
    const busAll = tailLines(BUS_LOG, 600) || [];
    // The Operator's last induction, as the bus recorded it: the console's own
    // "REQ inducted" notice. This is the measured fact the operator crane's dock
    // trip is driven by (09 Amendment B) - the same event, not a guess at one.
    let lastInduct = null;
    for (const l of busAll) {
      const m = BUS_RE.exec(l);
      if (!m) continue;
      lastByAgent.set(m[2], { time: m[1], verb: m[4], text: m[5] });
      if (m[2] === "CONSOLE" && m[4] === "TELL" && /\bREQ inducted\b/.test(m[5])) lastInduct = m[1];
    }

    // Open REQ rows per agent — scheduled work, blue.
    const openByAgent = new Map();
    const reworkByAgent = new Map();
    const openRows = [];
    const ledgerRows = taskRows(400) || [];
    for (const r of ledgerRows) {
      if (r.status !== "REQ" || r.closed || r.taken) continue;
      openByAgent.set(r.who, (openByAgent.get(r.who) || 0) + 1);
      openRows.push({ who: r.who, what: String(r.what || "").slice(0, 80) });
      if (REWORK_RE.test(String(r.raw || ""))) reworkByAgent.set(r.who, (reworkByAgent.get(r.who) || 0) + 1);
    }
    const claims = claimState();

    // Absolute paths a bus line could use to name a pallet on this floor.
    const pathCandidates = (p) => p.mounted ? [p.source] : [
      path.join(dir.abs, p.name),
      ...(dir.rel.startsWith("@") ? [] : [path.join(wh.root, dir.rel, p.name)]),
    ];
    // Which warehouse a line names a path in: a secondary root, or an extra folder (which is
    // part of the main warehouse). Null when it names none — unknown, never guessed.
    const whereText = (textN) => {
      for (const w of WAREHOUSES.values()) if (!w.primary && pathHit(textN, normPath(w.root))) return w.id;
      for (const m of extraFolders()) if (pathHit(textN, normPath(m.root))) return "main";
      return null;
    };

    for (const f of markers) {
      // <AGENT>-<id>.on
      const id = f.replace(/\.on$/, "");
      const agent = id.includes("-") ? id.slice(0, id.lastIndexOf("-")) : id;
      let signedOn = null;
      try { signedOn = fs.statSync(path.join(SESSION_DIR, f)).mtime.toISOString(); } catch {}

      const last = lastByAgent.get(agent) || null;

      // EXPIRED SESSIONS (Operator approved, 2026-09-30). A marker is deleted by its
      // owner at sign-off and refreshed by its owner's heartbeat (08 s4, s6). One whose
      // marker AND last bus line are both older than SESSION_TTL_MS, and which holds no
      // live claim, belongs to a session that is gone: drawing it as an idle crane is
      // drawing a lie. It is counted (staleSessions) and left on disk - this never
      // deletes a marker, that is the owner's act.
      const seenMs = Math.max(signedOn ? Date.parse(signedOn) : 0, last ? Date.parse(last.time) : 0);
      if (seenMs && (now - seenMs) > SESSION_TTL_MS && !claims.live.has(agent)) { staleSessions++; continue; }

      // Alive = its last bus line OR its marker's last touch (the heartbeat, 08 s6) is
      // recent. Before, once an agent had written any bus line the marker's touch was
      // ignored, so a session that heartbeats but rarely speaks never read as moving.
      const recent = seenMs > 0 && (now - seenMs) < LIVE_MS;

      // Where is it working? Only if the agent's own last message names a
      // directory on THIS floor. Otherwise null — the crane parks at the dock
      // and renders grey rather than being placed somewhere invented.
      let at = null, where = null;
      if (last) {
        const textN = normPath(last.text);
        for (const p of pallets) {
          const byPath = pathCandidates(p).some((c) => pathHit(textN, normPath(c)));
          const byName = wh.primary && !p.mounted && !dir.rel.startsWith("@") &&
            new RegExp("(^|[\\s/\"'`])" + p.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([\\s/\"'`,.]|$)").test(last.text);
          if (byPath || byName) { at = p.name; break; }
        }
        where = whereText(textN);
      }

      const gated = last && last.verb === "GATE";
      const claim = claims.live.get(agent) || null;
      cranes.push({
        agent,
        session: id,
        signedOn,
        at,
        where,
        state: g.verb === "STOP" ? "stopped"
             : gated ? "gated"
             : (recent || claim) ? "moving"
             : "idle",
        last: last ? last.time : null,
        note: last ? (last.verb + " " + last.text).slice(0, 120) : null,
        scheduled: openByAgent.get(agent) || 0,
        carrying: claim ? { key: claim.key, what: claim.what, since: claim.since } : null,
        delivered: claims.delivered.get(agent) || null,
        rework: reworkByAgent.get(agent) || 0,
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
      const claim = claims.live.get(who) || null;
      cranes.push({
        agent: who, session: null, signedOn: null, at: null,
        state: g.verb === "STOP" ? "stopped" : claim ? "moving" : "scheduled",
        last: null, note: null, scheduled: n,
        carrying: claim ? { key: claim.key, what: claim.what, since: claim.since } : null,
        delivered: claims.delivered.get(who) || null,
        rework: reworkByAgent.get(who) || 0,
      });
    }
    // A live claim with no sign-on marker and no open REQ is still a crane that
    // holds a load: the claim file is the pickup record.
    for (const [who, claim] of claims.live) {
      if (cranes.some((cr) => cr.agent === who)) continue;
      cranes.push({
        agent: who, session: claim.session, signedOn: null, at: null,
        state: g.verb === "STOP" ? "stopped" : "moving",
        last: null, note: null, scheduled: 0,
        carrying: { key: claim.key, what: claim.what, since: claim.since },
        delivered: claims.delivered.get(who) || null, rework: 0,
      });
    }

    // WORK placement. An agent writing under this floor is placed by the directory it is writing
    // to: at the pallet on the way there, or `here` (on this directory's inductor) when this
    // floor is that directory. Evidence of work in another warehouse or elsewhere in this one
    // clears any weaker name-match above, so a crane is never drawn in two places.
    const workMap = workByAgent(lastByAgent, ledgerRows);
    const applyWork = (c, w) => {
      c.work = { wh: w.wh, rel: w.rel, file: w.file, src: w.src, when: new Date(w.when).toISOString() };
      c.where = w.wh;
      c.here = false;
      c.at = null;
      if (w.wh === wh.id) {
        if (w.rel === dir.rel) c.here = true;
        else if (!dir.rel || w.rel.startsWith(dir.rel + "/")) {
          const child = (dir.rel ? w.rel.slice(dir.rel.length + 1) : w.rel).split("/")[0];
          if (pallets.some((p) => p.name === child)) c.at = child;
        }
      }
      if (g.verb === "STOP") c.state = "stopped";
      else if (c.state !== "gated") c.state = "moving";
    };
    const keyed = new Set();
    for (const c of cranes) {
      keyed.add(agentKey(c.agent));
      const w = workMap.get(agentKey(c.agent));
      if (w) applyWork(c, w);
    }
    for (const [key, w] of workMap) {
      if (keyed.has(key)) continue;
      // Writing, but neither signed on nor holding a REQ: still a crane — the work is the evidence.
      const c = { agent: key, session: null, signedOn: null, at: null, here: false, where: null,
                  state: "moving", last: null, note: "writing /" + w.rel, scheduled: 0,
                  carrying: null, delivered: null, rework: 0 };
      applyWork(c, w);
      cranes.push(c);
    }
    cranes.sort((a, b) => a.agent.localeCompare(b.agent));

    // `where` is the warehouse the agent's own last line names a path in (null = it names none).
    // On a floor other than that one the crane is `away`: still listed, parked at the dock.
    for (const c of cranes) {
      if (c.here === undefined) c.here = false;
      if (c.where === undefined) c.where = null;
      c.away = c.where && c.where !== wh.id && WAREHOUSES.has(c.where)
        ? { id: c.where, label: WAREHOUSES.get(c.where).label } : null;
    }

    const spurFiles = surfaceFeed(500) || [];
    const spurs = spurFiles.length;
    const inducts = [...openByAgent.values()].reduce((a, b) => a + b, 0);
    const loads = {
      induct: openRows.slice(-6).reverse(),
      spur: spurFiles.slice(0, 6).map((f) => ({ name: f.name, mtime: f.mtime })),
    };

    const parts = dir.rel ? dir.rel.split("/") : [];
    return {
      warehouse: wh.id, label: wh.label, readOnly: !wh.primary,
      path: dir.rel,
      parent: parts.length ? parts.slice(0, -1).join("/") : null,
      breadcrumb: parts,
      pallets,
      looseFiles: loose,
      cranes,
      staleSessions,
      operator: { lastInduct },
      inducts,
      spurs,
      loads,
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

    // The broadcast log gets a one-line notice too, so anything watching the bus
    // sees the induction (and the Bus tab shows the console is alive). It informs,
    // never commands (03 §5); the REQ row stays the record. Best-effort: the row
    // is already written, so a bus hiccup must not fail the induction.
    try {
      appendBus(`${busTime()}  CONSOLE > ${target || "ALL"}  TELL  re:${rowKey(row.trim())} REQ inducted by ${by}: ${oneLine.slice(0, 200)}`);
    } catch { /* notice lost, record intact */ }

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
        // The window is the newest 80 rows, but a question an agent asked about an
        // older row must not vanish with it: pending asks are resolved against the
        // whole ledger and listed separately.
        const all = taskRows(5000);
        const rows = all === null ? null : all.slice(0, 80);
        const th = threads();
        const out = {}, pending = [];
        let n = 0;
        if (all !== null) {
          const byKey = new Map(all.map((r) => [r.key, r]));
          for (const [key, raw] of th.by) {
            const c = compactThread(raw);
            if (!c.asks.length && !c.notes.length) continue;
            const row = byKey.get(key) || null;
            if (n++ < 300) out[key] = c;
            for (const a of c.asks) {
              if (a.status === "PENDING") pending.push({ key, ask: a.id, from: a.from, time: a.time, text: a.text,
                                                        what: row ? row.what : null, rowStatus: row ? row.status : null,
                                                        rowClosed: !!(row && (row.closed || row.taken)) });
            }
          }
          pending.sort((a, b) => String(b.time).localeCompare(String(a.time)));
        }
        return json(res, { rows, present: rows !== null, path: path.relative(ROOT, TASK_INDEX),
                           threads: out, pending, busPresent: th.present });
      }
      if (url.pathname === "/bus" && req.method === "GET") {
        const lines = busLines();
        return json(res, { lines, present: lines !== null, path: path.relative(ROOT, BUS_LOG) });
      }
      if (url.pathname === "/surface" && req.method === "GET") {
        const files = surfaceFeed();
        return json(res, { files, present: files !== null, path: path.relative(ROOT, SURFACE_DIR) });
      }
      // Read one pointer file from the surface feed. Read-only and confined to that
      // one directory: the name must be a bare file name the feed itself lists (.md,
      // no separators, no dot-files), it is re-resolved and must still sit directly
      // inside the surface directory, and it is capped. _os is NOT in editableDirs
      // and must not become so - this is the narrow door that lets the Operator READ
      // what agents dropped without opening the rest of _os to editing.
      if (url.pathname === "/surface/file" && req.method === "GET") {
        const name = String(url.searchParams.get("name") || "");
        if (!name || name !== path.basename(name) || name.startsWith(".") || !name.endsWith(".md")) {
          return json(res, { error: "not a surface file name" }, 400);
        }
        let real, st;
        try {
          real = fs.realpathSync(path.join(SURFACE_DIR, name));
          const realDir = fs.realpathSync(SURFACE_DIR);
          if (path.dirname(real) !== realDir) return json(res, { error: "not found" }, 404);
          st = fs.statSync(real);
          if (!st.isFile()) return json(res, { error: "not found" }, 404);
        } catch { return json(res, { error: "not found" }, 404); }
        const CAP = 1_000_000;
        try {
          const fd = fs.openSync(real, "r");
          try {
            const buf = Buffer.alloc(Math.min(st.size, CAP));
            fs.readSync(fd, buf, 0, buf.length, 0);
            return json(res, { name, content: buf.toString("utf8"), size: st.size,
                               mtime: st.mtime.toISOString(), truncated: st.size > CAP });
          } finally { fs.closeSync(fd); }
        } catch { return json(res, { error: "unreadable" }, 500); }
      }
      if (url.pathname === "/warehouses" && req.method === "GET") {
        return json(res, [...WAREHOUSES.values()].map((w) => ({
          id: w.id, label: w.label, primary: w.primary, online: warehouseOnline(w),
        })));
      }
      if (url.pathname === "/floor" && req.method === "GET") {
        const whId = url.searchParams.get("wh") || "main";
        const wh = WAREHOUSES.get(whId);
        if (!wh) return json(res, { error: "no such warehouse" }, 404);
        if (!warehouseOnline(wh)) return json(res, { error: "warehouse offline — " + wh.label + " is not mounted" }, 503);
        const f = floor(url.searchParams.get("path") || "", whId);
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
          restartRequired: ["root", "host", "port", "editableDirs", "lockedFiles", "warehouses"],
          liveKeys: config.LIVE_KEYS,
        });
      }

      if (url.pathname === "/config/save" && POST) {
        const g = gate();
        if (g.verb !== "RUN") return json(res, { error: `estop ${g.verb} — no writes`, reason: g.reason }, 423);
        const patch = await readJson(req);
        try {
          let prev = {};
          try { prev = JSON.parse(fs.readFileSync(cfg.configPath, "utf8")) || {}; } catch { /* new file */ }
          const written = config.save(cfg.configPath, patch);
          // A key counts as changed against what the file said, or the default where it said nothing.
          const was = (k) => JSON.stringify(k in prev ? prev[k] : config.DEFAULTS[k]);
          const changed = Object.keys(written).filter((k) => config.KEYS.includes(k) && was(k) !== JSON.stringify(written[k]));
          // Only keys the sidecar re-reads live can skip the restart.
          const restart = changed.some((k) => !config.LIVE_KEYS.includes(k));
          return json(res, { ok: true, written, path: cfg.configPath, restart, changed });
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

      // Answer a question an agent put to the Operator (THE OPERATOR'S QUESTIONS,
      // above). Writes ONE ANS line to the broadcast log and a TELL to the asker's
      // inbox. It records a decision; it starts nothing, and it is refused unless
      // the gate reads RUN - a red floor takes no orders, and no answers either.
      if (url.pathname === "/tasks/answer" && POST) {
        const g = gate();
        if (g.verb !== "RUN") return json(res, { error: `estop ${g.verb} — no writes`, reason: g.reason }, 423);
        const b = await readJson(req);
        const key = String(b.key || "");
        const ask = b.ask ? String(b.ask) : null;
        const VERB = { approve: "APPROVED", deny: "DENIED", note: "NOTED" }[String(b.verdict || "")];
        if (!/^[0-9a-f]{12}$/.test(key)) return json(res, { error: "bad row key" }, 400);
        if (ask !== null && !/^[0-9a-f]{12}$/.test(ask)) return json(res, { error: "bad question id" }, 400);
        if (!VERB) return json(res, { error: "verdict must be approve, deny or note" }, 400);
        const note = String(b.note || "").replace(/\s+/g, " ").trim().slice(0, 400);
        if (VERB === "NOTED" && !note) return json(res, { error: "a reply needs text" }, 400);
        if (VERB !== "NOTED" && !ask) return json(res, { error: "a decision must answer a question" }, 400);
        const all = taskRows(5000);
        if (all === null || !all.some((r) => r.key === key)) return json(res, { error: "no such row" }, 404);
        let asker = "ALL";
        if (ask) {
          const t = threads().by.get(key);
          const a = t && t.asks.get(ask);
          if (!a) return json(res, { error: "no such question on that row" }, 404);
          asker = a.from;
        }
        const line = `${busTime()}  CONSOLE > ${asker}  ANS  re:${key}${ask ? " ask:" + ask : ""} ${VERB}${note ? " :: " + note : ""}`;
        try { appendBus(line); }
        catch (e) { return json(res, { error: "write failed: " + e.message }, 500); }
        // The asker hears it in its inbox - as a TELL that points at the record,
        // never as an order (03 §5).
        let inbox = null;
        if (asker !== "ALL" && AGENT_RE.test(asker)) {
          try {
            const dir = path.join(BUS_DIR, "in");
            fs.mkdirSync(dir, { recursive: true });
            inbox = path.join(dir, `${asker}.log`);
            fs.appendFileSync(inbox, `${new Date().toISOString()}  CONSOLE > ${asker}  TELL  ` +
              `Operator answered your ASK re:${key}: ${VERB}${note ? " - " + note : ""}\n`, "utf8");
          } catch { inbox = null; }
        }
        return json(res, { ok: true, line, verdict: VERB, inbox: inbox ? path.relative(ROOT, inbox) : null, executed: false });
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
