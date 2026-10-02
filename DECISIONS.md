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

## D-11 · Who ratifies a tree's Constitution

| | |
|---|---|
| **Rivals** | (a) Each tree's Operator decides its own constitution, and the public copy is only a proposal. (b) The model running the tree ratifies its own, with the Operator able to refuse. (c) The model decides, with the Operator informed. |
| **Kept** | (a). |
| **Pruned** | (b) and (c). |
| **Why** | (b) and (c) change the premise of the protocol, not a clause. [`08`](protocol/08-AGENTS.md) §7 states the philosophy once: the machine reports, the human decides. Under (a) the public [`CONSTITUTION.md`](CONSTITUTION.md) stays unratified and binds nothing here. Inside a tree that adopts it, the Operator ratifies and amends it, an agent never enacts, and no amendment gives an agent the irreversible act (Articles III.1, XI.1, XI.3 and XI.6). The maintainer decided this on 2026-10-02, having first been asked whether the model should ratify. |

## D-12 · What an approval is worth after it is given

| | |
|---|---|
| **Rivals** | (a) An answer stays good until someone says otherwise: the latest `CONSOLE` `APPROVED` is the decision, however old and however often acted on. (b) An approval carries an expiry, is good for one act, and records what the console held when it was given. (c) A weighted vote or a quorum of agents that can open a gate. |
| **Kept** | (b), in [`03`](protocol/03-BUS.md) §5a. |
| **Pruned** | (a) — [`10`](protocol/10-AIRLOCK.md) §6 already says permission is per-action and per-session, and the console had no way to honour that. (c) — a vote among agents decides what [`08`](protocol/08-AGENTS.md) §7 leaves to the human, and no agent commands another. |
| **Why** | Reading another project's approach to the same problem, [hivemind](https://github.com/miigwech-potato/hivemind) (reviewed at commit `dbd71c3`, 2026-10-02), showed three mechanics worth having: an expiry that fails shut when missing, single use, and a record of what the human saw. They are generic engineering and were reimplemented here from the idea, in Node with no dependency; nothing was copied, and its voting, role and notation machinery were not taken. Three differences from it are deliberate. Single use is **durable and cross-process** (an exclusive file create plus a `TELL` on the bus), where its spent set lives in one process's memory. `seen` is a full-width hash of the ASK line and the ledger row, and its job is narrow: the 12-hex `ask:` and `re:` ids are truncated, so it binds an approval to the exact question and fails it if the question behind the id changes. It records what the console **held**, not what the Operator **read**; if the console ever shows referenced evidence files, those belong in the hash. And the human record is not a free-text field an agent supplies: it is written by the console, from the console's own state. None of this is authentication; see U-09. |

---

# Part 2 · Unresolved

Conflicts were found and **not** settled. Each meets one of the carve-outs in
[`05`](protocol/05-CORRECTION.md) §7 — settling it would require information not available, or
being wrong would be unsafe. They are open questions in the protocol, not oversights.

If you adopt Parvis, **these are the decisions you have to make yourself.**

## D-10 · How a `REQ` row activates an agent

| | |
|---|---|
| **Rivals** | (a) The console executes on confirm: the induct button spawns the agent. (b) An agent session polls the ledger and does what the rows say. (c) A separate process the Operator runs — `parvis watch` — claims a row and hands it to the agent **as a file**; the agent's own mandate reads it, and only a launcher the Operator configured starts anything. |
| **Kept** | (c). |
| **Pruned** | (a) — [`07`](protocol/07-INTERFACE.md) §1 and [`09`](protocol/09-FLOOR.md) §8: a surface inducts, it never executes. (b) — [`03`](protocol/03-BUS.md) §5: a file informs, it never commands; a poller that obeys rows has turned the ledger into a command channel that anyone who can append owns. |
| **Why** | The row is a record of the Operator's order, not its source. So it never enters a shell or `argv`; rows shaped like instructions are quarantined as security events rather than worked; the default is rows addressed to the agent by name, and admitting the Operator's own channel wholesale is a flag you must type. The watcher never writes `DONE` for anyone — self-report is `[CLAIMED]` ([`02`](protocol/02-EVIDENCE.md) §3). Two consequences fell out of building it: the ledger needed **one lock**, because a rewrite racing an append silently drops the append (measured, then fixed), and **one parser** with read-side netting — `closes <key>` — so the floor stops counting a `REQ` the agent's own `DONE` has answered. The netting is categorisation, never authorisation; any writer can close any key, so the manifest shows the closer beside every closed row and nothing disappears unlabelled. Unattended pickup on a given machine remains the Operator's call under U-02; `--once` is the keystroke form. |

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

## U-05 · Is a governing document a second mandate? — *design, and a rule this repository holds itself to*

**The conflict.** [`CONSTITUTION.md`](CONSTITUTION.md) is proposed as the one document an AI reads on entering a
tree. To do that it has to *represent* the file system and the mandates, so its Part Two gives every protocol
file one line. But D-04 settled that there is one precedence file and that it is an index of obligations, not a
restatement, and [`CONTRIBUTING.md`](CONTRIBUTING.md) rule 1 says a rule restated in a new file is drift. The
README already carries a one-line table of the same files, so Part Two is a second one.

**Why it was not settled.** Whether a one-line digest with a pointer is an index (allowed) or a restatement
(drift) is a design call for the owner of the protocol. The options: keep the digest and label it
non-authoritative; generate Parts One and Two from the protocol files at build time so they cannot drift; or let
Part Two replace the README table and have the README link it.

**What shipped.** The digest, with a stated rule that a digest line never outranks its owning file (Article I.2).
The Constitution is marked PROPOSED and binds nothing.

## U-06 · "Prune", or retire? — *a contradiction between the Constitution and 05*

**The conflict.** [`05`](protocol/05-CORRECTION.md) §7 and the README say to keep the right fact and prune, or
delete, the wrong one. The proposed Constitution (Articles VIII.3 and IX.3) says to retire a rival by archiving it
and leaving a pointer, and never to destroy another agent's file.

**Why it was not settled.** One of them has to change. The Constitution's reading agrees with the append-only bus
([`03`](protocol/03-BUS.md) §6). But `05` is an owning file, and changing a normative file is not a drive-by edit.

**What shipped.** Neither file changed. The Constitution's reading is proposed, and
[`CONTRIBUTING.md`](CONTRIBUTING.md) rule 3 applies: this entry is the record.

## U-07 · Where a Constitution lives, and how an AI finds it

**The conflict.** The proposed Constitution says it lives at the root of the tree it governs, so an AI entering the
file system finds it first (Article I.5). `parvis init` does not create it, and the "bind your agent" block in the
README does not point at it.

**Why it was not settled.** Scaffolding it means a template copy, which is a second copy of the same text, and a
rule about whether `parvis check` should require it. Both change the tool and the contract with adopters.

**What shipped.** One file, [`CONSTITUTION.md`](CONSTITUTION.md), at the repository root. No template copy, no
change to `init`, no change to the bind block.

## U-08 · Who lifts a GATE? — *an Operator's ruling, offered as a default*

**The conflict.** [`03`](protocol/03-BUS.md) defines the `GATE` verb as "I am blocking this until my condition
clears" and says nothing about who clears it. §5a adds that an approval does not lift a standing refusal, a gate
or the estop. The proposed Constitution (Articles VII.5 and VII.6) fills the gap: the Operator may lift any GATE;
an agent may lift a task GATE once it believes the conditions are met and the Governance AI has approved its work
for the whole GATE; only the Governance AI, among the agents, lifts a GATE on anything that goes public; the rest
is the Operator's. It excludes safety holds, money, credentials and anything on rungs 0 to 2, and says that
approving or lifting a GATE never releases an act.

**Why it was not settled.** It is one Operator's ruling for one deployment, and it creates a role, the Governance
AI, that [`08`](protocol/08-AGENTS.md) does not have. Whether it generalises, and whether lifting a public GATE may
ever release the act it blocks, are for the owner to decide.

**What shipped.** The rule, in the proposed Constitution only, with the exclusions written out. `03` is
unchanged.

## U-09 · Who wrote an approval? — *design, and unsafe to guess*

**The conflict.** [`03`](protocol/03-BUS.md) §5a lets an agent act on a `CONSOLE`-labelled `APPROVED`, and D-12 gave
that line an expiry, a single use and a hash of what the console held. The label is still only a label. The bus is
plain text that any process able to append can write to, so such a process can write a fresh, unexpired,
correctly hashed approval, and create the claim file that goes with it. [`11`](protocol/11-TREASURY.md) §6 and
[`12`](protocol/12-CREDENTIALS.md) §2 say authorisation is never text. For money and credentials that stays absolute
and `parvis approved` is not consulted. For ordinary work, §5a accepts the label with the bounds above.

**Why it was not settled.** Proving authorship needs a key that agents cannot reach. A signature (Ed25519 from
`node:crypto` would keep the tool dependency-free) is easy to write and easy to get wrong in the one place that
matters: **where the private key lives**. If the sidecar holds it and an agent runs as the same operating-system
user, the agent can read it, and the signature proves nothing. The honest options each cost something: a separate
OS account for the console; a key held by a person-operated device and used per approval; or accepting the
label for work that can do bounded harm and refusing it for everything else, which is what ships. Which one fits
depends on how a given Operator runs the machine.

**What shipped.** Expiry, single use and `seen`, the label, and the written limit. No signature and no key custody.
`parvis approved` prints, every time, that it reads the record and cannot prove who wrote it.

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
| Status claims about unbuilt components | The source honestly labelled several subsystems `SPEC ONLY`, `NEVER RAN`, `PARKED`, or `DESIGNED, not armed`. Rather than ship those labels, the components are simply absent. |
| Third-party system names in the floor design | The warehouse model was learned from real commercial systems, and the source named them. [`07`](protocol/07-INTERFACE.md) §2.6 makes their absence a rule rather than a scrub: the pattern is ours, and a surface shipping someone else's trade name is wrong. |

## What this means for you

The protocol is the part that generalises. **The 3,393 files that did not ship were not the
valuable part** — they were one person's instance of it, plus the exhaust of running it. If
adopting Parvis produces a tree like that one, that is expected; the thing to carry across is
the discipline, not the directory.
