> **Onofficiële vertaling.** De normatieve versie van dit document is de Engelse, in de branch `main`.
> Deze vertaling wordt voor het gemak aangeboden en **is niet door een moedertaalspreker
> gecontroleerd**. Bij afwijking van het Engelse origineel **geldt het Engels**. De
> protocolaanduidingen (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, de busverba en de
> bestandsnamen) blijven bewust in het Engels: het zijn letterlijke waarden die agents uitlezen.

# 07 — DE INTERFACELAAG

**Status: normatief.** Dit is het bestand waarnaar het project is genoemd.

Elk oppervlak dat een mens aanraakt, is **Parvis**. Het alleen-lezen vloeroverzicht is de *Parvis HMI*; het
tegelmenu van waaruit je de vloot aanstuurt, is de *Parvis Console*.

---

## 1. De regel die het HTML laat werken

> Een browserpagina is een **scherm en een toetsenbord**, geen programma met schijftoegang.

Dat ene feit beheerst de hele laag:

- **De pagina toont en verzamelt.** Zij geeft toestand weer en neemt invoer aan. Geopend vanaf een
  bestandspad kan zij op zichzelf **de boom niet lezen en geen opdracht schrijven.** De zandbak van de
  browser verbiedt beide, en dat is een pluspunt.
- **De sidecar slaat de brug.** Een kleine lokale lusdienst — gebonden aan `127.0.0.1`, verder niets — is
  het enige dat de boom voor de pagina leest en schrijft wat de pagina indient. De pagina haalt de toestand
  op met `GET`; de pagina verstuurt een prompt met `POST`; de sidecar doet het schijfwerk. **Geen sidecar,
  geen levende Parvis — alleen een momentopname.**
- **Niets omzeilt de toetsing.** Een vanuit Parvis verstuurde prompt is een **inbrenging, geen uitvoering**.
  De sidecar schrijft een `REQ`-regel in de takenindex en stopt. Hij start nooit een agent, voert nooit een
  opdracht uit, verzendt nooit. Nieuw werk vastleggen blijft de toetsaanslag van de Operator.

Daarom "werkt" de pagina: de pagina is eerlijk over het feit dat zij een venster is, de sidecar doet het
kleine echte werk aan de rand, en **de toetsing staat nog steeds tussen een prompt en een bewegende
machine.**

---

## 2. Harde eisen — elk Parvis-oppervlak

1. **Zelfstandig.** Eén HTML-bestand: CSS en JS ingebed, geen externe scripts, geen CDN. Alleen
   weblettertypen, met een echte terugvalreeks. Het moet offline vanaf een bestandspad weergeven.

2. **De kleuren zijn de toestand, live gelezen, nooit voorgewend.** Groen = draaiend, amber = eerst vragen,
   rood = gestopt — afgeleid uit het STATE-bestand en het levende register. **Een waarde zonder levende bron
   toont `—`, nooit een plausibel ogend getal.** Rood gaat boven elke andere kleur en boven de hele
   interface.

3. **De sidecar is alleen lokale lus en bewaart geen geheim dat de pagina kan zien.** Geen API-sleutel, geen
   inloggegeven, geen waardevol token bereikt de browser. De sidecar authenticeert de pagina met een lokaal
   sessietoken en doet het bevoorrechte werk zelf. **De pagina bewaart nooit iets wat de moeite van het
   stelen waard is.**

4. **Een momentopname wordt als momentopname gemerkt,** met haar leestijd. Alleen een pagina die met een
   levende sidecar praat, mag zich als live voordoen. Een verouderde pagina die er live uitziet, is erger
   dan geen pagina.

5. **De noodstop gaat boven de interface.** Onder `STOP` brengt Parvis niets in en schrijft de sidecar niets
   dan de afmeldregel. **Een rode vloer neemt geen opdrachten aan.**

6. **Parvis-merk, en geen namen van derde bedrijven.** Van welke echte systemen het patroon ook is geleerd,
   het patroon is van jou en het heet Parvis. Een oppervlak dat andermans handelsnaam meelevert, is fout en
   wordt gecorrigeerd.

---

## 3. Beveiligingseisen voor de sidecar

Een lokale-lus-HTTP-dienst op een ontwikkelwerkplek is een echt aanvalsoppervlak. Deze punten zijn niet
optioneel.

| Eis | Waarom |
|---|---|
| **Bind `127.0.0.1` expliciet**, nooit `0.0.0.0` | Alle interfaces binden publiceert je vlootconsole op het lokale netwerk. |
| **Valideer de `Host`-header** tegen een toelatingslijst van `127.0.0.1:<port>` / `localhost:<port>` | Verslaat DNS-rebinding, waarmee een bezochte webpagina een lokale lusdienst bereikt. |
| **Weiger verzoeken met een `Origin` die je niet hebt uitgegeven** | Dezelfde aanvalsklasse, andere vector. |
| **Eis een sessietoken** op elke wijzigende route, uitgegeven bij het laden van de pagina, nooit gelogd | De pagina bewijst dat zij jouw pagina is. |
| **Zet elk pad** dat de dienst leest of schrijft **op een toelatingslijst**, los het daarna opnieuw op en bevestig de insluiting | Verslaat padtraversal. Een toelatingslijst alleen volstaat niet als er symbolische koppelingen bestaan. |
| **Faal veilig bij een onleesbare estop** — weiger, val niet terug op `RUN` | Zie [`01-ESTOP.md`](01-ESTOP.md) §2. |
| **Geen `eval`, geen shell-aanroep, geen sjablooninvoeging van gebruikersinvoer** | De promptbalk is een inbrengveld, geen opdrachtregel. |

De referentie-implementatie in [`reference/sidecar/`](../reference/sidecar/) verwezenlijkt al deze punten en
is bij elk ervan van commentaar voorzien.

---

## 4. Wat de oppervlakken zijn

| Oppervlak | Wat | Stand |
|---|---|---|
| **Parvis Console** | Panelen met tabbladen — toestand, documenten, register, bus, oppervlak, instellingen | Uitgeleverd. |
| **Parvis Floor** | Het tabblad Magazijn: 3D-vloer, omcirkelen en indalen, apparatuurbediening | Uitgeleverd. Zie [`09-FLOOR.md`](09-FLOOR.md). |
| **Promptbalk** | Het inbrengveld, op de console en op elk vloerwerktuig | Uitgeleverd. |
| **De sidecar** | Lokale-lusbrug: leest de boom, schrijft `REQ`-regels, bewaart geen geheim | Uitgeleverd. |

**Lever eerst de panelen uit.** De 3D-vloer is het deel dat iedereen wil bouwen en het deel dat niets waard
is zonder het register eronder — zij geeft toestand weer die de rest van het protocol voortbrengt, en op een
lege boom toont zij terecht niets.

---

## 5. Uitgangspunt

- **De pagina leest. De sidecar schrijft. De Operator legt vast.**
- Geen enkel oppervlak start, verzendt, rolt uit of heft een noodstop op.
- Geen geheim bereikt de browser, nooit.
- Uitvoer gaat naar bestanden en naar de console, niet naar een chatvenster
  ([`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)).
