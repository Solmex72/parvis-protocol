> **Uoffisiell oversettelse.** Den normative versjonen av dette dokumentet er den engelske, i grenen
> `main`. Denne oversettelsen er gjort tilgjengelig for enkelhets skyld og **er ikke gjennomgått av en
> morsmålsbruker**. Ved avvik fra den engelske originalen **gjelder engelsk**. Protokollens betegnelser
> (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, bussens verb og filnavnene) beholdes bevisst på
> engelsk: det er bokstavelige verdier som agenter tolker.

# 06 — DATASONER

**Status: normativ.** Hvor en fil får bo.

---

## 1. Hvorfor et forbud ikke virket

Den opprinnelige regelen lød *”ingen hemmeligheter, aldri, ingen steder”* — **uten noe sted å legge private data
i stedet.**

Et forbud uten bestemmelsessted blir ikke overholdt. Det omgås, og privat materiale havner ved et uhell i det
synkroniserte treet. Det skjedde gjentatte ganger, også ved en agent som selv var omfattet av regelen.

**Regelen er en styringsbeslutning, ikke et forbud.**

---

## 2. De to sonene

| Sone | Egenskap | Inneholder |
|---|---|---|
| **PUBLIC** | Synkroniserer til skylagring. **Behandle hver byte som offentliggjort.** | Doktrine, pålegg, agentdefinisjoner, arkitektur, forretningssammenheng, research, teknisk dokumentasjon |
| **PRIVATE** | **Utenfor enhver synkroniseringsrot** — og utenfor brukerprofilen, slik at omdirigering av kjente mapper heller ikke når dit | Hemmeligheter, virkelige personer og personopplysningene deres, private prosjekter og medier, alt det ville være galt å finne i en sikkerhetskopi |

### Prøven

> *Ville det være et problem om dette lå i et skyøyeblikksbilde om et år?*

Ja → PRIVATE. Nei → PUBLIC. Ved virkelig usikkerhet → **PRIVATE.** Prisen for overklassifisering er bryderi.
Prisen for underklassifisering kan ikke tas tilbake.

### Vit hva som faktisk synkroniserer

Kontroller dette på den virkelige maskinen, ikke ut fra en antakelse. På en vanlig arbeidsstasjon kan flere
synkroniseringsklienter kjøre samtidig, og alt under brukerens mapper for dokumenter, skrivebord eller bilder
forlater maskinen og oppbevares i versjonshistorikken i uker. **Å slette lokalt kaller det ikke tilbake.**

To følger som hver for seg forårsaker virkelige feil:

1. **Byggeutgang må omdirigeres** ut av en synkroniseringsrot, ellers ødelegger speilet den midt i byggingen.
2. **Nøkler bor utenfor**, bevisst og som standard.

---

## 3. Unntaket: påloggingsopplysninger hører til ingen sone

**Aktive påloggingsopplysninger — passord, API-nøkler, tokens, sendenøkler — hører hjemme i en passordbehandler,
ikke i noen av filsystemene.**

Den private sonen inneholder *private data*. En passordbehandler inneholder *påloggingsopplysninger*. Dette er
ingen ordkløveri: en privat katalog er ikke kryptert som standard, og en fil er en fil. I det øyeblikket én
kopieres, siteres i en utskrift eller vedlegges noe, er den røpet.

**Formuler den private sonens sikkerhetsegenskap snevert, og overdriv den aldri.** Dens eneste påviste egenskap
er vanligvis at *ingenting kopierer den noe sted*. Uten etterprøvd kryptering av hele disken eller enkeltfiler er
den ikke kryptert, ikke sikkerhetskopiert og ingen safe.

---

## 4. Klassifiseringen er Operatørens, og den kan justeres

Hold den levende tabellen i én enkelt fil — `DATA-CLASSIFICATION.md` — der Operatøren flytter kategorier mellom
soner, og som enhver agent leser i stedet for å gjette.

Denne protokollfilen oppgir **mekanismen**. Den filen oppgir **policyen**. Der de to er uenige, vinner
policyfilen.

---

## 5. Følger for agenter

- **Ingen hemmelighet i noe tre som pakkes.** En sammenhengspakke finnes for å limes inn i en ny økt. Navngi hva
  som holdes og hvor; aldri verdien.
- **Ingen hemmelighet når `surface/`.** Den vises på skjermen.
- **Ingen hemmelighet når en nettleser.** Se [`07-INTERFACE.md`](07-INTERFACE.md) §3.
- **Skjul ved henvisning, ikke ved sletting.** `<api key — see password manager entry "acme-prod">` holder
  kjensgjerningen finnbar uten å røpe verdien.

---

## 6. Beskjæring uten tap

Før noe forlater arbeidstreet:

1. Kopier det til et forseglet lager **utenfor røttene** — en arkivfil, ikke nåbar med glob.
2. Forbered stiene i `marked-deletion.md` / `marked-archive.md`.
3. **Utførelsen er Operatørens hånd**, med treet falt til ro.

Slett aldri i mengde under pågående samtidighet.
