> **Uofficiel oversættelse.** Den normative udgave af dette dokument er den engelske, i grenen `main`.
> Denne oversættelse stilles til rådighed for bekvemmelighedens skyld og **er ikke gennemset af en
> modersmålstalende**. Ved afvigelse fra den engelske original **gælder engelsk**. Protokollens
> betegnelser (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, bussens verber og filnavnene) bevares
> bevidst på engelsk: det er bogstavelige værdier, som agenter fortolker.

# 06 — DATAZONER

**Status: normativ.** Hvor en fil må bo.

---

## 1. Hvorfor et forbud ikke virkede

Den oprindelige regel lød *”ingen hemmeligheder, aldrig, ingen steder”* — **uden noget sted at lægge private
data i stedet.**

Et forbud uden bestemmelsessted bliver ikke overholdt. Det omgås, og privat materiale havner ved et uheld i det
synkroniserede træ. Det skete gentagne gange, også ved en agent, der selv var omfattet af reglen.

**Reglen er en styringsbeslutning, ikke et forbud.**

---

## 2. De to zoner

| Zone | Egenskab | Indeholder |
|---|---|---|
| **PUBLIC** | Synkroniserer til skylagring. **Behandl hver byte som offentliggjort.** | Doktrin, pålæg, agentdefinitioner, arkitektur, forretningssammenhæng, research, teknisk dokumentation |
| **PRIVATE** | **Uden for enhver synkroniseringsrod** — og uden for brugerprofilen, så omdirigering af kendte mapper heller ikke når derhen | Hemmeligheder, virkelige personer og deres personoplysninger, private projekter og medier, alt, det ville være forkert at finde i en sikkerhedskopi |

### Prøven

> *Ville det være et problem, hvis dette lå i et skyøjebliksbillede om et år?*

Ja → PRIVATE. Nej → PUBLIC. Ved virkelig usikkerhed → **PRIVATE.** Prisen for overklassificering er besvær.
Prisen for underklassificering kan ikke tages tilbage.

### Vid, hvad der faktisk synkroniserer

Kontrollér dette på den virkelige maskine, ikke ud fra en antagelse. På en almindelig arbejdsstation kan flere
synkroniseringsklienter køre samtidig, og alt under brugerens mapper for dokumenter, skrivebord eller billeder
forlader maskinen og gemmes i versionshistorikken i uger. **At slette lokalt kalder det ikke tilbage.**

To følger, der hver for sig forårsager virkelige fejl:

1. **Bygningsudgang skal omdirigeres** ud af en synkroniseringsrod, ellers ødelægger spejlet den midt i
   bygningen.
2. **Nøgler bor udenfor**, bevidst og som standard.

---

## 3. Undtagelsen: adgangsoplysninger hører til ingen zone

**Aktive adgangsoplysninger — adgangskoder, API-nøgler, tokens, udsendelsesnøgler — hører til i en
adgangskodemanager, ikke i nogen af filsystemerne.**

Den private zone indeholder *private data*. En adgangskodemanager indeholder *adgangsoplysninger*. Dette er
ingen ordkløveri: et privat katalog er ikke krypteret som standard, og en fil er en fil. I det øjeblik én
kopieres, citeres i en udskrift eller vedhæftes noget, er den røbet.

**Formulér den private zones sikkerhedsegenskab snævert, og overdriv den aldrig.** Dens eneste påviste egenskab
er sædvanligvis, at *intet kopierer den nogen steder hen*. Uden efterprøvet kryptering af hele disken eller
enkeltfiler er den ikke krypteret, ikke sikkerhedskopieret og intet pengeskab.

---

## 4. Klassificeringen er Operatørens, og den kan justeres

Hold den levende tabel i én enkelt fil — `DATA-CLASSIFICATION.md` — hvor Operatøren flytter kategorier mellem
zoner, og som enhver agent læser i stedet for at gætte.

Denne protokolfil angiver **mekanismen**. Den fil angiver **politikken**. Hvor de to er uenige, vinder
politikfilen.

---

## 5. Følger for agenter

- **Ingen hemmelighed i noget træ, der pakkes.** En sammenhængspakke findes for at blive indsat i en ny session.
  Navngiv, hvad der holdes, og hvor; aldrig værdien.
- **Ingen hemmelighed når `surface/`.** Den vises på skærmen.
- **Ingen hemmelighed når en browser.** Se [`07-INTERFACE.md`](07-INTERFACE.md) §3.
- **Skjul ved henvisning, ikke ved sletning.** `<api key — see password manager entry "acme-prod">` holder
  kendsgerningen findbar uden at røbe værdien.

---

## 6. Beskæring uden tab

Før noget forlader arbejdstræet:

1. Kopiér det til et forseglet lager **uden for rødderne** — en arkivfil, ikke nåelig med glob.
2. Forbered stierne i `marked-deletion.md` / `marked-archive.md`.
3. **Udførelsen er Operatørens hånd**, med træet faldet til ro.

Slet aldrig i mængde under igangværende samtidighed.
