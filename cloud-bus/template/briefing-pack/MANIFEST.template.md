# MANIFEST — egress record for the pack

- pack: `<your-id>`
- generated: `<UTC time>` (`<which clock>`)
- protocol version the digest was generated from: `<version>`
- lane: human relay. The Operator hands this pack over by hand. No program sends it.

## Approval trail

- **Order:** the Operator's instruction that this pack be made, quoted or cited by date.
- **Register:** the approvals-register entry, with its state when the pack was generated. For a
  human-relay send, the approving act and the sending act are the same act: the Operator reading this
  pack and handing it over. No agent sends it, and none infers approval from the order to write it.
- **Clearance sweep:** who swept the pack against the content boundary (`05`), when, and what for.
- **Data handling on the vendor's side:** not asserted here. The Operator confirms the vendor's
  current published terms on retention and training use before sending anything beyond this pack.

## Files (SHA-256 over the file bytes as generated)

| file | sha256 | bytes |
|---|---|---|
| `README.md` | `<hash>` | `<n>` |
| `01-PARTICIPANTS.md` | `<hash>` | `<n>` |
| `02-DOCTRINE-DIGEST.md` | `<hash>` | `<n>` |
| `03-HOW-WE-CONNECT.md` | `<hash>` | `<n>` |
| `04-RETURN-ENVELOPE.md` | `<hash>` | `<n>` |
| `05-CONTENT-BOUNDARY.md` | `<hash>` | `<n>` |

## Verify

```bash
sha256sum *.md
```

```powershell
Get-FileHash -Algorithm SHA256 -Path .\*.md
```
