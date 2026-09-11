> **Uofficiel oversættelse.** Den normative udgave af dette dokument er den engelske, i grenen `main`.
> Denne oversættelse stilles til rådighed for bekvemmelighedens skyld og **er ikke gennemset af en
> modersmålstalende**. Ved afvigelse fra den engelske original **gælder engelsk**. Protokollens
> betegnelser (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, bussens verber og filnavnene) bevares
> bevidst på engelsk: det er bogstavelige værdier, som agenter fortolker.

# 07 — GRÆNSEFLADELAGET

**Status: normativ.** Dette er den fil, projektet er opkaldt efter.

Enhver flade, et menneske rører ved, er **Parvis**. Den skrivebeskyttede hallevisning er *Parvis HMI*;
flisemenuen, du styrer flåden fra, er *Parvis Console*.

---

## 1. Reglen, der får HTML'en til at virke

> En browserside er en **skærm og et tastatur**, ikke et program med diskadgang.

Den ene kendsgerning styrer hele laget:

- **Siden viser og indsamler.** Den gengiver tilstand og modtager inddata. Åbnet fra en filsti kan den på egen
  hånd **hverken læse træet eller skrive en ordre.** Browserens sandkasse forbyder begge dele, og det er en
  fordel.
- **Sidecaren slår broen.** En lille tjeneste på tilbagekoblingssløjfen — bundet til `127.0.0.1` og intet andet
  — er det eneste, der læser træet for siden og skriver det, siden indsender. Siden henter tilstanden med `GET`;
  siden sender en prompt med `POST`; sidecaren udfører diskarbejdet. **Ingen sidecar, ingen levende Parvis — kun
  et øjebliksbillede.**
- **Intet omgår gennemsynet.** En prompt sendt fra Parvis er en **indføring, ikke en udførelse.** Sidecaren
  skriver en `REQ`-linje i opgaveprotokollen og standser. Den starter aldrig en agent, kører aldrig en kommando,
  sender aldrig. At fastlægge nyt arbejde forbliver Operatørens tastetryk.

Derfor ”virker” siden: siden er ærlig om at være et vindue, sidecaren udfører det lille virkelige arbejde i
kanten, og **gennemsynet står fortsat mellem en prompt og en maskine i bevægelse.**

---

## 2. Hårde krav — enhver Parvis-flade

1. **Selvbærende.** Én HTML-fil: CSS og JS indlejret, ingen ydre scripts, ingen CDN. Kun webskrifttyper med en
   virkelig reservekæde. Den skal kunne gengives offline fra en filsti.

2. **Farverne er tilstanden, læst live, aldrig foregivet.** Grøn = kører, rav = spørg først, rød = standset —
   udledt af STATE-filen og den levende protokol. **En værdi uden levende kilde viser `—`, aldrig et troværdigt
   udseende tal.** Rød går forud for enhver anden farve og hele grænsefladen.

3. **Sidecaren kører kun på tilbagekoblingssløjfen og holder ingen hemmelighed, siden kan se.** Ingen API-nøgle,
   ingen adgangsoplysninger, intet værdifuldt token når browseren. Sidecaren godkender siden med et lokalt
   sessionstoken og udfører det privilegerede arbejde selv. **Siden holder aldrig noget værd at stjæle.**

4. **Et øjebliksbillede mærkes som øjebliksbillede,** med sin læsetid. Kun en side, der taler med en levende
   sidecar, må udgive sig for at være live. En forældet side, der ser live ud, er værre end ingen side.

5. **Nødstoppet går forud for grænsefladen.** Under `STOP` indfører Parvis intet, og sidecaren skriver intet ud
   over afmeldingslinjen. **En rød hal tager ingen ordrer.**

6. **Parvis-mærket og ingen tredjepartsfirmanavne.** Fra hvilke virkelige systemer mønstret end er lært, er
   mønstret dit, og det hedder Parvis. En flade, der udbreder en andens handelsnavn, er forkert og rettes.

---

## 3. Sikkerhedskrav til sidecaren

En HTTP-tjeneste på tilbagekoblingssløjfen på en udviklerarbejdsstation er en virkelig angrebsflade. Disse
punkter er ikke valgfrie.

| Krav | Hvorfor |
|---|---|
| **Bind `127.0.0.1` udtrykkeligt**, aldrig `0.0.0.0` | At binde alle grænseflader offentliggør din flådekonsol på det lokale net. |
| **Validér `Host`-hovedet** mod en tilladelsesliste med `127.0.0.1:<port>` / `localhost:<port>` | Besejrer DNS-rebinding, hvormed en besøgt webside når en tjeneste på sløjfen. |
| **Afvis anmodninger med et `Origin`, du ikke har udstedt** | Samme angrebsklasse, anden vektor. |
| **Kræv et sessionstoken** på enhver ændrende rute, udstedt ved sideindlæsning, aldrig logget | Siden beviser, at den er din side. |
| **Tilladelseslist enhver sti**, tjenesten læser eller skriver, opløs den derefter igen, og bekræft indeslutning | Besejrer stivandring. En tilladelsesliste alene er ikke nok, hvis symbolske links findes. |
| **Fejl sikkert ved en ulæselig estop** — nægt, fald ikke tilbage til `RUN` | Se [`01-ESTOP.md`](01-ESTOP.md) §2. |
| **Ingen `eval`, intet skalkald, ingen skabelonindsættelse af brugerinddata** | Promptlinjen er et inddatafelt, ikke en kommandolinje. |

Referenceimplementeringen i [`reference/sidecar/`](../reference/sidecar/) virkeliggør alle disse punkter og er
kommenteret ved hvert enkelt.

---

## 4. Hvad fladerne er

| Flade | Hvad | Status |
|---|---|---|
| **Parvis Console** | Paneler med faner — tilstand, dokumenter, protokol, bus, flade, indstillinger | Leveres. |
| **Parvis Floor** | Fanen Lager: tredimensionel hal, kredsning og nedstigning, udstyrsstyring | Leveres. Se [`09-FLOOR.md`](09-FLOOR.md). |
| **Promptlinje** | Inddatafeltet, på konsollen og ved hvert haludstyr | Leveres. |
| **Sidecaren** | Bro på sløjfen: læser træet, skriver `REQ`-linjer, holder ingen hemmeligheder | Leveres. |

**Lever panelerne først.** Den tredimensionelle hal er den del, alle vil bygge, og den del, der er værdiløs
uden protokollen under sig — den gengiver tilstand, resten af protokollen frembringer, og på et tomt træ viser
den rigtigt nok intet.

---

## 5. Holdning

- **Siden læser. Sidecaren skriver. Operatøren fastlægger.**
- Ingen flade starter, sender, udruller eller ophæver et nødstop.
- Ingen hemmelighed når browseren, nogensinde.
- Udgang går til filer og til konsollen, ikke til et chatvindue
  ([`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)).
