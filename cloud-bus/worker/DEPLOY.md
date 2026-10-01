# Deploying the bus worker

**Status: [PROPOSED] against a real drive.** The worker's logic is tested on a local directory
(`node bus-worker.mjs --selftest`, 20 checks). It has not been proven against any particular
drive's mount or sync semantics. Run the check in §4 before you trust it with anything.

The worker is the only autonomous poller on the bus ([`../SPEC.md`](../SPEC.md) §9). It needs a
host that stays up, Node 18 or later, and **a directory that is the bus folder**. It does not know
or care how that directory is filled, and it holds no drive credential.

## 1. Two steps that are yours, and no agent's

Per [`12`](../../protocol/12-CREDENTIALS.md): a credential is *placed*, never *sent*. An agent
does not type these, and nothing should ever ask you to paste them into a chat or a bus file.

1. **Get a shell on the host.** Your key, your provider console. Not an agent's job.
2. **Authorise the drive client on the host.** However your sync tool does it — an interactive
   OAuth flow, or a service-account file you copy to the host yourself. Scope it to the one bus
   folder if the drive allows it.

## 2. Give the worker a directory

Any of these produces a directory; pick the one your drive supports.

| Method | Note |
|---|---|
| A mount of the drive folder (for example an `rclone mount` with a write cache) | Renames and overwrites must work on the mount. Test them (§4). |
| A two-way sync of the folder to local disk | A job can be seen on the server before it has fully synced; the worker's "still syncing" grace (SPEC §4.3) covers a young truncated file, not a stalled sync. |
| The drive's own desktop client on a host that has one | Simplest. Ties the worker to that host. |

Whichever you choose, put the worker **outside** the synced folder and give it the folder as
`--bus`. Never run the worker's own code from inside a sync root
([`06`](../../protocol/06-DATA-ZONES.md) §2).

## 3. Install

```bash
# as an unprivileged user — the worker needs no root
mkdir -p ~/bus-worker
cp bus-worker.mjs ~/bus-worker/
cp -r handlers ~/bus-worker/handlers     # only the handlers you actually intend to offer
node ~/bus-worker/bus-worker.mjs --bus /path/to/_bus --once --dry   # reads, writes nothing
```

`handlers/<task>.mjs` is the whitelist: a job's `task` is accepted only if that file exists. Write
your own by following the contract at the top of [`handlers/echo.mjs`](handlers/echo.mjs). **Install
a handler only if you would run it on input written by any participant on the bus** — a job body
is data from a party you do not control.

Then the service, edited for your user and paths:

```bash
sudo cp bus-worker.service /etc/systemd/system/bus-worker.service
sudo systemctl daemon-reload
sudo systemctl enable --now bus-worker
```

The unit uses `Restart=on-failure`, and the worker exits **0** when it sees the stop sentinel
([`01`](../../protocol/01-ESTOP.md) §3), so a stop **is not undone by the supervisor**. After the
Operator removes the sentinel, start it by hand.

## 4. Prove it on your drive before you rely on it

1. Create a `job` file from another device, addressed to your worker id, with `"task": "echo"`.
2. Watch `heartbeat/<worker-id>.txt` change, and a reply appear in `results/` with `reply_to` set.
3. Confirm the job moved to `jobs/processed/` on **both** sides.
4. Create the file `estop` in the bus folder. Confirm the heartbeat stops changing and the worker
   process exits. Remove it, restart, confirm it resumes. *Note how long step 4 took to propagate;
   that is your real stop latency (SPEC §6).*

If any step fails, the worker stays undeployed and jobs queue and wait. Nothing is lost by that.

## 5. Retention

The worker prunes only `jobs/processed/`, past `--retain-days` (default 30; `0` disables). Every
other store on the bus has an owner who prunes it: requesters empty `results/archive/`, the
steward trims `heartbeat/` if it grows. A store with no named pruner is a leak waiting to happen
([`08`](../../protocol/08-AGENTS.md) §6).
