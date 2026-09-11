# Översättningsstatus — Svenska (`lang/sv`)

> **English summary:** this branch is the Parvis Protocol with `protocol/` translated into Swedish. The
> English text on `main` is normative. Files not listed as translated below are still English — this
> branch is a complete, working copy of the repository, not a partial one.

---

## Vad denna gren är

Denna gren är det **fullständiga** Parvis Protocol-arkivet, med nedan angivna filer översatta till svenska.
Inget har tagits bort. Är en fil ännu inte översatt finns den här på originalspråket och är fortfarande fullt
användbar.

**Engelskan i grenen `main` är den normativa versionen.** Där denna översättning och originalet skiljer sig
gäller engelskan. Översättningen är maskinstödd och **har inte granskats av någon med språket som modersmål**.

## Överenskommelse om protokollets identifierare

Följande behålls **medvetet på engelska**, eftersom det rör sig om bokstavliga värden som agenter tolkar och
jämför, inte om löpande text:

- tillståndsverben `RUN`, `YELLOW`, `STOP`;
- tillförlitlighetsmärkningarna `[PROVEN]`, `[CLAIMED]`, `[ASSUMED]`, `[PROPOSED]`;
- bussens sex verb `FLASH`, `ASK`, `ANS`, `TELL`, `GATE`, `ACK`;
- liggarraderna `REQ`, `DONE`, `BLOCKED`, `REFUSED`;
- alla filnamn och sökvägar (`_os/`, `estop`, `protocol/00-PRECEDENCE.md`, …).

Att översätta dem skulle söndra varje implementation som läser dem.

---

## Täckning

| Fil | Status |
|---|---|
| `protocol/00-PRECEDENCE.md` | ✅ Översatt |
| `protocol/01-ESTOP.md` | ✅ Översatt |
| `protocol/02-EVIDENCE.md` | ✅ Översatt |
| `protocol/03-BUS.md` | ✅ Översatt |
| `protocol/04-OUTPUT-CONTRACT.md` | ✅ Översatt |
| `protocol/05-CORRECTION.md` | ✅ Översatt |
| `protocol/06-DATA-ZONES.md` | ✅ Översatt |
| `protocol/07-INTERFACE.md` | ✅ Översatt |
| `protocol/08-AGENTS.md` | ✅ Översatt |
| `protocol/09-FLOOR.md` | ✅ Översatt |
| `protocol/10-AIRLOCK.md` | ✅ Översatt |
| `README.md` | ⬜ Engelska |
| `CHANGELOG.md`, `DECISIONS.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` | ⬜ Engelska |
| `examples/`, `reference/`, `templates/` | ⬜ Engelska |
| Kod och konfiguration (`.mjs`, `.json`, `.html`, `.yml`) | ⬜ Översätts inte, avsiktligt |

---

## Tangentbordslayouter

Denna gren täcker dem som skriver med följande Windows-tangentbordslayouter:

`Swedish`, `Swedish with Sami`

---

## Anmäla ett översättningsfel

Öppna ett ärende i arkivet och ange fil, avsnitt och föreslagen formulering. En översättningsrättelse ändrar
**aldrig** den normativa innebörden: anser du att engelskan är fel är det ett separat ärende och det riktar sig
mot `main`.
