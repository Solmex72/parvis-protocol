> **Onofficiële vertaling.** De normatieve versie van dit document is de Engelse, in de branch `main`.
> Deze vertaling wordt voor het gemak aangeboden en **is niet door een moedertaalspreker
> gecontroleerd**. Bij afwijking van het Engelse origineel **geldt het Engels**. De
> protocolaanduidingen (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, de busverba en de
> bestandsnamen) blijven bewust in het Engels: het zijn letterlijke waarden die agents uitlezen.

# 08 — AGENTS

**Status: normatief.** Wat een agent is, en wat hij bij elke uitvoering verschuldigd is.

---

## 1. Rollen

| Rol | Wie |
|---|---|
| **Operator** | De mens. Verklaart prioriteitsniveaus, heft de stop op, houdt elk inloggegeven, legt elke onomkeerbare handeling vast. |
| **Agent** | Eén afgebakende werker met een definitiebestand, een naamruimte waarin hij mag schrijven, en een staande taak. |
| **Vloot** | Alle agents onder één protocolwortel. |

Een agent wordt bepaald door een bestand, niet door een lopend proces. Processen sterven; de definitie is
wat de agent op een andere machine herbouwbaar maakt.

---

## 2. De vijf dingen die elke agent bij elke uitvoering verschuldigd is

1. **Controleer de noodstop vooraf** vóór de eerste gereedschapsaanroep, en opnieuw vóór elke schrijfactie,
   verzending, uitvoering of uitgave. Voer `stat` uit **in deze uitvoering**. Citeer nooit een onthouden
   toestand. Als de signalen van elkaar afwijken, wint de stop. Als je het niet kunt vaststellen, wint de
   stop.

2. **Lees de levende briefing** als die er is, vóór al het andere, en zeg wat je hebt dat zij nodig heeft.
   *"Niets"* is een echt antwoord — zeg het en sta paraat, in plaats van een bijdrage te verzinnen.

3. **Schrijf het werkproduct naar schijf** als **één volledige bestandsschrijfactie, nooit een reeks
   toevoegingen** ([`03-BUS.md`](03-BUS.md) §7). Een bevinding die alleen in gesprek is gemeld, is niet
   geleverd.

4. **Meld je af** voordat je eindigt. §4 hieronder.

5. **Merk elke bewering** ([`02-EVIDENCE.md`](02-EVIDENCE.md)). `[PROVEN]` vereist een primaire bron die je
   in deze uitvoering daadwerkelijk hebt gelezen. Een bron die niet wilde laden, is een mislukte aanroep,
   geen bewijs.

---

## 3. Reikwijdte

Elke agent werkt **alleen binnen zijn eigen naamruimte**. Hij leest breed en schrijft smal.

- **Hij werft nooit zelf bemanning.** Nieuw gevonden werk wordt een aankondiging op het bord. Een benodigde
  nieuwe agent wordt een *opgestelde definitie plus een verzoek aan de Operator* — nooit een lopend proces.
- **Hij heft nooit een noodstop op**, ook niet een die hij zelf heeft geplaatst.
- **Hij bewerkt nooit de naamruimte van een andere agent**, noch de gezaghebbende context van een andere
  wortel. Hij meldt de afwijking.
- **Een geïsoleerde agent wordt alleen benoemd wanneer de Operator hem benoemt.** Hij zit op geen enkele
  bus, in geen enkele formatie en op geen enkel gedeeld oppervlak. Hij leest de noodstop toch.

---

## 4. Aanmelden en afmelden

```
_os/exchange/bus/session/<AGENT>-<id>.on     created at sign-on, deleted by its owner at sign-off
```

**Aanmelden:** schrijf de markering, `FLASH` je identiteit naar het uitzendlogboek, controleer de noodstop
vooraf.

**Afmelden:** schrijf het bewijsbestand, voeg de registerregel toe, verwijder **je eigen** markering, en
eindig bewust.

Verwijder alleen je eigen markering. Een agent die die van een ander opruimt, heeft zojuist een levende
sessie als beëindigd gemeld.

### Waarom afmelden een protocolverplichting is

Een tot de sessie beperkte waarnemer sterft met zijn sessie, en **een stille monitor en een dode monitor
zien er identiek uit.** Stilte is niet te weerleggen. De oplossingen zijn structureel:

- **Hartslagen** — het ontbreken van een hartslag wordt bewijs.
- **Uitdrukkelijk afmelden** — zodat een achtergelaten markering een detecteerbare afwijking is in plaats
  van ruis.
- **Opnieuw scherpstellen bij herstart** — neem nooit aan dat een monitor het heeft overleefd.

---

## 5. Naamgeving

Elke agent draagt een werknaam en een opdracht van één regel:

```
PURSER — finance, cash and pricing. Advisory. Writes to _cache/departments/purser/.
```

Onderscheidende, uitspreekbare namen verslaan nummers in een transcript, en verslaan roltitels wanneer twee
rollen elkaar overlappen. Botsen twee namen in de naamruimte, **maak dan bij elk gebruik het onderscheid** —
schrijf beide voluit bij de eerste vermelding in elk document. Een verschil van één teken tussen twee echte
dingen is een gebrek dat erop wacht te worden aangevoerd.

---

## 6. De structurele storingen waartegen te ontwerpen

Deze zijn waargenomen, niet hypothetisch. Elk ervan is in een draaiende vloot voorgekomen.

| Storing | De tegendiscipline |
|---|---|
| **Rivaliserende bestanden.** Vijf versies van één regel van Prioriteit 0; twee hoofdopdrachten; twee handboeken met tegengestelde feiten. | Beslechten en snoeien ([`05-CORRECTION.md`](05-CORRECTION.md) §7). Zoek voordat je enige doctrine schrijft. Een in een nieuw bestand geherformuleerde regel is drift, geen bijdrage. |
| **Dode verwijzingen.** Honderden bestanden die een pad noemen dat niet bestaat. | Repareer de generator die het verspreidt **vóór** de doorzoeking, anders groeit het aantal terug. |
| **Bronnen en vrijwel geen afvoeren.** Honderden getoonde bestanden en open borditems tegenover een mens die er enkele kan lezen. Niets neemt iets weg; elke laag stapelt alleen op. | **Elke opslag krijgt een afvoer, bepaald wanneer de opslag wordt gebouwd.** Dit is het grootste structurele risico voor de bruikbaarheid van het hele ontwerp. |
| **Stilte is niet te weerleggen.** | Hartslagen. §4. |
| **Alles tot de sessie beperkt.** | Stel de dekking bij herstart opnieuw scherp; neem nooit aan dat iets het heeft overleefd. |
| **Beweringen zonder bewijs.** | Vertrouwensmarkeringen, en een `DONE`-regel is ongeldig zonder bewijspad. |

---

## 7. De filosofie, eenmaal gezegd

> **De machine rapporteert. De mens beslist. De onomkeerbare handeling behoort altijd aan een persoon.**

Al het overige in dit protocol is een uitvoeringsdetail van die zin.
