> **Tłumaczenie nieoficjalne.** Wersją normatywną tego dokumentu jest wersja angielska w gałęzi `main`.
> To tłumaczenie udostępniono dla wygody i **nie zostało zweryfikowane przez rodzimego użytkownika
> języka**. W razie rozbieżności z oryginałem angielskim **rozstrzyga angielski**. Identyfikatory
> protokołu (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, czasowniki magistrali i nazwy plików)
> celowo pozostają po angielsku: są to dosłowne wartości, które agenci przetwarzają.

# 06 — STREFY DANYCH

**Status: normatywny.** Gdzie plikowi wolno mieszkać.

---

## 1. Dlaczego zakaz nie zadziałał

Pierwotna reguła brzmiała *„żadnych tajemnic, nigdy, nigdzie”* — **bez żadnego miejsca, w którym można by
zamiast tego trzymać dane prywatne.**

Zakaz bez miejsca docelowego nie jest przestrzegany. Jest obchodzony, a materiał prywatny trafia
przypadkiem do drzewa synchronizowanego. Zdarzało się to wielokrotnie, również za sprawą agenta, który sam
podlegał tej regule.

**Reguła jest decyzją o kierowaniu, a nie zakazem.**

---

## 2. Dwie strefy

| Strefa | Właściwość | Zawiera |
|---|---|---|
| **PUBLIC** | Synchronizuje się z chmurą. **Traktuj każdy bajt jako opublikowany.** | Doktryna, mandaty, definicje agentów, architektura, kontekst biznesowy, badania, dokumentacja techniczna |
| **PRIVATE** | **Poza każdym katalogiem synchronizacji** — i poza profilem użytkownika, żeby przekierowanie znanych folderów też tam nie sięgnęło | Tajemnice, prawdziwe osoby i ich dane osobowe, projekty i media prywatne, wszystko, czego znalezienie w kopii zapasowej byłoby niewłaściwe |

### Test

> *Czy byłby problem, gdyby to za rok znalazło się w migawce w chmurze?*

Tak → PRIVATE. Nie → PUBLIC. Przy rzeczywistej niepewności → **PRIVATE.** Kosztem zaklasyfikowania zbyt
wysoko jest niewygoda. Kosztu zaklasyfikowania zbyt nisko nie da się cofnąć.

### Wiedz, co naprawdę się synchronizuje

Sprawdź to na prawdziwej maszynie, nie z założenia. Na typowej stacji roboczej może działać naraz kilka
klientów synchronizacji, a wszystko w folderach dokumentów, pulpitu lub obrazów użytkownika opuszcza maszynę
i jest przechowywane w historii wersji przez tygodnie. **Usunięcie lokalne tego nie odwołuje.**

Dwie konsekwencje, z których każda powoduje realne awarie:

1. **Wyjście kompilacji musi być przekierowane** poza katalog synchronizacji, inaczej lustro uszkodzi je w
   trakcie budowania.
2. **Klucze mieszkają na zewnątrz**, celowo i domyślnie.

---

## 3. Wyjątek: poświadczenia nie należą do żadnej strefy

**Aktywne poświadczenia — hasła, klucze API, tokeny, klucze transmisji — należą do menedżera haseł, a nie do
żadnego z systemów plików.**

Strefa prywatna zawiera *dane prywatne*. Menedżer haseł zawiera *poświadczenia*. To nie pedanteria: katalog
prywatny nie jest domyślnie zaszyfrowany, a plik jest plikiem. W chwili, gdy któreś zostanie skopiowane,
zacytowane w zapisie rozmowy lub do czegoś dołączone, jest ujawnione.

**Opisuj właściwość bezpieczeństwa strefy prywatnej wąsko i nigdy jej nie wyolbrzymiaj.** Jej jedyną
udowodnioną właściwością jest zwykle to, że *nic jej nigdzie nie kopiuje*. Bez zweryfikowanego szyfrowania
całego dysku lub poszczególnych plików nie jest ona zaszyfrowana, nie ma kopii zapasowej i nie jest sejfem.

---

## 4. Klasyfikacja należy do Operatora i jest regulowalna

Trzymaj żywą tabelę w jednym pliku — `DATA-CLASSIFICATION.md` — w którym Operator przenosi kategorie między
strefami, a każdy agent go czyta, zamiast zgadywać.

Ten plik protokołu opisuje **mechanizm**. Tamten plik opisuje **politykę**. Gdzie oba są niezgodne, wygrywa
plik polityki.

---

## 5. Konsekwencje dla agentów

- **Żadnej tajemnicy w drzewie, które jest pakowane.** Pakiet kontekstu istnieje po to, by wkleić go do nowej
  sesji. Nazwij, co jest przechowywane i gdzie; nigdy wartość.
- **Żadna tajemnica nie dociera do `surface/`.** Jest wyświetlana na ekranie.
- **Żadna tajemnica nie dociera do przeglądarki.** Zob. [`07-INTERFACE.md`](07-INTERFACE.md) §3.
- **Zasłaniaj przez odniesienie, nie przez usunięcie.** `<api key — see password manager entry "acme-prod">`
  zachowuje odnajdywalność faktu bez ujawniania wartości.

---

## 6. Przycinanie bez straty

Zanim cokolwiek opuści drzewo robocze:

1. Skopiuj to do zapieczętowanego składu **poza katalogami głównymi** — do pliku archiwum, nieosiągalnego
   wzorcem glob.
2. Przygotuj ścieżki w `marked-deletion.md` / `marked-archive.md`.
3. **Wykonanie to ręka Operatora**, przy wyciszonym drzewie.

Nigdy nie usuwaj masowo przy aktywnej współbieżności.
