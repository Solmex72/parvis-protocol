# Stan tłumaczenia — Polski (`lang/pl`)

> **English summary:** this branch is the Parvis Protocol with `protocol/` translated into Polish. The
> English text on `main` is normative. Files not listed as translated below are still English — this
> branch is a complete, working copy of the repository, not a partial one.

---

## Czym jest ta gałąź

Ta gałąź to **pełne** repozytorium Parvis Protocol, w którym wymienione niżej pliki przetłumaczono na
polski. Nic nie zostało usunięte. Jeśli plik nie jest jeszcze przetłumaczony, występuje tu w języku
oryginału i pozostaje w pełni użyteczny.

**Wersja angielska w gałęzi `main` jest wersją normatywną.** Tam, gdzie to tłumaczenie i oryginał się
różnią, rozstrzyga angielski. Tłumaczenie powstało z udziałem maszyny i **nie zostało zweryfikowane przez
rodzimego użytkownika języka**.

## Konwencja dotycząca identyfikatorów protokołu

Poniższe **celowo pozostają po angielsku**, ponieważ są to dosłowne wartości, które agenci przetwarzają i
porównują, a nie tekst ciągły:

- czasowniki stanu `RUN`, `YELLOW`, `STOP`;
- oznaczenia pewności `[PROVEN]`, `[CLAIMED]`, `[ASSUMED]`, `[PROPOSED]`;
- sześć czasowników magistrali `FLASH`, `ASK`, `ANS`, `TELL`, `GATE`, `ACK`;
- wiersze rejestru `REQ`, `DONE`, `BLOCKED`, `REFUSED`;
- wszystkie nazwy plików i ścieżki (`_os/`, `estop`, `protocol/00-PRECEDENCE.md`, …).

Przetłumaczenie ich zepsułoby każdą implementację, która je odczytuje.

---

## Pokrycie

| Plik | Stan |
|---|---|
| `protocol/00-PRECEDENCE.md` | ✅ Przetłumaczony |
| `protocol/01-ESTOP.md` | ✅ Przetłumaczony |
| `protocol/02-EVIDENCE.md` | ✅ Przetłumaczony |
| `protocol/03-BUS.md` | ✅ Przetłumaczony |
| `protocol/04-OUTPUT-CONTRACT.md` | ✅ Przetłumaczony |
| `protocol/05-CORRECTION.md` | ✅ Przetłumaczony |
| `protocol/06-DATA-ZONES.md` | ✅ Przetłumaczony |
| `protocol/07-INTERFACE.md` | ✅ Przetłumaczony |
| `protocol/08-AGENTS.md` | ✅ Przetłumaczony |
| `protocol/09-FLOOR.md` | ✅ Przetłumaczony |
| `protocol/10-AIRLOCK.md` | ✅ Przetłumaczony |
| `README.md` | ⬜ Angielski |
| `CHANGELOG.md`, `DECISIONS.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` | ⬜ Angielski |
| `examples/`, `reference/`, `templates/` | ⬜ Angielski |
| Kod i konfiguracja (`.mjs`, `.json`, `.html`, `.yml`) | ⬜ Nietłumaczone, z założenia |

---

## Układy klawiatury

Ta gałąź obsługuje piszących następującymi układami klawiatury Windows:

`Polish (214)`, `Polish (Programmers)`

---

## Zgłaszanie błędu tłumaczenia

Otwórz zgłoszenie w repozytorium, podając plik, sekcję i proponowane brzmienie. Poprawka tłumaczenia
**nigdy** nie zmienia znaczenia normatywnego: jeśli uważasz, że błędna jest wersja angielska, to osobne
zgłoszenie i dotyczy `main`.
