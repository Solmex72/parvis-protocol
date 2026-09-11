// RED-TEAM HARNESS — protocol/10-AIRLOCK.md §7.
//
// Replays an injection corpus into OUR OWN ingress and proves quarantine
// holds. Defensive only: it measures our resilience and probes nothing
// belonging to anyone else.
//
// Pass criterion, all three:
//   1. zero injections reach an instruction context
//   2. zero unauthorised writes reach canonical state
//   3. 100% land in quarantine with correct provenance
//
//   node reference/airlock/redteam.mjs [root]
//
// Copyright (c) 2026 Connor Woods. MIT.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as air from "./airlock.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const corpus = JSON.parse(fs.readFileSync(path.join(HERE, "corpus.json"), "utf8"));

const tty = process.stdout.isTTY && !process.env.NO_COLOR;
const c = {
  dim: (s) => (tty ? `\x1b[2m${s}\x1b[0m` : s),
  green: (s) => (tty ? `\x1b[32m${s}\x1b[0m` : s),
  red: (s) => (tty ? `\x1b[31m${s}\x1b[0m` : s),
  amber: (s) => (tty ? `\x1b[33m${s}\x1b[0m` : s),
  b: (s) => (tty ? `\x1b[1m${s}\x1b[0m` : s),
};

const root = process.argv[2] || fs.mkdtempSync(path.join(os.tmpdir(), "parvis-airlock-"));
const ephemeral = !process.argv[2];

let pass = 0, fail = 0;
const ok = (name, cond, detail) => {
  console.log("   " + (cond ? c.green("pass") : c.red("FAIL")) + "  " + name + (detail ? c.dim("   " + detail) : ""));
  cond ? pass++ : fail++;
};

console.log("");
console.log("  " + c.b("Airlock red-team") + c.dim("  — protocol/10 §7, pointed at our own ingress"));
console.log("  root  " + root);
console.log("");

// ---------------------------------------------------------------------------
// 1. Every case quarantines, and hostile ones are flagged.
// ---------------------------------------------------------------------------
console.log("  " + c.b("Ingress"));
let hostileDetected = 0, hostileTotal = 0, falsePositives = 0;

for (const t of corpus.cases) {
  const r = air.accept(root, { origin: "redteam/" + t.id, payload: t.payload });
  const ids = r.hits.map((h) => h.id);

  // 3 — everything lands in quarantine with provenance, hostile or not.
  const rec = air.show(root, r.id);
  const quarantined = !!rec && rec.trust === "UNTRUSTED_DATA" && !!rec.sha256 && rec.origin.startsWith("external:");

  if (t.expect) {
    hostileTotal++;
    const caught = ids.includes(t.expect);
    if (caught) hostileDetected++;
    ok(t.id.padEnd(18) + " flagged " + c.dim(t.expect), caught && quarantined,
       caught ? "" : "got [" + ids.join(",") + "]");
  } else {
    if (ids.length) falsePositives++;
    ok(t.id.padEnd(18) + " benign, still quarantined", quarantined,
       ids.length ? c.amber("flagged [" + ids.join(",") + "] — false positive") : "");
  }
}

// ---------------------------------------------------------------------------
// 2. Multi-response assembly: parts must never be joined by the airlock.
// ---------------------------------------------------------------------------
console.log("");
console.log("  " + c.b("Assembly"));
const partIds = corpus.assembly.parts.map((p, i) =>
  air.accept(root, { origin: "redteam/assembly", payload: p }).id);
ok("each fragment is a separate quarantined record", new Set(partIds).size === corpus.assembly.parts.length);

const joined = corpus.assembly.parts.join(" ");
const joinedHits = air.scan(joined);
ok("the assembled whole would be caught if ever joined", joinedHits.length > 0,
   joinedHits.map((h) => h.id).join(","));
ok("the airlock never joins fragments itself",
   air.list(root).filter((r) => r.origin.endsWith("assembly")).length === corpus.assembly.parts.length);

// ---------------------------------------------------------------------------
// 3. Structural guarantees — the ones that matter more than any pattern list.
// ---------------------------------------------------------------------------
console.log("");
console.log("  " + c.b("Structure"));

const src = fs.readFileSync(path.join(HERE, "airlock.mjs"), "utf8");
const body = src.replace(/^\s*\/\/.*$/gm, "");   // ignore commentary
ok("no eval in the broker", !/\beval\s*\(/.test(body));
ok("no child_process in the broker", !/child_process|\bspawn\s*\(|\bexec\s*\(/.test(body));
ok("no network egress in the broker", !/\bfetch\s*\(|node:https?|\bXMLHttpRequest\b/.test(body));
ok("no payload interpolated into a template", !/`[^`]*\$\{[^}]*payload[^}]*\}[^`]*`/.test(body));
ok("trust is a constant, not a parameter",
   /export const TRUST = "UNTRUSTED_DATA"/.test(src) && !/trust\s*[:=]\s*(?!TRUST|"UNTRUSTED_DATA")[a-z]/.test(body));

// Canonical state is untouched: the only thing on disk is the airlock dock.
const stray = [];
(function walk(dir, rel) {
  let e; try { e = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const x of e) {
    const r = rel ? rel + "/" + x.name : x.name;
    if (x.isDirectory()) walk(path.join(dir, x.name), r);
    else if (!r.startsWith("_os/airlock/")) stray.push(r);
  }
})(root, "");
ok("zero writes outside _os/airlock/", stray.length === 0, stray.length ? stray.slice(0, 3).join(", ") : "");

// Nothing is ever auto-promoted.
ok("nothing promoted itself", air.list(root).every((r) => !r.promoted));
const needsHuman = air.promote(root, air.list(root)[0].id, {});
ok("promotion without a named human is refused", needsHuman.ok === false, needsHuman.error);

// ---------------------------------------------------------------------------
// 4. Audit chain.
// ---------------------------------------------------------------------------
console.log("");
console.log("  " + c.b("Audit"));
const v1 = air.verify(root);
ok("hash chain verifies", v1.ok, v1.entries + " entries");

// Tamper with one entry and prove the chain notices.
const P = air.paths(root);
const lines = fs.readFileSync(P.audit, "utf8").split("\n").filter((l) => l.trim());
if (lines.length > 2) {
  const victim = JSON.parse(lines[1]);
  victim.verdict = "clean";                        // a lie
  lines[1] = JSON.stringify(victim);
  fs.writeFileSync(P.audit, lines.join("\n") + "\n", "utf8");
  const v2 = air.verify(root);
  ok("a tampered entry is detected", !v2.ok, v2.why + " at entry " + v2.brokenAt);
}

// ---------------------------------------------------------------------------
// 5. Idempotency.
// ---------------------------------------------------------------------------
console.log("");
console.log("  " + c.b("Replay"));
const a1 = air.accept(root, { origin: "replay", payload: "same content" });
const a2 = air.accept(root, { origin: "replay", payload: "same content" });
ok("a replayed response cannot double-apply", a2.duplicate === true && a1.id === a2.id);

// ---------------------------------------------------------------------------
console.log("");
const rate = hostileTotal ? Math.round((hostileDetected / hostileTotal) * 100) : 100;
console.log("  detection " + (rate === 100 ? c.green(rate + "%") : c.amber(rate + "%")) +
            c.dim("  (" + hostileDetected + "/" + hostileTotal + " hostile cases flagged)"));
console.log("  false positives on benign content: " + (falsePositives ? c.amber(String(falsePositives)) : c.green("0")));
console.log("");
console.log("  " + (fail ? c.red(fail + " FAILED") : c.green("all passed")) + c.dim("   (" + pass + " checks)"));
console.log("");

if (ephemeral) { try { fs.rmSync(root, { recursive: true, force: true }); } catch {} }
process.exit(fail ? 1 : 0);
