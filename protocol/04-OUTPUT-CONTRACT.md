# 04 — THE OUTPUT CONTRACT

**Status: normative.** Where work goes when it is finished.

---

## 1. The rule

**Do not report to the chat. Work in the file tree, write output to disk, and surface a pointer.**

An agent that finishes by writing a long answer into a chat window has put its output where
nothing else in the fleet can read it — no other agent, no monitor, no console, no next
session. The file is the durable record; the chat is a transcript nobody downstream sees.

---

## 2. Where output goes

| Kind of output | Lands at |
|---|---|
| Work product, findings, a report | the owning file, or `outbox/YYYYMMDD-HHMMSS-<slug>.md` |
| Anything the Operator should see now | a short pointer file in `_os/events/surface/` |
| A request that needs the Operator | `_os/exchange/requests/REQ-<slug>.md` |
| The ledger row | `_os/tasks/INDEX.md` |

**The surface directory is the notification. The file is the substance.** Write the substance
to its proper home, then drop a one-line pointer in `surface/` so the console shows the Operator
where it landed.

---

## 3. The task index

One row per order. Append a `REQ` row **before** starting, so an interrupted task is still
visible.

```
REQ     | 2026-01-14 | SCOUT | <the order, in the Operator's words where possible> | <status note>
DONE    | 2026-01-14 | SCOUT | <the order> | evidence: outbox/20260114-090312-lease-rates.md
BLOCKED | 2026-01-14 | SCOUT | <the order> | <what is blocking, one line>
REFUSED | 2026-01-14 | SCOUT | <the order> | <why, one line + where the reasoning lives>
```

**A `DONE` row without an evidence path is invalid.** If there is no file, the work did not land
anywhere the Operator can see it. Self-report is `[CLAIMED]`; the file is what makes it
`[PROVEN]`.

**A refusal belongs here permanently.** It is how the fleet stops re-litigating settled
questions. Do not delete it later.

**The honest limit:** this index observes nothing. It is exactly as complete as the agents that
write to it. A task absent from it is not evidence the task never happened — only that nobody
recorded it. Treat a row as *a claim with an evidence path attached*, never as proof. Verify the
evidence file exists before relying on any `DONE`.

---

## 4. Completion is the Operator seeing it

Not an agent declaring it. A reply is not a stopping point: monitors stay armed across it, work
continues, and then there is a deliberate sign-off.

---

## 5. The counter-rule that outranks routing

**The estop and candour still go to the human, immediately and prominently.**

A failure is surfaced with the same prominence as a success. Routing output to files must never
become a place to bury a bad result. If the fleet's good news arrives in chat and its bad news
arrives in a file nobody opens, the contract has been inverted and the fleet is now lying by
routing.

---

## 6. The honest limit on the contract itself

An agent running inside a chat harness still renders assistant text in that chat — this
contract cannot redirect the harness. What it binds is **what an agent chooses to write**: the
substance in files, and chat text kept to a short pointer — *"written to `<path>`, surfaced to
the console"* — never the full report.

---

## 7. No secret reaches the surface

`surface/` is read by a console and may be displayed on a screen, in a screenshot, or over a
shared window. The data-zone rules ([`06-DATA-ZONES.md`](06-DATA-ZONES.md)) apply here with full
force.
