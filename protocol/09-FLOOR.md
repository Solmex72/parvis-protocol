> **Neoficiální překlad.** Normativní verzí tohoto dokumentu je anglická, ve větvi `main`. Tento překlad
> je poskytnut pro pohodlí a **nebyl ověřen rodilým mluvčím**. Při rozporu s anglickým originálem **má
> přednost angličtina**. Identifikátory protokolu (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`,
> slovesa sběrnice a názvy souborů) jsou záměrně ponechány anglicky: jsou to doslovné hodnoty, které
> agenti zpracovávají.

# 09 — HALA

**Stav: normativní pro vizualizátor; informativní jako model.**
Provedeno v [`reference/sidecar/hmi.html`](../reference/sidecar/hmi.html).

---

## 1. Tvrzení

Flotilu agentů je těžké vidět. Strom souborů je seznam, tabulka procesů je seznam a protokol je seznam —
takže jediným obrazem běžící flotily, který kdo má, je několik seznamů, jež spolu nesouhlasí.

**Automatizovaný sklad je týž stroj a čitelný je už čtyřicet let.** Jeřáby přemisťují náklady mezi regály
pod řídicím systémem a člověk, který na to dohlíží, přečte halu se stovkami současných pohybů jediným
pohledem, podle barvy, aniž by přečetl jediný řádek textu.

Parvis si to půjčuje. Nikoli jako ozdobu — jako *zobrazení*, v němž každý předmět skladu odpovídá právě jedné
věci ve stromu a vlastní bezpečnostní pravidla skladu se ukazují být bezpečnostními pravidly protokolu, už
nakreslenými na správném místě.

---

## 2. Zobrazení

| V hale | Ve flotile | Čteno z |
|---|---|---|
| **Jeřáb** | agent nebo živá relace | značky relací v `_os/exchange/bus/session/` |
| **Paleta** | adresář | sám strom; štítkem palety je její cesta |
| **Pozice v regálu** | kde ten adresář žije | jeho nadřazený adresář |
| **Otevřít paletu** | sestoupit do adresáře | **další celý sklad** — §4 |
| **Induct** (příjmová rampa) | přicházející práce | řádek `REQ` v `_os/tasks/INDEX.md` |
| **Spur** (výdejová rampa) | odcházející výstup | soubor v `_os/events/surface/`, export |
| **Dopravník** | souborová sběrnice | `_os/exchange/bus/` — jak se práce přesouvá, aniž ji nese jeřáb |
| **Nákladní vůz** | vnější služba nebo jiná AI | hranice. §5 |

Nejde o obrázek. Jde o to, že **tuto obrazovku už umíte číst**, pokud jste kdy stáli před řídicím systémem
skladu — a pokud ne, model je i tak názorný způsobem, jakým výpis adresáře nebývá.

---

## 3. Barvy

Jediný pohled, před jakoukoli navigací:

| Barva | V hale | Ve flotile |
|---|---|---|
| **ZELENÁ** | v pohybu — jeřáb nese náklad | agent pracuje; živá relace uprostřed úkolu |
| **MODRÁ** | naplánováno — ve frontě, dosud nezačato | vývěska na nástěnce: zadáno, čeká na agenta |
| **JANTAROVÁ** | pozor — pozice žádá rozhodnutí | `YELLOW`: ptát se před každým úkonem |
| **ČERVENÁ** | nouzové zastavení — ta zóna stojí | `STOP`: zastavení je natažené a tento kořen je zmrazen |
| **ŠEDÁ** | prázdné, nebo bez živého zdroje | žádná data. Nikdy dohad. |

Toto není nové schéma. Je to stav, který strom už obsahuje, vykreslený.

**Červená vždy vyhraje pohled.** Jediná červená zóna zastaví oko dříve než kterákoli zeleň, přesně jak
zastavení přebíjí každý jiný signál ([`01`](01-ESTOP.md)). **Hala, která ukazuje zeleň nad červenou zónou,
lže** — a to je právě to selhání, jemuž má toto pravidlo zabránit.

**Šedá je povinná tam, kde není živý zdroj.** Pozice bez dat se vykreslí šedě a čte `—`. Nikdy se nevykresluje
zeleně, protože zelená je příjemná výchozí hodnota ([`07`](07-INTERFACE.md) §2.2).

---

## 4. Vnořený sklad

**Otevřete paletu a nedíváte se na bednu. Díváte se na další celý sklad** — s vlastními jeřáby, vlastními
paletami, vlastními rampami.

To je přesně strom souborů. Podnik je sklad; jeho oddělení jsou uličky; jejich soubory jsou palety; a paleta,
která je sama adresářem, je další hala. Vizualizátor je tedy **jediný pohled, který sestupuje**, se stejným
ovládáním v každé hloubce, protože každá úroveň *je* sklad. Cestou dolů není třeba učit se nic nového.

Rekurze je celý důvod, proč metafora drží, místo aby byla slupkou. Přehled vykreslující jen nejvyšší úroveň
je fotografie flotily; ten, který sestupuje, je její pohled.

---

## 5. Nákladní vozy kotví u hranice — nikdy nevjíždějí do haly

Zde model přestává být vizualizací a začíná něco vynucovat.

Vnější služba — jiná AI, API, dodavatel — je **nákladní vůz**. A ve skutečném skladu nákladní vůz couvá k
rampě. Nevjíždí do haly, nehýbe jeřábem, nevstupuje do regálu a neotevírá vnořený sklad. Složí náklad u
induct nebo jej vyzvedne ze spur, a to je celý jeho přístup.

**Ta rampa je propusť.** Každá vnější výměna probíhá na okraji, přefiltrovaná, a nic vnějšího se nedostane
volně dovnitř stromu.

**Papírům nákladního vozu se nedůvěřuje, dokud se neprověří.** Náklad přijíždějící vozem jsou příchozí *data*,
nikoli rozkaz hale. Vkládá se a přezkoumává jako cokoli jiného, nikdy se po příjezdu neplní. To je hranice
zdroje pokynů z [`03`](03-BUS.md) §5, nakreslená jako nakládací rampa — a nakreslená na jediném místě, kde ji
ten, kdo hledí na obrazovku, může vidět dodrženou.

Pokud vaše vykreslení postaví nákladní vůz do haly, vykreslení je chybné a stejně tak architektura, kterou
kreslí.

---

## 6. Dva povrchy, dvě práce

| | **Hala** (tento soubor) | **Konzole** ([`07`](07-INTERFACE.md)) |
|---|---|---|
| Co to je | trojrozměrná hala, sledovaná živě | dlaždicová nabídka, odstupňovaná podle přístupu |
| Co ukazuje | **jak je systém na tom** — každý agent, adresář a stav naráz | **co můžete udělat** — vyberte nástroj, udělejte práci |
| Sloveso | dívat se, chápat, rozhodovat | provádět, používat, vytvářet |

**Hala ukazuje, jak stroj myslí; konzole slouží k jednání podle toho, co usoudíte.** Jedno je mapa, druhé
ponk. Řídicí povrch potřebuje obojí a chybou je postavit jen ten hezký.

---

## 7. Ovládání

Použitelným původní řešení činila navigace, nikoli barva sama:

| Ovládání | Dělá |
|---|---|
| **Tažení** | oblet haly — otáčení, náklon, pohled podél uličky |
| **Shora** | přechod na půdorys shora. Oblet pro hloubku, půdorys pro rozvržení |
| **Klik na paletu** | sestup do ní — další sklad, totéž ovládání |
| **Rolování** | přiblížení |

Totéž ovládání v každé hloubce. Nesmlouvavé: pohled, jehož interakce se mění, jak sestupujete, porušil slib,
že každá úroveň je sklad.

### Kamera je ortografická, záměrně

**Perspektivní sbíhání není.** Rovnoběžky se nikdy nesbíhají a pozice na vzdáleném konci uličky se vykreslí
přesně tak velká jako pozice u vašich nohou.

Na okamžik to působí chybně — oko čeká sbíhání a jeho nepřítomnost čte, jako by stálo uvnitř beden a hledělo
ven. Přesto je to správná výměna a právě tak jsou řešeny řídicí obrazovky skutečných automatizovaných hal:
**celý smysl je porovnávat pozice napříč halou jediným pohledem**, a perspektivní kamera činí vzdálený konec
uličky menším, matnějším a hůře posouditelným než konec blízký. V perspektivě „tamten regál je plnější“ a
„tamten regál je blíž“ vypadají stejně. U ortografické kamery nikoli.

Zakrývání zůstává skutečné — odvrácené plochy se zahazují a bližší geometrie přemalovává vzdálenější. Je to
plochá kamera, nikoli plochá scéna.

Zařízení je dosažitelné i z **boční nabídky**, seskupené podle druhu — jeřáby, palety, obě rampy, dopravník,
nákladní vozy. Výběr z nabídky nebo z haly otevře totéž ovládání, protože hala, kterou lze procházet jen
klikáním na malé bedny v trojrozměrné scéně, je ukázka, nikoli nástroj.

---

## 8. Co hala smí a nesmí

Platí každé omezení z [`07`](07-INTERFACE.md) §5. Čára se vede na jednom určitém místě:

**Hala smí vkládat. Nikdy nesmí provádět.**

To je táž čára, kterou [`07`](07-INTERFACE.md) §1 vede už pro konzoli, a právě ona vůbec dovoluje, aby
zařízení mělo ovládání. Vybrat jeřáb a směrovat mu práci znamená zapsat řádek `REQ` se jménem onoho agenta a
vložit `TELL` do jeho schránky. **Nic to nespustí.** Žádný proces se nespustí, žádný příkaz neproběhne a agent
si práci vezme při svém vlastním dalším běhu — nebo nevezme.

Dva důsledky, jež se snadno popletou:

- **Směrovaná práce stále není rozkaz.** Řádek `REQ` je kanonický záznam; řádek ve schránce na něj jen
  ukazuje. Soubor, který by agentovi *přikazoval* — nebo si zevnitř stromu osoboval pravomoc Operátora — by
  byl bezpečnostní událostí, kterou vymezuje [`03`](03-BUS.md) §5, a zabudovat to do povrchu by bylo horší než
  udělat to ručně. Pravomoc je Operátor v rozhovoru. Hala píše záznam, nikoli pokyn.
- **Některé zařízení záměrně nedostává ovládání.** Dopravník je jen ke čtení: konzole schopná zapisovat řádky
  na sběrnici by vyráběla pravomoc, kterou jí protokol upírá. Nákladní vozy nemají ovládání vůbec — §5.

**Při `STOP` se hala vykreslí červeně a nic nevkládá.** Červená hala nepřijímá příkazy.

Poctivá mez, řečená jednou: **toto je fotografie stromu v jednom okamžiku, nikoli živý proud telemetrie.**
Dotazuje se v odstupech. Mezi dotazy je zastaralá, ukazuje, kdy naposledy četla, a zešedne, místo aby
předstírala opak, když sidecar přestane odpovídat.
