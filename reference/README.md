# reference/

The runnable half. A CLI and a loopback sidecar that serve a browser console over a Parvis tree.

**Zero dependencies. Node 18+. Windows, macOS and Linux.** CI proves the last claim on every push
across three operating systems and three Node versions.

```bash
npx parvis init my-project     # scaffold _os/ and copy the protocol in
cd my-project
npx parvis serve               # http://127.0.0.1:7843/
```

Or from a clone:

```bash
cd reference
node bin/parvis.mjs selftest
node bin/parvis.mjs serve --root ../my-project
```

---

## Commands

| Command | Does |
|---|---|
| `parvis serve [flags]` | Start the console. |
| `parvis init [dir]` | Scaffold `_os/` and copy `protocol/` into it. Never overwrites. |
| `parvis check` | Preflight the estop. **Exits 1 when not `RUN`** — gate a hook or a CI job on this. |
| `parvis watch --agent N` | The agent-side pickup loop, run by the Operator as its own process. Claims one open `REQ` row addressed to `N` at a time (exclusive-create, one winner per race), hands it to the agent as a **file** — never `argv` — and, with `--run PROG --arg A…`, starts the agent with `PARVIS_REQ_FILE` in its environment. Never writes `DONE` for anyone; appends `BLOCKED` if the agent wrote nothing. Instruction-shaped rows are quarantined as security events. `--unaddressed` also takes rows inducted under the Operator's own name (opt-in, on purpose). `--once`, `--dry`, `--every SEC`. |
| `parvis manifest` | What the ledger is waiting on: open rows (with `HOSTILE` where the airlock's markers hit), closed rows and whether their evidence resolves, active claims, session markers, rows the console cannot see. **Read-only.** |
| `parvis config [--init]` | Show the effective config and where each value came from; write the file. |
| `parvis estop <reason>` | Place the stop. Refuses without a reason in plain English. |
| `parvis clear` | Remove the sentinel, set `RUN`. |
| `parvis selftest` | Verify this install on this platform. |

### `parvis estop` is the Operator's hand

[`01`](../protocol/01-ESTOP.md) §2 says only the Operator writes the stop. This command is a human
typing at a terminal. **Do not wire it into an agent, a hook, or a CI job** — an agent that can
stop the fleet on its own authority is the failure mode the rule exists to prevent, and it does not
become acceptable because a script is holding the keyboard.

---

## Configuration

Three sources, resolved in one place, highest wins:

```
CLI flag  >  environment  >  <root>/parvis.config.json  >  built-in default
```

`parvis config` prints every key with its source, so you never have to guess why a value is what
it is. The console's **Settings** tab shows the same thing and writes the file — but greys out any
value pinned by a flag or an env var, because showing it as editable would be a lie the next
restart exposes.

| Key | Default | Notes |
|---|---|---|
| `root` | `.` | The tree to govern. |
| `host` | `127.0.0.1` | See below. |
| `port` | `7843` | |
| `allowNonLoopback` | `false` | Second opt-in required for a public bind. |
| `openBrowser` | `true` | |
| `editableDirs` | `["_os", "_os/protocol"]` | Relative, must not escape the root. |
| `lockedFiles` | `["01-ESTOP.md", "00-PRECEDENCE.md", "COVENANT.md", "ESTOP.md"]` | Readable, never writable through the UI. |
| `operator` | `null` | Falls back to the OS username. |
| `refreshMs` | `5000` | |

A malformed config file is an **error you are told about**, never a silent fallback to defaults —
falling back would change the bind address and the locked-file list without telling anyone.

Keys marked `RESTART` in the settings panel take effect on the next start. The panel says so
rather than pretending a live rebind happened.

### The bind address

Loopback by default, and [`07`](../protocol/07-INTERFACE.md) §3 makes that a requirement rather
than a preference. Binding elsewhere publishes the console — and edit access to your unlocked
governing documents — to everything that can route to you. **There is no user authentication**;
the session token proves a request came from the served page, not who is asking.

So a public bind needs `host` *and* `allowNonLoopback`, warns at startup, and shows a permanent red
banner in the UI. For genuine remote access, tunnel instead:

```bash
ssh -N -L 7843:127.0.0.1:7843 you@your-workstation
```

---

## What the sidecar will and will not do

**Will:** read the tree, list and edit allowlisted `.md` files with a `.bak` copy, append `REQ`
rows, drop surface pointers, and write `parvis.config.json`.

**Will not:** spawn a process, run a command, open an outbound connection, or hold a credential.
There is no `exec`, no `spawn` outside the one browser-launch shim, and no `fetch` in the request
path. That is load-bearing, not incidental — it is what makes a prompt in the UI an *induction*
rather than an *execution*.

### Security controls

| Control | Where |
|---|---|
| Loopback bind, explicit | `start()` |
| `Host` header allowlist — defeats DNS rebinding | `HOST_OK` |
| `Origin` check | `originOk()` |
| Per-process session token, timing-safe compare | `tokenOk()` |
| Path allowlist + `realpath` containment | `resolveEditable()` |
| Safety anchors non-editable at any state | `LOCKED` |
| Writes refused unless `RUN` | every mutating route |
| **Unreadable estop reads `YELLOW`, never `RUN`** | `estopState()` |

That last one is the important one. The origin implementation had
`catch { return "RUN" }`, which turned every disk error into a silent authorisation. It is
recorded as [D-03](../DECISIONS.md) and commented at the point of the fix.

Full threat model, including what this explicitly does **not** defend against, is in
[SECURITY.md](../SECURITY.md).

---

## Layout

```
reference/
  bin/parvis.mjs              the CLI
  sidecar/parvis-sidecar.mjs  the server
  sidecar/config.mjs          file + env + flag resolution
  sidecar/console.html        the whole UI, one self-contained file
  package.json                zero dependencies, and CI fails if that changes
```

`console.html` is deliberately one file with inline CSS and JS and no CDN, per
[`07`](../protocol/07-INTERFACE.md) §2.1 — it renders from a file path with no server, and a page
that has lost its sidecar says so in red rather than showing stale numbers as if they were live.
