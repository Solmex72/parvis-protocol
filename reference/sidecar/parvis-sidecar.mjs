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
  const BUS_LOG = path.join(ROOT, "_os", "exchange", "bus", "broadcast.log");
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
    let files = null, dirs = null;
    try {
      let f = 0, d = 0;
      (function walk(dir, depth) {
        if (depth > 12) return;
        let entries;
        try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
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

  const ROW_RE = /^(REQ|DONE|BLOCKED|REFUSED)\s*\|/;

  function taskRows(limit = 80) {
    const lines = tailLines(TASK_INDEX, 5000);
    if (lines === null) return null;
    const rows = [];
    for (const l of lines) {
      if (!ROW_RE.test(l)) continue;
      const p = l.split("|").map((s) => s.trim());
      rows.push({ status: p[0] || "", date: p[1] || "", who: p[2] || "", what: p[3] || "", evidence: p[4] || "" });
    }
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
  // INDUCTION — 07 §1. A prompt becomes a REQ row. It does not become a
  // process. This function contains no exec, no spawn, and no network call,
  // and that is load-bearing rather than incidental.
  // -------------------------------------------------------------------------
  function induct(prompt) {
    const stamp = new Date().toISOString();
    const day = stamp.slice(0, 10);
    const oneLine = String(prompt).replace(/[\r\n]+/g, " ").trim().slice(0, 500);
    const who = cfg.operator || "parvis-console";

    fs.mkdirSync(path.dirname(TASK_INDEX), { recursive: true });
    fs.mkdirSync(SURFACE_DIR, { recursive: true });

    // 04 §3 — the REQ row is appended before any work starts, so an
    // interrupted task is still visible. Append-only: this is a log.
    const row = `REQ     | ${day} | ${who} | ${oneLine} | inducted from the console, awaiting the Operator\n`;
    fs.appendFileSync(TASK_INDEX, row, "utf8");

    // 04 §2 — the substance goes to its home, a pointer goes to the surface.
    const slug = oneLine.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "induction";
    const ptr = path.join(SURFACE_DIR, `${stamp.replace(/[:.]/g, "").slice(0, 15)}-${slug}.md`);
    fs.writeFileSync(ptr,
      `# Induction from the Parvis console\n\n` +
      `- **When:** ${stamp}\n- **By:** ${who}\n- **Prompt:** ${oneLine}\n` +
      `- **Row:** appended to \`_os/tasks/INDEX.md\`\n\n` +
      `Nothing was executed. This is a request awaiting the Operator.\n`, "utf8");

    return { row: row.trim(), pointer: path.relative(ROOT, ptr) };
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

      if (url.pathname === "/induct" && POST) {
        const g = gate();
        if (g.verb !== "RUN") return json(res, { error: `estop ${g.verb} — no orders`, reason: g.reason }, 423);
        const { prompt } = await readJson(req);
        if (typeof prompt !== "string" || !prompt.trim()) return json(res, { error: "empty prompt" }, 400);
        try { return json(res, { ok: true, ...induct(prompt) }); }
        catch (e) { return json(res, { error: String(e.message) }, 500); }
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
    server.listen(cfg.port, cfg.host, () => {
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
