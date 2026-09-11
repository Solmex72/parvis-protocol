# Käännöksen tila — Suomi (`lang/fi`)

> **English summary:** this branch is the Parvis Protocol with `protocol/` translated into Finnish. The
> English text on `main` is normative. Files not listed as translated below are still English — this
> branch is a complete, working copy of the repository, not a partial one.

---

## Mikä tämä haara on

Tämä haara on **täydellinen** Parvis Protocol -arkisto, jossa alla luetellut tiedostot on käännetty suomeksi.
Mitään ei ole poistettu. Jos tiedostoa ei ole vielä käännetty, se on täällä alkuperäiskielellään ja on edelleen
täysin käyttökelpoinen.

**Haaran `main` englanninkielinen teksti on normatiivinen versio.** Missä tämä käännös ja alkuperäinen poikkeavat
toisistaan, englanti ratkaisee. Käännös on konetuettu, eikä **äidinkielinen puhuja ole sitä tarkastanut**.

## Sopimus protokollan tunnisteista

Seuraavat on **tarkoituksella jätetty englanniksi**, koska ne ovat kirjaimellisia arvoja, joita agentit
jäsentävät ja vertailevat, eivät juoksevaa tekstiä:

- tilaverbit `RUN`, `YELLOW`, `STOP`;
- luottamusmerkinnät `[PROVEN]`, `[CLAIMED]`, `[ASSUMED]`, `[PROPOSED]`;
- väylän kuusi verbiä `FLASH`, `ASK`, `ANS`, `TELL`, `GATE`, `ACK`;
- kirjanpitorivit `REQ`, `DONE`, `BLOCKED`, `REFUSED`;
- kaikki tiedostonimet ja polut (`_os/`, `estop`, `protocol/00-PRECEDENCE.md`, …).

Niiden kääntäminen rikkoisi jokaisen toteutuksen, joka niitä lukee.

---

## Kattavuus

| Tiedosto | Tila |
|---|---|
| `protocol/00-PRECEDENCE.md` | ✅ Käännetty |
| `protocol/01-ESTOP.md` | ✅ Käännetty |
| `protocol/02-EVIDENCE.md` | ✅ Käännetty |
| `protocol/03-BUS.md` | ✅ Käännetty |
| `protocol/04-OUTPUT-CONTRACT.md` | ✅ Käännetty |
| `protocol/05-CORRECTION.md` | ✅ Käännetty |
| `protocol/06-DATA-ZONES.md` | ✅ Käännetty |
| `protocol/07-INTERFACE.md` | ✅ Käännetty |
| `protocol/08-AGENTS.md` | ✅ Käännetty |
| `protocol/09-FLOOR.md` | ✅ Käännetty |
| `protocol/10-AIRLOCK.md` | ✅ Käännetty |
| `README.md` | ⬜ Englanti |
| `CHANGELOG.md`, `DECISIONS.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` | ⬜ Englanti |
| `examples/`, `reference/`, `templates/` | ⬜ Englanti |
| Koodi ja asetukset (`.mjs`, `.json`, `.html`, `.yml`) | ⬜ Ei käännetä, tarkoituksella |

---

## Näppäimistöasettelut

Tämä haara kattaa ne, jotka kirjoittavat seuraavilla Windowsin näppäimistöasetteluilla:

`Finnish`, `Finnish with Sami`

---

## Käännösvirheen ilmoittaminen

Avaa arkistoon issue, jossa kerrot tiedoston, kohdan ja ehdotetun sanamuodon. Käännöskorjaus **ei koskaan** muuta
normatiivista merkitystä: jos katsot englanninkielisen olevan väärässä, se on erillinen issue ja kohdistuu
haaraan `main`.
