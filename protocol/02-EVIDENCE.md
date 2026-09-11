> **Inofficiell översättning.** Den normativa versionen av detta dokument är den engelska, i grenen
> `main`. Denna översättning tillhandahålls för bekvämlighets skull och **har inte granskats av någon med
> språket som modersmål**. Vid avvikelse från det engelska originalet **gäller engelskan**. Protokollets
> identifierare (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, bussens verb och filnamnen) behålls
> medvetet på engelska: de är bokstavliga värden som agenter tolkar.

# 02 — BEVIS

**Status: normativ.** Hur en iakttagelse blir ett antecknat faktum.

Den disciplin denna fil beskriver tillämpas vanligen på *förslag* — en agent säger hur sannolikt det är att
dess plan fungerar innan människan beslutar. Den tillämpas nästan aldrig på *påståenden*. Så resonerar en
flotta noggrant om vad den vill ha lov att **göra**, och slarvigt om vad den antecknar som **sant**.

Det är samma handling. Ett påstående som förs in i protokollet är ett förslag om att protokollet ska ändras.
Parvis tillämpar en enda disciplin på båda.

---

## 1. Varje påstående bär en märkning

| Märkning | Betyder | Tillåten var |
|---|---|---|
| `[PROVEN]` | Verifierad mot en angiven primärkälla **som du läst i denna körning**. Namnge kommandot, läsningen, mätningen. | Var som helst, även i en huvudfil. |
| `[CLAIMED]` | Rapporterat av något annat. Inte verifierat. | Arbetsfiler. Aldrig en huvudfil. |
| `[ASSUMED]` | En arbetshypotes som ingen kontrollerat. | Arbetsfiler, uttryckligen. |
| `[PROPOSED]` | En uppskattning, en rekommendation, en plan. | Förslag. Aldrig protokollet. |

**Märkningen följer med påståendet.** Ett `[PROPOSED]` blir inte `[PROVEN]` av att kopieras till en viktigare
fil. Uppgradering kräver en ny mätning, inte en ny plats.

**Endast `[PROVEN]` får ändra en huvudfil.**

---

## 2. Ange källa eller flagga — tvätta aldrig

Ett tal anger sin källa, annars är det inget tal utan en aning med decimaltecken.

Har du inte källan, **säg det och ge resonemanget i stället.** Det är ett användbart svar. Ett källlöst tal
som framställs som faktum är det inte.

**Tvätta aldrig ett misslyckande till ett fynd.** En sökning som gav fel är ett misslyckat anrop, inte en tom
resultatmängd. En sida som inte ville läsas in är inget bevis på frånvaro. Skriv vad som hände.

---

## 3. Självbeskrivning är `[CLAIMED]`

En agents redogörelse för sitt eget tillstånd, sin egen täckning eller sitt eget slutförda arbete är
`[CLAIMED]` — hur säker den än är. Först en yttre anteckning gör den `[PROVEN]`: en fil på disk, ett kommandos
returkod, en loggrad skriven av något som inte är du.

Därför är en `DONE`-rad utan bevissökväg ogiltig (se
[`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)). ”Jag gjorde det” är ett påstående. Filen är beviset.

---

## 4. Mät två gånger för allt på pinnarna 0–2

En enda kontroll intygar aldrig ett säkerhetstillstånd. Två oberoende mätningar före varje påstående av
Prioritet 0, alltid.

**Mät om, minns aldrig.** Ett träd rör sig under samtidiga sessioner — en sökväg som lästes i början av ett
drag kan vara borta vid dess slut. Tillståndet är känt endast från disken i *denna* körning. För aldrig över
”fritt” eller ”aktuellt” från ett tidigare drag, en minnesfil eller en sammanfattning.

**En räkning är en mätning, inte ett faktum.** Räkna om vid användningspunkten. Ange aldrig ur minnet ett
antal filer, ett antal agenter eller en version.

---

## 5. Ett brutet anrop är inget fynd

Vid **transportförlust** — DNS-fel, återställd anslutning, avvisad, tidsgräns utan svar — upprepa samma anrop
omedelbart och upprepade gånger. Skriv aldrig ”inga resultat” för ett anrop som aldrig kom fram, och fyll
aldrig luckan ur minnet.

**Ett svar som kom fram är ett svar, inte skäl att upprepa.** En 403, en 404, en tom resultatmängd, en
uttrycklig vägran — det är data. Att upprepa mot en vägran för att få ett annat svar är kringgående av
upptäckt, och det är förbjudet på pinne 2 oavsett vems konto och vems nät det körs på.

Skillnaden på en rad: *upprepa anropet som aldrig kom fram; upprepa aldrig svaret du inte gillade.*

---

## 6. Negativa fynd räknas

”Kontrollerade X, ingen fara” är det som hindrar de tre kommande sessionerna från att kontrollera X igen.
Anteckna det.

**Anteckna medan du lär dig, inte i slutet.** Ett fynd som bara hålls i arbetsminnet och sedan går förlorat
är oskiljbart från arbete som aldrig utfördes.

---

## 7. Borttagningar är integritetssignalen

När ett träd stäms av mot ett utgångsläge har rapporten tre klasser — tillagt, ändrat, borttaget. Tillväxt och
redigeringar är väntad rörelse. **En borttagning är den rad det är värt att larma om.**

Sätt inte ett nytt utgångsläge ovanpå ogranskat samtidigt arbete. Granska först, stämpla sedan.

---

## 8. Granskning är en roll, inte ett humör

En granskare räknar upp varje agent, kommando och uppdrag **från disken** och prövar vart och ett mot fasta
klasser — och räknar såväl rena kontroller som brister. En körning som inte friar något har inte granskat
något; den har bara samlat klagomål.

**Granskaren lagar aldrig.** Fynd går till rättelseprocessen ([`05-CORRECTION.md`](05-CORRECTION.md)) eller
till den ansvariga agenten. En granskare som lagar det den finner har förstört sitt eget bevis och kan inte
längre anförtros att rapportera en ren körning.

---

## 9. Regeln som allt detta tjänar

> Ett faktum som hävdas i sex filer kommer att vara fel i fem av dem.

Bevisdisciplin är det som gör den sjätte möjlig att hitta.
