> **Onofficiële vertaling.** De normatieve versie van dit document is de Engelse, in de branch `main`.
> Deze vertaling wordt voor het gemak aangeboden en **is niet door een moedertaalspreker
> gecontroleerd**. Bij afwijking van het Engelse origineel **geldt het Engels**. De
> protocolaanduidingen (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, de busverba en de
> bestandsnamen) blijven bewust in het Engels: het zijn letterlijke waarden die agents uitlezen.

# 09 — DE VLOER

**Status: normatief voor de visualisator; informatief als model.**
Uitgevoerd door [`reference/sidecar/hmi.html`](../reference/sidecar/hmi.html).

---

## 1. De bewering

Een vloot agents is moeilijk te zien. Een bestandsboom is een lijst, een procestabel is een lijst, en een
logboek is een lijst — zodat het enige beeld dat iemand van een draaiende vloot heeft, bestaat uit
verschillende lijsten die niet op elkaar aansluiten.

**Een geautomatiseerd magazijn is dezelfde machine, en het is al veertig jaar afleesbaar.** Kranen
verplaatsen ladingen tussen stellingen onder een besturingssysteem, en de persoon die toezicht houdt, leest
een vloer met honderden gelijktijdige bewegingen in één oogopslag af, aan de kleur, zonder één regel tekst
te lezen.

Parvis leent dat. Niet als versiering — als een *afbeelding*, waarin elk magazijnobject precies
overeenkomt met één ding in de boom, en waarin de eigen veiligheidsregels van het magazijn de
veiligheidsregels van het protocol blijken te zijn, al op de juiste plek getekend.

---

## 2. De afbeelding

| Op de vloer | In de vloot | Gelezen uit |
|---|---|---|
| **Kraan** | een agent, of een levende sessie | de sessiemarkeringen in `_os/exchange/bus/session/` |
| **Pallet** | een map | de boom zelf; het etiket van de pallet is haar pad |
| **Stellingplaats** | waar die map woont | de bovenliggende map |
| **Een pallet openen** | in de map afdalen | **nog een heel magazijn** — §4 |
| **Induct** (inkomend dok) | binnenkomend werk | een `REQ`-regel in `_os/tasks/INDEX.md` |
| **Spur** (uitgaand dok) | een vertrekkend werkproduct | een bestand in `_os/events/surface/`, een export |
| **Transportband** | de bestandsbus | `_os/exchange/bus/` — hoe werk zich verplaatst zonder dat een kraan het draagt |
| **Vrachtwagen** | een externe dienst of een andere AI | de grens. §5 |

Het gaat niet om het plaatje. Het gaat erom dat **je dit scherm al kunt lezen** als je ooit voor een
magazijnbesturingssysteem hebt gestaan — en zo niet, dan is het model nog steeds concreet op een manier
waarop een mappenlijst dat niet is.

---

## 3. De kleuren

Eén oogopslag, vóór enige navigatie:

| Kleur | Op de vloer | In de vloot |
|---|---|---|
| **GROEN** | in beweging — een kraan draagt een lading | een agent werkt; een levende sessie midden in een taak |
| **BLAUW** | ingepland — in de wachtrij, nog niet begonnen | een aankondiging op het bord: besteld, wachtend op een agent |
| **AMBER** | aandacht — een plaats vraagt om een beslissing | `YELLOW`: vraag vóór elke handeling |
| **ROOD** | noodstop — die zone ligt stil | `STOP`: de noodstop staat scherp en deze wortel is bevroren |
| **GRIJS** | leeg, of geen levende bron | geen gegevens. Nooit een gok. |

Dit is geen nieuw schema. Het is de toestand die de boom al bevat, weergegeven.

**Rood wint altijd de oogopslag.** Eén enkele rode zone houdt het oog tegen vóór enig groen, precies zoals
de stop boven elk ander signaal gaat ([`01`](01-ESTOP.md)). **Een vloer die groen toont boven een rode zone
liegt** — en dat is de specifieke storing die deze regel moet verbieden.

**Grijs is verplicht waar er geen levende bron is.** Een plaats zonder gegevens wordt grijs weergegeven en
toont `—`. Zij wordt nooit groen weergegeven, want groen is de prettige standaardwaarde
([`07`](07-INTERFACE.md) §2.2).

---

## 4. Het geneste magazijn

**Open een pallet en je kijkt niet naar een kist. Je kijkt naar nog een heel magazijn** — met eigen kranen,
eigen pallets, eigen dokken.

Dit is precies de bestandsboom. Een initiatief is een magazijn; zijn afdelingen zijn gangpaden; hun
bestanden zijn pallets; en een pallet die zelf een map is, is nog een vloer. De visualisator is dus **één
weergave die afdaalt**, met dezelfde bediening op elke diepte, omdat elk niveau een magazijn *is*. Er valt
onderweg naar beneden niets nieuws te leren.

De recursie is de hele reden waarom de metafoor standhoudt in plaats van een omhulsel te zijn. Een
dashboard dat alleen het bovenste niveau weergeeft, is een foto van een vloot; een dat afdaalt, is er een
weergave van.

---

## 5. Vrachtwagens meren aan bij de grens — zij rijden nooit de vloer op

Hier houdt het model op een visualisatie te zijn en begint het iets af te dwingen.

Een externe dienst — een andere AI, een API, een leverancier — is een **vrachtwagen**. En in een echt
magazijn steekt een vrachtwagen achteruit tegen een dok. Hij rijdt de vloer niet op, verplaatst geen kraan,
gaat geen stelling in en opent geen genest magazijn. Hij zet een lading af bij een induct of haalt er een op
bij een spur, en dat is zijn volledige toegang.

**Dat dok is de luchtsluis.** Elke externe uitwisseling vindt aan de rand plaats, gefilterd, en niets van
buiten komt los binnen de boom.

**De papieren van een vrachtwagen zijn niet te vertrouwen tot ze zijn gecontroleerd.** Een lading die op een
vrachtwagen aankomt, is binnenkomende *gegevens*, geen opdracht aan de vloer. Zij wordt ingebracht en
getoetst als al het andere, nooit bij aankomst opgevolgd. Dat is de grens van de instructiebron uit
[`03`](03-BUS.md) §5, getekend als een laaddok — en getekend op de ene plek waar iemand die naar het scherm
kijkt, haar kan zien worden nageleefd.

Als jouw weergave een vrachtwagen op de vloer zet, is de weergave fout en de architectuur die zij tekent
ook.

---

## 6. Twee oppervlakken, twee taken

| | **De vloer** (dit bestand) | **De console** ([`07`](07-INTERFACE.md)) |
|---|---|---|
| Wat het is | een 3D-vloer, live bekeken | een tegelmenu, getrapt naar toegang |
| Wat het toont | **hoe het systeem ervoor staat** — elke agent, map en toestand tegelijk | **wat je kunt doen** — kies het gereedschap, doe het werk |
| Het werkwoord | kijken, begrijpen, beslissen | uitvoeren, gebruiken, voortbrengen |

**De vloer laat zien hoe de machine denkt; de console dient om te handelen naar wat je concludeert.** De een
is een kaart, de ander een werkbank. Een besturingsoppervlak heeft beide nodig, en de fout is alleen de
mooie te bouwen.

---

## 7. Bediening

De navigatie maakte het origineel bruikbaar, niet de kleur alleen:

| Bediening | Doet |
|---|---|
| **Slepen** | om de vloer draaien — roteren, kantelen, langs een gangpad kijken |
| **Van boven** | naar een plattegrond van bovenaf. Draaien voor diepte, plattegrond voor indeling |
| **Klik op een pallet** | erin afdalen — nog een magazijn, dezelfde bediening |
| **Scrollen** | zoomen |

Dezelfde bediening op elke diepte. Niet onderhandelbaar: een weergave waarvan de interactie verandert
naarmate je afdaalt, heeft de belofte gebroken dat elk niveau een magazijn is.

### De camera is orthografisch, met opzet

Er is **geen perspectiefverjonging**. Evenwijdige lijnen lopen nooit samen, en een plaats aan het eind van
een gangpad wordt precies even groot weergegeven als een aan je voeten.

Dat lijkt even fout — het oog verwacht convergentie en leest de afwezigheid ervan alsof het tussen de
kisten staat en naar buiten kijkt. Het is toch de juiste afweging, en het is wat besturingsschermen voor
echte geautomatiseerde vloeren gebruiken: **het hele punt is plaatsen over de vloer heen in één oogopslag te
vergelijken**, en een perspectiefcamera maakt het verre eind van een gangpad kleiner, doffer en moeilijker
te beoordelen dan het nabije. Onder perspectief zien "die stelling is voller" en "die stelling is dichterbij"
er hetzelfde uit. Onder een orthografische camera niet.

Occlusie blijft echt — vlakken die zich afwenden worden weggelaten en nabijere geometrie schildert over
verdere heen. Het is een platte camera, geen platte scène.

Werktuigen zijn ook bereikbaar via een **zijmenu**, gegroepeerd per soort — kranen, pallets, de twee dokken,
de transportband, de vrachtwagens. Kiezen uit het menu of van de vloer opent dezelfde bediening, want een
vloer die je alleen kunt doorlopen door op kleine kistjes in een 3D-scène te klikken, is een demonstratie en
geen instrument.

---

## 8. Wat de vloer wel en niet mag

Elke beperking uit [`07`](07-INTERFACE.md) §5 geldt. De lijn wordt op één bepaalde plek getrokken:

**De vloer mag inbrengen. Zij mag nooit uitvoeren.**

Dat is dezelfde lijn die [`07`](07-INTERFACE.md) §1 al voor de console trekt, en zij is wat werktuigen
überhaupt bediening laat hebben. Een kraan kiezen en er werk aan richten schrijft een `REQ`-regel die die
agent noemt en zet een `TELL` in diens postbus. **Het start niets.** Er wordt geen proces gestart, geen
opdracht uitgevoerd, en de agent pakt het werk op bij zijn eigen volgende uitvoering — of niet.

Twee gevolgen die makkelijk misgaan:

- **Gericht werk is nog steeds geen opdracht.** De `REQ`-regel is het canonieke register; de postbusregel
  verwijst er slechts naar. Een bestand dat een agent zou *bevelen* — of dat het gezag van de Operator vanuit
  de boom zou opeisen — zou het beveiligingsincident zijn dat [`03`](03-BUS.md) §5 omschrijft, en dat in het
  oppervlak inbouwen zou erger zijn dan het met de hand doen. Het gezag is de Operator in gesprek. De vloer
  schrijft het register, niet de instructie.
- **Sommige werktuigen krijgen bewust geen bediening.** De transportband is alleen-lezen: een console die
  regels op de bus zou kunnen schrijven, zou gezag fabriceren dat het protocol haar ontzegt. Vrachtwagens
  hebben helemaal geen bediening — §5.

**Onder `STOP` wordt de vloer rood weergegeven en brengt zij niets in.** Een rode vloer neemt geen
opdrachten aan.

De eerlijke grens, eenmaal gezegd: **dit is een foto van de boom op één moment, geen levende telemetriestroom.**
Zij bevraagt met tussenpozen. Tussen bevragingen is zij verouderd, toont zij wanneer zij het laatst heeft
gelezen, en wordt zij grijs in plaats van anders voor te wenden wanneer de sidecar niet meer antwoordt.
