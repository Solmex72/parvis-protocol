> **Onofficiële vertaling.** De normatieve versie van dit document is de Engelse, in de branch `main`.
> Deze vertaling wordt voor het gemak aangeboden en **is niet door een moedertaalspreker
> gecontroleerd**. Bij afwijking van het Engelse origineel **geldt het Engels**. De
> protocolaanduidingen (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, de busverba en de
> bestandsnamen) blijven bewust in het Engels: het zijn letterlijke waarden die agents uitlezen.

# 05 — CORRECTIE

**Status: normatief.** Wat er gebeurt wanneer een vastgelegd feit onjuist blijkt.

---

## 1. Het probleem

> Een feit dat in zes bestanden wordt beweerd, is in vijf ervan onjuist.

Het bestand corrigeren dat je toevallig voor je hebt, is geen correctie. Het levert een boom op waarin de
waarheid en de fout allebei verwijzingen hebben, en de volgende sessie pakt degene die zij het eerst
opent. Dit is de kenmerkende faalwijze van een documentatierijke vloot agents, en hij verergert in stilte.

**Een correctie plant zich voort, of zij heeft niet plaatsgevonden.**

---

## 2. Lezen is niet gratis — het verplicht

Een leidend bestand lezen plaatst je eronder. Daaruit volgt tweeërlei:

1. Alles daarin dat **duurzaam, niet vanzelfsprekend en niet uit de boom af te leiden** is, gaat vóór het
   einde van de sessie naar je blijvende geheugen.
2. **Als jouw context het bestand tegenspreekt, wint het bestand.** Omzeil het niet. Corrigeer het
   register.

---

## 3. Onmiddellijke Koerscorrectie (ICC)

Eén opdracht, één beurt, zonder voorstelstap.

```
/icc the planner meal times are placeholders, not the Operator's actual times
```

### De volgorde

**1 · Doorzoeken.** Leid uit de correctie 2 tot 5 zoektermen af: de **oude** formulering, de voor de hand
liggende varianten ervan en de betrokken eigennamen. Niet de nieuwe formulering. Voer per term één
geïndexeerde zoekactie uit voordat je iets leest. Doorloop nooit de boom bestand voor bestand om treffers
te vinden — daar is de index voor.

**2 · Classificeer elke treffer.**

| Treffer | Actie |
|---|---|
| **Beweert het oude feit** | Herschrijf hem. |
| **Noemt het terloops**, in beide gevallen waar | Laat hem. Roer de tekst niet om. |
| **Spreekt het nieuwe feit indirect tegen** — een afgeleide conclusie, een tabelregel, een geplande taak die op de oude waarde is gebouwd | **Herschrijf die ook.** Deze wordt het vaakst gemist. |
| **Buiten bereik** (§5) | Nooit bewerken. Noteer hem onder *Left alone*. |

**3 · Herschrijf, alles in één keer.** Sluit aan bij de bestaande toon van elk bestand en bij de conventie
voor vertrouwensmarkeringen. Een gecorrigeerd feit behoudt de markering die het verdient — **waardeer een
bewering niet op naar `[PROVEN]` omdat zij nu actueel is.** Droeg de oude tekst een datum, zet dan die van
vandaag.

Waar een feit in meer dan drie bestanden wordt beweerd, is dat **verdubbeling, geen redundantie**: noem het
één keer in het bestand dat het bezit, en laat de andere daarnaar verwijzen.

**4 · Register en geheugen.** Beide, anders is de uitvoering niet af. Zet een vermelding boven aan het
correctieregister:

```
## 2026-01-14 — meal times are placeholders

Was      planner asserts 07:30 / 12:00 / 18:30 as the Operator's actual times
Now      those are defaults shipped with the template; real times are unknown
Why      Operator correction, 2026-01-14
Files    personal/planner/NOW.md:14, personal/planner/README.md:31, _os/tasks/INDEX.md:88
Memory   planner-meal-times.md (updated)
Left     backups/ (history), CONTEXT-BUNDLE.md (generated)
```

Schrijf het feit daarna naar het blijvende geheugen — **controleer daarbij eerst of er al een
geheugenvermelding over het onderwerp bestaat en werk die bij**, in plaats van twee versies achter te
laten van een feit dat je zojuist een opdracht lang hebt verenigd.

**5 · Verplichtingen na het bewerken.** Voer de generator of de back-up opnieuw uit waartoe de
bewerkingen verplichten. Bouw de index opnieuw op als er bestanden zijn aangemaakt of verwijderd.

---

## 4. Een staande beslissing wordt in de openbaarheid teruggedraaid

Als een correctie een staande beslissing ongeldig maakt — een regel "niet opnieuw ter discussie", een
`[PROVEN]`-item, een beleidsregel — **draai haar niet stilzwijgend om.** Herschrijf haar als
*teruggedraaid*, met de datum en de reden, zodat de volgende sessie weet dat zij is herroepen en niet
vergeten.

Een beslissing die zonder spoor verandert, is niet te onderscheiden van een beslissing die nooit is
genomen.

---

## 5. Wat nooit wordt herschreven

| Nooit aangeraakt | Waarom |
|---|---|
| `backups/`, `archive/` | Geschiedenis. Geschiedenis wordt niet gecorrigeerd; zij wordt achterhaald. |
| Gegenereerde bestanden | Bewerk de bron en voer de generator opnieuw uit. |
| De boom van een geïsoleerde agent | Toegang alleen na benoeming. |
| De gezaghebbende hoofdcontext van een andere wortel | Meld de afwijking. Bewerk niet over een eigendomsgrens heen. |
| Alles wat een geheim bevat | Volledig buiten het bereik van een tekstdoorzoeking. |

**Een doorzoeking die tekst herschrijft, zal binaire bestanden vernielen.** Beperk elke doorzoeking via een
toelatingslijst tot tekstextensies, nooit via uitsluiting.

---

## 6. Wat ICC niet doet

`/icc` corrigeert het register. **Het gaat daarna niet het werk doen dat de correctie impliceert.** Dat zijn
afzonderlijke handelingen met afzonderlijke machtigingen, en ze door elkaar halen is hoe een correctie van
één regel een ongecontroleerde verbouwing wordt.

---

## 7. Rivaliserende feiten worden beslecht en gesnoeid — niet gecatalogiseerd

Wanneer twee bestanden tegenstrijdige feiten beweren, **beslis welk juist is, houd dat, en verwijder de
onjuiste beweringen in dezelfde doorgang.**

Een conflictrapport dat beide rivalen op schijf laat staan, heeft niets opgelost. De volgende sessie pakt
nog steeds het bestand dat zij het eerst opent, en een veiligheidsregel met vijf circulerende versies is
*minder* betrouwbaar dan een met één versie, niet meer.

**Beslis op de inhoud, nooit op het tijdstempel.** De winnaar is het bestand dat het feit bezit, de versie
die door een meting wordt gedragen, degene die de toets doorstaat. **Het nieuwste is niet het waarste** — de
klassieke mislukking hier zijn vier dubbele geheugenbestanden geschreven binnen negentig seconden van
elkaar, waarbij het nieuwste de onjuiste bewering bevatte, zodat een regel "het nieuwste wint" de fout zou
hebben geërfd.

**Leg de beslechting vast.** Welk feit heeft gewonnen, wat is gesnoeid en waarom — in het register, zodat het
snoeien leesbaar is in plaats van stil. Een rivaal die spoorloos verdwijnt, ziet er precies zo uit als een
rivaal die er nooit is geweest, en de volgende sessie maakt hem opnieuw aan.

### Wat toch wordt opgeschaald in plaats van beslecht

Drie gevallen. Toon ze; beslis ze niet:

- De tegenstrijdigheid berust op informatie die de agent niet heeft.
- Fout zitten zou **onveilig of onomkeerbaar** zijn — alles op de sporten 0–2.
- De verliezende bewering ligt **buiten de eigendomsgrens van de agent** — de gezaghebbende hoofdcontext van
  een andere wortel. Meld de afwijking; bewerk niet over de grens heen.

Al het gewone wordt beslist en opgeruimd.
