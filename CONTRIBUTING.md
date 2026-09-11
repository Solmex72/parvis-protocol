# Contributing

Issues and pull requests are welcome. This project has a few rules that are unusual, and they
come straight from the protocol it describes.

---

## The three that matter

**1 · A rule restated in a new file is drift, not a contribution.**

The origin system reached five circulating versions of a single Priority-0 rule. That is the
specific failure this repository exists to prevent, so: if a rule needs changing, change it
**where it lives**. Do not add a file that re-states it more clearly. If you cannot find where a
rule lives, that is a bug worth an issue on its own.

**2 · Claims carry their tags.**

In an issue or a PR description, `[PROVEN]` means you ran it and will say what you ran, on what
platform. `[CLAIMED]` means you read it somewhere. `[ASSUMED]` means it seems right.
`[PROPOSED]` means you think we should. Mixing these up wastes the reviewer's time reconstructing
which is which.

"Works on my machine" is `[PROVEN]` for exactly one machine, and saying which one is the useful
half.

**3 · Contradictions get settled, not catalogued.**

If your change makes two files disagree, fix both in the same PR and say which fact won. See
[`05-CORRECTION.md`](protocol/05-CORRECTION.md) §7. If you cannot settle it — because it needs
information you do not have, or because being wrong would be unsafe — say so explicitly and it
goes in [`DECISIONS.md`](DECISIONS.md) Part 2 alongside the other four open questions.

---

## Changing the protocol

`protocol/` is a specification. Changes there are held to a higher bar than code:

- **Say what breaks.** Anyone who adopted the previous wording has agents running against it.
- **Keep the honest limits.** Every file states what it cannot do. Those sections are
  load-bearing, not hedging — do not tidy them away.
- **No new rung above the stop.** [`00`](protocol/00-PRECEDENCE.md) ships with nothing above the
  estop. An exception is the most dangerous possible edit; it needs its own discussion, not a PR.
- **Changes to [`01-ESTOP.md`](protocol/01-ESTOP.md) get extra scrutiny**, particularly anything
  touching the fail-safe direction. Unreadable means stopped. Always.

## Changing the code

- **Zero dependencies.** CI fails if `package.json` grows one. This is not negotiable for a tool
  that reads and writes your governing documents.
- **No hardcoded paths, no hardcoded separators.** `path.join`, always. The reason is in the
  release notes: the origin implementation had roughly 200 hardcoded Windows paths and could not
  run anywhere else.
- **Windows, macOS and Linux.** CI runs all three on Node 18, 20 and 22. A dynamic `import()` of
  an absolute path needs `pathToFileURL` or it breaks on Windows only — that exact bug shipped
  and was caught by the selftest, which is why the selftest exists.
- **Add a check to `parvis selftest`** for anything platform-sensitive you touch.

```bash
cd reference
node bin/parvis.mjs selftest     # must pass before you open a PR
node bin/parvis.mjs init /tmp/t  # scaffold
PARVIS_ROOT=/tmp/t node bin/parvis.mjs serve
```

## Security

Do not open a public issue for anything exploitable — see [SECURITY.md](SECURITY.md) for private
reporting.

## Licensing

By contributing you agree your contribution ships under the same terms as the file it lands in:
[MIT](LICENSE) for code, [CC BY 4.0](LICENSE-DOCS) for prose.
