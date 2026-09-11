# 05 — CORRECTION

**Status: normative.** What happens when a recorded fact turns out to be wrong.

---

## 1. The problem

> A fact asserted in six files will be wrong in five of them.

Correcting the file you happen to be looking at is not a correction. It creates a tree where
the truth and the error both have citations, and the next session picks whichever it opens
first. This is the defining failure mode of a documentation-heavy agent fleet, and it compounds
silently.

**A correction propagates, or it did not happen.**

---

## 2. Reading is not free — it obligates

Reading a governing file puts you under it. Two things follow:

1. Anything in it that is **durable, non-obvious, and not derivable from the tree** goes to
   your persistent memory before the session ends.
2. **If your context contradicts the file, the file wins.** Do not work around it. Correct the
   record.

---

## 3. Immediate Course Correction (ICC)

One command, one turn, no proposal step.

```
/icc the planner meal times are placeholders, not the Operator's actual times
```

### The sequence

**1 · Sweep.** Derive 2–5 search terms from the correction: the **old** wording, its obvious
variants, and the proper nouns involved. Not the new wording. Run one indexed sweep per term
before reading anything. Never walk the tree file-by-file to find hits — that is what the index
is for.

**2 · Classify every hit.**

| Hit | Action |
|---|---|
| **Asserts the old fact** | Rewrite it. |
| **Mentions it in passing**, true either way | Leave it. Do not churn prose. |
| **Contradicts the new fact indirectly** — a downstream conclusion, a table row, a scheduled job built on the old value | **Rewrite it too.** This is the one most often missed. |
| **Off-limits** (§5) | Never edit. Note it under *Left alone*. |

**3 · Rewrite, all at once.** Match each file's existing voice and confidence-label convention.
A corrected fact keeps whatever tag it earns — **do not promote a claim to `[PROVEN]` because
it is now current.** If the old text carried a date, stamp today's.

Where a fact is asserted in more than three files, that is **duplication, not redundancy**:
state it once in the file that owns it, and make the others point there.

**4 · Ledger and memory.** Both, or the run is not finished. Prepend an entry to the correction
ledger:

```
## 2026-01-14 — meal times are placeholders

Was      planner asserts 07:30 / 12:00 / 18:30 as the Operator's actual times
Now      those are defaults shipped with the template; real times are unknown
Why      Operator correction, 2026-01-14
Files    personal/planner/NOW.md:14, personal/planner/README.md:31, _os/tasks/INDEX.md:88
Memory   planner-meal-times.md (updated)
Left     backups/ (history), CONTEXT-BUNDLE.md (generated)
```

Then write the fact to persistent memory — **checking for an existing memory on the subject
first and updating that one**, rather than leaving two versions of a fact you just spent a
command unifying.

**5 · Post-edit obligations.** Re-run whatever generator or backup the edits obliged. Rebuild
the index if files were created or deleted.

---

## 4. A standing decision is reversed in the open

If a correction invalidates a standing decision — a "do not re-litigate" line, a `[PROVEN]`
item, a policy rule — **do not quietly flip it.** Rewrite it as *reversed*, with the date and
the reason, so the next session knows it was overturned rather than forgotten.

A decision that changes without a trace is indistinguishable from a decision that was never
made.

---

## 5. What is never rewritten

| Never touched | Why |
|---|---|
| `backups/`, `archive/` | History. History is not corrected; it is superseded. |
| Generated files | Edit the source and re-run the generator. |
| An isolated agent's tree | Named-only access. |
| Another root's authoritative master context | Report the drift. Do not edit across an ownership boundary. |
| Anything holding a secret | Out of scope for a text sweep entirely. |

**A sweep that rewrites text will destroy binaries.** Scope every sweep to text extensions by
allowlist, never by exclusion.

---

## 6. What ICC does not do

`/icc` corrects the record. **It does not then go do the work the correction implies.** Those
are separate acts with separate authorisations, and conflating them is how a one-line
correction turns into an unreviewed refactor.

---

## 7. Rival facts are settled and pruned — not catalogued

When two files assert contradictory facts, **decide which one is right, keep it, and remove the
wrong assertions in the same pass.**

A conflict report that leaves both rivals on disk has resolved nothing. The next session still
picks whichever file it opens first, and a safety rule with five circulating versions is *less*
reliable than one with a single version, not more.

**Decide on the merits, never by timestamp.** The winner is the file that owns the fact, the
version backed by a measurement, the one that survives scrutiny. **Newest is not truest** — the
canonical failure here is four duplicate memory files written within ninety seconds of each
other, where the newest asserted the false claim, so a "newest wins" rule would have inherited
the error.

**Record the resolution.** Which fact won, what was pruned, and why — in the ledger, so the
pruning is legible rather than silent. A rival that vanishes without a trace looks identical to
a rival that was never there, and the next session re-creates it.

### What still gets escalated instead of settled

Three cases. Surface these; do not decide them:

- The contradiction turns on information the agent does not have.
- Being wrong would be **unsafe or irreversible** — anything on rungs 0–2.
- The losing assertion sits **outside the agent's ownership boundary** — another root's
  authoritative master context. Report the drift; do not edit across the boundary.

Everything ordinary gets decided and cleaned up.
