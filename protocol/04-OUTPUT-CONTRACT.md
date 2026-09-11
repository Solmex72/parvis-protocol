> **Neoficiální překlad.** Normativní verzí tohoto dokumentu je anglická, ve větvi `main`. Tento překlad
> je poskytnut pro pohodlí a **nebyl ověřen rodilým mluvčím**. Při rozporu s anglickým originálem **má
> přednost angličtina**. Identifikátory protokolu (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`,
> slovesa sběrnice a názvy souborů) jsou záměrně ponechány anglicky: jsou to doslovné hodnoty, které
> agenti zpracovávají.

# 04 — VÝSTUPNÍ SMLOUVA

**Stav: normativní.** Kam jde práce, když je hotová.

---

## 1. Pravidlo

**Nehlaste do chatu. Pracujte ve stromu souborů, zapište výstup na disk a vystavte ukazatel.**

Agent, který skončí tím, že napíše dlouhou odpověď do okna chatu, uložil svůj výstup tam, kde jej nic jiného
ve flotile nemůže přečíst — žádný jiný agent, žádný monitor, žádná konzole, žádná další relace. Soubor je
trvalý záznam; chat je přepis, který nikdo dále po proudu nevidí.

---

## 2. Kam jde výstup

| Druh výstupu | Přistane v |
|---|---|
| Výsledek práce, zjištění, zpráva | odpovědný soubor, nebo `outbox/YYYYMMDD-HHMMSS-<slug>.md` |
| Cokoli, co má Operátor vidět teď | krátký soubor-ukazatel v `_os/events/surface/` |
| Žádost, která vyžaduje Operátora | `_os/exchange/requests/REQ-<slug>.md` |
| Řádek rejstříku | `_os/tasks/INDEX.md` |

**Adresář `surface/` je upozornění. Soubor je podstata.** Zapište podstatu na její vlastní místo a pak
zanechte jednořádkový ukazatel v `surface/`, aby konzole ukázala Operátorovi, kam přistála.

---

## 3. Rejstřík úkolů

Jeden řádek na příkaz. Připojte řádek `REQ` **před** začátkem, aby přerušený úkol zůstal viditelný.

```
REQ     | 2026-01-14 | SCOUT | <the order, in the Operator's words where possible> | <status note>
DONE    | 2026-01-14 | SCOUT | <the order> | evidence: outbox/20260114-090312-lease-rates.md
BLOCKED | 2026-01-14 | SCOUT | <the order> | <what is blocking, one line>
REFUSED | 2026-01-14 | SCOUT | <the order> | <why, one line + where the reasoning lives>
```

**Řádek `DONE` bez cesty k důkazu je neplatný.** Není-li soubor, práce nepřistála nikde, kde by ji Operátor
viděl. Vlastní hlášení je `[CLAIMED]`; soubor je to, co z něj činí `[PROVEN]`.

**Odmítnutí sem patří natrvalo.** Tak flotila přestává znovu otevírat vyřešené otázky. Nemažte je později.

**Poctivá mez:** tento rejstřík nic nepozoruje. Je přesně tak úplný jako agenti, kteří do něj píší. Chybějící
úkol není důkazem, že se úkol nikdy nestal — jen toho, že jej nikdo nezaznamenal. Berte řádek jako *tvrzení s
připojenou cestou k důkazu*, nikdy jako důkaz. Ověřte, že soubor důkazu existuje, než se na jakékoli `DONE`
spolehnete.

---

## 4. Dokončení je to, že to Operátor uvidí

Nikoli to, že to agent prohlásí. Odpověď není bod zastavení: monitory zůstávají skrze ni natažené, práce
pokračuje a pak nastane uvážené odhlášení.

---

## 5. Protipravidlo, které přebíjí směrování

**Nouzové zastavení a otevřenost jdou i nadále člověku, okamžitě a nápadně.**

Selhání se ukazuje stejně nápadně jako úspěch. Směrování výstupu do souborů se nikdy nesmí stát místem, kde
se pohřbívá špatný výsledek. Přicházejí-li dobré zprávy flotily do chatu a špatné do souboru, který nikdo
neotevře, smlouva se převrátila a flotila nyní lže směrováním.

---

## 6. Poctivá mez samotné smlouvy

Agent běžící uvnitř chatového postroje stále vypisuje text asistenta do onoho chatu — tato smlouva postroj
přesměrovat nemůže. Zavazuje však **to, co se agent rozhodne zapsat**: podstatu do souborů a text chatu
zkrácený na krátký ukazatel — *„zapsáno do `<path>`, vystaveno na konzoli“* — nikdy úplnou zprávu.

---

## 7. Žádné tajemství nedosáhne povrchu

`surface/` čte konzole a může být zobrazen na obrazovce, na snímku či ve sdíleném okně. Pravidla datových zón
([`06-DATA-ZONES.md`](06-DATA-ZONES.md)) zde platí v plné síle.
