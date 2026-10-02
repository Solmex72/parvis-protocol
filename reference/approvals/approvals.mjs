// APPROVALS — what an approval is still worth after it has been given.
//
// protocol/03 §5a lets the Operator answer an agent's question with one
// console-sent ANS line, APPROVED or DENIED. This module is the other half:
// whether an agent may rely on that line NOW, for THIS act.
//
//   expires      the console writes ttl:<UTC> on an approval. Past it, the
//                approval does not count. An approval with no ttl does not count
//                either: expiry is not optional, and a missing value fails shut.
//   single use   an approval authorises ONE act. `spend` claims it by creating a
//                file that must not already exist (exclusive create), so two
//                agents racing for the same approval cannot both win. Checking
//                and spending are separate calls on purpose.
//   seen         the console writes seen:<sha256> of the ASK line and the ledger
//                row it held when the Operator decided. The 12-hex ids on the bus
//                are truncated hashes; this is the full-width binding, and it
//                voids an approval if the question behind its id has changed.
//
// WHAT THIS DOES NOT DO. The bus is plain text that any process able to append
// can write to. A line labelled CONSOLE is a label, not a signature, so an agent
// that can write the log can write a fresh, unexpired, correctly-hashed
// approval. Expiry, single use and seen make an approval bounded and
// non-replayable by an honest or confused agent; they do not make it
// unforgeable. Authenticity needs a key the agents cannot reach (DECISIONS U-09).
// A result from this module is "the record says so", never "the Operator did".
//
// The caller checks the estop before it calls anything here; this module reads
// the bus and writes only one claim file and one TELL.
//
// Zero dependencies. Node 18+.
//
// Copyright (c) 2026 Connor Woods. MIT.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { readIndex } from "../sidecar/ledger.mjs";

export const TTL = Object.freeze({ min: 1, max: 10080, def: 60 });   // minutes: a minute .. a week, default an hour

// 03 §2 — time  from > to  VERB  text
export const BUS_RE = /^(\S+)\s+(\S+)\s*>\s*(\S+)\s+(FLASH|ASK|ANS|TELL|GATE|ACK)\s+(.*)$/;
export const RE_TAG = /\bre:([0-9a-f]{12})\b/;
export const AGENT_RE = /^[A-Za-z0-9][A-Za-z0-9_-]{0,39}$/;
const KEY_RE = /^[0-9a-f]{12}$/;
const ASK_TAG = /\bask:([0-9a-f]{12})\b/;
const TTL_TAG = /\bttl:(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)(?=\s|$)/;
const SEEN_TAG = /\bseen:([0-9a-f]{64})\b/;
const VERDICT_RE = /\b(APPROVED|DENIED|NOTED)\b/;
export const SPENT_RE = /\bSPENT approval:([0-9a-f]{16})\b/;

const sha256 = (s) => crypto.createHash("sha256").update(String(s), "utf8").digest("hex");

/** The 12-hex id of an ASK line. The same function the console has always used. */
export const askId = (raw) => crypto.createHash("sha1").update(String(raw).trim()).digest("hex").slice(0, 12);
/** The identity of one approval: the full hash of its ANS line. A re-approval is a new line, so a new id. */
export const answerId = (raw) => sha256(String(raw).trim());
/** The full-width binding of a decision to the question and the ledger row it was made on. */
export const seenHash = (askRaw, rowRaw) => sha256(`${String(askRaw).trim()}\n${String(rowRaw).trim()}`);

export const isoZ = (ms) => new Date(ms).toISOString().replace(/\.\d{3}Z$/, "Z");

/** A whole number of minutes inside TTL.min..TTL.max, or null. */
export function ttlMinutes(v) {
  const n = typeof v === "string" && /^\d+$/.test(v.trim()) ? Number(v) : v;
  return Number.isInteger(n) && n >= TTL.min && n <= TTL.max ? n : null;
}

// ---------------------------------------------------------------------------
// The ANS body: `ask:<id> VERDICT [ttl:<UTC>] [seen:<sha256>] [:: note]`
// Tags and verdict are read from the part BEFORE `::` only. The note is the
// Operator's free text; it cannot carry a verdict or a ttl.
// ---------------------------------------------------------------------------

export function parseAnswerBody(body) {
  const text = String(body);
  const cut = text.indexOf("::");
  const head = cut < 0 ? text : text.slice(0, cut);
  const ask = ASK_TAG.exec(head), v = VERDICT_RE.exec(head), t = TTL_TAG.exec(head), s = SEEN_TAG.exec(head);
  const note = cut < 0
    ? head.replace(ASK_TAG, "").replace(VERDICT_RE, "").replace(TTL_TAG, "").replace(SEEN_TAG, "").trim()
    : text.slice(cut + 2).trim();
  const expires = t ? Date.parse(t[1]) : NaN;
  return {
    ask: ask ? ask[1] : null,
    verdict: v ? v[1] : "NOTED",
    ttl: t ? t[1] : null,
    expires: Number.isFinite(expires) ? expires : null,
    seen: s ? s[1] : null,
    note,
  };
}

export function formatAnswer({ key, ask, verdict, note, ttl, seen }) {
  return `re:${key}${ask ? " ask:" + ask : ""} ${verdict}${ttl ? " ttl:" + ttl : ""}${seen ? " seen:" + seen : ""}${note ? " :: " + note : ""}`;
}

/**
 * Is one console answer worth relying on, now?
 *   VALID | EXPIRED | NO-TTL | SPENT | CHANGED | DENIED | PENDING
 */
export function assess(a, { now = Date.now(), isSpent = () => false, seenNow = null } = {}) {
  if (!a) return "PENDING";
  if (a.verdict === "DENIED") return "DENIED";
  if (a.verdict !== "APPROVED") return "PENDING";
  if (isSpent(a.id)) return "SPENT";
  if (a.expires === null) return "NO-TTL";
  if (a.expires <= now) return "EXPIRED";
  if (a.seen && seenNow && a.seen !== seenNow) return "CHANGED";
  return "VALID";
}

const REASON = {
  VALID: "an unexpired, unspent approval from CONSOLE is on the bus",
  CLAIMED: "the approval is now spent; this caller holds the only claim to it",
  EXPIRED: "the approval's ttl has passed — ask again",
  "NO-TTL": "the approval carries no ttl, so it is not honoured — ask again",
  SPENT: "this approval was already used — ask again",
  CHANGED: "the question behind this approval has changed since it was given — ask again",
  DENIED: "the Operator denied it",
  PENDING: "the Operator has not decided",
  NONE: "no question has been asked on that row",
  "NO-SUCH-ASK": "no such question on that row",
  AMBIGUOUS: "more than one valid approval exists on that row — name one with --ask",
  "NO-BUS": "there is no bus log under this root",
  "BAD-KEY": "the row key must be 12 hex characters",
  "BAD-ASK": "the question id must be 12 hex characters",
  "BAD-AGENT": "the agent id is not a valid id",
};

// ---------------------------------------------------------------------------
// Reading the bus — pure over lines, so a test can hand it any log
// ---------------------------------------------------------------------------

function collect(lines, key) {
  const asks = new Map();
  const answers = [];
  const spent = new Set();
  lines.forEach((raw, n) => {
    const m = BUS_RE.exec(raw);
    if (!m) return;
    const rk = RE_TAG.exec(m[5]);
    if (!rk || rk[1] !== key) return;
    if (m[4] === "ASK") {
      asks.set(askId(raw), { id: askId(raw), raw, time: m[1], from: m[2], text: m[5].replace(RE_TAG, "").trim() });
    } else if (m[4] === "ANS") {
      const p = parseAnswerBody(m[5].replace(RE_TAG, "").trim());
      answers.push({ ...p, id: answerId(raw), n, time: m[1], from: m[2], console: m[2] === "CONSOLE" });
    } else if (m[4] === "TELL") {
      const sp = SPENT_RE.exec(m[5]);
      if (sp) spent.add(sp[1]);
    }
  });
  return { asks, answers, spent };
}

/**
 * The state of the approval on one ledger row.
 * Returns { ok, state, reason, ask, from, answer, claimed, seenChecked }.
 * ok is true only for VALID (and, from spend, CLAIMED).
 */
export function evaluate(lines, { key, ask = null, now = Date.now(), isSpent = () => false, rowRaw = null } = {}) {
  const { asks, answers, spent } = collect(lines, key);
  const spentAny = (id) => spent.has(id.slice(0, 16)) || isSpent(id);
  const decisive = (a) => a.verdict === "APPROVED" || a.verdict === "DENIED";
  // A decision from anyone but CONSOLE is a claim. It is counted so it can be reported, never obeyed.
  const claimed = answers.filter((a) => !a.console && decisive(a)).length;

  const want = ask ? [ask] : [...asks.keys()];
  const per = want.map((id) => {
    const q = asks.get(id);
    if (!q) return { ask: id, from: null, answer: null, state: "NO-SUCH-ASK", seenChecked: false };
    const decided = answers.filter((a) => a.ask === id && a.console && decisive(a));
    const last = decided.length ? decided[decided.length - 1] : null;
    const seenNow = rowRaw !== null ? seenHash(q.raw, rowRaw) : null;
    return {
      ask: id, from: q.from, answer: last,
      state: last ? assess(last, { now, isSpent: spentAny, seenNow }) : "PENDING",
      seenChecked: !!(last && last.seen && seenNow),
    };
  });

  const done = (r, extra = {}) => ({ ...r, ok: r.state === "VALID", reason: REASON[r.state], claimed, ...extra });
  const valid = per.filter((r) => r.state === "VALID");
  if (valid.length === 1) return done(valid[0]);
  if (valid.length > 1) return done({ ask: null, from: null, answer: null, state: "AMBIGUOUS", seenChecked: false }, { asks: valid.map((r) => r.ask) });
  if (!per.length) return done({ ask: null, from: null, answer: null, state: "NONE", seenChecked: false });
  const decided = per.filter((r) => r.answer);
  if (decided.length) return done(decided.reduce((a, b) => (b.answer.n > a.answer.n ? b : a)));
  return done(per[per.length - 1]);
}

// ---------------------------------------------------------------------------
// Files
// ---------------------------------------------------------------------------

export const busLog = (root) => path.join(root, "_os", "exchange", "bus", "broadcast.log");
export const spentDir = (root) => path.join(root, "_os", "exchange", "bus", "spent");
export const spentFile = (root, id) => path.join(spentDir(root), id + ".txt");

/** Append one line, keeping the log one-line-per-message even if the last writer left no trailing newline. */
export function appendLine(file, line) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  let lead = "";
  try {
    const fd = fs.openSync(file, "r");
    try {
      const st = fs.fstatSync(fd);
      if (st.size > 0) { const b = Buffer.alloc(1); fs.readSync(fd, b, 0, 1, st.size - 1); if (b[0] !== 10) lead = "\n"; }
    } finally { fs.closeSync(fd); }
  } catch { /* no log yet: the append creates it */ }
  fs.appendFileSync(file, lead + line + "\n", "utf8");
}

/** The bus as lines, or null if it does not exist. Reads at most the last 16 MB. */
export function readBus(root, maxBytes = 16 * 1024 * 1024) {
  let fd;
  try { fd = fs.openSync(busLog(root), "r"); } catch { return null; }
  try {
    const size = fs.fstatSync(fd).size;
    const len = Math.min(size, maxBytes);
    const buf = Buffer.alloc(len);
    let got = 0;
    while (got < len) {
      const r = fs.readSync(fd, buf, got, len - got, size - len + got);
      if (r <= 0) break;
      got += r;
    }
    let text = buf.toString("utf8", 0, got);
    if (size > len) text = text.slice(text.indexOf("\n") + 1);     // drop the line the cut landed in
    return text.split(/\r?\n/).filter((l) => l.trim());
  } finally { fs.closeSync(fd); }
}

/** The raw ledger row with this key, or null if the ledger or the row is not there. */
export function ledgerRow(root, key) {
  const rows = readIndex(path.join(root, "_os", "tasks", "INDEX.md"));
  if (!rows) return null;
  const r = rows.concat(rows.other || []).find((x) => x.key === key);
  return r ? r.raw : null;
}

/** Check, without spending. Same answer however many times it is asked. */
export function check(root, key, { ask = null, now = Date.now() } = {}) {
  const bad = (state) => ({ ok: false, state, reason: REASON[state], claimed: 0, ask: null, from: null, answer: null, seenChecked: false });
  if (!KEY_RE.test(String(key))) return bad("BAD-KEY");
  if (ask !== null && !KEY_RE.test(String(ask))) return bad("BAD-ASK");
  const lines = readBus(root);
  if (lines === null) return bad("NO-BUS");
  return evaluate(lines, {
    key, ask, now,
    isSpent: (id) => fs.existsSync(spentFile(root, id)),
    rowRaw: ledgerRow(root, key),
  });
}

/**
 * The lock itself: create the claim file, and only if it does not exist yet.
 * true for the one caller that created it, false for every other. This single call,
 * not the check before it, is what makes an approval single-use under a race.
 */
export function claim(root, id, line) {
  fs.mkdirSync(spentDir(root), { recursive: true });
  try {
    fs.writeFileSync(spentFile(root, id), line + "\n", { flag: "wx" });
    return true;
  } catch (e) {
    if (e.code === "EEXIST") return false;
    throw e;
  }
}

/**
 * Check, then claim. The claim is an exclusive create, so exactly one caller can
 * win a given approval. Claim BEFORE the act: a crash between the two burns the
 * approval (the Operator is asked again), where the other order would let it be
 * replayed. The bus TELL is the record; the file is the lock.
 */
export function spend(root, key, { ask = null, by = null, now = Date.now() } = {}) {
  const r = check(root, key, { ask, now });
  if (!r.ok) return r;
  const who = by || r.from || "ALL";
  if (!AGENT_RE.test(who) && who !== "ALL") return { ...r, ok: false, state: "BAD-AGENT", reason: REASON["BAD-AGENT"] };
  const id = r.answer.id;
  const line = `${isoZ(now)}  ${who} > OPERATOR  TELL  re:${key} ask:${r.ask} SPENT approval:${id.slice(0, 16)}`;
  if (!claim(root, id, line)) return { ...r, ok: false, state: "SPENT", reason: REASON.SPENT };
  let logged = true;
  try { appendLine(busLog(root), line); } catch { logged = false; }
  return { ...r, ok: true, state: "CLAIMED", reason: REASON.CLAIMED, spent: id, line, logged };
}
