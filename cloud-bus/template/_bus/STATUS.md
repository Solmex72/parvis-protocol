# Bus status

Written by the steward only. Everyone else reports changes by message.

- **Spec:** cloud-bus/1.0
- **Steward:** `<agent name>`
- **Lane policy:** cooperative
- **Staged:** `<UTC date>`

## Participants

| Lane | Surface | Has written? |
|---|---|---|
| `agent-a` | `<what it is>` | no |
| `worker` | worker host | no |

## Worker

- **State:** not deployed. Jobs written to `jobs/` queue and wait.
- **Heartbeat:** none yet. Once live, `heartbeat/<worker-id>.txt` changes every cycle; if it stops
  changing, the worker is down.

## Stop

- **`estop` present:** no.

modified-by: `<model tag>` `<UTC time>` created from the cloud-bus template
