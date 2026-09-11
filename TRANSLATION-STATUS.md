# Übersetzungsstand — Deutsch (`lang/de`)

> **English summary:** this branch is the Parvis Protocol with `protocol/` translated into German.
> The English text on `main` is normative. Files not listed as translated below are still English —
> this branch is a complete, working copy of the repository, not a partial one.

---

## Was dieser Branch ist

Dieser Branch ist das **vollständige** Parvis-Protocol-Repository, wobei die unten aufgeführten
Dateien ins Deutsche übersetzt sind. Nichts wurde entfernt. Ist eine Datei noch nicht übersetzt,
erscheint sie hier in ihrer Ursprungssprache und bleibt voll benutzbar.

**Das Englische im Branch `main` ist die normative Fassung.** Wo diese Übersetzung und das Original
voneinander abweichen, gilt das Englische. Diese Übersetzung ist maschinell unterstützt und **wurde
nicht von einem Muttersprachler geprüft**.

## Konvention zu den Protokollbezeichnern

Das Folgende bleibt **bewusst auf Englisch**, weil es sich um wörtliche Werte handelt, die Agenten
auswerten und vergleichen, und nicht um Fließtext:

- die Zustandsverben `RUN`, `YELLOW`, `STOP`;
- die Vertrauensauszeichnungen `[PROVEN]`, `[CLAIMED]`, `[ASSUMED]`, `[PROPOSED]`;
- die sechs Bus-Verben `FLASH`, `ASK`, `ANS`, `TELL`, `GATE`, `ACK`;
- die Registerzeilen `REQ`, `DONE`, `BLOCKED`, `REFUSED`;
- sämtliche Dateinamen und Pfade (`_os/`, `estop`, `protocol/00-PRECEDENCE.md`, …).

Sie zu übersetzen würde jede Implementierung zerstören, die sie liest.

---

## Abdeckung

| Datei | Stand |
|---|---|
| `protocol/00-PRECEDENCE.md` | ✅ Übersetzt |
| `protocol/01-ESTOP.md` | ✅ Übersetzt |
| `protocol/02-EVIDENCE.md` | ✅ Übersetzt |
| `protocol/03-BUS.md` | ✅ Übersetzt |
| `protocol/04-OUTPUT-CONTRACT.md` | ✅ Übersetzt |
| `protocol/05-CORRECTION.md` | ✅ Übersetzt |
| `protocol/06-DATA-ZONES.md` | ✅ Übersetzt |
| `protocol/07-INTERFACE.md` | ✅ Übersetzt |
| `protocol/08-AGENTS.md` | ✅ Übersetzt |
| `protocol/09-FLOOR.md` | ✅ Übersetzt |
| `protocol/10-AIRLOCK.md` | ✅ Übersetzt |
| `README.md` | ⬜ Englisch |
| `CHANGELOG.md`, `DECISIONS.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` | ⬜ Englisch |
| `examples/`, `reference/`, `templates/` | ⬜ Englisch |
| Code und Konfiguration (`.mjs`, `.json`, `.html`, `.yml`) | ⬜ Nicht übersetzt, nach Entwurf |

---

## Tastaturbelegungen

Dieser Branch deckt diejenigen ab, die mit den folgenden Windows-Tastaturbelegungen schreiben:

`German`, `German (IBM)`, `German Extended (E1)`, `German Extended (E2)`, `Swiss German`

---

## Einen Übersetzungsfehler melden

Öffne ein Issue im Repository mit Angabe von Datei, Abschnitt und Formulierungsvorschlag. Eine
Übersetzungskorrektur ändert **niemals** die normative Bedeutung: Wenn du meinst, das Englische sei
falsch, ist das ein eigenes Issue und richtet sich gegen `main`.
