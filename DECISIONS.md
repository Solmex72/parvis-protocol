# DECISIONS, CONFLICTS, AND REMOVALS

The private system this protocol was extracted from carried **rival facts** — the same rule
asserted in several files, in versions that disagreed. Extracting it meant deciding which
version was right and deleting the others, rather than shipping a specification that
contradicts itself.

This file is the record of that work, in three parts:

1. [**Settled**](#part-1--settled) — conflicts decided during extraction, and why.
2. [**Unresolved**](#part-2--unresolved) — conflicts found and deliberately *not* decided.
3. [**Removed**](#part-3--removed) — a measured inventory of what did not ship.

It exists so the pruning is legible. A rival that vanishes without a trace looks identical to
one that was never there, and the next person re-creates it.

Decisions were made **on the merits** — measured evidence, the file that owns the fact, the
version that survives scrutiny — never by modification date.

---

# Part 1 · Settled

## D-01 · The estop's primary signal

| | |
|---|---|
| **Rivals** | (a) The `STATE` file is authoritative. (b) The sentinel file is authoritative and `STATE` is a derived mirror. |
| **Kept** | (b) — sentinel first. |
| **Pruned** | (a), everywhere. |
| **Why** | `STATE` is written by tooling and goes stale; the sentinel is a fact created by a hand. A derived value cannot outrank its source. Where the two disagree, **stopped wins** either way, which makes (b) strictly safer. |

## D-02 · What an agent does with partial work at a stop

| | |
|---|---|
| **Rivals** | (a) Discard the partial output. (b) Save it in place, labelled partial. |
| **Kept** | (b). |
| **Pruned** | (a). |
| **Why** | A discarded half-report destroys work the restart doctrine exists to protect. The real hazard is a truncated file later read as finished — and **the label is what prevents that, not the deletion.** |

## D-03 · The fail-safe on an unreadable estop state

| | |
|---|---|
| **Rivals** | (a) Doctrine: unreadable or unparseable is read as `YELLOW` — ask. (b) The original sidecar implementation: `catch { return "RUN" }`. |
| **Kept** | (a). |
| **Pruned** | (b). Fixed in [`reference/sidecar/parvis-sidecar.mjs`](reference/sidecar/parvis-sidecar.mjs). |
| **Why** | (b) inverts the fail-safe: every disk error, permission change, and typo becomes a silent authorisation to proceed. This was a live defect in the source implementation, not a difference of opinion. It is called out at the point of the fix in the code. |

## D-04 · How many mandates are fleet-wide

| | |
|---|---|
| **Rivals** | Two files each presenting as *the* fleet-wide mandate, plus a sealed copy and a pre-version backup — four documents, one role. |
| **Kept** | One precedence file — [`protocol/00-PRECEDENCE.md`](protocol/00-PRECEDENCE.md) — which is an **index of obligations, not a restatement of them.** |
| **Pruned** | Every rival and every backup copy. |
| **Why** | Duplication is how a Priority-0 rule ends up with five inconsistent versions in circulation. The index names the one authoritative file per obligation and never repeats its text. |

## D-05 · Agent and file counts

| | |
|---|---|
| **Rivals** | Four different counts of the same fleet, each asserted as fact in a different file — and a fifth implied by counting the inbox directory. |
| **Kept** | None of them. |
| **Pruned** | All. |
| **Why** | **A count is a measurement, not a fact.** The protocol asserts no counts anywhere and requires a recount at the point of use. A shipped number would have been wrong within a day. |

## D-06 · Deployment ground truth

| | |
|---|---|
| **Rivals** | Two runbooks asserting opposite states of the same infrastructure — one describing a provisioned server in detail, one recording that no verified server exists. |
| **Kept** | Neither. |
| **Pruned** | Both, entirely out of scope for this release. |
| **Why** | The claim was unverified on both sides, and the material was private infrastructure detail regardless. Nothing in this repository describes anyone's live infrastructure. |

## D-07 · Access tiers in the console

| | |
|---|---|
| **Rivals** | (a) The interface mandate: surfaces are tiered by access and the sidecar authenticates the page with a local token. (b) The implementation: `admin: true` hardcoded, no token, every tile unlocked, no `Host` or `Origin` validation. |
| **Kept** | (a). |
| **Pruned** | (b). |
| **Why** | The mandate was right and the code had drifted from it. The reference sidecar now issues a session token, validates `Host` and `Origin`, and derives its access tier rather than asserting one. |

## D-08 · Conflict handling itself

| | |
|---|---|
| **Rivals** | (a) Surface conflicts; never resolve them silently. (b) Pick the right fact and prune the wrong ones. |
| **Kept** | (b), with three carve-outs. |
| **Pruned** | (a) as a general rule. |
| **Why** | Surfacing alone resolves nothing — both rivals stay on disk and the next session still picks whichever it opens first. (a) survives only where settling would be unsafe: missing information, a rung 0–2 consequence, or an assertion outside the agent's ownership boundary. See [`protocol/05-CORRECTION.md`](protocol/05-CORRECTION.md) §7. |

## D-09 · How many confidence tags there are

| | |
|---|---|
| **Rivals** | Three files each defining a three-tag vocabulary — and each a *different* three. `[PROVEN]`/`[CLAIMED]`/`[PROPOSED]` in two, `[PROVEN]`/`[CLAIMED]`/`[ASSUMED]` in a third. |
| **Kept** | All four tags, in one table. |
| **Pruned** | The three competing three-tag definitions. |
| **Why** | The tags are not rivals; they are one vocabulary that three files each sampled. `[ASSUMED]` (an unchecked working premise) and `[PROPOSED]` (a recommendation) are genuinely different states and collapsing them loses information. Defining the set once, in [`02`](protocol/02-EVIDENCE.md), is the fix. |

---

# Part 2 · Unresolved

Four conflicts were found and **not** settled. Each meets one of the carve-outs in
[`05`](protocol/05-CORRECTION.md) §7 — settling it would require information not available, or
being wrong would be unsafe. They are open questions in the protocol, not oversights.

If you adopt Parvis, **these are the four decisions you have to make yourself.**

## U-01 · May an agent place a stop? — *rung 1, unsafe to guess*

**The conflict.** One governing file says an agent *may* place a sentinel, but only against work
aimed at harm, and should ask the human when unsure. Another says flatly that **no** agent writes
the stop, including the agent that found the problem — it raises a `GATE` instead.

**Why it was not settled.** The two may be reconcilable: they might be talking about different
artifacts — a *sentinel file* an agent could create, versus the *`STATE` file* only a human
writes. That reading is plausible, and it is exactly the kind of plausible safety inference that
should not be made by the party extracting the document.

**What shipped.** [`01`](protocol/01-ESTOP.md) is explicit that no agent writes `STATE` and no
agent *clears* anything. It is **silent** on whether an agent may place a sentinel. You must
decide and write it down.

**The asymmetry that should inform your decision:** an agent that wrongly places a stop costs
you an interruption. An agent that wrongly withholds one costs you whatever the stop was for.

## U-02 · No daemons, versus two required long-running processes — *the Operator's machine, the Operator's call*

**The conflict.** A standing constraint reads **"No background daemons or services. Standing
refusal."** Two other components require exactly that: the interface layer needs a running
loopback sidecar, and the evidence protocol names a **persistent monitor** over the stop signals
as the proven fix for the gap where a stop arms mid-session.

**Why it was not settled.** This is a policy about someone's own machine, and both sides have
real safety content. The no-daemon rule exists so nothing can hold a restart or fake presence.
The monitor exists because preflight-once genuinely misses a mid-session stop — and it caught a
real halt arming in production.

**What shipped.** The sidecar is an **operator-launched foreground process** that you start and
watch exit, not an installed service, and it registers nothing. That sidesteps the conflict for
the sidecar. It does not settle the question for the monitor, which remains recommended in
[`02`](protocol/02-EVIDENCE.md) §6 and unbuilt here.

## U-03 · Is anything above the stop? — *precedence, and a real failure mode*

**The conflict.** The precedence ladder says the stop beats everything, including the human's
next instruction. A separate architecture document says one thing sits above it: **the memory
ceiling** — on the reasoning that a machine paged into unusability is a machine the human
cannot type the stop into.

**Why it was not settled.** The argument for the exception is not silly — a stop you cannot
physically enter is not a stop. But an exception above rung 0 is the most dangerous edit anyone
can make to this protocol, and it should be made deliberately by an owner, not inherited from a
footnote.

**What shipped.** [`00`](protocol/00-PRECEDENCE.md) ships with **no rung above the stop**, and
resource self-preservation is not mentioned. If you need the exception, add it consciously.

## U-04 · The output contract versus the harness — *structural, probably permanent*

**The conflict.** The output contract says do not report to the chat. Every chat-based agent
harness renders assistant text in the chat regardless; the contract cannot reach the harness.

**Why it was not settled.** It is not settleable from inside the protocol. It is a property of
where agents currently run.

**What shipped.** [`04`](protocol/04-OUTPUT-CONTRACT.md) §6 states the limit plainly and binds
the part that *is* controllable — what an agent chooses to write. Substance to files, chat
reduced to a pointer. The counter-rule in §5 matters more than the contract itself: **the stop
and bad news still go to the human immediately.** A routing rule that buries failures has
inverted into a lie.

---

# Part 3 · Removed

Measured against the source tree on 2026-09-11. `[PROVEN]` — counts from `find` and `grep` over
the origin directories, not from memory.

## The shape of what was left behind

| Area | Files | Shipped? |
|---|---|---|
| `_os/` — the OS and doctrine layer | 530 | **Doctrine only**, rewritten. No machinery, no logs, no state. |
| `personal/` — the operator's own life | 2,224 | **None.** |
| `business/` — ventures and their agents | 492 | **None.** |
| `dev/` — buildable side projects | 119 | **None.** |
| `Vault/` — private zone | 19 | **None.** |
| `_icc/` — correction mandate and ledger | 6 | **Pattern only**, rewritten from scratch. |
| **Source tree total** | **3,427** | **34 files ship.** |

## Removed for privacy, itemised

None of this is a protocol decision. All of it is someone's private data, and it is listed so the
omissions are not mistaken for oversights.

| Removed | Detail |
|---|---|
| **Personal data** | The entire `personal/` tree — 2,224 files: context about a real person, a planner, household and meal data, a password tracker, network captures, archives. |
| **Business context** | Company identity, financials, runway, contracts, covenant terms with a named counterparty, regulatory exposure, market research, a pitch draft. |
| **Third-party PII** | **4 email addresses** appear in the source, two belonging to people who are not the author. All removed; none appear here. |
| **Infrastructure identifiers** | Public and LAN **IPv4 addresses**, a hostname, a cloud server ID, a project ID, a firewall rule name, and SSH configuration for a live host. All removed. The only addresses in this repository are `127.0.0.1` and the RFC-reserved examples. |
| **Origin paths** | Every absolute path from the author's machine, replaced by a configurable root. |
| **The agent roster** | ~29 named agents with charters. That is one organisation's internal org chart, not a protocol artifact. The templates ship with generic examples instead. |
| **Operational residue** | 127 outbox reports, 214 surfaced events, 7 generated directives, 56 backup archives, session markers, bus logs, and state files — all of it the *output* of a running fleet rather than the protocol. |
| **Named third-party systems** | Company names that appeared as the origin of design patterns. [`07`](protocol/07-INTERFACE.md) §2.6 makes their absence a rule, not just a scrub. |
| **The legacy subsystem** | One component whose trigger is a death in the family. It is not a protocol component, it is the most personal thing in the tree, and it belongs to its author. |

## Removed for correctness

| Removed | Why |
|---|---|
| All fleet counts, file counts, and version numbers asserted as fact | D-05. A count is a measurement. |
| Both deployment runbooks | D-06. Unverified on both sides. |
| Three rival mandate documents and one pre-version backup | D-04. |
| `catch { return "RUN" }` | D-03. An inverted fail-safe. |
| `admin: true` | D-07. |
| Status claims about unbuilt components | The source honestly labelled several subsystems `SPEC ONLY`, `NEVER RAN`, `PARKED`, or `DESIGNED, not armed`. Rather than ship those labels, the components are simply absent — except the 3D HMI, which is named in [`07`](protocol/07-INTERFACE.md) §4 as aspirational because the protocol would otherwise imply it exists. |

## What this means for you

The protocol is the part that generalises. **The 3,393 files that did not ship were not the
valuable part** — they were one person's instance of it, plus the exhaust of running it. If
adopting Parvis produces a tree like that one, that is expected; the thing to carry across is
the discipline, not the directory.
