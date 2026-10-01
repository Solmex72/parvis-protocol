# 09 — THE FLOOR

**Status: normative for the visualiser; informative as a model.**
Implemented by the Warehouse tab in
[`reference/sidecar/console.html`](../reference/sidecar/console.html), served by the sidecar's
`/floor` route.

---

## 1. The claim

An agent fleet is hard to see. A file tree is a list, a process table is a list, and a log is a
list — so the only picture anyone has of a running fleet is several lists that do not line up.

**An automated warehouse is the same machine, and it has been legible for forty years.** Cranes
move loads between racks under a control system, and the person supervising it reads a floor of
hundreds of simultaneous moves at a glance, by colour, without reading a single line of text.

Parvis borrows that. Not as decoration — as a *mapping*, where each warehouse object corresponds
to exactly one thing in the tree, and the warehouse's own safety rules turn out to be the
protocol's safety rules already drawn in the right place.

---

## 2. The mapping

| On the floor | In the fleet | Read from |
|---|---|---|
| **Crane** | an agent, or a live session | the session markers in `_os/exchange/bus/session/` |
| **Pallet** | a directory | the tree itself; the pallet's label is its path |
| **Rack location** | where that directory lives | its parent |
| **Opening a pallet** | descending into the directory | **another entire warehouse** — §4 |
| **Induct** (inbound dock) | work arriving | a `REQ` row in `_os/tasks/INDEX.md` |
| **Spur** (outbound dock) | a deliverable leaving | a file in `_os/events/surface/`, an export |
| **Conveyor** | the file bus | `_os/exchange/bus/` — how work moves without a crane carrying it |
| **Truck** | an external service or another AI | the boundary. §5 |

The point is not the picture. The point is that **you already know how to read this screen** if
you have ever stood in front of a warehouse control system — and if you have not, the model is
still concrete in a way a directory listing is not.

---

## 3. The colours

One glance, before any navigation:

| Colour | On the floor | In the fleet |
|---|---|---|
| **GREEN** | moving — a crane is carrying a load | an agent is working; a live session mid-task |
| **BLUE** | scheduled — queued, not yet started | a job-board posting: ordered, waiting for an agent |
| **AMBER** | attention — a location needs a decision | `YELLOW`: ask before each action |
| **RED** | E-stopped — that zone is halted | `STOP`: the estop is armed and this root is frozen |
| **GREY** | empty, or no live source | no data. Never a guess. |

This is not a new scheme. It is the state the tree already holds, rendered.

**Red always wins the glance.** A single red zone stops the eye before any green, exactly as the
stop outranks every other signal ([`01`](01-ESTOP.md)). **A floor that shows green over a red zone
is lying** — and that is the specific failure this rule exists to forbid.

**Grey is mandatory where there is no live source.** A location with no data renders grey and
reads `—`. It never renders green because green is the pleasant default
([`07`](07-INTERFACE.md) §2.2).

---

## 4. The nested warehouse

**Open a pallet and you are not looking at a box. You are looking at another whole warehouse** —
its own cranes, its own pallets, its own docks.

This is the file tree exactly. A venture is a warehouse; its departments are aisles; their files
are pallets; and a pallet that is itself a directory is another floor. So the visualiser is **one
view that descends**, with the same controls at every depth, because every level *is* a warehouse.
There is nothing new to learn on the way down.

The recursion is the whole reason the metaphor holds rather than being a skin. A dashboard that
only renders the top level is a picture of a fleet; one that descends is a view of it.

---

## 5. Trucks dock at the boundary — they never drive onto the floor

This is where the model stops being a visualisation and starts enforcing something.

An external service — another AI, an API, a vendor — is a **truck**. And in a real warehouse a
truck backs up to a dock. It does not drive onto the floor, move a crane, enter a rack, or open a
nested warehouse. It drops a load at an induct or collects one from a spur, and that is the
entirety of its access.

**That dock is the airlock.** Every external exchange happens at the edge, screened, and nothing
external gets loose inside the tree.

**A truck's paperwork is untrusted until checked.** A load arriving on a truck is inbound *data*,
not an order to the floor. It is inducted and reviewed like anything else, never obeyed on
arrival. That is the instruction-source boundary from [`03`](03-BUS.md) §5, drawn as a loading
dock — and drawn in the one place where somebody looking at the screen can see it being honoured.

If your rendering puts a truck on the floor, the rendering is wrong and so is the architecture it
is drawing.

---

## 6. Two surfaces, two jobs

| | **The floor** (this file) | **The console** ([`07`](07-INTERFACE.md)) |
|---|---|---|
| What it is | a 3D floor, viewed live | a tiled menu, tiered by access |
| What it shows | **how the system is** — every agent, directory and state at once | **what you can do** — pick the tool, do the job |
| The verb | watch, understand, decide | run, use, produce |

**The floor shows how the machine thinks; the console is for acting on what you conclude.** One is
a map, the other a workbench. A management surface needs both, and the mistake is building only
the pretty one.

---

## 7. Controls

Navigation is what made the original usable, not colour alone:

| Control | Does |
|---|---|
| **Drag** | orbit the floor — rotate, tilt, look down an aisle |
| **Top-down** | drop to an overhead plan. Orbit for depth, plan for layout |
| **Click a pallet** | descend into it — another warehouse, same controls |
| **Scroll** | zoom |

Same controls at every depth. Non-negotiable: a view whose interaction changes as you descend has
broken the promise that every level is a warehouse.

### The camera is orthographic, on purpose

There is **no perspective divide**. Parallel lines never converge, and a location at the far end
of an aisle renders exactly the same size as one at your feet.

This looks wrong for a moment — the eye expects convergence and reads its absence as though it
were standing inside the boxes looking out. It is the right trade anyway, and it is what control
screens for real automated floors use: **the whole point is comparing locations across the floor
at a glance**, and a perspective camera makes the far end of an aisle smaller, dimmer and harder
to judge than the near end. Under perspective, "that rack is fuller" and "that rack is closer"
look the same. Under an orthographic camera they do not.

Occlusion is still real — faces that turn away are culled and nearer geometry paints over farther.
It is a flat camera, not a flat scene.

Equipment is also reachable from a **side menu**, grouped by kind — cranes, pallets, the two
docks, the conveyor, the trucks. Selecting from either the menu or the floor opens the same
controls, because a floor you can only navigate by clicking small boxes in a 3D scene is a demo
rather than an instrument.

---

## 8. What the floor may and may not do

Every constraint in [`07`](07-INTERFACE.md) §5 applies. The line is drawn in one specific place:

**The floor may induct. It may never execute.**

That is the same line [`07`](07-INTERFACE.md) §1 already draws for the console, and it is what
lets equipment have controls at all. Selecting a crane and addressing work to it writes a `REQ`
row naming that agent and drops a `TELL` in its inbox. **It starts nothing.** No process is
spawned, no command runs, and the agent picks the work up on its own next run — or does not.

Two consequences that are easy to get wrong:

- **Addressed work is still not an order.** The `REQ` row is the canonical record; the inbox line
  only points at it. A file that *commanded* an agent — or claimed the Operator's authority from
  inside the tree — would be the security event [`03`](03-BUS.md) §5 defines, and building that
  into the surface would be worse than building it by hand. The authority is the Operator in
  conversation. The floor writes the record, not the instruction.
- **Some equipment gets no controls, deliberately.** The conveyor is read-only: a console that
  could write lines onto the bus would be manufacturing authority the protocol denies it. Trucks
  have no controls at all — §5.

**Under `STOP`, the floor renders red and inducts nothing.** A red floor takes no orders.

The honest limit, stated once: **this is a picture of the tree at a moment, not a live telemetry
feed.** It polls. Between polls it is stale, it shows when it last read, and it goes grey rather
than pretending otherwise when the sidecar stops answering.

---

## Amendment A — rails and the load cycle (the Flag's order, 2026-09-30)

**A crane is always on a rail.** One rail runs down the centreline of each aisle, out to both
docks. Parking is a siding: one rail per column, joined to the inbound lane. The two docks each
have a lane across the floor, and a crane changes rail only on a lane. A crane never takes a
diagonal across the floor and never appears from the air; a new crane enters from the lane onto
its own rail. On `STOP` every crane halts where it stands.

**Work moves between the docks.**

| Role | Picks up | Carries to | Drops at |
|---|---|---|---|
| **Worker** | the **inductor** — a claimed `REQ` | its location (the pallet its last bus line names) | a **spur** — the finished deliverable |
| **Rework** | a **spur** — a deliverable that already left | its location, where it modifies the load | the **inductor** — as a new `REQ` for a worker |

**Every leg is driven by a measured fact, never inferred.** A worker's pickup is a live
`_os/tasks/claims/<key>.claim` (older than 30 minutes it is a dead agent's claim and draws
nothing); its drop is that claim's `.done` file (shown for two minutes). A rework is an open
`REQ` row whose text names a file under `_os/events/surface/` — that row is the statement "I am
picking this up from the spur". Where no such fact exists the crane parks; it does not act out a
cycle it is not in (§3: grey, never a guess). The loads stacked at the docks are the open `REQ`
rows (inductor) and the newest surface files (spur), counted from disk.

**A pallet is green when anything beneath it was written in the last ten minutes**, not only when
its own entry list changed — a directory's mtime does not move when a file three levels down is
edited, so the floor previously read "quiet" while the fleet was working. The walk is bounded; if
it runs out of budget the pallet is marked partial rather than reported quiet.

---

## Amendment B — yellow pallets, and sessions that have ended (the Operator's rulings, 2026-09-30)

Both were put to the Operator as questions on the Tasks tab ([`03-BUS.md`](03-BUS.md) 5a) and approved.

**A stored location is yellow.** A pallet is drawn amber, as a pallet is. State rides on the
other colours: **green** if anything beneath it was written in the last ten minutes, **red** on
`STOP`, **grey** where it could not be read. How full a location is shows in its **height and
brightness**, not in a colour of its own. This supersedes the §3 reading of amber as "a location
needs a decision" for pallets (a crane in `GATE` still draws amber), and replaces the earlier
"amber means 30 or more entries". A pallet is never near-black, however empty.

**A session that has ended is not a crane.** A session marker is deleted by its owner at sign-off
and refreshed by its owner's heartbeat ([`08`](08-AGENTS.md) §4, §6). A marker whose file **and**
last bus line are both older than 24 hours, and which holds no live claim, is a dead session: the
floor does not draw it, counts it (`staleSessions` in `/floor`, shown in the HUD), and **never
deletes it** — removing a marker is its owner's act. An agent with open `REQ` rows still appears,
as scheduled at the inductor, not as signed on.

**Alive means the last bus line or the marker's last touch** (the heartbeat) is within 90 seconds. Before,
a marker's touch was ignored once the agent had written any bus line, so a session that beats but rarely
speaks could never read as moving; the heartbeat is the marker touch (08 §6), so it counts.
