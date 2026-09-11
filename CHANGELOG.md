# Changelog

All notable changes to this project are recorded here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Because `protocol/` is a specification, a **breaking** change there means wording that existing
adopters' agents were told to follow. Those get a major version, the same as an API break.

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

### Added — reference implementation

- `parvis` CLI: `serve`, `init`, `check`, `config`, `estop`, `clear`, `selftest`. Zero
  dependencies, Node 18+.
- Loopback sidecar with `Host` allowlist, `Origin` check, per-process session token, path
  allowlist plus `realpath` containment, and non-editable safety anchors.
- Full browser console: overview, documents with in-place editing, task ledger, bus, surface feed,
  job board, and settings. Self-contained single file — inline CSS and JS, no CDN, renders
  offline, light and dark.
- Configuration by file (`parvis.config.json`), environment, and flags, resolved with a stated
  precedence and shown with its source in the settings panel.
- `parvis check` exits non-zero when not `RUN`, so a hook or a CI job can gate on the stop.
- CI matrix across Windows, macOS and Linux on Node 18, 20 and 22, plus a hygiene job that fails
  the build on a leaked path, IP address, or email.

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

[1.0.0]: https://github.com/Solmex72/parvis-protocol/releases/tag/v1.0.0
