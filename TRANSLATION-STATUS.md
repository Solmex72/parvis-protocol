# Stato della traduzione — Italiano (`lang/it`)

> **English summary:** this branch is the Parvis Protocol with `protocol/` translated into Italian.
> The English text on `main` is normative. Files not listed as translated below are still English —
> this branch is a complete, working copy of the repository, not a partial one.

---

## Che cos'è questo branch

Questo branch è il repository **completo** di Parvis Protocol, con i file indicati sotto tradotti in
italiano. Nulla è stato rimosso. Se un file non è ancora tradotto, compare qui nella lingua originale e
resta pienamente utilizzabile.

**L'inglese del branch `main` è la versione normativa.** Dove questa traduzione e l'originale divergono,
prevale l'inglese. Questa traduzione è assistita da macchina e **non è stata verificata da un
madrelingua**.

## Convenzione sugli identificatori del protocollo

I seguenti sono **deliberatamente mantenuti in inglese**, perché sono valori letterali che gli agenti
analizzano e confrontano, non prosa:

- i verbi di stato `RUN`, `YELLOW`, `STOP`;
- le etichette di confidenza `[PROVEN]`, `[CLAIMED]`, `[ASSUMED]`, `[PROPOSED]`;
- i sei verbi del bus `FLASH`, `ASK`, `ANS`, `TELL`, `GATE`, `ACK`;
- le righe di registro `REQ`, `DONE`, `BLOCKED`, `REFUSED`;
- tutti i nomi di file e i percorsi (`_os/`, `estop`, `protocol/00-PRECEDENCE.md`, …).

Tradurli spezzerebbe qualsiasi implementazione che li legge.

---

## Copertura

| File | Stato |
|---|---|
| `protocol/00-PRECEDENCE.md` | ✅ Tradotto |
| `protocol/01-ESTOP.md` | ✅ Tradotto |
| `protocol/02-EVIDENCE.md` | ✅ Tradotto |
| `protocol/03-BUS.md` | ✅ Tradotto |
| `protocol/04-OUTPUT-CONTRACT.md` | ✅ Tradotto |
| `protocol/05-CORRECTION.md` | ✅ Tradotto |
| `protocol/06-DATA-ZONES.md` | ✅ Tradotto |
| `protocol/07-INTERFACE.md` | ✅ Tradotto |
| `protocol/08-AGENTS.md` | ✅ Tradotto |
| `protocol/09-FLOOR.md` | ✅ Tradotto |
| `protocol/10-AIRLOCK.md` | ✅ Tradotto |
| `README.md` | ⬜ Inglese |
| `CHANGELOG.md`, `DECISIONS.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` | ⬜ Inglese |
| `examples/`, `reference/`, `templates/` | ⬜ Inglese |
| Codice e configurazione (`.mjs`, `.json`, `.html`, `.yml`) | ⬜ Non tradotti, per scelta |

---

## Layout di tastiera

Questo branch copre chi scrive con i seguenti layout di tastiera Windows:

`Italian`, `Italian (142)`

---

## Segnalare un errore di traduzione

Apri una issue nel repository indicando il file, la sezione e la formulazione proposta. Una correzione di
traduzione **non** cambia mai il significato normativo: se ritieni che l'inglese sia sbagliato, quella è
una issue distinta e riguarda `main`.
