> **Tłumaczenie nieoficjalne.** Wersją normatywną tego dokumentu jest wersja angielska w gałęzi `main`.
> To tłumaczenie udostępniono dla wygody i **nie zostało zweryfikowane przez rodzimego użytkownika
> języka**. W razie rozbieżności z oryginałem angielskim **rozstrzyga angielski**. Identyfikatory
> protokołu (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, czasowniki magistrali i nazwy plików)
> celowo pozostają po angielsku: są to dosłowne wartości, które agenci przetwarzają.

# 05 — KOREKTA

**Status: normatywny.** Co się dzieje, gdy zapisany fakt okazuje się błędny.

---

## 1. Problem

> Fakt stwierdzony w sześciu plikach będzie błędny w pięciu z nich.

Poprawienie pliku, który akurat masz przed sobą, nie jest korektą. Tworzy drzewo, w którym prawda i błąd
mają oba swoje przypisy, a kolejna sesja bierze ten, który otworzy pierwszy. To charakterystyczny tryb
awarii floty agentów obciążonej dokumentacją i narasta on po cichu.

**Korekta się rozchodzi albo nie miała miejsca.**

---

## 2. Czytanie nie jest darmowe — zobowiązuje

Przeczytanie pliku nadrzędnego stawia cię pod nim. Wynikają z tego dwie rzeczy:

1. Wszystko, co jest w nim **trwałe, nieoczywiste i niewyprowadzalne z drzewa**, trafia do twojej pamięci
   trwałej przed końcem sesji.
2. **Jeśli twój kontekst przeczy plikowi, wygrywa plik.** Nie obchodź go. Popraw zapis.

---

## 3. Natychmiastowa Korekta Kursu (ICC)

Jedno polecenie, jedna tura, bez etapu propozycji.

```
/icc the planner meal times are placeholders, not the Operator's actual times
```

### Kolejność

**1 · Przeszukanie.** Wyprowadź z korekty od 2 do 5 haseł wyszukiwania: **stare** sformułowanie, jego
oczywiste warianty oraz występujące nazwy własne. Nie nowe sformułowanie. Wykonaj po jednym przeszukaniu
indeksowanym na hasło, zanim cokolwiek przeczytasz. Nigdy nie przechodź drzewa plik po pliku w poszukiwaniu
trafień — od tego jest indeks.

**2 · Sklasyfikuj każde trafienie.**

| Trafienie | Działanie |
|---|---|
| **Stwierdza stary fakt** | Przepisz je. |
| **Wspomina o nim mimochodem**, prawdziwe tak czy owak | Zostaw. Nie mieszaj w tekście. |
| **Przeczy nowemu faktowi pośrednio** — wniosek wtórny, wiersz tabeli, zaplanowane zadanie zbudowane na starej wartości | **Przepisz i to.** To przeoczane najczęściej. |
| **Poza granicami** (§5) | Nigdy nie edytuj. Odnotuj w *Left alone*. |

**3 · Przepisz, wszystko naraz.** Dopasuj się do istniejącego tonu każdego pliku i do jego konwencji
oznaczeń pewności. Poprawiony fakt zachowuje oznaczenie, na które zasługuje — **nie awansuj twierdzenia do
`[PROVEN]` dlatego, że jest teraz aktualne.** Jeśli stary tekst nosił datę, wstaw dzisiejszą.

Gdy fakt jest stwierdzony w więcej niż trzech plikach, to **powielenie, a nie nadmiarowość**: podaj go raz w
pliku, do którego należy, a pozostałe niech tam wskazują.

**4 · Rejestr i pamięć.** Oba, inaczej przebieg nie jest skończony. Dodaj wpis na początku rejestru korekt:

```
## 2026-01-14 — meal times are placeholders

Was      planner asserts 07:30 / 12:00 / 18:30 as the Operator's actual times
Now      those are defaults shipped with the template; real times are unknown
Why      Operator correction, 2026-01-14
Files    personal/planner/NOW.md:14, personal/planner/README.md:31, _os/tasks/INDEX.md:88
Memory   planner-meal-times.md (updated)
Left     backups/ (history), CONTEXT-BUNDLE.md (generated)
```

Następnie zapisz fakt do pamięci trwałej — **sprawdzając najpierw, czy istnieje już wpis pamięci na ten
temat, i aktualizując właśnie jego**, zamiast zostawiać dwie wersje faktu, który właśnie poświęciłeś
polecenie, by ujednolicić.

**5 · Obowiązki po edycji.** Uruchom ponownie generator lub kopię zapasową, do których edycje zobowiązały.
Przebuduj indeks, jeśli powstały lub zostały usunięte pliki.

---

## 4. Stała decyzja zostaje odwrócona jawnie

Jeśli korekta unieważnia stałą decyzję — wiersz „nie podważać ponownie”, pozycję `[PROVEN]`, regułę polityki
— **nie odwracaj jej po cichu.** Przepisz ją jako *odwróconą*, z datą i powodem, aby kolejna sesja wiedziała,
że została uchylona, a nie zapomniana.

Decyzja, która zmienia się bez śladu, jest nie do odróżnienia od decyzji, której nigdy nie podjęto.

---

## 5. Czego nigdy się nie przepisuje

| Nigdy nietykane | Dlaczego |
|---|---|
| `backups/`, `archive/` | Historia. Historii się nie poprawia; zostaje zastąpiona. |
| Pliki wygenerowane | Edytuj źródło i uruchom generator ponownie. |
| Drzewo agenta odizolowanego | Dostęp wyłącznie po wskazaniu. |
| Miarodajny kontekst nadrzędny innego katalogu głównego | Zgłoś rozbieżność. Nie edytuj przez granicę własności. |
| Wszystko, co zawiera tajemnicę | Całkowicie poza zasięgiem przeszukiwania tekstu. |

**Przeszukanie, które przepisuje tekst, zniszczy pliki binarne.** Ogranicz każde przeszukanie do rozszerzeń
tekstowych listą dozwoloną, nigdy przez wykluczanie.

---

## 6. Czego ICC nie robi

`/icc` poprawia zapis. **Nie idzie potem wykonywać pracy, którą korekta implikuje.** To odrębne czyny z
odrębnymi upoważnieniami, a ich mieszanie sprawia, że jednowierszowa korekta zamienia się w niesprawdzoną
przebudowę.

---

## 7. Fakty konkurencyjne rozstrzyga się i przycina — nie kataloguje

Gdy dwa pliki stwierdzają fakty sprzeczne, **zdecyduj, który jest prawdziwy, zachowaj go i usuń błędne
twierdzenia w tym samym przejściu.**

Raport o konflikcie, który zostawia obu konkurentów na dysku, niczego nie rozwiązał. Kolejna sesja i tak
bierze plik, który otworzy pierwszy, a reguła bezpieczeństwa z pięcioma krążącymi wersjami jest *mniej*
wiarygodna niż z jedną, a nie bardziej.

**Rozstrzygaj co do istoty, nigdy po znaczniku czasu.** Zwycięzcą jest plik, do którego fakt należy, wersja
poparta pomiarem, ta, która wytrzymuje badanie. **Najnowsze nie znaczy najprawdziwsze** — kanoniczną awarią
są tu cztery zduplikowane pliki pamięci zapisane w odstępie dziewięćdziesięciu sekund, w których najnowszy
zawierał fałszywe twierdzenie, więc reguła „wygrywa najnowszy” odziedziczyłaby błąd.

**Zapisz rozstrzygnięcie.** Który fakt wygrał, co przycięto i dlaczego — w rejestrze, aby przycinanie było
czytelne, a nie ciche. Konkurent, który znika bez śladu, wygląda identycznie jak konkurent, którego nigdy nie
było, a kolejna sesja tworzy go na nowo.

### Co mimo to jest eskalowane zamiast rozstrzygane

Trzy przypadki. Pokaż je; nie rozstrzygaj:

- Sprzeczność zależy od informacji, których agent nie posiada.
- Pomyłka byłaby **niebezpieczna lub nieodwracalna** — cokolwiek ze szczebli 0–2.
- Twierdzenie przegrywające leży **poza granicą własności agenta** — miarodajny kontekst nadrzędny innego
  katalogu głównego. Zgłoś rozbieżność; nie edytuj przez granicę.

Wszystko zwyczajne zostaje rozstrzygnięte i uporządkowane.
