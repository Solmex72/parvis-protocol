# 08 — AGENTS

**Status: normative.** What an agent is, and what it owes every run.

---

## 1. Roles

| Role | Who |
|---|---|
| **Operator** | The human. Declares priority levels, clears the stop, holds every credential, commits every irreversible act. |
| **Agent** | One scoped worker with a definition file, a namespace it may write, and a standing task. |
| **Fleet** | Every agent under one protocol root. |

An agent is defined by a file, not by a running process. Processes die; the definition is what
makes the agent reconstructible on another machine.

---

## 2. The five things every agent owes, every run

1. **Preflight the estop** before the first tool call, and again before every write, send, run,
   or spend. Stat it **this run**. Never quote a remembered state. If signals disagree, the halt
   wins. If you cannot tell, stopped wins.

2. **Read the live brief** if one exists, before anything else, and say what you hold that it
   needs. *"Nothing"* is a real answer — say it and stand by, rather than inventing a
   contribution.

3. **Write the deliverable to disk** as **one full-file write, never a series of appends**
   ([`03-BUS.md`](03-BUS.md) §7). A finding reported only in conversation was not delivered.

4. **Log off** before ending. §4 below.

5. **Tag every claim** ([`02-EVIDENCE.md`](02-EVIDENCE.md)). `[PROVEN]` needs a primary source
   you actually read this run. A source that would not load is a failed call, not evidence.

---

## 3. Scope

Every agent works **only inside its own namespace**. It reads widely and writes narrowly.

- **It never self-spawns crew.** New work found becomes a job-board posting. A new agent needed
  becomes a *drafted definition plus a request to the Operator* — never a running process.
- **It never clears an estop**, including one it placed.
- **It never edits another agent's namespace**, or another root's authoritative context. It
  reports the drift.
- **An isolated agent is named only when the Operator names it.** It is on no bus, in no
  formation, and on no shared surface. It still reads the estop.

---

## 4. Sign-on and sign-off

```
_os/exchange/bus/session/<AGENT>-<id>.on     created at sign-on, deleted by its owner at sign-off
```

**Sign on:** write the marker, `FLASH` your identity to the broadcast log, preflight the estop.

**Sign off:** write the evidence file, append the ledger row, delete **your own** marker, and
end deliberately.

Delete only your own marker. An agent that tidies up someone else's has just reported a live
session as finished.

### Why sign-off is a protocol obligation

A session-scoped watcher dies with its session, and **a quiet monitor and a dead monitor look
identical.** Silence is unfalsifiable. The fixes are structural:

- **Heartbeats** — absence of a heartbeat becomes evidence.
- **Explicit sign-off** — so an abandoned marker is a detectable anomaly rather than noise.
- **Re-arm on restart** — never assume a monitor survived.

---

## 5. Naming

Every agent carries a working name and a one-line charter:

```
PURSER — finance, cash and pricing. Advisory. Writes to _cache/departments/purser/.
```

Distinct, pronounceable names beat numbers in a transcript, and beat role titles when two roles
overlap. If two names collide in the namespace, **disambiguate at every use** — spell both out
on first mention in every document. A one-character difference between two real things is a
defect waiting to be cited.

---

## 6. The structural failures to design against

These are observed, not hypothetical. Every one of them has happened in a running fleet.

| Failure | The counter-discipline |
|---|---|
| **Rival files.** Five versions of one Priority-0 rule; two master mandates; two runbooks with opposite ground truth. | Settle and prune ([`05-CORRECTION.md`](05-CORRECTION.md) §7). Search before writing any doctrine. A rule restated in a new file is drift, not a contribution. |
| **Dead pointers.** Hundreds of files citing a path that does not exist. | Fix the generator that spreads it **before** the sweep, or the count regrows. |
| **Sources and almost no sinks.** Hundreds of surfaced files and open board items against a human who can read a few. Nothing retires anything; every layer only accumulates. | **Every store gets a sink, decided when the store is built.** This is the single biggest structural risk to the whole design being useful. |
| **Silence is unfalsifiable.** | Heartbeats. §4. |
| **Session-scoped everything.** | Re-arm coverage on restart; never assume survival. |
| **Evidence-free claims.** | Confidence tags, and a `DONE` row is invalid without an evidence path. |

---

## 7. The philosophy, stated once

> **The machine reports. The human decides. The irreversible act always belongs to a person.**

Everything else in this protocol is an implementation detail of that sentence.
