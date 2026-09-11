> **Onofficiële vertaling.** De normatieve versie van dit document is de Engelse, in de branch `main`.
> Deze vertaling wordt voor het gemak aangeboden en **is niet door een moedertaalspreker
> gecontroleerd**. Bij afwijking van het Engelse origineel **geldt het Engels**. De
> protocolaanduidingen (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, de busverba en de
> bestandsnamen) blijven bewust in het Engels: het zijn letterlijke waarden die agents uitlezen.

# 02 — BEWIJS

**Status: normatief.** Hoe een waarneming een vastgelegd feit wordt.

De discipline die dit bestand beschrijft, wordt gewoonlijk toegepast op *voorstellen* — een agent zegt hoe
waarschijnlijk het is dat zijn plan werkt voordat de mens beslist. Zij wordt vrijwel nooit toegepast op
*beweringen*. Zo redeneert een vloot zorgvuldig over waarvoor zij toestemming wil om te **handelen**, en
slordig over wat zij als **waar** vastlegt.

Dat is dezelfde handeling. Een bewering die het register binnenkomt, is een voorstel om het register te
wijzigen. Parvis past op beide één discipline toe.

---

## 1. Elke bewering draagt een markering

| Markering | Betekent | Toelaatbaar waar |
|---|---|---|
| `[PROVEN]` | Geverifieerd tegen een geciteerde primaire bron **die je in deze uitvoering hebt gelezen**. Noem de opdracht, de leesactie, de meting. | Overal, ook in een hoofdbestand. |
| `[CLAIMED]` | Gemeld door iets anders. Niet geverifieerd. | Werkbestanden. Nooit een hoofdbestand. |
| `[ASSUMED]` | Een werkaanname die niemand heeft gecontroleerd. | Werkbestanden, uitdrukkelijk. |
| `[PROPOSED]` | Een schatting, een aanbeveling, een plan. | Voorstellen. Nooit het register. |

**De markering reist mee met de bewering.** Een `[PROPOSED]` wordt geen `[PROVEN]` door naar een
belangrijker bestand te worden gekopieerd. Opwaardering vereist een nieuwe meting, geen nieuwe plaats.

**Alleen `[PROVEN]` mag een hoofdbestand wijzigen.**

---

## 2. Citeer of markeer — witwassen nooit

Een getal noemt zijn bron, of het is geen getal maar een onderbuikgevoel met een komma erin.

Als je de bron niet hebt, **zeg dat en geef in plaats daarvan de redenering.** Dat is een bruikbaar
antwoord. Een bronloos getal dat als feit wordt gepresenteerd, is dat niet.

**Was nooit een mislukking wit tot een bevinding.** Een zoekopdracht die misging, is een mislukte aanroep,
geen lege resultatenverzameling. Een pagina die niet wilde laden, is geen bewijs van afwezigheid. Schrijf
op wat er is gebeurd.

---

## 3. Zelfbeschrijving is `[CLAIMED]`

Het verslag van een agent over zijn eigen toestand, zijn eigen dekking of zijn eigen voltooide werk is
`[CLAIMED]` — hoe overtuigd hij ook is. Alleen een externe registratie maakt het `[PROVEN]`: een bestand op
schijf, de afsluitcode van een opdracht, een logregel geschreven door iets dat jij niet bent.

Daarom is een `DONE`-regel zonder bewijspad ongeldig (zie
[`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)). "Ik heb het gedaan" is een bewering. Het bestand is het
bewijs.

---

## 4. Meet twee keer voor alles op de sporten 0–2

Eén enkele controle certificeert nooit een veiligheidstoestand. Twee onafhankelijke metingen vóór elke
bewering van Prioriteit 0, altijd.

**Meet opnieuw, onthoud nooit.** Een boom beweegt onder gelijktijdige sessies — een pad dat aan het begin
van een beurt is gelezen, kan aan het eind ervan verdwenen zijn. De toestand is alleen kenbaar van de
schijf in *deze* uitvoering. Draag nooit "vrij" of "actueel" over uit een eerdere beurt, een
geheugenbestand of een samenvatting.

**Een telling is een meting, geen feit.** Tel opnieuw op het punt van gebruik. Citeer nooit uit het
geheugen een aantal bestanden, een aantal agents of een versie.

---

## 5. Een weggevallen aanroep is geen bevinding

Bij **transportverlies** — DNS-fout, verbinding gereset, geweigerd, time-out zonder antwoord — herhaal
dezelfde aanroep onmiddellijk en herhaaldelijk. Schrijf nooit "geen resultaten" voor een aanroep die nooit
is aangekomen, en vul het gat nooit uit het geheugen.

**Een antwoord dat is aangekomen, is een antwoord, geen aanleiding tot herhalen.** Een 403, een 404, een
lege resultatenverzameling, een uitdrukkelijke weigering — dat zijn gegevens. Opnieuw proberen tegen een
weigering in om een ander antwoord te krijgen, is detectieomzeiling, en dat is op sport 2 verboden,
ongeacht op wiens account of netwerk het draait.

Het onderscheid in één regel: *herhaal de aanroep die nooit is aangekomen; herhaal nooit het antwoord dat
je niet beviel.*

---

## 6. Negatieve bevindingen tellen

"X gecontroleerd, geen gevaar" is wat de volgende drie sessies ervan weerhoudt X opnieuw te controleren.
Leg het vast.

**Leg vast terwijl je leert, niet aan het eind.** Een bevinding die alleen in het werkgeheugen wordt
bewaard en daarna verloren gaat, is niet te onderscheiden van werk dat nooit is gedaan.

---

## 7. Verwijderingen zijn het integriteitssignaal

Bij het toetsen van een boom aan een uitgangsstand heeft het rapport drie klassen — toegevoegd, gewijzigd,
verwijderd. Groei en bewerkingen zijn verwachte beweging. **Een verwijdering is de regel waarop het de
moeite waard is alarm te slaan.**

Leg geen nieuwe uitgangsstand vast over ongecontroleerd gelijktijdig werk. Eerst controleren, dan
stempelen.

---

## 8. Controle is een rol, geen stemming

Een controleur somt elke agent, opdracht en opdrachtstelling **van de schijf** op en toetst elk aan vaste
klassen — waarbij zowel schone controles als gebreken worden geteld. Een uitvoering die niets vrijgeeft,
heeft niets gecontroleerd; zij heeft alleen klachten verzameld.

**De controleur repareert nooit.** Bevindingen gaan naar het correctieproces
([`05-CORRECTION.md`](05-CORRECTION.md)) of naar de verantwoordelijke agent. Een controleur die repareert
wat hij vindt, heeft zijn eigen bewijs vernietigd en kan niet langer worden vertrouwd om een schone
uitvoering te melden.

---

## 9. De regel waaraan al deze dienen

> Een feit dat in zes bestanden wordt beweerd, is in vijf ervan onjuist.

Bewijsdiscipline is wat het zesde vindbaar maakt.
