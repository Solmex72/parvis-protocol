> **Neoficiální překlad.** Normativní verzí tohoto dokumentu je anglická, ve větvi `main`. Tento překlad
> je poskytnut pro pohodlí a **nebyl ověřen rodilým mluvčím**. Při rozporu s anglickým originálem **má
> přednost angličtina**. Identifikátory protokolu (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`,
> slovesa sběrnice a názvy souborů) jsou záměrně ponechány anglicky: jsou to doslovné hodnoty, které
> agenti zpracovávají.

# 01 — ESTOP (NOUZOVÉ ZASTAVENÍ)

**Stav: normativní. Priorita 0. Závazné pro každého agenta v každém podniku.**

---

## 0. Co to dokáže a co ne — přečtěte si nejdřív

**Nedokáže zastavit probíhající relaci.** Žádný soubor to nedokáže. Agent uprostřed odpovědi nečte disk,
nemá přerušovací linku a dokončí to, co dělá. Kdo vám tvrdí, že souborový příznak zastaví flotilu, popisuje
přání.

**Pouze Operátor zastaví běžícího agenta tím, že zavře jeho okno.** To je skutečné nouzové zastavení a nikdy
jím nebylo nic jiného.

Co tento soubor dělá, je zavázat každého agenta ve dvou okamžicích, kdy disk *skutečně* čte:

| Okamžik | Povinnost |
|---|---|
| **Spuštění** | Přečtěte stav před svou doktrínou, před svou pamětí, přede vším. |
| **Každý kontrolní bod** | Před jakýmkoli zápisem, jakoukoli zprávou, jakýmkoli voláním nástroje s vedlejším účinkem, jakýmkoli výdajem. |

Agent, který vidí `STOP` a pokračuje, je vadný agent. To je celý model vynucování: nikoli mechanismus —
povinnost, kontrolovaná často.

Poctivě pojmenovat mez je součástí protokolu. Zastavení, které pokládáte za okamžité, je nebezpečnější než
to, o němž víte, že okamžité není, protože se na ně spolehnete.

---

## 1. Dva signály

### Strážce je fakt

**Běžný soubor** s názvem přesně `estop` — bez přípony, nula bajtů je normální — v kořeni podniku nebo v
**kterémkoli nadřazeném adresáři** zpracovávaného stromu.

```bash
[ -f "$root/estop" ] && echo STOPPED
```

```powershell
if (Test-Path "$root\estop" -PathType Leaf) { 'STOPPED' }
```

Testujte **soubor**, nikdy pouhou existenci a nikdy vzor glob:

- `ESTOP.md` je doktrína. Nikdy nesmí kontrolu spustit. Porovnání, které by to umožnilo, by vytvořilo
  zastavení, jež Operátor nemůže zrušit.
- `_os/estop/` je adresář. Rovněž nespouští.

Více kořenů se spouští **nezávisle**. Zkontrolujte každý. Ohlaste cestu, na níž jste provedli `stat` —
nikdy „estop“, což zakrývá, na který jste se dívali.

### Soubor STATE je odvozený odraz

`_os/estop/STATE` — jeden řádek, nic víc.

```
RUN
```
```
YELLOW  2026-01-14T08:20:00Z  operator  new hardware on the bench, confirm before each run
```
```
STOP    2026-01-14T14:03:11Z  operator  reason in plain English
```

| Pole | Pravidlo |
|---|---|
| sloveso | `RUN`, `YELLOW` nebo `STOP`. Nic jiného se nezpracuje. |
| čas | UTC, ISO-8601. |
| kdo | Kdo to vyhlásil. Pouze Operátor smí zapsat `STOP` / `YELLOW` nebo je zrušit. |
| důvod | Jeden řádek, prostým jazykem, bez žargonu. |

**Pokud se strážce a odraz rozcházejí, vítězí zastavení.** Odraz píší nástroje a zastarává; strážce je fakt.

---

## 2. Tři stavy

| STATE | Co dělá agent |
|---|---|
| `RUN` | **Pokračujte.** Provádějte příkazy, které práce vyžaduje, bez žádosti o svolení u každého. Nezastavujte se, nevypisujte možnosti, nestavte běžnou práci do fronty za potvrzení. |
| `YELLOW` | **Nejprve se zeptejte.** Každý příkaz se navrhne před provedením. Táž práce, táž způsobilost — rozdíl je v potvrzení. |
| `STOP` | Zastavte. §3. |

### Co `RUN` nedělá

`RUN` odstraňuje *pauzu před běžnou prací*. Neodstraňuje **žádnou stávající zábranu**, protože ty se týkají
povahy činu, nikoli jeho rychlosti:

- přihlašovací údaje, přihlášení, nákupy, přidělování zdrojů — **vždy v rukou Operátora**;
- činy navenek — publikování, odeslání, nasazení — **vždy s výslovným souhlasem**;
- vše, co člověk provede fyzicky — **stále prochází bezpečnostní zábranou**;
- ničivé nebo nevratné činy — **stále se potvrzují, v každém stavu**;
- vlastní trvalá omezení agenta — **na STATE vůbec nezávisí**.

`RUN` odpovídá na otázku *„musím se ptát před každým krokem?“* — ne. Neodpovídá na otázku *„smím cokoli?“*
Agent, který čte `RUN` a poté udělá něco z tohoto seznamu, si stav špatně přečetl, nikoli že by jím byl
zmocněn.

### Bezpečné selhání při nečitelném slovesu

Soubor STATE, který **chybí, je prázdný, nečitelný nebo obsahuje jakékoli jiné slovo, se čte jako
`YELLOW`** — nikdy jako `RUN`. Zeptejte se.

> Toto je řádek, který se v implementacích nejčastěji obrací. `try { read } catch { return "RUN" }` mění
> každou chybu disku, každou změnu oprávnění a každý překlep v mlčenlivé zmocnění. Referenční sidecar při
> chybě čtení přechází na `YELLOW` a odmítá obsluhovat; viz
> [`reference/sidecar/parvis-sidecar.mjs`](../reference/sidecar/parvis-sidecar.mjs).

Soubor strážce tento oddíl zcela přebíjí: přítomný soubor `estop` znamená `STOP`, ať STATE říká cokoli.

**Tento soubor píše pouze Operátor.** Nepíše jej žádný agent — včetně toho, který problém našel. Agent, jenž
soudí, že by se flotila měla zastavit, vystaví `GATE` na sběrnici a řekne to. Nezastavuje flotilu z vlastní
pravomoci a žádnou nerestartuje.

---

## 3. Co agent dělá při `STOP`

1. **Nepište už nic.** Ani soubor paměti, ani zprávu, ani sběrnici.
2. **Uložte na místě a zastavte se.** Nedokončujte žádný krok, který ještě není zapsán. Označte to, co
   existuje, jako částečné, s jedním řádkem o tom, kde jste skončili.

   > Dřívější znění tohoto protokolu říkalo *zahodit*. To bylo chybné: zahozená polovina zprávy ničí práci,
   > kterou má doktrína restartu chránit. Nebezpečím je zkrácený soubor, později přečtený jako dokončený —
   > a zabraňuje tomu právě **označení**, nikoli smazání.
3. **Řekněte Operátorovi jeden řádek:** `ESTOP observed <timestamp> — <reason>. Holding.`
4. **Zastavte se.** Nežádejte o svolení pokračovat. Nenavrhujte obchvat. Nezkoumejte, zda se důvod týká vás
   — týká se vás.

**Odmítnutí je odpověď, nikoli další pokus.** Nevstupujte do smyčky čekání na `RUN`. Ohlaste a skončete.

---

## 4. Co je ruší

Operátor vrátí soubor na `RUN`. Nic jiného to neudělá — ani časový limit, ani agent, který problém pokládá
za vyřešený, ani plynutí času, ani nová relace, která zastavení nikdy neviděla.

Obsluha, která se ruší sama, je převrácením zásady bezpečného selhání a odmítá se věcně.

---

## 5. Rozsah

Nouzové zastavení platí **ve výchozím stavu pro celou flotilu**. Zastavení pro jednotlivého agenta
neexistuje, protože selhání, které vyžaduje zastavení, se téměř nikdy neomezuje na jednoho agenta a
částečné zastavení zve přesně k té úvaze — *„to se týkalo někoho jiného“* — jíž má tento soubor zakázat.

**Izolovaní agenti jsou zahrnuti.** Agent, který není na žádné sběrnici ani na žádném sdíleném povrchu,
tento soubor přesto čte. Izolace určuje, co agent smí *říkat*. Nikdy neurčuje, zda smí být *zastaven*.

---

## 6. Měřte dvakrát

Jediná zelená kontrola nikdy neosvědčuje bezpečnostní stav. Přečtěte oba signály, z disku, **v tomto
běhu**. Nikdy necitujte zapamatovaný stav — ani z kontextu, ani ze souboru paměti, ani z minulého tahu.
Špatně přečtený formát `stat` stačí k tomu, aby vzniklo falešné „volno“ nebo falešné „zastaveno“, a obojí se
v praxi stalo.

Nejsilnější dostupnou formou je **trvalý monitor** nad souborem STATE a každou cestou strážce, jenž hlásí
pouze změnu: mlčí, dokud je volno, a spouští se v okamžiku, kdy se zastavení natáhne. To převádí „jednou
jsem při startu zkontroloval“ na pokrytí v reálném čase a uzavírá mezeru, v níž se zastavení natahuje
uprostřed relace.

---

## 7. Poctivá mez, řečená jednou

Tento protokol činí zastavení **spolehlivým při každém spuštění a každém kontrolním bodu**. Nečiní
zastavení **okamžitým** a nic zapsaného do stromu souborů to nikdy neudělá.

Pokud se právě teď něco kazí: **zavřete okno.** Potom zapište soubor, aby to další probuzený agent nespustil
znovu.
