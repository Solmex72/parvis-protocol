> **Onofficiële vertaling.** De normatieve versie van dit document is de Engelse, in de branch `main`.
> Deze vertaling wordt voor het gemak aangeboden en **is niet door een moedertaalspreker
> gecontroleerd**. Bij afwijking van het Engelse origineel **geldt het Engels**. De
> protocolaanduidingen (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, de busverba en de
> bestandsnamen) blijven bewust in het Engels: het zijn letterlijke waarden die agents uitlezen.

# 04 — HET UITVOERCONTRACT

**Status: normatief.** Waar het werk heen gaat wanneer het af is.

---

## 1. De regel

**Rapporteer niet aan de chat. Werk in de bestandsboom, schrijf de uitvoer naar schijf en toon een
verwijzing.**

Een agent die eindigt met het schrijven van een lang antwoord in een chatvenster, heeft zijn uitvoer
neergelegd waar niets anders in de vloot het kan lezen — geen andere agent, geen monitor, geen console,
geen volgende sessie. Het bestand is het duurzame register; de chat is een transcript dat niemand
stroomafwaarts ziet.

---

## 2. Waar de uitvoer heen gaat

| Soort uitvoer | Komt terecht in |
|---|---|
| Werkproduct, bevindingen, een rapport | het verantwoordelijke bestand, of `outbox/YYYYMMDD-HHMMSS-<slug>.md` |
| Alles wat de Operator nu moet zien | een kort verwijsbestand in `_os/events/surface/` |
| Een verzoek dat de Operator nodig heeft | `_os/exchange/requests/REQ-<slug>.md` |
| De registerregel | `_os/tasks/INDEX.md` |

**De map `surface/` is de melding. Het bestand is de inhoud.** Schrijf de inhoud naar zijn eigen plek en
laat dan een verwijzing van één regel achter in `surface/`, zodat de console de Operator toont waar het
terecht is gekomen.

---

## 3. De takenindex

Eén regel per opdracht. Voeg een `REQ`-regel toe **voordat** je begint, zodat een onderbroken taak
zichtbaar blijft.

```
REQ     | 2026-01-14 | SCOUT | <the order, in the Operator's words where possible> | <status note>
DONE    | 2026-01-14 | SCOUT | <the order> | evidence: outbox/20260114-090312-lease-rates.md
BLOCKED | 2026-01-14 | SCOUT | <the order> | <what is blocking, one line>
REFUSED | 2026-01-14 | SCOUT | <the order> | <why, one line + where the reasoning lives>
```

**Een `DONE`-regel zonder bewijspad is ongeldig.** Als er geen bestand is, is het werk nergens terecht
gekomen waar de Operator het kan zien. Zelfrapportage is `[CLAIMED]`; het bestand is wat het `[PROVEN]`
maakt.

**Een weigering hoort hier blijvend thuis.** Zo houdt de vloot op beslechte kwesties opnieuw ter discussie
te stellen. Verwijder haar later niet.

**De eerlijke grens:** deze index neemt niets waar. Zij is precies zo volledig als de agents die erin
schrijven. Een ontbrekende taak is geen bewijs dat de taak nooit heeft plaatsgevonden — alleen dat niemand
haar heeft vastgelegd. Behandel een regel als *een bewering met een bewijspad eraan vast*, nooit als
bewijs. Controleer of het bewijsbestand bestaat voordat je op een `DONE` vertrouwt.

---

## 4. Voltooiing is dat de Operator het ziet

Niet dat een agent het verklaart. Een antwoord is geen eindpunt: monitors blijven er dwars doorheen
scherp, het werk gaat door, en dan volgt een bewuste afmelding.

---

## 5. De tegenregel die boven de routering gaat

**De noodstop en de openhartigheid gaan nog steeds naar de mens, onmiddellijk en prominent.**

Een mislukking wordt met dezelfde prominentie getoond als een succes. Uitvoer naar bestanden routeren mag
nooit een plek worden om een slecht resultaat te begraven. Als het goede nieuws van de vloot in de chat
aankomt en het slechte nieuws in een bestand dat niemand opent, is het contract omgekeerd en liegt de
vloot nu via routering.

---

## 6. De eerlijke grens van het contract zelf

Een agent die binnen een chatharnas draait, produceert nog steeds assistenttekst in die chat — dit contract
kan het harnas niet omleiden. Wat het wél bindt, is **wat een agent kiest te schrijven**: de inhoud in
bestanden, en de chattekst beperkt tot een korte verwijzing — *"geschreven naar `<path>`, getoond aan de
console"* — nooit het volledige rapport.

---

## 7. Geen geheim bereikt het oppervlak

`surface/` wordt door een console gelezen en kan op een scherm, in een schermafbeelding of in een gedeeld
venster worden getoond. De regels voor gegevenszones ([`06-DATA-ZONES.md`](06-DATA-ZONES.md)) gelden hier
onverkort.
