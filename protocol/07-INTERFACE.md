# 07 — THE INTERFACE LAYER

**Status: normative.** This is the file the project is named for.

Every surface a human touches is **Parvis**. The read-only floor view is the *Parvis HMI*; the
tile menu you drive the fleet from is the *Parvis Console*.

---

## 1. The rule that makes the HTML work

> A browser page is a **display and a keyboard**, not a program with disk access.

That single fact governs the whole layer:

- **The page shows and collects.** It renders state and takes input. Opened from a file path, on
  its own, it **cannot read the tree and cannot write an order.** The browser sandbox forbids
  both, and that is a feature.
- **The sidecar bridges it.** A small loopback service — bound to `127.0.0.1`, nothing else — is
  the only thing that reads the tree for the page and writes what the page submits. The page
  `GET`s state from it; the page `POST`s a prompt to it; the sidecar does the disk work.
  **No sidecar, no live Parvis — only a snapshot.**
- **Nothing bypasses the review.** A prompt posted from Parvis is an **induction, not an
  execution**. The sidecar writes a `REQ` row to the task index and stops. It never spawns an
  agent, never runs a command, never sends. Committing new work stays the Operator's keystroke.

That is why the page "works": the page is honest about being a window, the sidecar does the
small real work at the edge, and **the review still stands between a prompt and a moving
machine.**

---

## 2. Hard requirements — every Parvis surface

1. **Self-contained.** One HTML file: inline CSS and JS, no external scripts, no CDN. Web fonts
   only, with a real fallback stack. It must render offline from a file path.

2. **The colours are the state, read live, never faked.** Green = running, amber = ask first,
   red = stopped — derived from the STATE file and the live ledger. **A value with no live
   source shows `—`, never a plausible-looking number.** Red outranks every other colour and the
   whole UI.

3. **The sidecar is loopback-only and holds no secret the page can see.** No API key, no
   credential, no token of value reaches the browser. The sidecar authenticates the page with a
   local session token and does the privileged work itself. **The page never holds anything
   worth stealing.**

4. **A snapshot is labelled as a snapshot,** with its read time. Only a page talking to a live
   sidecar may present itself as live. A stale page that looks live is worse than no page.

5. **The estop outranks the interface.** Under `STOP`, Parvis inducts nothing and the sidecar
   writes nothing but the log-off line. **A red floor takes no orders.**

6. **Parvis branding, and no third-party company names.** Whatever real systems the pattern was
   learned from, the pattern is yours and it is called Parvis. A surface that ships someone
   else's trade name is wrong and gets corrected.

---

## 3. Security requirements for the sidecar

A loopback HTTP service on a developer workstation is a real attack surface. These are not
optional.

| Requirement | Why |
|---|---|
| **Bind `127.0.0.1` explicitly**, never `0.0.0.0` | Binding all interfaces publishes your fleet console to the LAN. |
| **Validate the `Host` header** against an allowlist of `127.0.0.1:<port>` / `localhost:<port>` | Defeats DNS rebinding, which is how a web page you visit reaches a loopback service. |
| **Reject requests carrying an `Origin` you did not issue** | Same class of attack, different vector. |
| **Require a session token** on every mutating route, issued at page load, never logged | The page proves it is your page. |
| **Allowlist every path** the service will read or write, then re-resolve and confirm containment | Defeats traversal. An allowlist alone is not enough if symlinks exist. |
| **Fail safe on an unreadable estop** — refuse, do not default to `RUN` | See [`01-ESTOP.md`](01-ESTOP.md) §2. |
| **No `eval`, no shell-out, no template interpolation of user input** | The prompt bar is an induction input, not a command line. |

The reference implementation in [`reference/sidecar/`](../reference/sidecar/) implements all of
these and is commented at the point of each one.

---

## 4. What the surfaces are

| Surface | What | State |
|---|---|---|
| **Parvis Console** | Tabbed panels — state, documents, ledger, bus, surface, settings | Ships. |
| **Parvis Floor** | The Warehouse tab: 3D floor, orbit and drill-in, equipment controls | Ships. See [`09-FLOOR.md`](09-FLOOR.md). |
| **Prompt bar** | The induction input, on the console and on each piece of floor equipment | Ships. |
| **The sidecar** | Loopback bridge: reads tree, writes `REQ` rows, holds no secret | Ships. |

**Ship the panels first.** The 3D floor is the part everyone wants to build and the part that is
worthless without the ledger underneath it — it renders state the rest of the protocol produces,
and on an empty tree it correctly shows nothing.

---

## 5. Standing

- **The page reads. The sidecar writes. The Operator commits.**
- No surface spawns, sends, deploys, or clears an estop.
- No secret reaches the browser, ever.
- Output goes to files and the console, not to a chat window
  ([`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)).
