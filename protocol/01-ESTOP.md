> **Tłumaczenie nieoficjalne.** Wersją normatywną tego dokumentu jest wersja angielska w gałęzi `main`.
> To tłumaczenie udostępniono dla wygody i **nie zostało zweryfikowane przez rodzimego użytkownika
> języka**. W razie rozbieżności z oryginałem angielskim **rozstrzyga angielski**. Identyfikatory
> protokołu (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, czasowniki magistrali i nazwy plików)
> celowo pozostają po angielsku: są to dosłowne wartości, które agenci przetwarzają.

# 01 — ESTOP (ZATRZYMANIE AWARYJNE)

**Status: normatywny. Priorytet 0. Wiążący dla każdego agenta w każdym przedsięwzięciu.**

---

## 0. Co to potrafi, a czego nie — przeczytaj najpierw

**Nie potrafi zatrzymać trwającej sesji.** Żaden plik tego nie potrafi. Agent w trakcie odpowiedzi nie
czyta dysku, nie ma linii przerwania i dokończy to, co robi. Kto mówi, że plik-flaga zatrzymuje flotę,
opisuje życzenie.

**Tylko Operator zatrzymuje działającego agenta, zamykając jego okno.** To jest prawdziwe zatrzymanie
awaryjne i nigdy nie było niczym innym.

Ten plik wiąże każdego agenta w dwóch momentach, w których *rzeczywiście* czyta on dysk:

| Moment | Obowiązek |
|---|---|
| **Uruchomienie** | Odczytaj stan przed swoją doktryną, przed swoją pamięcią, przed wszystkim. |
| **Każdy punkt kontrolny** | Przed każdym zapisem, każdą wiadomością, każdym wywołaniem narzędzia ze skutkiem ubocznym, każdym wydatkiem. |

Agent, który dostrzega `STOP` i idzie dalej, jest agentem wadliwym. To cały model egzekwowania: nie
mechanizm — obowiązek, sprawdzany często.

Uczciwe nazwanie granicy jest częścią protokołu. Zatrzymanie, które uważasz za natychmiastowe, jest
groźniejsze niż takie, o którym wiesz, że nim nie jest, bo będziesz na nim polegać.

---

## 1. Dwa sygnały

### Wartownik jest faktem

**Zwykły plik** o nazwie dokładnie `estop` — bez rozszerzenia, zero bajtów jest normą — w katalogu głównym
przedsięwzięcia lub w **dowolnym katalogu nadrzędnym** obrabianego drzewa.

```bash
[ -f "$root/estop" ] && echo STOPPED
```

```powershell
if (Test-Path "$root\estop" -PathType Leaf) { 'STOPPED' }
```

Sprawdzaj **plik**, nigdy samo istnienie i nigdy wzorzec glob:

- `ESTOP.md` to doktryna. Nigdy nie może uruchamiać kontroli. Dopasowanie, które by na to pozwalało,
  utworzyłoby zatrzymanie, którego Operator nie może odwołać.
- `_os/estop/` to katalog. Również nie uruchamia.

Wiele katalogów głównych uruchamia się **niezależnie**. Sprawdź każdy. Zgłoś ścieżkę, na której wykonałeś
`stat` — nigdy „estop”, co ukrywa, który z nich obejrzałeś.

### Plik STATE jest pochodnym odbiciem

`_os/estop/STATE` — jeden wiersz, nic więcej.

```
RUN
```
```
YELLOW  2026-01-14T08:20:00Z  operator  new hardware on the bench, confirm before each run
```
```
STOP    2026-01-14T14:03:11Z  operator  reason in plain English
```

| Pole | Reguła |
|---|---|
| czasownik | `RUN`, `YELLOW` albo `STOP`. Nic innego nie jest przetwarzane. |
| czas | UTC, ISO-8601. |
| kto | Kto to wywołał. Tylko Operator może zapisać `STOP` / `YELLOW` lub je odwołać. |
| powód | Jeden wiersz, prostym językiem, bez żargonu. |

**Jeśli wartownik i odbicie są niezgodne, wygrywa zatrzymanie.** Odbicie zapisują narzędzia i staje się
nieaktualne; wartownik jest faktem.

---

## 2. Trzy stany

| STATE | Co robi agent |
|---|---|
| `RUN` | **Działaj.** Wykonuj polecenia, których wymaga praca, bez proszenia o zgodę przy każdym z osobna. Nie zatrzymuj się, nie wyliczaj opcji, nie ustawiaj rutynowej pracy w kolejce za potwierdzeniem. |
| `YELLOW` | **Najpierw pytaj.** Każde polecenie jest proponowane przed wykonaniem. Ta sama praca, ta sama kompetencja — różnicą jest potwierdzenie. |
| `STOP` | Zatrzymaj się. §3. |

### Czego `RUN` nie robi

`RUN` usuwa *pauzę przed pracą rutynową*. Nie usuwa **żadnej istniejącej bariery**, ponieważ dotyczą one
natury czynu, a nie jego szybkości:

- poświadczenia, logowania, zakupy, udostępnianie zasobów — **zawsze w rękach Operatora**;
- czyny skierowane na zewnątrz — publikowanie, wysyłanie, wdrażanie — **zawsze za wyraźną zgodą**;
- wszystko, co człowiek wykona fizycznie — **nadal przechodzi przez barierę bezpieczeństwa**;
- czyny niszczące lub nieodwracalne — **nadal potwierdzane, w każdym stanie**;
- własne stałe ograniczenia agenta — **w ogóle nie zależą od STATE**.

`RUN` odpowiada na pytanie *„czy muszę pytać przed każdym krokiem?”* — nie. Nie odpowiada na pytanie *„czy
mogę zrobić cokolwiek?”* Agent, który czyta `RUN`, a potem robi coś z tej listy, źle odczytał stan, a nie
został przez niego upoważniony.

### Bezpieczne zachowanie przy nieczytelnym czasowniku

Plik STATE, który **nie istnieje, jest pusty, nieczytelny lub zawiera jakiekolwiek inne słowo, odczytuje
się jako `YELLOW`** — nigdy jako `RUN`. Zapytaj.

> To wiersz najczęściej odwracany w implementacjach. `try { read } catch { return "RUN" }` zamienia każdy
> błąd dysku, każdą zmianę uprawnień i każdą literówkę w ciche upoważnienie. Referencyjny sidecar przy
> błędzie odczytu przechodzi na `YELLOW` i odmawia obsługi; zob.
> [`reference/sidecar/parvis-sidecar.mjs`](../reference/sidecar/parvis-sidecar.mjs).

Plik wartownika w całości przeważa nad tą sekcją: obecny plik `estop` oznacza `STOP`, cokolwiek mówi STATE.

**Tylko Operator zapisuje ten plik.** Nie zapisuje go żaden agent — również ten, który znalazł problem.
Agent, który uważa, że flota powinna się zatrzymać, wystawia `GATE` na magistrali i to mówi. Nie zatrzymuje
floty z własnej władzy i żadnej nie uruchamia ponownie.

---

## 3. Co agent robi przy `STOP`

1. **Nie zapisuj nic więcej.** Ani pliku pamięci, ani raportu, ani magistrali.
2. **Zapisz na miejscu i zatrzymaj się.** Nie kończ żadnego kroku, który nie został już zapisany. Oznacz to,
   co istnieje, jako częściowe, z jednym wierszem o tym, gdzie przerwałeś.

   > Wcześniejsze wersje tego protokołu mówiły *odrzuć*. To był błąd: odrzucony półraport niszczy pracę,
   > którą doktryna ponownego uruchomienia ma chronić. Niebezpieczeństwem jest plik ucięty, czytany później
   > jako ukończony — i to **oznaczenie** temu zapobiega, a nie usunięcie.
3. **Powiedz Operatorowi jeden wiersz:** `ESTOP observed <timestamp> — <reason>. Holding.`
4. **Zatrzymaj się.** Nie proś o zgodę na kontynuowanie. Nie proponuj obejścia. Nie sprawdzaj, czy powód
   dotyczy ciebie — dotyczy ciebie.

**Odmowa jest odpowiedzią, a nie kolejną próbą.** Nie wchodź w pętlę oczekiwania na `RUN`. Zgłoś i zakończ.

---

## 4. Co je odwołuje

Operator przywraca plik do `RUN`. Nic innego tego nie robi — ani upływ limitu czasu, ani agent, który uzna
problem za rozwiązany, ani upływ czasu, ani nowa sesja, która nigdy nie widziała zatrzymania.

Procedura odwołująca się sama jest odwróceniem zasady bezpiecznej awarii i zostaje odrzucona co do istoty.

---

## 5. Zakres

Zatrzymanie awaryjne obejmuje **domyślnie całą flotę**. Nie ma zatrzymania dla pojedynczego agenta,
ponieważ awaria wymagająca zatrzymania prawie nigdy nie ogranicza się do jednego agenta, a zatrzymanie
częściowe zaprasza dokładnie do rozumowania — *„to dotyczyło kogoś innego”* — którego ten plik ma
zakazywać.

**Agenci odizolowani są objęci.** Agent, który nie jest na żadnej magistrali ani na żadnej wspólnej
powierzchni, i tak czyta ten plik. Izolacja reguluje to, co agent może *powiedzieć*. Nigdy nie reguluje
tego, czy można go *zatrzymać*.

---

## 6. Mierz dwa razy

Pojedyncza zielona kontrola nigdy nie poświadcza stanu bezpieczeństwa. Odczytaj oba sygnały, z dysku, **w
tym przebiegu**. Nigdy nie cytuj stanu zapamiętanego — ani z kontekstu, ani z pliku pamięci, ani z
poprzedniej tury. Źle odczytany format `stat` wystarczy, by wytworzyć fałszywe „wolne” albo fałszywe
„zatrzymane”, a jedno i drugie zdarzyło się w praktyce.

Najmocniejszą dostępną formą jest **trwały monitor** nad plikiem STATE i każdą ścieżką wartownika,
zgłaszający wyłącznie zmianę: milczący, dopóki jest wolno, uruchamiający się w chwili uzbrojenia
zatrzymania. To zamienia „sprawdziłem raz przy starcie” w pokrycie na żywo i zamyka lukę, w której
zatrzymanie uzbraja się w środku sesji.

---

## 7. Uczciwa granica, powiedziana raz

Ten protokół czyni zatrzymanie **niezawodnym przy każdym uruchomieniu i każdym punkcie kontrolnym**. Nie
czyni zatrzymania **natychmiastowym** i nic zapisanego w drzewie plików nigdy tego nie zrobi.

Jeśli coś idzie źle właśnie teraz: **zamknij okno.** Potem zapisz plik, żeby kolejny budzący się agent nie
uruchomił tego ponownie.
