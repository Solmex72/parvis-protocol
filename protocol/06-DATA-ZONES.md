# 06 — DATA ZONES

**Status: normative.** Where a file is allowed to live.

---

## 1. Why a ban did not work

The original rule was *"no secrets, ever, anywhere"* — with **nowhere to put private data
instead.**

A prohibition with no destination does not get followed. It gets worked around, and private
material lands in the synced tree by accident. That happened repeatedly, including by an agent
that was itself under the rule.

**The rule is a routing decision, not a ban.**

---

## 2. The two zones

| Zone | Property | Holds |
|---|---|---|
| **PUBLIC** | Syncs to cloud storage. **Treat every byte as published.** | Doctrine, mandates, agent definitions, architecture, business context, research, technical documentation |
| **PRIVATE** | **Outside every sync root** — and outside the user profile, so known-folder redirection cannot reach it either | Secrets, real people and their PII, private projects and media, anything that would be wrong to find in a backup |

### The test

> *Would it be a problem if this were in a cloud snapshot a year from now?*

Yes → PRIVATE. No → PUBLIC. When genuinely unsure → **PRIVATE.** The cost of over-classifying
is inconvenience. The cost of under-classifying cannot be undone.

### Know what actually syncs

Check this on the real machine, not from assumption. On a typical workstation, several sync
clients may be running at once, and anything under the user's documents, desktop, or pictures
folders leaves the machine and is retained in version history for weeks. **Deleting it locally
does not recall it.**

Two consequences that each cause real failures:

1. **Build output must be redirected** out of a sync root, or the mirror corrupts it mid-build.
2. **Keys live outside**, deliberately and by default.

---

## 3. The carve-out: credentials are neither zone

**Live credentials — passwords, API keys, tokens, stream keys — belong in a password manager,
not in either filesystem.**

The private zone holds *private data*. A password manager holds *credentials*. This is not
pedantry: a private directory is not encrypted by default, and a file is a file. The moment one
is copied, quoted into a transcript, or attached to anything, it is disclosed.

**State the private zone's security property narrowly and never overstate it.** Its only proven
property is usually that *nothing copies it anywhere*. Absent verified full-disk or per-file
encryption, it is not encrypted, not backed up, and not a safe.

---

## 4. The classification is the Operator's, and it is adjustable

Keep the live table in one file — `DATA-CLASSIFICATION.md` — where the Operator moves categories
between zones and every agent reads it rather than guessing.

This protocol file states the **mechanism**. That file states the **policy**. Where the two
disagree, the policy file wins.

---

## 5. Consequences for agents

- **No secret in any tree that gets bundled.** A context bundle exists to be pasted into a
  fresh session. Name what is held and where; never the value.
- **No secret reaches `surface/`.** It is displayed on screen.
- **No secret reaches a browser.** See [`07-INTERFACE.md`](07-INTERFACE.md) §3.
- **Redact by reference, not by deletion.** `<api key — see password manager entry "acme-prod">`
  keeps the fact discoverable without disclosing the value.

---

## 6. Pruning without loss

Before anything leaves the working tree:

1. Copy it to a sealed store **outside the roots** — an archive file, not glob-reachable.
2. Stage the paths in `marked-deletion.md` / `marked-archive.md`.
3. **Execution is the Operator's hand**, with the tree quiesced.

Never mass-delete under live concurrency.
