# cloud-bus

**The Parvis bus, run over a shared cloud drive.** For fleets whose agents are different products
on different devices and meet only in a synced folder: no shared host, no server, no API.

[`protocol/03-BUS.md`](../protocol/03-BUS.md) is the bus for agents on one machine. This folder is
what changes when the bus is a folder in a consumer cloud drive — which loses concurrent edits,
syncs files in pieces, and delivers late. It extends `03` and restates none of it.

```
 phone / glasses / browser agents        a worker host
        │   write a file                      │   polls jobs/, runs a whitelisted task
        ▼                                     ▼
 ┌─────────────────────────  _bus/  (a synced drive folder)  ─────────────────────────┐
 │  agents/<name>/inbox · outbox     jobs/ → processed/     results/ → archive/         │
 │  README · PRIMER · STATUS         heartbeat/<worker>.txt     estop (Operator only)   │
 └──────────────────────────────────────────────────────────────────────────────────────┘
        one message = one new, uniquely named file · nobody edits anyone else's file
```

## What is here

| Path | What | Licence |
|---|---|---|
| [`SPEC.md`](SPEC.md) | The normative spec: transport hazards, the four rules, the envelope, lanes, the stop on a drive, offload, corrections, deliverables, honest limits. **Start here.** | CC BY 4.0 |
| [`template/_bus/`](template/_bus/) | A folder to copy into the drive: `README`, `PRIMER`, `STATUS`, lanes, `jobs/`, `results/`, `heartbeat/`. | MIT |
| [`template/briefing-pack/`](template/briefing-pack/) | A pack for onboarding an outside agent: participants, doctrine digest, the relay, the **return envelope**, the content boundary, a manifest. | MIT |
| [`worker/`](worker/) | A zero-dependency reference worker (`bus-worker.mjs`), a sample handler, a systemd unit, and `DEPLOY.md`. | MIT |
| [`examples/`](examples/) | Example envelopes, a correction, a dispute, a lane notice, a device registry. | MIT |

## The ideas that are specific to this transport

1. **One message, one new file.** A drive is a last-writer-wins replicator. Two writers to one
   path lose an edit silently, so no path has two writers. A shared append-only log — fine on one
   host — does **not** carry over.
2. **A file that will not parse is still syncing.** A half-arrived file is not a finding. Look
   again; never delete what you cannot read.
3. **Nothing pushes.** Agents list their inbox every time and do not remember it.
4. **Cooperation is the default because confinement cannot be enforced** from inside a shared
   folder on a product you do not control. Every act is a visible, tagged file instead. Confinement
   is offered only where the drive's own permissions sit under it.
5. **A tag attributes; it does not authenticate.** `model: <tag>` makes honest provenance cheap
   and a forged tag a visible lie. It is not a signature.
6. **The stop is late on a replicated drive.** Say so, and for anything urgent close the window.

## Try it

```bash
node worker/bus-worker.mjs --selftest              # 20 checks, throwaway local directory
cp -r template/_bus /path/to/your/drive/_bus
node worker/bus-worker.mjs --lint /path/to/your/drive/_bus
```

The worker is **[PROPOSED]** against a real drive: its logic is tested; its behaviour on any
particular mount is an errand to run first ([`worker/DEPLOY.md`](worker/DEPLOY.md) §4).

## Provenance

Extracted from a working multi-agent bus that ran over a consumer cloud drive, and made generic:
participant names, devices, hosts, accounts and paths are replaced by placeholders. Three of its
lessons are now spec text rather than folklore: the access policy changed from *confined* to
*cooperative* once it was clear a third-party product cannot be fenced from inside a shared folder;
a device ranking written in a file was wrong in several lanes at once until it was swept; and a
native document format (a stub, not text) is not a message.

## Licence

Dual, by material, like the rest of the repository: prose (`SPEC.md`, this README) under
[CC BY 4.0](../LICENSE-DOCS); code and templates under [MIT](../LICENSE). See the root licence
files for the exact scope. Copyright © 2026 Connor Woods.
