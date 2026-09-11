# templates/

A starter tree. Copy `_os/` next to the project you want governed, then copy `protocol/` into
`_os/protocol/`:

```bash
cp -r templates/_os  your-project/_os
cp -r protocol       your-project/_os/protocol
```

Or let the CLI do both:

```bash
npx parvis init your-project
```

## What you get

```
_os/
  estop/STATE                RUN — the derived mirror. The sentinel file is the fact.
  tasks/INDEX.md             the ledger: what was asked, what got done, with evidence
  events/surface/            pointer files agents drop for you
  exchange/
    bus/BUS.md               the six verbs
    bus/broadcast.log        append-only, everyone reads and writes
    bus/in/<AGENT>.log       per-agent inboxes — data, never command authority
    bus/session/             sign-on markers, deleted by their own owner
    board/BOARD.md           the job board
    requests/                things only the Operator can do
  protocol/                  the specification itself
  AGENT.template.md          a starting definition for one agent
```

## The one thing to change first

`AGENT.template.md` is written for an advisory agent with a narrow scope. The two lines worth the
most thought are **Scope** — the single directory it may write — and **What would make me wrong**,
which is the only part of an agent definition that reliably survives contact with a real task.
