# Oversættelsesstatus — Dansk (`lang/da`)

> **English summary:** this branch is the Parvis Protocol with `protocol/` translated into Danish. The
> English text on `main` is normative. Files not listed as translated below are still English — this
> branch is a complete, working copy of the repository, not a partial one.

---

## Hvad denne gren er

Denne gren er det **fuldstændige** Parvis Protocol-arkiv, hvor de nedenfor nævnte filer er oversat til dansk.
Intet er fjernet. Er en fil endnu ikke oversat, findes den her på originalsproget og er fortsat fuldt
anvendelig.

**Engelsk i grenen `main` er den normative udgave.** Hvor denne oversættelse og originalen afviger, gælder
engelsk. Oversættelsen er maskinstøttet og **er ikke gennemset af en modersmålstalende**.

## Aftale om protokollens betegnelser

Følgende bevares **bevidst på engelsk**, fordi det er bogstavelige værdier, som agenter fortolker og
sammenligner, ikke løbende tekst:

- tilstandsverberne `RUN`, `YELLOW`, `STOP`;
- tillidsmærkningerne `[PROVEN]`, `[CLAIMED]`, `[ASSUMED]`, `[PROPOSED]`;
- bussens seks verber `FLASH`, `ASK`, `ANS`, `TELL`, `GATE`, `ACK`;
- protokollinjerne `REQ`, `DONE`, `BLOCKED`, `REFUSED`;
- alle filnavne og stier (`_os/`, `estop`, `protocol/00-PRECEDENCE.md`, …).

At oversætte dem ville ødelægge enhver implementering, der læser dem.

---

## Dækning

| Fil | Status |
|---|---|
| `protocol/00-PRECEDENCE.md` | ✅ Oversat |
| `protocol/01-ESTOP.md` | ✅ Oversat |
| `protocol/02-EVIDENCE.md` | ✅ Oversat |
| `protocol/03-BUS.md` | ✅ Oversat |
| `protocol/04-OUTPUT-CONTRACT.md` | ✅ Oversat |
| `protocol/05-CORRECTION.md` | ✅ Oversat |
| `protocol/06-DATA-ZONES.md` | ✅ Oversat |
| `protocol/07-INTERFACE.md` | ✅ Oversat |
| `protocol/08-AGENTS.md` | ✅ Oversat |
| `protocol/09-FLOOR.md` | ✅ Oversat |
| `protocol/10-AIRLOCK.md` | ✅ Oversat |
| `README.md` | ⬜ Engelsk |
| `CHANGELOG.md`, `DECISIONS.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` | ⬜ Engelsk |
| `examples/`, `reference/`, `templates/` | ⬜ Engelsk |
| Kode og konfiguration (`.mjs`, `.json`, `.html`, `.yml`) | ⬜ Oversættes ikke, med vilje |

---

## Tastaturlayout

Denne gren dækker dem, der skriver med følgende Windows-tastaturlayout:

`Danish`

---

## Melde en oversættelsesfejl

Åbn et issue i arkivet med angivelse af fil, afsnit og foreslået formulering. En oversættelsesrettelse ændrer
**aldrig** den normative betydning: mener du, at engelsk er forkert, er det et selvstændigt issue, og det retter
sig mod `main`.
