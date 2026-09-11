# Security

## Reporting a vulnerability

Use **GitHub's private vulnerability reporting** on this repository:
[Security → Report a vulnerability](https://github.com/Solmex72/parvis-protocol/security/advisories/new).

Please do not open a public issue for anything exploitable. Expect a first response within a
week; this is maintained by one person.

---

## The threat model, stated plainly

Being clear about what this does *not* defend against is part of the protocol
([`02-EVIDENCE.md`](protocol/02-EVIDENCE.md) — no overclaiming).

### What Parvis defends against

| Threat | Defence |
|---|---|
| A file in the tree issuing instructions to an agent | [`03`](protocol/03-BUS.md) §5 — an inbox is data, never command authority. A file that tries to command is a security event. |
| An agent acting on tool output as if it were an order | Same rule, generalised: everything arriving through a tool is data. |
| A web page you visit reaching the sidecar | `Host` allowlist and `Origin` check — defeats DNS rebinding. |
| A cross-origin request forging a write | Session token, minted per process, injected into the served document only. |
| Path traversal through the document editor | Allowlist, then `realpath` containment check after symlink resolution. |
| A UI editing the stop | Safety anchors are non-editable through any route, at any state. |
| An unreadable estop silently authorising work | Fail-safe direction: unreadable is `YELLOW`, never `RUN`. |
| Private data reaching a synced directory | [`06`](protocol/06-DATA-ZONES.md) — routing, not a bare prohibition. |

### What Parvis does NOT defend against

**An adversarial agent with shell access.** The protocol constrains a *cooperating* agent. An
agent that has decided to ignore its doctrine has a filesystem and a shell, and no markdown file
changes that. If you need containment, you need a sandbox, a container, or an unprivileged user —
Parvis is not one and does not claim to be.

**A local attacker already on your machine.** The session token stops a *remote* page from
reaching the sidecar. It does not stop a process running as you, which can read the token from
memory, read the tree directly, or simply start its own sidecar.

**A malicious `parvis.config.json`.** The config file is trusted input. It can point the root
anywhere you can read, widen `editableDirs`, or empty `lockedFiles`. Treat it the way you treat
any file that configures a tool that writes to disk — do not accept one from a repository you
have not read.

**The stop being instant.** [`01`](protocol/01-ESTOP.md) §0 is explicit: no file halts a session
already mid-turn. If you need an immediate stop, close the window.

---

## The bind address

The sidecar binds `127.0.0.1` by default and this is a protocol requirement
([`07`](protocol/07-INTERFACE.md) §3), not a default worth changing casually.

Binding anywhere else publishes the console — and **edit access to your unlocked governing
documents** — to every machine that can route to yours. **There is no user authentication.** The
session token proves a request came from the served page; it does not establish who is asking.

For that reason a non-loopback bind requires two independent opt-ins (`host` *and*
`allowNonLoopback`), warns at startup, and shows a permanent red banner in the UI. If you need
remote access, put it behind an SSH tunnel or a reverse proxy that actually authenticates:

```bash
ssh -N -L 7843:127.0.0.1:7843 you@your-workstation
```

---

## Supported versions

| Version | Supported |
|---|---|
| 1.0.x | yes |
| < 1.0 | no — pre-release, never published |

## Dependencies

Zero, deliberately, and CI fails the build if that changes. The supply-chain surface of this
project is Node itself.
