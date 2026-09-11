# Changelog

All notable changes to this project are recorded here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Because `protocol/` is a specification, a **breaking** change there means wording that existing
adopters' agents were told to follow. Those get a major version, the same as an API break.

## [1.1.0] — 2026-09-11

The agent pickup loop: inducted `REQ` rows can now activate agents, without the console ever
spawning anything.

### Added

- **`parvis watch --agent NAME`** ([`reference/sidecar/watch.mjs`](reference/sidecar/watch.mjs)) —
  the agent-side pickup loop, run by the Operator as its own process. Each cycle it preflights the
  estop (sentinel first, `STATE` second, unreadable is `YELLOW`), heartbeats its own session
  marker, and claims one open `REQ` row addressed to `NAME` with an exclusive-create file in
  `_os/tasks/claims/`, so two watchers racing for a row have exactly one winner. The row reaches
  the agent as a **file**, never as `argv`, and framed as data (03 §5). With `--run PROG --arg A`
  the agent is started with `PARVIS_REQ_FILE` and friends in its environment; `shell:false`.
  Afterwards the watcher checks that the *agent* wrote its own `DONE`/`BLOCKED`/`REFUSED` — it
  never writes `DONE` for anyone (02 §3, 04 §3) — and appends `BLOCKED` if it did not. `STOP`
  holds and writes nothing, not even a sign-off; `YELLOW` claims nothing and says what it sees.
  `--unaddressed` (opt-in, by design) also claims rows inducted under the Operator's own channel
  name. `--once`, `--dry`, `--every SEC`.
- **Quarantine.** A `REQ` row that carries instruction-shaped text — an override, a role switch,
  an authority claim, fake system syntax, an encoded blob — is a **security event** (03 §5, 10 §4):
  the watcher refuses to claim it, records `<key>.hostile`, surfaces the row verbatim in one file
  the Operator reads, and puts only the key and marker names on the bus, never the text. Two
  content markers (a path, the word "password") are handed to the agent as flags instead.
- **`parvis manifest`** — what the ledger is waiting on, for a human at a terminal. Open rows with
  `HOSTILE` prefixes, closed rows with who closed them and whether the evidence path resolves,
  active claims and whether their owner is alive, session markers with heartbeat age, and rows the
  console cannot see. Read-only; proven by mtime.
- **[`reference/sidecar/ledger.mjs`](reference/sidecar/ledger.mjs)** — one parser for every reader
  of `_os/tasks/INDEX.md`, and one lock for every writer. A `REQ` with a later `DONE`/`BLOCKED`/
  `REFUSED` that names it (`closes <key>`) or repeats its text is **closed**; a `REQ` named by
  another `REQ`'s `closes` is **taken**. The lock is an exclusive-create file with the holder's
  pid; a dead holder's lock is released only when it is dead **and** past the stale window, never
  on age or liveness alone. A busy ledger means *write nothing and say so* (`ELEDGERBUSY`).

### Changed

- **Sidecar.** `induct()` and `/tasks/amend` take the ledger lock; a rewrite can no longer drop an
  append that lands mid-request (measured: 6 appenders × 40 rows against a concurrent rewriter,
  240/240 survive). A held lock returns **503** with nothing written. The warehouse floor stops
  counting closed or taken `REQ` rows as scheduled, so a crane's queue clears when the agent's own
  `DONE` lands. `/tasks` rows carry `key`, `closed` and `taken`.
- **CLI version** `1.1.0`.

### Honest limits, stated

- Nothing here makes an agent trustworthy with a row; the launcher the Operator configures is the
  grant, and `--unaddressed` admits a class of rows from a world-appendable file, which is why it
  is a flag you have to type.
- `closes <key>` is categorisation, never authorisation: any writer can append a row closing any
  key. The manifest shows the closer beside every closed row so nothing disappears unlabelled.
- The quarantine is a pattern list. It catches shapes; it does not read intent.

## [1.0.0] — 2026-09-11

First public release. Extracted from a private multi-agent system that ran daily for several
months, with every rival fact settled and every private artifact removed. The full record of what
was decided, what stayed open, and what was removed is in [DECISIONS.md](DECISIONS.md).

### Added — protocol

- **00 PRECEDENCE** — the seven-rung ladder, and the rule that a lower rung never overrides a
  higher one. Ships with nothing above the stop.
- **01 ESTOP** — sentinel-and-mirror stop, `RUN` / `YELLOW` / `STOP`, and §0 stating plainly that
  no file halts a running session.
- **02 EVIDENCE** — four confidence tags, cite-or-flag, measure-twice, self-description is never
  `[PROVEN]`, and a dropped call is not a finding.
- **03 BUS** — the filesystem as the only channel, six verbs, and the rule that makes it safe: an
  inbox informs, it never commands.
- **04 OUTPUT CONTRACT** — work in files, surface a pointer, and the counter-rule that bad news
  still goes straight to the human.
- **05 CORRECTION** — how a changed fact propagates in one pass, and how a rival gets settled and
  pruned rather than catalogued.
- **06 DATA ZONES** — public and private as a routing decision rather than a bare prohibition,
  with credentials belonging to neither.
- **07 INTERFACE** — the page is a window, the sidecar is the bridge, a prompt is an induction and
  not an execution; plus the sidecar's seven security requirements.
- **08 AGENTS** — what an agent owes every run, sign-on and sign-off, and the six structural
  failures to design against.
- **09 FLOOR** — the warehouse mapping. Agents are cranes, directories are pallets, work arrives
  at an induct and leaves by a spur, and an external service is a truck that docks at the boundary
  and never drives onto the floor — which puts the airlock where it belongs and makes it visible.
  Opening a pallet is entering another whole warehouse, navigated identically, all the way down.

- **10 AIRLOCK** — the dock. The far side is modelled as hostile; everything it returns is
  wrapped  before anything reads it, quarantined by content hash, and never
  reaches canonical state without a human. Egress is allowlisted, redacted and provenance-stamped;
  external callers cannot name paths at all.

### Added — reference implementation

- `parvis` CLI: `serve`, `init`, `check`, `config`, `estop`, `clear`, `selftest`. Zero
  dependencies, Node 18+.
- Loopback sidecar with `Host` allowlist, `Origin` check, per-process session token, path
  allowlist plus `realpath` containment, and non-editable safety anchors.
- Full browser console: overview, warehouse floor, documents with in-place editing, task ledger,
  bus, surface feed, job board, and settings. Self-contained single file — inline CSS and JS, no
  CDN, renders offline, light and dark.
- **Warehouse tab** — a 3D floor of the tree, rendered on a 2D canvas with a hand-rolled
  yaw/pitch camera and painter's-algorithm depth sort. No library, because no CDN. Drag to orbit,
  scroll to zoom, top-down mode, click any equipment to descend or open its controls. Cranes are
  driven by live session markers and bus recency, and animate toward the directory their own last
  message names — parking grey at the dock when that cannot be determined rather than being placed
  somewhere invented.
- **Equipment side menu and controls** — cranes, pallets, both docks, the conveyor, and the
  trucks, each selectable with its own panel. Addressing a crane inducts work to it: a `REQ` row
  naming that agent plus a `TELL` in its inbox. It starts nothing. The conveyor is read-only and
  trucks have no controls at all, both deliberately.
- Configuration by file (`parvis.config.json`), environment, and flags, resolved with a stated
  precedence and shown with its source in the settings panel.
- `parvis check` exits non-zero when not `RUN`, so a hook or a CI job can gate on the stop.
-  — list, accept, show, promote, verify, redteam. Promotion requires a named
  human and records a judgement rather than copying anything into canonical state.
- Hash-chained append-only audit log; a tampered entry is detected and located.
- **Red-team harness** () replaying a 23-case injection corpus into our own
  ingress: override attempts, authority spoofs, fake system turns, tool-call syntax, encoded
  payloads, zero-width steering, and multi-response assembly. 100% detection, zero false positives
  on benign content, plus structural assertions that the broker contains no eval, no child_process,
  no network egress, and no path where a payload is interpolated into a template.
- **Full system stress test** () — deep trees with awkward filenames,
  malformed estop states, symlink loops, 12k-row ledgers, concurrent appends, racing ingress,
  hostile requests, oversized bodies, and every write route under STOP. 35 assertions.
- CI matrix across Windows, macOS and Linux on Node 18, 20 and 22, plus red-team, stress, and a
  hygiene job that fails the build on a leaked path, IP address, or email.

### Fixed — found by the stress test

- **Silently truncated counts.** The tree walker's depth guard is necessary — a symlink loop would
  otherwise never return — but a guard that trips makes the count partial, and it was being
  reported as a total. A tree 20 deep reported 12 of 20 files with no indication. The snapshot now
  declares , and the console renders the number with a  and says why.
- **A blue crane on a red floor.** An agent with queued work but no session marker kept reading
  scheduled under STOP.
- **Listen backlog saturation.** Under a burst against a large tree, connections were refused at
  the socket rather than answered. Backlog raised to 1024 and the saturation point is now measured
  and reported rather than assumed.

### Fixed — carried over from the origin implementation

- **Inverted estop fail-safe.** The original read `catch { return "RUN" }`, turning every disk
  error into a silent authorisation. Unreadable is now `YELLOW`. (D-03)
- **No access control in the console.** `admin: true` was hardcoded, with no token and no `Host`
  or `Origin` validation. (D-07)
- **Windows-only dynamic import.** An absolute path passed to `import()` needs `pathToFileURL`;
  without it the CLI failed on Windows alone. Caught by the selftest.
- **Roughly 200 hardcoded absolute paths** replaced by a configurable root.

### Removed

3,393 of the origin tree's 3,427 files. Personal data, business context, infrastructure
identifiers, third-party PII, the agent roster, and the operational exhaust of a running fleet.
Itemised in [DECISIONS.md](DECISIONS.md) Part 3.

[1.1.0]: https://github.com/Solmex72/parvis-protocol/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/Solmex72/parvis-protocol/releases/tag/v1.0.0
