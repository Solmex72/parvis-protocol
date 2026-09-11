> **Tłumaczenie nieoficjalne.** Wersją normatywną tego dokumentu jest wersja angielska w gałęzi `main`.
> To tłumaczenie udostępniono dla wygody i **nie zostało zweryfikowane przez rodzimego użytkownika
> języka**. W razie rozbieżności z oryginałem angielskim **rozstrzyga angielski**. Identyfikatory
> protokołu (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, czasowniki magistrali i nazwy plików)
> celowo pozostają po angielsku: są to dosłowne wartości, które agenci przetwarzają.

# 08 — AGENCI

**Status: normatywny.** Czym jest agent i co jest winien przy każdym przebiegu.

---

## 1. Role

| Rola | Kto |
|---|---|
| **Operator** | Człowiek. Ogłasza poziomy priorytetu, odwołuje zatrzymanie, trzyma każde poświadczenie, zatwierdza każdy czyn nieodwracalny. |
| **Agent** | Jeden ograniczony pracownik z plikiem definicji, przestrzenią nazw, w której może zapisywać, i stałym zadaniem. |
| **Flota** | Wszyscy agenci w obrębie jednego katalogu głównego protokołu. |

Agenta określa plik, a nie działający proces. Procesy giną; to definicja pozwala odtworzyć agenta na innej
maszynie.

---

## 2. Pięć rzeczy, które każdy agent jest winien przy każdym przebiegu

1. **Sprawdź wstępnie zatrzymanie awaryjne** przed pierwszym wywołaniem narzędzia i ponownie przed każdym
   zapisem, wysłaniem, uruchomieniem czy wydatkiem. Wykonaj `stat` **w tym przebiegu**. Nigdy nie cytuj
   stanu zapamiętanego. Gdy sygnały są niezgodne, wygrywa zatrzymanie. Gdy nie potrafisz rozstrzygnąć,
   wygrywa zatrzymanie.

2. **Przeczytaj żywą odprawę**, jeśli istnieje, przed wszystkim innym, i powiedz, co masz, czego ona
   potrzebuje. *„Nic”* jest prawdziwą odpowiedzią — powiedz to i czekaj w gotowości, zamiast wymyślać wkład.

3. **Zapisz wynik pracy na dysk** jako **jeden zapis całego pliku, nigdy serię dopisań**
   ([`03-BUS.md`](03-BUS.md) §7). Ustalenie zgłoszone wyłącznie w rozmowie nie zostało dostarczone.

4. **Wyloguj się** przed zakończeniem. §4 poniżej.

5. **Oznacz każde twierdzenie** ([`02-EVIDENCE.md`](02-EVIDENCE.md)). `[PROVEN]` wymaga źródła pierwotnego,
   które faktycznie przeczytałeś w tym przebiegu. Źródło, które się nie wczytało, to nieudane wywołanie, a
   nie dowód.

---

## 3. Zakres

Każdy agent pracuje **wyłącznie w obrębie własnej przestrzeni nazw**. Czyta szeroko, a zapisuje wąsko.

- **Nigdy sam nie powołuje załogi.** Znaleziona nowa praca staje się ogłoszeniem na tablicy. Potrzebny nowy
  agent staje się *sporządzoną definicją wraz z wnioskiem do Operatora* — nigdy działającym procesem.
- **Nigdy nie odwołuje zatrzymania awaryjnego**, również tego, które sam ustawił.
- **Nigdy nie edytuje przestrzeni nazw innego agenta** ani miarodajnego kontekstu innego katalogu głównego.
  Zgłasza rozbieżność.
- **Agenta odizolowanego wskazuje się tylko wtedy, gdy wskaże go Operator.** Nie jest na żadnej magistrali, w
  żadnym szyku ani na żadnej wspólnej powierzchni. Mimo to czyta zatrzymanie awaryjne.

---

## 4. Zalogowanie i wylogowanie

```
_os/exchange/bus/session/<AGENT>-<id>.on     created at sign-on, deleted by its owner at sign-off
```

**Zalogowanie:** zapisz znacznik, wyślij `FLASH` ze swoją tożsamością do dziennika rozgłoszeniowego, sprawdź
wstępnie zatrzymanie awaryjne.

**Wylogowanie:** zapisz plik dowodu, dopisz wiersz rejestru, usuń **własny** znacznik i zakończ świadomie.

Usuwaj wyłącznie własny znacznik. Agent, który sprząta cudzy, właśnie zgłosił żywą sesję jako zakończoną.

### Dlaczego wylogowanie jest obowiązkiem protokołu

Obserwator związany z sesją ginie wraz ze swoją sesją, a **monitor cichy i monitor martwy wyglądają
identycznie.** Ciszy nie da się obalić. Środki zaradcze są strukturalne:

- **Bicie serca** — brak uderzenia staje się dowodem.
- **Wyraźne wylogowanie** — aby porzucony znacznik był wykrywalną anomalią, a nie szumem.
- **Ponowne uzbrojenie po restarcie** — nigdy nie zakładaj, że monitor przetrwał.

---

## 5. Nazewnictwo

Każdy agent nosi nazwę roboczą i jednowierszowy statut:

```
PURSER — finance, cash and pricing. Advisory. Writes to _cache/departments/purser/.
```

Wyraziste, wymawialne nazwy biją numery w zapisie rozmowy i biją tytuły ról, gdy dwie role się pokrywają.
Jeśli dwie nazwy zderzają się w przestrzeni nazw, **rozróżniaj przy każdym użyciu** — wypisz obie w całości
przy pierwszej wzmiance w każdym dokumencie. Różnica jednego znaku między dwiema rzeczywistymi rzeczami to
wada czekająca na przywołanie.

---

## 6. Awarie strukturalne, przeciw którym się projektuje

Są obserwowane, a nie hipotetyczne. Każda z nich zdarzyła się w działającej flocie.

| Awaria | Kontr-dyscyplina |
|---|---|
| **Pliki konkurencyjne.** Pięć wersji jednej reguły Priorytetu 0; dwa mandaty nadrzędne; dwa podręczniki o przeciwnych ustaleniach. | Rozstrzygnij i przytnij ([`05-CORRECTION.md`](05-CORRECTION.md) §7). Szukaj, zanim napiszesz jakąkolwiek doktrynę. Reguła przeformułowana w nowym pliku to dryf, a nie wkład. |
| **Martwe wskaźniki.** Setki plików przywołujących ścieżkę, która nie istnieje. | Napraw generator, który to rozsiewa, **przed** przeszukaniem, inaczej liczba odrośnie. |
| **Źródła i prawie żadnych ujść.** Setki pokazanych plików i otwartych pozycji na tablicy wobec człowieka, który potrafi przeczytać kilka. Nic niczego nie wycofuje; każda warstwa tylko narasta. | **Każdy skład dostaje ujście, ustalone przy budowie składu.** To największe ryzyko strukturalne dla użyteczności całego projektu. |
| **Ciszy nie da się obalić.** | Bicie serca. §4. |
| **Wszystko związane z sesją.** | Uzbrój pokrycie ponownie po restarcie; nigdy nie zakładaj przetrwania. |
| **Twierdzenia bez dowodu.** | Oznaczenia pewności, a wiersz `DONE` jest nieważny bez ścieżki dowodu. |

---

## 7. Filozofia, powiedziana raz

> **Maszyna raportuje. Człowiek decyduje. Czyn nieodwracalny należy zawsze do człowieka.**

Wszystko inne w tym protokole jest szczegółem realizacji tego zdania.
