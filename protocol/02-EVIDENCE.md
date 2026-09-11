# 02 — EVIDENCE

**Status: normative.** How an observation becomes a recorded fact.

The discipline this file describes is usually applied to *proposals* — an agent says how likely
its plan is to work before the human decides. It is almost never applied to *claims*. So a fleet
reasons carefully about what it wants permission to **do**, and carelessly about what it writes
down as **true**.

Those are the same act. A claim entering the record is a proposal that the record should change.
Parvis applies one discipline to both.

---

## 1. Every claim carries a tag

| Tag | Means | Admissible where |
|---|---|---|
| `[PROVEN]` | Verified against a cited primary source **you read this run**. Name the command, the read, the measurement. | Anywhere, including a master file. |
| `[CLAIMED]` | Reported by something else. Not verified. | Working files. Never a master file. |
| `[ASSUMED]` | A working premise nobody has checked. | Working files, explicitly. |
| `[PROPOSED]` | An estimate, a recommendation, a plan. | Proposals. Never the record. |

**The tag travels with the claim.** A `[PROPOSED]` does not become `[PROVEN]` by being copied
into a more important file. Promotion requires a new measurement, not a new location.

**Only `[PROVEN]` may change a master file.**

---

## 2. Cite or flag — never launder

A number states its source or it is not a number, it is an intuition wearing a decimal point.

If you do not have the source, **say so and give the reasoning instead.** That is a useful
answer. A sourceless number presented as fact is not.

**Never launder a failure into a finding.** A search that errored is a failed call, not an
empty result set. A page that would not load is not evidence of absence. Write what happened.

---

## 3. Self-description is `[CLAIMED]`

An agent's account of its own state, its own coverage, or its own completed work is
`[CLAIMED]` — no matter how confident. Only an outside record makes it `[PROVEN]`: a file on
disk, a command's exit code, a log line written by something that is not you.

This is why a `DONE` row without an evidence path is invalid (see
[`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)). "I did it" is a claim. The file is the proof.

---

## 4. Measure twice for anything on rung 0–2

A single check never certifies a safety state. Two independent measurements before any
Priority-0 claim, always.

**Re-measure, never remember.** A tree churns under concurrent sessions — a path read at the
start of a turn may be gone by its end. State is knowable only from disk *this* run. Never
carry "cleared" or "current" forward from a prior turn, a memory file, or a summary.

**A count is a measurement, not a fact.** Recount at the point of use. Never quote a file
count, an agent count, or a version from memory.

---

## 5. A dropped call is not a finding

On **lost transport** — DNS failure, connection reset, refused, timeout with no response —
retry the same call immediately and repeatedly. Never write "no results" for a call that never
arrived, and never fill the gap from memory.

**A response that arrived is an answer, not a retry.** A 403, a 404, an empty result set, an
explicit refusal — these are data. Retrying into a refusal to get a different answer is
detection evasion, and it is barred at rung 2 regardless of whose account or whose network it
runs on.

The distinction in one line: *retry the call that never landed; never retry the answer you did
not like.*

---

## 6. Negative findings count

"Checked X, not a hazard" is what stops the next three sessions re-checking X. Record it.

**Record as you learn, not at the end.** A finding held only in working memory and then lost is
indistinguishable from work never done.

---

## 7. Removals are the integrity signal

When verifying a tree against a baseline, the report has three classes — added, modified,
removed. Growth and edits are expected churn. **A removal is the line worth alarming on.**

Do not re-baseline over unaudited concurrent work. Audit first, then stamp.

---

## 8. Audit is a role, not a mood

An auditor enumerates every agent, command, and mandate **from disk** and checks each against
fixed classes — counting clean checks as well as defects. A run that clears nothing has audited
nothing; it has only collected complaints.

**The auditor never fixes.** Findings route to the correction process
([`05-CORRECTION.md`](05-CORRECTION.md)) or to the owning agent. An auditor that repairs what it
finds has destroyed its own evidence and can no longer be trusted to report a clean run.

---

## 9. The rule these all serve

> A fact asserted in six files will be wrong in five of them.

Evidence discipline is what makes the sixth one findable.
