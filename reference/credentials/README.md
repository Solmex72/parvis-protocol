# credentials — reference implementation

Implements [`protocol/12-CREDENTIALS.md`](../../protocol/12-CREDENTIALS.md).

> **An agent gains a capability. It never gains a secret.**

Two files, zero dependencies, Node 18+.

| File | What it is |
|---|---|
| `credentials.mjs` | The module an agent uses. Handles, point-of-use resolution, redaction, and a refusal to emit text carrying a live value. |
| `leakcheck.mjs` | The adversarial counterpart, the way `redteam.mjs` is to `airlock.mjs`. Self-tests the module, then scans a tree for API-key-shaped strings. |

---

## The pattern, in three steps

**1 · A human creates the key at the provider, scoped.** Read-only if reading is all it does;
expiring if the provider supports it. Scope is set *before the key exists* — §5. Store it in the
password manager.

**2 · The key is injected at launch, never typed.** The value goes from the password manager into
the process environment and nowhere else:

```bash
# POSIX
PARVIS_READ_KEY="$(bw get password 'ops-read')" node your-agent.mjs
```

```powershell
# PowerShell
$env:PARVIS_READ_KEY = (bw get password 'ops-read'); node your-agent.mjs
```

It never lands on disk, never enters a conversation, and never appears in `argv` — where any other
process on the machine could read it.

**3 · The agent holds a handle, not a value.**

```js
import { handle, use, redact, assertClean } from "./credentials.mjs";

const READ = handle("PARVIS_READ_KEY", { scope: "reporting:read", expires: "2026-12-31" });

console.log(`using ${READ}`);
// → using <PARVIS_READ_KEY — see password manager>

const balance = await use(READ, async (key) => {
  const r = await fetch(url, { headers: { Authorization: `Bearer ${key}` } });
  return r.json();
});
```

`use()` resolves the value at the point of use and hands it only to the callback. Stringifying the
handle — in a log line, a `REQ` row, a surfaced error — yields the handle, never the secret.

---

## Redaction is the last line, not the first

```js
const line = `GET ${url} failed: ${err.message}`;
await writeFile(logPath, assertClean(redact(line), "log line"));
```

`redact()` scrubs any live value out of text. `assertClean()` **throws** if one is still present,
so a leak fails loudly at the boundary instead of quietly downstream. Its error deliberately does
not quote the offending text — an error message that echoed the secret would be the leak it exists
to prevent.

Reach for these when writing a file, populating `surface/`, or returning an error. They are a
backstop for the case where a value slipped somewhere it should not have been, not a licence to be
careless upstream.

---

## Running the check

```bash
node reference/credentials/leakcheck.mjs .     # self-test + scan the repo
npm run leakcheck --prefix reference           # same, via package script
```

Exits non-zero on a self-test failure or a finding. CI runs it on every OS and Node version in the
matrix.

A finding is printed as `path:line pattern (N chars, value withheld)`. **The matched text is never
printed.** A scanner that dumps the secret into a CI log has performed the leak it was built to
catch.

It knows the difference between a key and a placeholder: `<api key — see password manager entry
"acme">` and `__PARVIS_TOKEN__` do not trip it, and neither does a 40-character git sha, because
bare high-entropy strings are indistinguishable from the content digests this project writes down
on purpose. The generic rule therefore requires assignment to a secret-*named* variable.

**If it finds something: rotate at the provider first, then clean up** — §7. Deleting the file does
not recall the sync, and deleting the message does not recall the transcript. Every minute spent
tidying first is a minute the old value still works.

---

## What this does not do

It keeps a key out of the places we control — the tree, transcripts, logs, surfaces, commits. It
cannot protect a secret from the provider, from another process running as the same user, or from
a human who photographs the screen. And it does not make an agent trustworthy with the capability.

**Scope is the control; custody is not.** A narrowly-scoped key an agent cannot exceed is safe in a
way that a broad key held carefully never is.
