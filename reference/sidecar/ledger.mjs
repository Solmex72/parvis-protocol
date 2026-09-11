// LEDGER — _os/tasks/INDEX.md, read without trust and written one at a time.
//
// Three things write the task ledger: the sidecar's induct() appends, the
// sidecar's /tasks/amend rewrites in place, and the watcher appends a BLOCKED
// row when an agent exits without one. A rewrite is read -> splice -> write.
// If an append lands between that read and that write, the rewrite is made
// from a stale copy and the appended line is silently gone. 02 §7 calls a
// removal the integrity signal; this is how you get one without meaning to.
//
// So: one parser, shared, and one lock, shared.
//
// PARSE. A row is `STATUS | YYYY-MM-DD | who | what | note`. A real row carries
// a real date. The template ships example rows reading `YYYY-MM-DD | who | ...`
// and without DATE_RE the placeholder registers as a live task and an agent
// called "who" appears on the floor. A documented example must never register
// as fleet state. Fenced blocks are NOT skipped: real trees keep live rows
// inside them (measured on the reference vault), so fence-tracking would hide
// work rather than examples.
//
// NET. Everyone but the Operator's console appends; nobody edits another
// hull's row (04 §3). So an agent that finishes appends its own DONE, and which
// REQ that closes is read from the closer, two ways:
//   - its note carries `closes <key>`, <key> being the REQ's content key, or
//   - its `what` is the REQ's `what` verbatim and it comes later in the file.
// A REQ with a closer is `closed`; a REQ named by another REQ's `closes` is
// `taken` (someone appended their own REQ to say they are on it). The floor
// stops counting a closed or taken REQ as open. This is categorisation, never
// proof: any writer can append a row closing any key — every row is a claim —
// which is why nothing here deletes or hides. It labels, and the manifest
// shows the label next to who wrote it.
//
// LOCK. A file created with exclusive-create ('wx'): atomic on every filesystem
// Node runs on, no daemon. Holders record their pid so a lock left behind by a
// dead process can be released — by age AND by pid liveness, never by age
// alone, so a slow live writer is not robbed.
//
// Zero dependencies. Node 18+.
// Copyright (c) 2026 Connor Woods. MIT.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

// ---------------------------------------------------------------------------
// PARSE
// ---------------------------------------------------------------------------

export const ROW_RE = /^(REQ|DONE|BLOCKED|REFUSED)\s*\|/;
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const CLOSES_RE = /\bcloses\s+([0-9a-f]{6,40})\b/gi;

const LF = String.fromCharCode(10);
const CR = String.fromCharCode(13);

export const pad7 = (v) => (v + "       ").slice(0, 7);

/** A row's identity is its content: the same line always keys the same way, on every machine. */
export function rowKey(raw) {
  return crypto.createHash("sha1").update(String(raw).trim()).digest("hex").slice(0, 12);
}

function keyMatches(a, b) {
  // `closes 105b563f` may carry a prefix of the 12-hex key; accept either direction, 6+ chars.
  return a === b || (a.length >= 6 && b.startsWith(a)) || (b.length >= 6 && a.startsWith(b));
}

/**
 * Parse the ledger text into rows, then net them: mark each REQ `closed` by a
 * later DONE/BLOCKED/REFUSED that names it or repeats its text, and `taken` by
 * a later REQ that names it. Rows failing DATE_RE are returned separately as
 * `invisible` — they exist in the file and the console cannot see them.
 */
export function parseIndex(text) {
  const rows = [];
  const invisible = [];
  const lines = String(text == null ? "" : text).split(LF).map((x) => x.split(CR).join(""));
  lines.forEach((l, i) => {
    if (!ROW_RE.test(l)) return;
    const p = l.split("|").map((s) => s.trim());
    if (!DATE_RE.test(p[1] || "")) { invisible.push({ line: i + 1, raw: l }); return; }
    const note = p[4] || "";
    const closes = [];
    const re = new RegExp(CLOSES_RE.source, "gi");
    let m;
    while ((m = re.exec(note))) closes.push(m[1].toLowerCase());
    rows.push({
      line: i + 1, status: p[0], date: p[1], who: p[2] || "", what: p[3] || "",
      evidence: note, note, raw: l, key: rowKey(l), closes, taken: null, closed: null,
    });
  });
  for (const r of rows) {
    if (r.status !== "REQ") continue;
    for (const c of rows) {
      if (c.line <= r.line) continue;                       // append-only: later in the file is later in time
      const names = c.closes.some((k) => keyMatches(k, r.key));
      if (c.status === "REQ") {
        if (names && !r.taken) r.taken = { by: c.who, line: c.line, key: c.key };
      } else if (names || c.what === r.what) {
        r.closed = { by: c.who, status: c.status, line: c.line, key: c.key, evidence: c.note };
      }
    }
  }
  rows.invisible = invisible;
  return rows;
}

/** parseIndex over a file. null if the file cannot be read — absence is a fact, not an empty ledger. */
export function readIndex(indexPath) {
  let text;
  try { text = fs.readFileSync(indexPath, "utf8"); } catch { return null; }
  return parseIndex(text);
}

/**
 * The path a DONE row points at, if its note carries one. `evidence: <path>` is
 * the documented form; a bare relative path in the note is accepted too.
 * Returns null when the note names nothing path-shaped.
 */
export function evidencePath(note) {
  const s = String(note || "");
  const m = s.match(/evidence\s*[:=]\s*`?([^`;|]+?)`?\s*(?:;|$)/i) || s.match(/(?:^|\s)`?((?:[A-Za-z]:)?[\w./\\-]+\.[A-Za-z0-9]{1,8})`?(?:\s|;|$)/);
  if (!m) return null;
  const p = m[1].trim();
  if (!p || /^<.*>$/.test(p)) return null;             // `<path to what you produced>` is the template
  return p;
}

// ---------------------------------------------------------------------------
// LOCK
// ---------------------------------------------------------------------------

const RETRIES = 24;          // 24 x 250ms = 6s of patience before giving up
const RETRY_MS = 250;
const STALE_MS = 60 * 1000;  // a lock older than this whose holder is dead is abandoned

let heldHere = false;        // this process is inside a locked section right now

export function lockPath(root) {
  return path.join(root, "_os", "tasks", ".INDEX.lock");
}

export function pidAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try { process.kill(pid, 0); return true; }
  catch (e) { return e.code === "EPERM"; }   // exists but not ours: alive
}

/** unlink with a short retry: a sync client can hold a fresh file's handle for a moment. */
export function unlinkRetry(p, tries = 6) {
  for (let i = 0; i < tries; i++) {
    try { fs.unlinkSync(p); return true; }
    catch (e) {
      if (e.code === "ENOENT") return true;
      if (e.code !== "EPERM" && e.code !== "EBUSY" && e.code !== "EACCES") throw e;
      pause(25 * (i + 1));
    }
  }
  return false;
}

/** rename with the same retry, for the same reason. */
export function renameRetry(from, to, tries = 6) {
  for (let i = 0; i < tries; i++) {
    try { fs.renameSync(from, to); return true; }
    catch (e) {
      if (e.code !== "EPERM" && e.code !== "EBUSY" && e.code !== "EACCES") throw e;
      pause(25 * (i + 1));
    }
  }
  return false;
}

function pause(ms) {
  // A real sleep without a promise, for the sync paths. Rare path; fine.
  try { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms); }
  catch { const until = Date.now() + ms; while (Date.now() < until) { /* spin */ } }
}

function readLock(p) {
  let st;
  try { st = fs.statSync(p); } catch { return null; }    // gone: the acquire can simply be retried
  let held = null;
  try { held = JSON.parse(fs.readFileSync(p, "utf8")); } catch { held = null; }
  // An empty or unparseable lock is, nearly always, a holder caught between
  // create and write — microseconds old, and very much alive. It is aged by
  // the file's mtime, never treated as ownerless. (Measured: reading it as
  // "no pid, epoch age" stole live locks and lost 7 rows in 240.)
  const at = held && held.at ? Date.parse(held.at) : st.mtimeMs;
  return { held, age: Date.now() - at, raw: JSON.stringify(held) };
}

function tryRelease(p) {
  const l = readLock(p);
  if (l === null) return true;
  const { held, age } = l;
  // Our own pid on a lock we are not inside: a release that failed earlier. Ours to clear.
  if (held && held.pid === process.pid && !heldHere) return unlinkRetry(p);
  if (held && pidAlive(held.pid)) return false;          // a live holder is never robbed
  if (!(age > STALE_MS)) return false;                   // young, holder unknown or mid-write: wait
  // Stale. Re-read immediately before removing so a lock that was just
  // released and re-taken by someone else is not the one we unlink. The
  // remaining window is two syscalls wide; it is stated, not hidden.
  const again = readLock(p);
  if (again === null) return true;
  if (again.raw !== l.raw) return false;
  return unlinkRetry(p);
}

function busy(p) {
  const err = new Error("ledger busy: " + p + " is held by another writer");
  err.code = "ELEDGERBUSY";
  return err;
}

// "held" is any error that means someone else is between us and the file:
// EEXIST (a live lock), or on Windows EPERM/EACCES/EBUSY while another process
// is mid-unlink of it (delete-pending). Both mean: wait and try again.
const HELD = new Set(["EEXIST", "EPERM", "EACCES", "EBUSY"]);

function acquire(p, who) {
  const fd = fs.openSync(p, "wx");
  try { fs.writeSync(fd, JSON.stringify({ pid: process.pid, who, at: new Date().toISOString() })); }
  finally { fs.closeSync(fd); }
}

/**
 * Run `fn` while holding the ledger lock. Throws with code ELEDGERBUSY if the
 * lock cannot be taken in time — callers must write NOTHING in that case and
 * report the contention, never fall through to an unlocked write.
 */
export async function withLedgerLock(root, fn, who = "unknown") {
  const p = lockPath(root);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  let got = false;
  for (let i = 0; i < RETRIES && !got; i++) {
    try { acquire(p, who); got = true; }
    catch (e) {
      if (!HELD.has(e.code)) throw e;
      if (e.code !== "EEXIST" || !tryRelease(p)) await new Promise((r) => setTimeout(r, RETRY_MS));
    }
  }
  if (!got) throw busy(p);
  heldHere = true;
  try { return await fn(); }
  finally { heldHere = false; unlinkRetry(p); }
}

/** Synchronous variant for call sites that cannot await. */
export function withLedgerLockSync(root, fn, who = "unknown") {
  const p = lockPath(root);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const deadline = Date.now() + RETRIES * RETRY_MS;
  let got = false;
  while (!got) {
    try { acquire(p, who); got = true; }
    catch (e) {
      if (!HELD.has(e.code)) throw e;
      if (e.code !== "EEXIST" || !tryRelease(p)) {
        if (Date.now() > deadline) throw busy(p);
        pause(RETRY_MS);
      }
    }
  }
  heldHere = true;
  try { return fn(); }
  finally { heldHere = false; unlinkRetry(p); }
}
