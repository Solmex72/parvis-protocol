> **Tłumaczenie nieoficjalne.** Wersją normatywną tego dokumentu jest wersja angielska w gałęzi `main`.
> To tłumaczenie udostępniono dla wygody i **nie zostało zweryfikowane przez rodzimego użytkownika
> języka**. W razie rozbieżności z oryginałem angielskim **rozstrzyga angielski**. Identyfikatory
> protokołu (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, czasowniki magistrali i nazwy plików)
> celowo pozostają po angielsku: są to dosłowne wartości, które agenci przetwarzają.

# 04 — KONTRAKT WYJŚCIA

**Status: normatywny.** Dokąd trafia praca, gdy jest skończona.

---

## 1. Reguła

**Nie raportuj do czatu. Pracuj w drzewie plików, zapisz wyjście na dysk i pokaż wskaźnik.**

Agent, który kończy, pisząc długą odpowiedź w oknie czatu, umieścił swoje wyjście tam, gdzie nic innego we
flocie nie może go przeczytać — żaden inny agent, żaden monitor, żadna konsola, żadna kolejna sesja. Plik
jest zapisem trwałym; czat jest zapisem rozmowy, którego nikt dalej nie widzi.

---

## 2. Dokąd trafia wyjście

| Rodzaj wyjścia | Ląduje w |
|---|---|
| Wynik pracy, ustalenia, raport | plik odpowiedzialny albo `outbox/YYYYMMDD-HHMMSS-<slug>.md` |
| Wszystko, co Operator ma zobaczyć teraz | krótki plik wskaźnikowy w `_os/events/surface/` |
| Wniosek wymagający Operatora | `_os/exchange/requests/REQ-<slug>.md` |
| Wiersz rejestru | `_os/tasks/INDEX.md` |

**Katalog `surface/` jest powiadomieniem. Plik jest treścią.** Zapisz treść w jej właściwym miejscu, a potem
zostaw jednowierszowy wskaźnik w `surface/`, żeby konsola pokazała Operatorowi, gdzie wylądowała.

---

## 3. Indeks zadań

Jeden wiersz na zlecenie. Dopisz wiersz `REQ` **przed** rozpoczęciem, żeby przerwane zadanie pozostało
widoczne.

```
REQ     | 2026-01-14 | SCOUT | <the order, in the Operator's words where possible> | <status note>
DONE    | 2026-01-14 | SCOUT | <the order> | evidence: outbox/20260114-090312-lease-rates.md
BLOCKED | 2026-01-14 | SCOUT | <the order> | <what is blocking, one line>
REFUSED | 2026-01-14 | SCOUT | <the order> | <why, one line + where the reasoning lives>
```

**Wiersz `DONE` bez ścieżki dowodu jest nieważny.** Jeśli nie ma pliku, praca nie wylądowała nigdzie, gdzie
Operator mógłby ją zobaczyć. Samoopis to `[CLAIMED]`; to plik czyni go `[PROVEN]`.

**Odmowa należy tu na stałe.** Tak flota przestaje podważać sprawy rozstrzygnięte. Nie usuwaj jej później.

**Uczciwa granica:** ten indeks niczego nie obserwuje. Jest dokładnie tak kompletny jak agenci, którzy do
niego piszą. Brak zadania nie jest dowodem, że zadanie nigdy nie miało miejsca — tylko że nikt go nie
zapisał. Traktuj wiersz jako *twierdzenie z dołączoną ścieżką dowodu*, nigdy jako dowód. Sprawdź, czy plik
dowodu istnieje, zanim zaufasz jakiemukolwiek `DONE`.

---

## 4. Ukończenie to zobaczenie przez Operatora

Nie ogłoszenie przez agenta. Odpowiedź nie jest punktem zatrzymania: monitory pozostają przez nią uzbrojone,
praca trwa, a potem następuje świadome wylogowanie.

---

## 5. Kontrreguła, która przeważa nad kierowaniem

**Zatrzymanie awaryjne i szczerość nadal idą do człowieka, natychmiast i w widocznym miejscu.**

Niepowodzenie pokazuje się równie widocznie jak sukces. Kierowanie wyjścia do plików nigdy nie może stać się
miejscem zakopywania złego wyniku. Jeśli dobre wieści floty trafiają na czat, a złe do pliku, którego nikt
nie otwiera, kontrakt został odwrócony i flota kłamie teraz przez kierowanie.

---

## 6. Uczciwa granica samego kontraktu

Agent działający wewnątrz uprzęży czatu i tak wypisuje tekst asystenta w tym czacie — ten kontrakt nie może
przekierować uprzęży. Wiąże natomiast **to, co agent wybiera do zapisania**: treść w plikach, a tekst czatu
ograniczony do krótkiego wskaźnika — *„zapisano do `<path>`, pokazano na konsoli”* — nigdy pełny raport.

---

## 7. Żadna tajemnica nie dociera na powierzchnię

`surface/` czyta konsola i może zostać wyświetlona na ekranie, na zrzucie albo we współdzielonym oknie.
Reguły stref danych ([`06-DATA-ZONES.md`](06-DATA-ZONES.md)) obowiązują tu w pełni.
