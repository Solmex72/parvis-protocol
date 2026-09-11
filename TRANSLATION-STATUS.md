# Oversettelsesstatus — Norsk bokmål (`lang/nb`)

> **English summary:** this branch is the Parvis Protocol with `protocol/` translated into Norwegian
> Bokmål. The English text on `main` is normative. Files not listed as translated below are still
> English — this branch is a complete, working copy of the repository, not a partial one.

---

## Hva denne grenen er

Denne grenen er det **fullstendige** Parvis Protocol-arkivet, der filene nedenfor er oversatt til norsk bokmål.
Ingenting er fjernet. Er en fil ennå ikke oversatt, finnes den her på originalspråket og er fortsatt fullt
brukbar.

**Engelsk i grenen `main` er den normative versjonen.** Der denne oversettelsen og originalen avviker, gjelder
engelsk. Oversettelsen er maskinstøttet og **er ikke gjennomgått av en morsmålsbruker**.

## Avtale om protokollens betegnelser

Følgende beholdes **bevisst på engelsk**, fordi det er bokstavelige verdier som agenter tolker og sammenligner,
ikke løpende tekst:

- tilstandsverbene `RUN`, `YELLOW`, `STOP`;
- tillitsmerkingene `[PROVEN]`, `[CLAIMED]`, `[ASSUMED]`, `[PROPOSED]`;
- bussens seks verb `FLASH`, `ASK`, `ANS`, `TELL`, `GATE`, `ACK`;
- protokollinjene `REQ`, `DONE`, `BLOCKED`, `REFUSED`;
- alle filnavn og stier (`_os/`, `estop`, `protocol/00-PRECEDENCE.md`, …).

Å oversette dem ville ødelegge enhver implementasjon som leser dem.

---

## Dekning

| Fil | Status |
|---|---|
| `protocol/00-PRECEDENCE.md` | ✅ Oversatt |
| `protocol/01-ESTOP.md` | ✅ Oversatt |
| `protocol/02-EVIDENCE.md` | ✅ Oversatt |
| `protocol/03-BUS.md` | ✅ Oversatt |
| `protocol/04-OUTPUT-CONTRACT.md` | ✅ Oversatt |
| `protocol/05-CORRECTION.md` | ✅ Oversatt |
| `protocol/06-DATA-ZONES.md` | ✅ Oversatt |
| `protocol/07-INTERFACE.md` | ✅ Oversatt |
| `protocol/08-AGENTS.md` | ✅ Oversatt |
| `protocol/09-FLOOR.md` | ✅ Oversatt |
| `protocol/10-AIRLOCK.md` | ✅ Oversatt |
| `README.md` | ⬜ Engelsk |
| `CHANGELOG.md`, `DECISIONS.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` | ⬜ Engelsk |
| `examples/`, `reference/`, `templates/` | ⬜ Engelsk |
| Kode og konfigurasjon (`.mjs`, `.json`, `.html`, `.yml`) | ⬜ Oversettes ikke, med hensikt |

---

## Tastaturoppsett

Denne grenen dekker dem som skriver med følgende Windows-tastaturoppsett:

`Norwegian`, `Norwegian with Sami`

---

## Melde en oversettelsesfeil

Åpne et issue i arkivet med angivelse av fil, avsnitt og foreslått ordlyd. En oversettelsesrettelse endrer
**aldri** den normative betydningen: mener du at engelsk er feil, er det et selvstendig issue, og det retter seg
mot `main`.
