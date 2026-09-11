> **Tłumaczenie nieoficjalne.** Wersją normatywną tego dokumentu jest wersja angielska w gałęzi `main`.
> To tłumaczenie udostępniono dla wygody i **nie zostało zweryfikowane przez rodzimego użytkownika
> języka**. W razie rozbieżności z oryginałem angielskim **rozstrzyga angielski**. Identyfikatory
> protokołu (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, czasowniki magistrali i nazwy plików)
> celowo pozostają po angielsku: są to dosłowne wartości, które agenci przetwarzają.

# 07 — WARSTWA INTERFEJSU

**Status: normatywny.** To plik, od którego projekt wziął nazwę.

Każda powierzchnia, której dotyka człowiek, to **Parvis**. Widok hali tylko do odczytu to *Parvis HMI*;
menu kafelkowe, z którego prowadzisz flotę, to *Parvis Console*.

---

## 1. Reguła, dzięki której HTML działa

> Strona przeglądarki to **ekran i klawiatura**, a nie program z dostępem do dysku.

Ten jeden fakt rządzi całą warstwą:

- **Strona pokazuje i zbiera.** Przedstawia stan i przyjmuje dane wejściowe. Otwarta ze ścieżki pliku, sama
  z siebie **nie potrafi odczytać drzewa ani zapisać zlecenia.** Piaskownica przeglądarki zabrania obu, i to
  jest zaleta.
- **Sidecar stanowi most.** Mała usługa pętli zwrotnej — związana z `127.0.0.1` i niczym więcej — jest
  jedynym, co odczytuje drzewo na rzecz strony i zapisuje to, co strona przesyła. Strona pobiera stan przez
  `GET`; strona wysyła prompt przez `POST`; sidecar wykonuje pracę na dysku. **Bez sidecara nie ma żywego
  Parvisa — jest tylko migawka.**
- **Nic nie omija przeglądu.** Prompt wysłany z Parvisa jest **wprowadzeniem, a nie wykonaniem.** Sidecar
  zapisuje wiersz `REQ` w indeksie zadań i zatrzymuje się. Nigdy nie uruchamia agenta, nigdy nie wykonuje
  polecenia, nigdy nie wysyła. Zatwierdzenie nowej pracy pozostaje naciśnięciem klawisza przez Operatora.

Dlatego strona „działa”: strona jest uczciwa co do tego, że jest oknem, sidecar wykonuje małą prawdziwą
pracę na krawędzi, a **przegląd nadal stoi między promptem a poruszającą się maszyną.**

---

## 2. Wymagania twarde — każda powierzchnia Parvis

1. **Samowystarczalna.** Jeden plik HTML: CSS i JS w treści, żadnych skryptów zewnętrznych, żadnego CDN.
   Wyłącznie czcionki webowe z prawdziwym stosem zapasowym. Musi wyświetlać się offline ze ścieżki pliku.

2. **Kolory są stanem, odczytywanym na żywo, nigdy udawanym.** Zielony = działa, bursztynowy = najpierw
   zapytaj, czerwony = zatrzymane — wyprowadzone z pliku STATE i z żywego rejestru. **Wartość bez żywego
   źródła pokazuje `—`, nigdy prawdopodobnie wyglądającą liczbę.** Czerwony przeważa nad każdym innym
   kolorem i nad całym interfejsem.

3. **Sidecar działa wyłącznie na pętli zwrotnej i nie przechowuje żadnej tajemnicy, którą strona mogłaby
   zobaczyć.** Żaden klucz API, żadne poświadczenie, żaden wartościowy token nie dociera do przeglądarki.
   Sidecar uwierzytelnia stronę lokalnym tokenem sesji i sam wykonuje pracę uprzywilejowaną. **Strona nigdy
   nie przechowuje niczego, co warto ukraść.**

4. **Migawkę oznacza się jako migawkę,** wraz z czasem odczytu. Tylko strona rozmawiająca z żywym sidecarem
   może przedstawiać się jako żywa. Nieaktualna strona, która wygląda na żywą, jest gorsza niż brak strony.

5. **Zatrzymanie awaryjne przeważa nad interfejsem.** Przy `STOP` Parvis niczego nie wprowadza, a sidecar nie
   zapisuje nic poza wierszem wylogowania. **Czerwona hala nie przyjmuje zleceń.**

6. **Marka Parvis i żadnych nazw firm trzecich.** Od jakichkolwiek rzeczywistych systemów nauczono się tego
   wzorca, wzorzec jest twój i nazywa się Parvis. Powierzchnia rozpowszechniająca cudzą nazwę handlową jest
   błędna i podlega poprawie.

---

## 3. Wymagania bezpieczeństwa dla sidecara

Usługa HTTP na pętli zwrotnej na stacji deweloperskiej to prawdziwa powierzchnia ataku. Te punkty nie są
opcjonalne.

| Wymaganie | Dlaczego |
|---|---|
| **Wiąż `127.0.0.1` wprost**, nigdy `0.0.0.0` | Związanie wszystkich interfejsów publikuje konsolę twojej floty w sieci lokalnej. |
| **Sprawdzaj nagłówek `Host`** wobec listy dozwolonej `127.0.0.1:<port>` / `localhost:<port>` | Pokonuje DNS rebinding, którym odwiedzana strona sięga do usługi na pętli zwrotnej. |
| **Odrzucaj żądania z `Origin`, którego nie wystawiłeś** | Ta sama klasa ataku, inny wektor. |
| **Wymagaj tokenu sesji** na każdej trasie zmieniającej stan, wystawianego przy ładowaniu strony, nigdy niezapisywanego w dzienniku | Strona dowodzi, że jest twoją stroną. |
| **Umieść na liście dozwolonej każdą ścieżkę**, którą usługa odczyta lub zapisze, a potem rozwiąż ją ponownie i potwierdź zawieranie | Pokonuje przechodzenie po ścieżkach. Sama lista dozwolona nie wystarczy, gdy istnieją dowiązania symboliczne. |
| **Przy nieczytelnym estop zawodź bezpiecznie** — odmów, nie wracaj do `RUN` | Zob. [`01-ESTOP.md`](01-ESTOP.md) §2. |
| **Żadnego `eval`, żadnego wywołania powłoki, żadnego wstawiania danych użytkownika do szablonów** | Pasek promptu to pole wprowadzania, a nie wiersz poleceń. |

Implementacja referencyjna w [`reference/sidecar/`](../reference/sidecar/) realizuje wszystkie te punkty i
jest opatrzona komentarzem w miejscu każdego z nich.

---

## 4. Czym są powierzchnie

| Powierzchnia | Co | Stan |
|---|---|---|
| **Parvis Console** | Panele z zakładkami — stan, dokumenty, rejestr, magistrala, powierzchnia, ustawienia | Dostarczana. |
| **Parvis Floor** | Zakładka Magazyn: hala 3D, obracanie i schodzenie w głąb, sterowanie sprzętem | Dostarczana. Zob. [`09-FLOOR.md`](09-FLOOR.md). |
| **Pasek promptu** | Pole wprowadzania, na konsoli i przy każdym sprzęcie hali | Dostarczany. |
| **Sidecar** | Most na pętli zwrotnej: czyta drzewo, zapisuje wiersze `REQ`, nie przechowuje tajemnic | Dostarczany. |

**Dostarcz najpierw panele.** Hala 3D to część, którą każdy chce zbudować, i część, która bez rejestru pod
spodem jest bezwartościowa — przedstawia stan wytwarzany przez resztę protokołu, a na pustym drzewie
poprawnie nie pokazuje nic.

---

## 5. Stanowisko

- **Strona czyta. Sidecar zapisuje. Operator zatwierdza.**
- Żadna powierzchnia nie uruchamia, nie wysyła, nie wdraża ani nie odwołuje zatrzymania awaryjnego.
- Żadna tajemnica nigdy nie dociera do przeglądarki.
- Wyjście trafia do plików i na konsolę, nie do okna czatu
  ([`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)).
