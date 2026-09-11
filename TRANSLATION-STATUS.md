# Stav překladu — Čeština (`lang/cs`)

> **English summary:** this branch is the Parvis Protocol with `protocol/` translated into Czech. The
> English text on `main` is normative. Files not listed as translated below are still English — this
> branch is a complete, working copy of the repository, not a partial one.

---

## Co je tato větev

Tato větev je **úplné** úložiště Parvis Protocol, v němž jsou níže uvedené soubory přeloženy do češtiny. Nic
nebylo odebráno. Není-li soubor dosud přeložen, je zde v původním jazyce a zůstává plně použitelný.

**Anglická verze ve větvi `main` je normativní.** Tam, kde se tento překlad a originál rozcházejí, má
přednost angličtina. Překlad vznikl za pomoci stroje a **nebyl ověřen rodilým mluvčím**.

## Úmluva o identifikátorech protokolu

Následující je **záměrně ponecháno anglicky**, protože jde o doslovné hodnoty, které agenti zpracovávají a
porovnávají, nikoli o souvislý text:

- stavová slovesa `RUN`, `YELLOW`, `STOP`;
- označení jistoty `[PROVEN]`, `[CLAIMED]`, `[ASSUMED]`, `[PROPOSED]`;
- šest sloves sběrnice `FLASH`, `ASK`, `ANS`, `TELL`, `GATE`, `ACK`;
- řádky rejstříku `REQ`, `DONE`, `BLOCKED`, `REFUSED`;
- všechny názvy souborů a cesty (`_os/`, `estop`, `protocol/00-PRECEDENCE.md`, …).

Jejich překlad by rozbil každou implementaci, která je čte.

---

## Pokrytí

| Soubor | Stav |
|---|---|
| `protocol/00-PRECEDENCE.md` | ✅ Přeloženo |
| `protocol/01-ESTOP.md` | ✅ Přeloženo |
| `protocol/02-EVIDENCE.md` | ✅ Přeloženo |
| `protocol/03-BUS.md` | ✅ Přeloženo |
| `protocol/04-OUTPUT-CONTRACT.md` | ✅ Přeloženo |
| `protocol/05-CORRECTION.md` | ✅ Přeloženo |
| `protocol/06-DATA-ZONES.md` | ✅ Přeloženo |
| `protocol/07-INTERFACE.md` | ✅ Přeloženo |
| `protocol/08-AGENTS.md` | ✅ Přeloženo |
| `protocol/09-FLOOR.md` | ✅ Přeloženo |
| `protocol/10-AIRLOCK.md` | ✅ Přeloženo |
| `README.md` | ⬜ Anglicky |
| `CHANGELOG.md`, `DECISIONS.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` | ⬜ Anglicky |
| `examples/`, `reference/`, `templates/` | ⬜ Anglicky |
| Kód a konfigurace (`.mjs`, `.json`, `.html`, `.yml`) | ⬜ Nepřekládá se, záměrně |

---

## Rozložení klávesnice

Tato větev pokrývá ty, kdo píší těmito rozloženími klávesnice Windows:

`Czech`, `Czech (QWERTY)`, `Czech Programmers`

---

## Nahlásit chybu překladu

Otevřete issue v úložišti s uvedením souboru, oddílu a navrhovaného znění. Oprava překladu **nikdy** nemění
normativní význam: máte-li za to, že chybná je anglická verze, je to samostatné issue a týká se `main`.
