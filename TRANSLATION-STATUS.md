# Vertaalstatus — Nederlands (`lang/nl`)

> **English summary:** this branch is the Parvis Protocol with `protocol/` translated into Dutch. The
> English text on `main` is normative. Files not listed as translated below are still English — this
> branch is a complete, working copy of the repository, not a partial one.

---

## Wat deze branch is

Deze branch is de **volledige** Parvis Protocol-repository, met de hieronder genoemde bestanden vertaald
naar het Nederlands. Er is niets verwijderd. Is een bestand nog niet vertaald, dan staat het hier in de
oorspronkelijke taal en blijft het volledig bruikbaar.

**Het Engels in de branch `main` is de normatieve versie.** Waar deze vertaling en het origineel van elkaar
afwijken, geldt het Engels. Deze vertaling is machinaal ondersteund en **is niet door een moedertaalspreker
gecontroleerd**.

## Afspraak over de protocolaanduidingen

Het volgende blijft **bewust in het Engels**, omdat het letterlijke waarden zijn die agents uitlezen en
vergelijken, en geen lopende tekst:

- de toestandswerkwoorden `RUN`, `YELLOW`, `STOP`;
- de vertrouwensmarkeringen `[PROVEN]`, `[CLAIMED]`, `[ASSUMED]`, `[PROPOSED]`;
- de zes busverba `FLASH`, `ASK`, `ANS`, `TELL`, `GATE`, `ACK`;
- de registerregels `REQ`, `DONE`, `BLOCKED`, `REFUSED`;
- alle bestandsnamen en paden (`_os/`, `estop`, `protocol/00-PRECEDENCE.md`, …).

Ze vertalen zou elke implementatie breken die ze uitleest.

---

## Dekking

| Bestand | Status |
|---|---|
| `protocol/00-PRECEDENCE.md` | ✅ Vertaald |
| `protocol/01-ESTOP.md` | ✅ Vertaald |
| `protocol/02-EVIDENCE.md` | ✅ Vertaald |
| `protocol/03-BUS.md` | ✅ Vertaald |
| `protocol/04-OUTPUT-CONTRACT.md` | ✅ Vertaald |
| `protocol/05-CORRECTION.md` | ✅ Vertaald |
| `protocol/06-DATA-ZONES.md` | ✅ Vertaald |
| `protocol/07-INTERFACE.md` | ✅ Vertaald |
| `protocol/08-AGENTS.md` | ✅ Vertaald |
| `protocol/09-FLOOR.md` | ✅ Vertaald |
| `protocol/10-AIRLOCK.md` | ✅ Vertaald |
| `README.md` | ⬜ Engels |
| `CHANGELOG.md`, `DECISIONS.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` | ⬜ Engels |
| `examples/`, `reference/`, `templates/` | ⬜ Engels |
| Code en configuratie (`.mjs`, `.json`, `.html`, `.yml`) | ⬜ Niet vertaald, met opzet |

---

## Toetsenbordindelingen

Deze branch bedient wie typt met de volgende Windows-toetsenbordindeling:

`Dutch`

---

## Een vertaalfout melden

Open een issue in de repository met vermelding van het bestand, de paragraaf en de voorgestelde
formulering. Een vertaalcorrectie verandert **nooit** de normatieve betekenis: vind je dat het Engels
onjuist is, dan is dat een afzonderlijke issue en die richt zich op `main`.
