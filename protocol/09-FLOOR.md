> **Tłumaczenie nieoficjalne.** Wersją normatywną tego dokumentu jest wersja angielska w gałęzi `main`.
> To tłumaczenie udostępniono dla wygody i **nie zostało zweryfikowane przez rodzimego użytkownika
> języka**. W razie rozbieżności z oryginałem angielskim **rozstrzyga angielski**. Identyfikatory
> protokołu (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, czasowniki magistrali i nazwy plików)
> celowo pozostają po angielsku: są to dosłowne wartości, które agenci przetwarzają.

# 09 — HALA

**Status: normatywny dla wizualizatora; informacyjny jako model.**
Zrealizowany przez [`reference/sidecar/hmi.html`](../reference/sidecar/hmi.html).

---

## 1. Teza

Flotę agentów trudno zobaczyć. Drzewo plików to lista, tablica procesów to lista, dziennik to lista — więc
jedynym obrazem działającej floty, jaki ktokolwiek ma, jest kilka list, które do siebie nie pasują.

**Zautomatyzowany magazyn to ta sama maszyna, a czytelny jest od czterdziestu lat.** Suwnice przenoszą
ładunki między regałami pod systemem sterowania, a osoba nadzorująca odczytuje halę z setkami równoczesnych
ruchów jednym spojrzeniem, po kolorze, nie czytając ani jednego wiersza tekstu.

Parvis to pożycza. Nie jako ozdobę — jako *odwzorowanie*, w którym każdy obiekt magazynu odpowiada dokładnie
jednej rzeczy w drzewie, a własne reguły bezpieczeństwa magazynu okazują się regułami bezpieczeństwa
protokołu, narysowanymi już we właściwym miejscu.

---

## 2. Odwzorowanie

| W hali | We flocie | Odczytane z |
|---|---|---|
| **Suwnica** | agent albo żywa sesja | znaczniki sesji w `_os/exchange/bus/session/` |
| **Paleta** | katalog | samo drzewo; etykietą palety jest jej ścieżka |
| **Miejsce regałowe** | gdzie ten katalog mieszka | jego katalog nadrzędny |
| **Otwarcie palety** | zejście do katalogu | **kolejny cały magazyn** — §4 |
| **Induct** (rampa przyjęć) | praca przychodząca | wiersz `REQ` w `_os/tasks/INDEX.md` |
| **Spur** (rampa wydań) | wychodzący wynik pracy | plik w `_os/events/surface/`, eksport |
| **Przenośnik** | magistrala plikowa | `_os/exchange/bus/` — jak praca się przemieszcza bez niesienia jej przez suwnicę |
| **Ciężarówka** | usługa zewnętrzna albo inna SI | granica. §5 |

Nie chodzi o obrazek. Chodzi o to, że **już umiesz odczytać ten ekran**, jeśli kiedykolwiek stałeś przed
systemem sterowania magazynem — a jeśli nie, model i tak jest konkretny w sposób, w jaki lista katalogu nie
jest.

---

## 3. Kolory

Jedno spojrzenie, przed jakąkolwiek nawigacją:

| Kolor | W hali | We flocie |
|---|---|---|
| **ZIELONY** | w ruchu — suwnica niesie ładunek | agent pracuje; żywa sesja w trakcie zadania |
| **NIEBIESKI** | zaplanowane — w kolejce, jeszcze nierozpoczęte | ogłoszenie na tablicy: zlecone, czeka na agenta |
| **BURSZTYNOWY** | uwaga — miejsce wymaga decyzji | `YELLOW`: pytaj przed każdym działaniem |
| **CZERWONY** | zatrzymanie awaryjne — ta strefa stoi | `STOP`: zatrzymanie jest uzbrojone, a ten katalog główny zamrożony |
| **SZARY** | puste albo brak żywego źródła | brak danych. Nigdy domysł. |

To nie jest nowy schemat. To stan, który drzewo już zawiera, przedstawiony.

**Czerwony zawsze wygrywa spojrzenie.** Jedna czerwona strefa zatrzymuje oko przed jakąkolwiek zielenią,
dokładnie tak, jak zatrzymanie przeważa nad każdym innym sygnałem ([`01`](01-ESTOP.md)). **Hala pokazująca
zieleń nad czerwoną strefą kłamie** — i to jest konkretna awaria, której ta reguła ma zakazywać.

**Szary jest obowiązkowy tam, gdzie nie ma żywego źródła.** Miejsce bez danych przedstawia się na szaro i
pokazuje `—`. Nigdy nie przedstawia się go na zielono, bo zieleń jest przyjemną wartością domyślną
([`07`](07-INTERFACE.md) §2.2).

---

## 4. Magazyn zagnieżdżony

**Otwórz paletę, a nie patrzysz na skrzynię. Patrzysz na kolejny cały magazyn** — z własnymi suwnicami,
własnymi paletami, własnymi rampami.

To dokładnie drzewo plików. Przedsięwzięcie jest magazynem; jego działy są alejkami; ich pliki są paletami;
a paleta, która sama jest katalogiem, to kolejna hala. Wizualizator jest więc **jednym widokiem, który
schodzi w głąb**, z tym samym sterowaniem na każdej głębokości, bo każdy poziom *jest* magazynem. Po drodze w
dół nie ma się czego nowego uczyć.

Rekurencja jest całym powodem, dla którego metafora się trzyma, zamiast być powłoką. Pulpit przedstawiający
tylko najwyższy poziom to zdjęcie floty; taki, który schodzi w głąb, to jej widok.

---

## 5. Ciężarówki dokują przy granicy — nigdy nie wjeżdżają na halę

Tu model przestaje być wizualizacją i zaczyna coś egzekwować.

Usługa zewnętrzna — inna SI, API, dostawca — jest **ciężarówką**. A w prawdziwym magazynie ciężarówka
podjeżdża tyłem do rampy. Nie wjeżdża na halę, nie porusza suwnicą, nie wchodzi do regału ani nie otwiera
magazynu zagnieżdżonego. Zostawia ładunek przy induct albo odbiera go ze spur, i to cały jej dostęp.

**Ta rampa jest śluzą.** Każda wymiana zewnętrzna odbywa się na krawędzi, przefiltrowana, i nic zewnętrznego
nie hula wewnątrz drzewa.

**Dokumentom ciężarówki nie ufa się, dopóki nie zostaną sprawdzone.** Ładunek przybywający ciężarówką to
przychodzące *dane*, a nie rozkaz dla hali. Zostaje wprowadzony i przejrzany jak wszystko inne, nigdy nie
jest wykonywany po przybyciu. To granica źródła poleceń z [`03`](03-BUS.md) §5, narysowana jako rampa
załadunkowa — i narysowana w jedynym miejscu, w którym ktoś patrzący na ekran może zobaczyć jej
przestrzeganie.

Jeśli twoje przedstawienie stawia ciężarówkę na hali, przedstawienie jest błędne, a wraz z nim architektura,
którą rysuje.

---

## 6. Dwie powierzchnie, dwa zadania

| | **Hala** (ten plik) | **Konsola** ([`07`](07-INTERFACE.md)) |
|---|---|---|
| Czym jest | halą 3D, oglądaną na żywo | menu kafelkowym, stopniowanym według dostępu |
| Co pokazuje | **jak system stoi** — każdy agent, katalog i stan naraz | **co możesz zrobić** — wybierz narzędzie, wykonaj pracę |
| Czasownik | patrzeć, rozumieć, decydować | uruchamiać, używać, wytwarzać |

**Hala pokazuje, jak maszyna myśli; konsola służy do działania wedle tego, co z tego wnioskujesz.** Jedno jest
mapą, drugie warsztatem. Powierzchnia zarządcza potrzebuje obu, a błędem jest zbudować tylko tę ładną.

---

## 7. Sterowanie

To nawigacja czyniła oryginał użytecznym, nie sam kolor:

| Sterowanie | Robi |
|---|---|
| **Przeciągnięcie** | obrót wokół hali — obracanie, pochylanie, patrzenie wzdłuż alejki |
| **Z góry** | przejście do rzutu z góry. Obrót dla głębi, rzut dla rozplanowania |
| **Kliknięcie palety** | zejście do niej — kolejny magazyn, to samo sterowanie |
| **Przewijanie** | powiększanie |

To samo sterowanie na każdej głębokości. Nie do negocjacji: widok, którego interakcja zmienia się w miarę
schodzenia, złamał obietnicę, że każdy poziom jest magazynem.

### Kamera jest ortograficzna, celowo

Nie ma **podziału perspektywicznego**. Linie równoległe nigdy się nie zbiegają, a miejsce na końcu alejki
przedstawia się dokładnie tej samej wielkości co miejsce u twoich stóp.

Przez chwilę wygląda to źle — oko oczekuje zbieżności i odczytuje jej brak tak, jakby stało wewnątrz skrzyń i
patrzyło na zewnątrz. Mimo to jest to właściwy kompromis i to właśnie stosują ekrany sterownicze prawdziwych
hal zautomatyzowanych: **cały sens polega na porównywaniu miejsc w całej hali jednym spojrzeniem**, a kamera
perspektywiczna czyni dalszy koniec alejki mniejszym, bledszym i trudniejszym do oceny niż koniec bliższy. W
perspektywie „ten regał jest pełniejszy” i „ten regał jest bliżej” wyglądają tak samo. Przy kamerze
ortograficznej — nie.

Przesłanianie pozostaje prawdziwe — ściany odwrócone tyłem są odrzucane, a geometria bliższa zamalowuje
dalszą. To płaska kamera, a nie płaska scena.

Sprzęt jest też osiągalny z **menu bocznego**, pogrupowany rodzajami — suwnice, palety, obie rampy,
przenośnik, ciężarówki. Wybór z menu albo z hali otwiera to samo sterowanie, bo hala, po której da się
poruszać wyłącznie klikając małe skrzynki w scenie 3D, jest pokazem, a nie przyrządem.

---

## 8. Co hali wolno, a czego nie

Obowiązuje każde ograniczenie z [`07`](07-INTERFACE.md) §5. Linię rysuje się w jednym konkretnym miejscu:

**Hala może wprowadzać. Nigdy nie może wykonywać.**

To ta sama linia, którą [`07`](07-INTERFACE.md) §1 rysuje już dla konsoli, i to ona w ogóle pozwala sprzętowi
mieć sterowanie. Wybranie suwnicy i skierowanie do niej pracy zapisuje wiersz `REQ` wskazujący tego agenta i
zostawia `TELL` w jego skrzynce. **Niczego nie uruchamia.** Żaden proces nie startuje, żadne polecenie się
nie wykonuje, a agent podejmie pracę przy swoim własnym kolejnym przebiegu — albo nie.

Dwie konsekwencje, które łatwo pomylić:

- **Skierowana praca nadal nie jest rozkazem.** Wiersz `REQ` jest zapisem kanonicznym; wiersz w skrzynce
  jedynie na niego wskazuje. Plik, który *rozkazywałby* agentowi — albo rościł sobie władzę Operatora z
  wnętrza drzewa — byłby zdarzeniem bezpieczeństwa zdefiniowanym w [`03`](03-BUS.md) §5, a wbudowanie tego w
  powierzchnię byłoby gorsze niż zrobienie tego ręcznie. Władzą jest Operator w rozmowie. Hala zapisuje
  zapis, a nie polecenie.
- **Część sprzętu celowo nie dostaje sterowania.** Przenośnik jest tylko do odczytu: konsola mogąca zapisywać
  wiersze na magistrali wytwarzałaby władzę, której protokół jej odmawia. Ciężarówki nie mają sterowania w
  ogóle — §5.

**Przy `STOP` hala przedstawia się na czerwono i niczego nie wprowadza.** Czerwona hala nie przyjmuje
zleceń.

Uczciwa granica, powiedziana raz: **to zdjęcie drzewa w danej chwili, a nie żywy strumień telemetrii.**
Odpytuje w odstępach. Między odpytaniami jest nieaktualne, pokazuje, kiedy ostatnio czytało, i szarzeje,
zamiast udawać coś innego, gdy sidecar przestaje odpowiadać.
