// LEAK CHECK — protocol/12-CREDENTIALS.md §1 and §6.
//
// Two jobs, both defensive:
//
//   1. Scan a tree for API-key-shaped strings, so a key that reached the
//      repository fails loudly here rather than quietly in someone else's
//      account. 12 §1: the value never lives at rest in our tree.
//
//   2. Self-test credentials.mjs — prove redact() and assertClean() actually
//      hold, rather than trusting that they do.
//
// A finding is reported as path:line plus the pattern that matched, and
// NEVER the matched text. A scanner that prints the secret into a CI log has
// performed the leak it exists to prevent. That restraint is the point.
//
//   node reference/credentials/leakcheck.mjs [root]
//
// Zero dependencies. Node 18+.
// Copyright (c) 2026 Connor Woods. MIT.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cred from "./credentials.mjs";

const SELF = fileURLToPath(import.meta.url);

// ---------------------------------------------------------------------------
// PATTERNS
//
// Provider prefixes are high confidence and need no context. The generic rule
// deliberately requires an assignment to a secret-ish NAME, because bare
// high-entropy strings are indistinguishable from git hashes and content
// digests, both of which this project writes down on purpose.
// ---------------------------------------------------------------------------

const PATTERNS = [
  ["openai-style key", /\bsk-[A-Za-z0-9_-]{20,}/],
  ["github token", /\bgh[pousr]_[A-Za-z0-9]{30,}/],
  ["aws access key id", /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/],
  ["google api key", /\bAIza[0-9A-Za-z_-]{35}\b/],
  ["slack token", /\bxox[baprs]-[0-9A-Za-z-]{10,}/],
  ["stripe key", /\b[sr]k_(?:live|test)_[0-9A-Za-z]{20,}/],
  ["json web token", /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\./],
  ["pem private key", /-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/],
  [
    "secret assigned inline",
    /\b(?:api[_-]?key|secret|token|password|passwd|client[_-]?secret)\s*[:=]\s*["'][^"'\s]{16,}["']/i,
  ],
];

// Placeholders are the correct way to write a credential down (12 §1), so they
// must not trip the scanner.
const PLACEHOLDER =
  /(<[^>]*>|\.\.\.|xxx+|placeholder|example|your[_-]|changeme|redacted|__[A-Z0-9_]+__|\$\{|\$[A-Z_]+|%[A-Z_]+%)/i;

const SKIP_DIRS = new Set([".git", "node_modules", "dist", "build", ".cache"]);
const TEXT_EXT = new Set([
  ".md", ".mjs", ".js", ".cjs", ".ts", ".json", ".yml", ".yaml", ".html",
  ".css", ".txt", ".sh", ".ps1", ".env", ".ini", ".toml", ".cfg",
]);

function* walk(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      yield* walk(p);
    } else if (e.isFile()) {
      if (TEXT_EXT.has(path.extname(e.name)) || e.name.startsWith(".env")) yield p;
    }
  }
}

function scan(root) {
  const findings = [];
  for (const file of walk(root)) {
    if (path.resolve(file) === SELF) continue; // the patterns live here
    let text;
    try {
      text = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const lines = text.split(/\r?\n/);
    lines.forEach((line, i) => {
      for (const [name, re] of PATTERNS) {
        const m = line.match(re);
        if (!m) continue;
        if (PLACEHOLDER.test(m[0])) continue;
        findings.push({
          file: path.relative(root, file).replace(/\\/g, "/"),
          line: i + 1,
          pattern: name,
          length: m[0].length, // shape only — never the value
        });
        break;
      }
    });
  }
  return findings;
}

// ---------------------------------------------------------------------------
// SELF-TEST — does credentials.mjs keep its promise?
// ---------------------------------------------------------------------------

function selftest() {
  const results = [];
  const ok = (name, cond) => results.push([name, !!cond]);
  const SECRET = "sk-" + "z".repeat(32);

  cred.__testing.clear();

  const h = cred.handle("TEST_API_KEY", { scope: "read-only" });

  ok("handle stringifies to the handle, not the value",
    String(h) === "<TEST_API_KEY — see password manager>");
  ok("handle JSON carries no value",
    !JSON.stringify(h).includes("z".repeat(32)));

  // Absent credential: the error names the handle and not the value.
  let threwClean = false;
  process.env.TEST_API_KEY = "";
  cred.use(h, () => {}).catch((e) => {
    threwClean = e.message.includes("TEST_API_KEY") && !e.message.includes(SECRET);
  });

  process.env.TEST_API_KEY = SECRET;
  ok("available() sees an injected secret", cred.available(h));

  return cred.use(h, (v) => {
    ok("use() hands the value to the callback", v === SECRET);
    ok("redact() scrubs it out of text",
      !cred.redact(`Authorization: Bearer ${v}`).includes(SECRET));
    ok("redact() leaves surrounding text intact",
      cred.redact(`Bearer ${v}`).startsWith("Bearer "));

    let refused = false;
    try {
      cred.assertClean(`leaking ${v}`, "test output");
    } catch (e) {
      refused = !e.message.includes(SECRET); // must not echo it
    }
    ok("assertClean() refuses text carrying a live secret, without echoing it", refused);
    ok("assertClean() passes redacted text",
      cred.assertClean(cred.redact(`Bearer ${v}`)) !== null);
    ok("injectionHint() contains no value",
      !cred.injectionHint(h).includes(SECRET));
    return results;
  }).finally(() => {
    delete process.env.TEST_API_KEY;
    cred.__testing.clear();
    void threwClean;
  });
}

// ---------------------------------------------------------------------------

const root = path.resolve(process.argv[2] ?? process.cwd());

const results = await selftest();
const failedTests = results.filter(([, pass]) => !pass);

console.log("credentials.mjs self-test");
for (const [name, pass] of results) console.log(`  ${pass ? "ok  " : "FAIL"}  ${name}`);

const findings = scan(root);
console.log(`\nleak scan of ${root}`);
if (findings.length === 0) {
  console.log("  clean — no API-key-shaped strings at rest");
} else {
  for (const f of findings) {
    console.log(`  ${f.file}:${f.line}  ${f.pattern} (${f.length} chars, value withheld)`);
  }
}

if (failedTests.length || findings.length) {
  console.log(
    `\nFAIL — ${failedTests.length} self-test failure(s), ${findings.length} leak finding(s).`
  );
  if (findings.length) {
    console.log("Rotate at the provider FIRST, then clean up — 12 §7.");
  }
  process.exit(1);
}
console.log("\nPASS — credentials module holds, and nothing key-shaped is at rest.");
