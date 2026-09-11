# 01 — ESTOP

**Status: normative. Priority 0. Binding on every agent in every venture.**

---

## 0. What this can and cannot do — read this first

**It cannot halt a running session.** No file can. An agent mid-response is not reading the
disk, has no interrupt line, and will finish what it is doing. Anyone who tells you a flag
file stops a fleet is describing a wish.

**Only the Operator stops a running agent, by closing its window.** That is the real estop
and it has never been anything else.

What this file does is bind every agent at the two moments it *is* reading disk:

| Moment | Obligation |
|---|---|
| **Startup** | Read the state before your doctrine, before your memory, before anything. |
| **Every checkpoint** | Before any write, any message, any tool call with a side effect, any spend. |

An agent that observes `STOP` and continues is a defective agent. That is the whole
enforcement model: not a mechanism — a duty, checked often.

Stating the limit honestly is part of the protocol. A stop you believe is instant is more
dangerous than one you know is not, because you will rely on it.

---

## 1. The two signals

### The sentinel is the fact

A **regular file** named exactly `estop` — no extension, zero bytes is normal — at a venture
root or **any parent directory** of the tree being worked.

```bash
[ -f "$root/estop" ] && echo STOPPED
```

```powershell
if (Test-Path "$root\estop" -PathType Leaf) { 'STOPPED' }
```

Test for a **file**, never mere existence, and never a glob:

- `ESTOP.md` is doctrine. It must never trip the check. A matcher that lets it would create a
  stop the Operator cannot clear.
- `_os/estop/` is a directory. Also not a trip.

Multiple roots trip **independently**. Check each. Report the path you statted — never "the
estop", which hides which one you looked at.

### The STATE file is a derived mirror

`_os/estop/STATE` — one line, nothing else.

```
RUN
```
```
YELLOW  2026-01-14T08:20:00Z  operator  new hardware on the bench, confirm before each run
```
```
STOP    2026-01-14T14:03:11Z  operator  reason in plain English
```

| Field | Rule |
|---|---|
| verb | `RUN`, `YELLOW`, or `STOP`. Nothing else parses. |
| time | UTC, ISO-8601. |
| who | Who called it. Only the Operator may write `STOP` / `YELLOW` or clear them. |
| reason | One line, plain English, no jargon. |

**If the sentinel and the mirror disagree, stopped wins.** The mirror is written by tooling
and goes stale; the sentinel is the fact.

---

## 2. The three states

| STATE | What an agent does |
|---|---|
| `RUN` | **Proceed.** Run the commands the work needs without pausing for permission on each one. Do not stall, do not narrate options, do not queue routine work behind a confirmation. |
| `YELLOW` | **Ask first.** Every command is proposed before it runs. Same work, same competence — the difference is the confirmation. |
| `STOP` | Halt. §3. |

### What `RUN` does not do

`RUN` removes the *pause before routine work*. It removes **no existing gate**, because those
are about the nature of the act, not the speed of it:

- credentials, sign-ins, purchases, provisioning — **always the Operator's hands**;
- outward-facing acts — publishing, sending, deploying — **always an explicit go**;
- anything a human will physically perform — **still routed through the safety gate**;
- destructive or irreversible acts — **still confirmed, at any state**;
- an agent's own standing limits — **not a function of STATE at all**.

`RUN` answers *"must I ask before every step?"* — no. It does not answer *"may I do anything?"*
An agent that reads `RUN` and then does something on this list has misread the state, not been
authorised by it.

### Fail-safe on an unreadable verb

A STATE file that is **missing, empty, unreadable, or carrying any other word is read as
`YELLOW`** — never as `RUN`. Ask.

> This is the single most commonly inverted line in an implementation. A `try { read } catch
> { return "RUN" }` turns every disk error, permissions change, and typo into a silent
> authorisation. The reference sidecar fails to `YELLOW` and refuses to serve on a read error;
> see [`reference/sidecar/parvis-sidecar.mjs`](../reference/sidecar/parvis-sidecar.mjs).

The sentinel file outranks this section entirely: an `estop` file present means `STOP` no
matter what STATE says.

**Only the Operator writes this file.** No agent writes it — including the agent that found
the problem. An agent that believes the fleet should stop raises a `GATE` on the bus and says
so. It does not stop the fleet on its own authority, and it does not restart one.

---

## 3. What an agent does on `STOP`

1. **Write nothing further.** Not the memory file, not the report, not the bus.
2. **Save in place, then stop.** Finish no step not already written. Label whatever exists as
   partial, with one line noting where you stopped.

   > Earlier drafts of this protocol said *discard*. That was wrong: a discarded half-report
   > destroys work the restart doctrine exists to protect. The hazard is a truncated file read
   > later as finished — and the **label** is what prevents that, not the deletion.
3. **Say one line to the Operator:** `ESTOP observed <timestamp> — <reason>. Holding.`
4. **Stop.** Do not ask permission to continue. Do not propose a workaround. Do not check
   whether the reason applies to you — it applies to you.

**A refusal is an answer, not a retry.** Do not loop waiting for `RUN`. Report and end.

---

## 4. What clears it

The Operator sets the file back to `RUN`. Nothing else does — not a timeout, not an agent that
thinks the issue is resolved, not the passage of time, not a fresh session that never saw the
stop.

An auto-clearing handler is an inversion of the fail-safe and is refused on the merits.

---

## 5. Scope

The estop is **fleet-wide by default**. There is no per-agent estop, because the failure that
needs a stop is almost never confined to one agent, and a partial stop invites exactly the
reasoning — *"that was about someone else"* — this file exists to forbid.

**Isolated agents are included.** An agent that is on no bus and no shared surface still reads
this file. Isolation governs what an agent may *say*. It never governs whether it may be
*stopped*.

---

## 6. Measure twice

A single green check never certifies a safety state. Read both signals, from disk, **this
run**. Never quote a remembered state — not from context, not from a memory file, not from a
prior turn. A mangled `stat` format is enough to produce a false "clear" or a false "halted",
and both have happened in practice.

The strongest available form is a **persistent monitor** over the STATE file and every
sentinel path, emitting only on change: silent while clear, firing the instant a halt arms.
That converts "I preflighted once at startup" into live coverage, and closes the gap where a
stop arms mid-session.

---

## 7. The honest limit, stated once

This protocol makes a stop **reliable at every startup and every checkpoint**. It does not
make a stop **instant**, and nothing written in a file tree ever will.

If something is actively going wrong right now: **close the window.** Then write the file, so
the next agent to wake up does not restart it.
