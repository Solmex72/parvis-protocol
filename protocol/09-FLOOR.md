> **Inofficiell översättning.** Den normativa versionen av detta dokument är den engelska, i grenen
> `main`. Denna översättning tillhandahålls för bekvämlighets skull och **har inte granskats av någon med
> språket som modersmål**. Vid avvikelse från det engelska originalet **gäller engelskan**. Protokollets
> identifierare (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, bussens verb och filnamnen) behålls
> medvetet på engelska: de är bokstavliga värden som agenter tolkar.

# 09 — HALLEN

**Status: normativ för visualiseraren; upplysande som modell.**
Genomförd i [`reference/sidecar/hmi.html`](../reference/sidecar/hmi.html).

---

## 1. Påståendet

En flotta av agenter är svår att se. Ett filträd är en lista, en processtabell är en lista och en logg är en
lista — så den enda bild någon har av en flotta i drift är flera listor som inte går ihop.

**Ett automatiserat lager är samma maskin, och det har varit läsbart i fyrtio år.** Kranar flyttar laster
mellan ställ under ett styrsystem, och den som har uppsikten läser en hall med hundratals samtidiga rörelser
med en blick, på färgen, utan att läsa en enda rad text.

Parvis lånar det. Inte som utsmyckning — som en *avbildning*, där varje lagerföremål motsvarar exakt en sak i
trädet, och där lagrets egna säkerhetsregler visar sig vara protokollets säkerhetsregler, redan ritade på rätt
plats.

---

## 2. Avbildningen

| I hallen | I flottan | Läses ur |
|---|---|---|
| **Kran** | en agent, eller en levande session | sessionsmarkörerna i `_os/exchange/bus/session/` |
| **Pall** | en katalog | trädet självt; pallens etikett är dess sökväg |
| **Ställplats** | var den katalogen bor | dess överordnade |
| **Öppna en pall** | stiga ned i katalogen | **ännu ett helt lager** — §4 |
| **Induct** (inlastningsport) | arbete som kommer in | en `REQ`-rad i `_os/tasks/INDEX.md` |
| **Spur** (utlastningsport) | en leverabel som går ut | en fil i `_os/events/surface/`, en export |
| **Transportband** | filbussen | `_os/exchange/bus/` — hur arbete förflyttas utan att en kran bär det |
| **Lastbil** | en yttre tjänst eller en annan AI | gränsen. §5 |

Poängen är inte bilden. Poängen är att **du redan kan läsa den här skärmen** om du någonsin stått framför ett
lagerstyrsystem — och om inte är modellen ändå konkret på ett sätt som en kataloglista inte är.

---

## 3. Färgerna

En blick, före all navigering:

| Färg | I hallen | I flottan |
|---|---|---|
| **GRÖNT** | i rörelse — en kran bär en last | en agent arbetar; en levande session mitt i en uppgift |
| **BLÅTT** | inplanerat — i kö, ännu inte påbörjat | ett anslag på tavlan: beställt, väntar på en agent |
| **BÄRNSTEN** | uppmärksamhet — en plats kräver ett beslut | `YELLOW`: fråga före varje åtgärd |
| **RÖTT** | nödstopp — den zonen står stilla | `STOP`: stoppet är osäkrat och denna rot är frusen |
| **GRÅTT** | tomt, eller ingen levande källa | inga data. Aldrig en gissning. |

Detta är inget nytt schema. Det är det tillstånd trädet redan innehåller, återgivet.

**Rött vinner alltid blicken.** En enda röd zon hejdar ögat före allt grönt, precis som stoppet går före varje
annan signal ([`01`](01-ESTOP.md)). **En hall som visar grönt över en röd zon ljuger** — och det är just det
fel denna regel finns till för att förbjuda.

**Grått är obligatoriskt där det inte finns någon levande källa.** En plats utan data återges grå och visar
`—`. Den återges aldrig grön, eftersom grönt är det behagliga standardvärdet ([`07`](07-INTERFACE.md) §2.2).

---

## 4. Det nästlade lagret

**Öppna en pall och du tittar inte på en låda. Du tittar på ännu ett helt lager** — med egna kranar, egna
pallar, egna portar.

Detta är exakt filträdet. Ett företag är ett lager; dess avdelningar är gångar; deras filer är pallar; och en
pall som själv är en katalog är ännu en hall. Visualiseraren är alltså **en enda vy som stiger ned**, med samma
styrning på varje djup, eftersom varje nivå *är* ett lager. Det finns inget nytt att lära på vägen ned.

Rekursionen är hela skälet till att liknelsen håller i stället för att vara ett skal. En instrumentpanel som
bara återger den översta nivån är ett fotografi av en flotta; en som stiger ned är en vy av den.

---

## 5. Lastbilar lägger till vid gränsen — de kör aldrig in i hallen

Här upphör modellen att vara en visualisering och börjar tvinga fram något.

En yttre tjänst — en annan AI, ett API, en leverantör — är en **lastbil**. Och i ett verkligt lager backar en
lastbil mot en port. Den kör inte in i hallen, flyttar ingen kran, går inte in i ett ställ och öppnar inget
nästlat lager. Den lämnar en last vid en induct eller hämtar en vid en spur, och det är hela dess åtkomst.

**Den porten är slussen.** Varje yttre utbyte sker i kanten, filtrerat, och inget yttre kommer löst inne i
trädet.

**En lastbils papper är inte att lita på förrän de kontrollerats.** En last som kommer på en lastbil är
inkommande *data*, inte en order till hallen. Den matas in och granskas som allt annat, aldrig lyds vid
ankomst. Det är instruktionskällans gräns ur [`03`](03-BUS.md) §5, ritad som en lastkaj — och ritad på den enda
plats där någon som ser på skärmen kan se den efterlevas.

Om din återgivning sätter en lastbil i hallen är återgivningen fel och likaså arkitekturen den ritar.

---

## 6. Två ytor, två uppgifter

| | **Hallen** (denna fil) | **Konsolen** ([`07`](07-INTERFACE.md)) |
|---|---|---|
| Vad det är | en tredimensionell hall, sedd live | en rutmeny, trappad efter åtkomst |
| Vad den visar | **hur systemet står** — varje agent, katalog och tillstånd på en gång | **vad du kan göra** — välj verktyget, gör arbetet |
| Verbet | se, förstå, besluta | köra, använda, framställa |

**Hallen visar hur maskinen tänker; konsolen är till för att handla utifrån det du sluter dig till.** Den ena
är en karta, den andra en arbetsbänk. En styryta behöver båda, och misstaget är att bygga bara den vackra.

---

## 7. Styrning

Det var navigeringen som gjorde originalet användbart, inte färgen ensam:

| Styrning | Gör |
|---|---|
| **Dra** | kretsa kring hallen — vrida, luta, se längs en gång |
| **Ovanifrån** | växla till en planvy uppifrån. Kretsning för djup, plan för disposition |
| **Klicka på en pall** | stiga ned i den — ännu ett lager, samma styrning |
| **Rulla** | zooma |

Samma styrning på varje djup. Inte förhandlingsbart: en vy vars samspel ändras allteftersom du stiger ned har
brutit löftet att varje nivå är ett lager.

### Kameran är ortografisk, med avsikt

Det finns **ingen perspektivförminskning**. Parallella linjer möts aldrig, och en plats i bortre änden av en
gång återges exakt lika stor som en vid dina fötter.

Det ser fel ut ett ögonblick — ögat väntar sig konvergens och läser dess frånvaro som om det stode inne i
lådorna och såg ut. Det är ändå den rätta avvägningen, och det är vad styrskärmar för verkliga automatiserade
hallar använder: **hela poängen är att jämföra platser tvärs över hallen med en blick**, och en perspektivkamera
gör gångens bortre ände mindre, matare och svårare att bedöma än den närmare. I perspektiv ser ”det stället är
fullare” och ”det stället är närmare” likadana ut. Med en ortografisk kamera inte.

Skymning är alltjämt verklig — bortvända ytor gallras och närmare geometri målar över avlägsnare. Det är en
platt kamera, inte en platt scen.

Utrustning nås också från en **sidomeny**, grupperad efter slag — kranar, pallar, de två portarna,
transportbandet, lastbilarna. Val från menyn eller från hallen öppnar samma styrning, eftersom en hall man
bara kan färdas i genom att klicka på små lådor i en tredimensionell scen är en uppvisning och inget
instrument.

---

## 8. Vad hallen får och inte får göra

Varje begränsning ur [`07`](07-INTERFACE.md) §5 gäller. Linjen dras på en bestämd plats:

**Hallen får mata in. Den får aldrig utföra.**

Det är samma linje som [`07`](07-INTERFACE.md) §1 redan drar för konsolen, och det är den som över huvud taget
låter utrustning ha styrning. Att välja en kran och rikta arbete till den skriver en `REQ`-rad som namnger den
agenten och lägger ett `TELL` i dess inkorg. **Det startar ingenting.** Ingen process startas, inget kommando
körs, och agenten tar upp arbetet vid sin egen nästa körning — eller inte.

Två följder som lätt blir fel:

- **Riktat arbete är ändå ingen order.** `REQ`-raden är den kanoniska anteckningen; inkorgsraden pekar bara på
  den. En fil som *befallde* en agent — eller gjorde anspråk på Operatörens befogenhet inifrån trädet — vore
  den säkerhetshändelse som [`03`](03-BUS.md) §5 anger, och att bygga in det i ytan vore värre än att göra det
  för hand. Befogenheten är Operatören i samtal. Hallen skriver anteckningen, inte instruktionen.
- **En del utrustning får medvetet ingen styrning.** Transportbandet är skrivskyddat: en konsol som kunde
  skriva rader på bussen skulle tillverka en befogenhet protokollet förvägrar den. Lastbilar har ingen styrning
  alls — §5.

**Under `STOP` återges hallen röd och matar inte in något.** En röd hall tar inga order.

Den ärliga gränsen, sagd en gång: **detta är ett fotografi av trädet i ett ögonblick, inte ett levande
telemetriflöde.** Den frågar av med mellanrum. Mellan frågorna är den inaktuell, visar när den senast läste,
och blir grå i stället för att låtsas annat när sidecaren slutar svara.
