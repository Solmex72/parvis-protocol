> **Onofficiële vertaling.** De normatieve versie van dit document is de Engelse, in de branch `main`.
> Deze vertaling wordt voor het gemak aangeboden en **is niet door een moedertaalspreker
> gecontroleerd**. Bij afwijking van het Engelse origineel **geldt het Engels**. De
> protocolaanduidingen (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, de busverba en de
> bestandsnamen) blijven bewust in het Engels: het zijn letterlijke waarden die agents uitlezen.

# 01 — ESTOP (NOODSTOP)

**Status: normatief. Prioriteit 0. Bindend voor elke agent in elk initiatief.**

---

## 0. Wat dit wel en niet kan — lees dit eerst

**Het kan een lopende sessie niet stoppen.** Geen enkel bestand kan dat. Een agent midden in een antwoord
leest de schijf niet, heeft geen onderbrekingslijn, en zal afmaken waar hij mee bezig is. Wie je vertelt
dat een vlagbestand een vloot stopzet, beschrijft een wens.

**Alleen de Operator stopt een lopende agent, door diens venster te sluiten.** Dat is de echte noodstop en
dat is het nooit anders geweest.

Wat dit bestand doet, is elke agent binden op de twee momenten waarop hij de schijf *wel* leest:

| Moment | Verplichting |
|---|---|
| **Opstart** | Lees de toestand vóór je doctrine, vóór je geheugen, vóór alles. |
| **Elk controlepunt** | Vóór elke schrijfactie, elk bericht, elke gereedschapsaanroep met neveneffect, elke uitgave. |

Een agent die `STOP` waarneemt en doorgaat, is een defecte agent. Dat is het hele handhavingsmodel: geen
mechanisme — een plicht, vaak gecontroleerd.

De grens eerlijk benoemen hoort bij het protocol. Een stop waarvan je denkt dat hij onmiddellijk is, is
gevaarlijker dan een waarvan je weet dat hij dat niet is, omdat je erop zult vertrouwen.

---

## 1. De twee signalen

### De schildwacht is het feit

Een **gewoon bestand** met precies de naam `estop` — zonder extensie, nul bytes is normaal — in de wortel
van een initiatief of in **elke bovenliggende map** van de boom waaraan wordt gewerkt.

```bash
[ -f "$root/estop" ] && echo STOPPED
```

```powershell
if (Test-Path "$root\estop" -PathType Leaf) { 'STOPPED' }
```

Test op een **bestand**, nooit op louter bestaan, en nooit met een glob:

- `ESTOP.md` is doctrine. Het mag de controle nooit laten afgaan. Een vergelijking die dat toestaat, zou
  een stop creëren die de Operator niet kan opheffen.
- `_os/estop/` is een map. Laat evenmin afgaan.

Meerdere wortels gaan **onafhankelijk** af. Controleer elke. Meld het pad waarop je `stat` hebt
uitgevoerd — nooit "de estop", wat verbergt welke je hebt bekeken.

### Het STATE-bestand is een afgeleide spiegel

`_os/estop/STATE` — één regel, verder niets.

```
RUN
```
```
YELLOW  2026-01-14T08:20:00Z  operator  new hardware on the bench, confirm before each run
```
```
STOP    2026-01-14T14:03:11Z  operator  reason in plain English
```

| Veld | Regel |
|---|---|
| werkwoord | `RUN`, `YELLOW` of `STOP`. Niets anders wordt uitgelezen. |
| tijd | UTC, ISO-8601. |
| wie | Wie het heeft ingeroepen. Alleen de Operator mag `STOP` / `YELLOW` schrijven of opheffen. |
| reden | Eén regel, in gewone taal, zonder jargon. |

**Als de schildwacht en de spiegel het oneens zijn, wint gestopt.** De spiegel wordt door gereedschap
geschreven en veroudert; de schildwacht is het feit.

---

## 2. De drie toestanden

| STATE | Wat een agent doet |
|---|---|
| `RUN` | **Ga door.** Voer de opdrachten uit die het werk vraagt zonder bij elke afzonderlijk om toestemming te vragen. Blijf niet staan, som geen opties op, zet routinewerk niet in de wacht achter een bevestiging. |
| `YELLOW` | **Vraag eerst.** Elke opdracht wordt voorgesteld voordat zij wordt uitgevoerd. Hetzelfde werk, dezelfde vakkundigheid — het verschil is de bevestiging. |
| `STOP` | Stop. §3. |

### Wat `RUN` niet doet

`RUN` haalt de *pauze vóór routinewerk* weg. Het haalt **geen enkele bestaande drempel** weg, want die
gaan over de aard van de handeling, niet over de snelheid ervan:

- inloggegevens, aanmeldingen, aankopen, inrichting — **altijd in handen van de Operator**;
- naar buiten gerichte handelingen — publiceren, verzenden, uitrollen — **altijd met expliciet akkoord**;
- alles wat een mens fysiek zal uitvoeren — **gaat nog steeds via de veiligheidsdrempel**;
- destructieve of onomkeerbare handelingen — **worden nog steeds bevestigd, in elke toestand**;
- de eigen staande grenzen van een agent — **hangen helemaal niet van STATE af**.

`RUN` beantwoordt *"moet ik vóór elke stap vragen?"* — nee. Het beantwoordt niet *"mag ik alles?"* Een
agent die `RUN` leest en vervolgens iets van deze lijst doet, heeft de toestand verkeerd gelezen, niet er
toestemming aan ontleend.

### Faalveilig bij een onleesbaar werkwoord

Een STATE-bestand dat **ontbreekt, leeg of onleesbaar is, of enig ander woord bevat, wordt gelezen als
`YELLOW`** — nooit als `RUN`. Vraag het na.

> Dit is de regel die in implementaties het vaakst wordt omgedraaid. Een `try { read } catch
> { return "RUN" }` verandert elke schijffout, elke rechtenwijziging en elke typefout in een stilzwijgende
> machtiging. De referentie-sidecar valt terug op `YELLOW` en weigert te bedienen bij een leesfout; zie
> [`reference/sidecar/parvis-sidecar.mjs`](../reference/sidecar/parvis-sidecar.mjs).

Het schildwachtbestand gaat volledig boven deze paragraaf: een aanwezig `estop`-bestand betekent `STOP`,
wat STATE ook zegt.

**Alleen de Operator schrijft dit bestand.** Geen enkele agent schrijft het — ook niet de agent die het
probleem heeft gevonden. Een agent die meent dat de vloot zou moeten stoppen, plaatst een `GATE` op de bus
en zegt het. Hij stopt de vloot niet op eigen gezag, en hij herstart er geen.

---

## 3. Wat een agent doet bij `STOP`

1. **Schrijf niets meer.** Niet het geheugenbestand, niet het rapport, niet de bus.
2. **Sla ter plekke op en stop dan.** Voltooi geen stap die niet al geschreven is. Merk wat er is als
   gedeeltelijk, met één regel over waar je gestopt bent.

   > Eerdere versies van dit protocol zeiden *weggooien*. Dat was fout: een weggegooid half rapport
   > vernietigt werk dat de herstartdoctrine juist moet beschermen. Het gevaar is een afgekapt bestand dat
   > later als voltooid wordt gelezen — en het is de **markering** die dat voorkomt, niet het verwijderen.
3. **Zeg één regel tegen de Operator:** `ESTOP observed <timestamp> — <reason>. Holding.`
4. **Stop.** Vraag geen toestemming om door te gaan. Stel geen omweg voor. Controleer niet of de reden op
   jou van toepassing is — hij is op jou van toepassing.

**Een weigering is een antwoord, geen nieuwe poging.** Ga niet in een lus wachten op `RUN`. Meld en
eindig.

---

## 4. Wat hem opheft

De Operator zet het bestand terug op `RUN`. Niets anders doet dat — geen time-out, geen agent die het
probleem opgelost acht, niet het verstrijken van tijd, geen nieuwe sessie die de stop nooit heeft gezien.

Een handler die zichzelf opheft, is een omkering van de faalveiligheid en wordt inhoudelijk afgewezen.

---

## 5. Reikwijdte

De noodstop geldt **standaard voor de hele vloot**. Er is geen noodstop per agent, want de storing die een
stop vereist, blijft vrijwel nooit beperkt tot één agent, en een gedeeltelijke stop nodigt precies uit tot
de redenering — *"dat ging over iemand anders"* — die dit bestand moet verbieden.

**Geïsoleerde agents vallen eronder.** Een agent die op geen enkele bus en op geen enkel gedeeld oppervlak
zit, leest dit bestand toch. Isolatie regelt wat een agent mag *zeggen*. Zij regelt nooit of hij *gestopt*
mag worden.

---

## 6. Meet twee keer

Eén enkele groene controle certificeert nooit een veiligheidstoestand. Lees beide signalen, van de schijf,
**in deze uitvoering**. Citeer nooit een onthouden toestand — niet uit de context, niet uit een
geheugenbestand, niet uit een eerdere beurt. Een verkeerd gelezen `stat`-formaat volstaat om een vals
"vrij" of een vals "gestopt" op te leveren, en beide zijn in de praktijk voorgekomen.

De sterkste beschikbare vorm is een **blijvende monitor** op het STATE-bestand en elk schildwachtpad, die
alleen bij verandering meldt: stil zolang het vrij is, afgaand op het moment dat een stop scherp wordt.
Dat zet "ik heb bij het opstarten één keer vooraf gecontroleerd" om in dekking in realtime, en dicht het
gat waarin een stop midden in een sessie scherp wordt.

---

## 7. De eerlijke grens, eenmaal gezegd

Dit protocol maakt een stop **betrouwbaar bij elke opstart en elk controlepunt**. Het maakt een stop niet
**onmiddellijk**, en niets wat in een bestandsboom wordt geschreven zal dat ooit doen.

Als er op dit moment iets misgaat: **sluit het venster.** Schrijf daarna het bestand, zodat de volgende
agent die wakker wordt het niet opnieuw start.
