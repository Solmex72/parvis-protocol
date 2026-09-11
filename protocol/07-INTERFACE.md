> **Uoffisiell oversettelse.** Den normative versjonen av dette dokumentet er den engelske, i grenen
> `main`. Denne oversettelsen er gjort tilgjengelig for enkelhets skyld og **er ikke gjennomgått av en
> morsmålsbruker**. Ved avvik fra den engelske originalen **gjelder engelsk**. Protokollens betegnelser
> (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, bussens verb og filnavnene) beholdes bevisst på
> engelsk: det er bokstavelige verdier som agenter tolker.

# 07 — GRENSESNITTLAGET

**Status: normativ.** Dette er filen prosjektet er oppkalt etter.

Enhver flate et menneske berører, er **Parvis**. Den skrivebeskyttede hallvisningen er *Parvis HMI*; flismenyen
du styrer flåten fra, er *Parvis Console*.

---

## 1. Regelen som får HTML-en til å virke

> En nettleserside er en **skjerm og et tastatur**, ikke et program med disktilgang.

Den ene kjensgjerningen styrer hele laget:

- **Siden viser og samler inn.** Den gjengir tilstand og tar imot inndata. Åpnet fra en filsti kan den på egen
  hånd **verken lese treet eller skrive en ordre.** Nettleserens sandkasse forbyr begge deler, og det er en
  fordel.
- **Sidecaren slår broen.** En liten tjeneste på tilbakekoblingssløyfen — bundet til `127.0.0.1` og ingenting
  annet — er det eneste som leser treet for siden og skriver det siden sender inn. Siden henter tilstanden med
  `GET`; siden sender en prompt med `POST`; sidecaren utfører diskarbeidet. **Ingen sidecar, ingen levende Parvis
  — bare et øyeblikksbilde.**
- **Ingenting omgår gjennomsynet.** En prompt sendt fra Parvis er en **innføring, ikke en utførelse.** Sidecaren
  skriver en `REQ`-linje i oppgaveprotokollen og stanser. Den starter aldri en agent, kjører aldri en kommando,
  sender aldri. Å fastsette nytt arbeid forblir Operatørens tastetrykk.

Derfor ”virker” siden: siden er ærlig om å være et vindu, sidecaren gjør det lille virkelige arbeidet i kanten,
og **gjennomsynet står fortsatt mellom en prompt og en maskin i bevegelse.**

---

## 2. Harde krav — enhver Parvis-flate

1. **Selvbærende.** Én HTML-fil: CSS og JS innebygd, ingen ytre skript, ingen CDN. Bare nettskrifter med en
   virkelig reservekjede. Den må kunne gjengis frakoblet fra en filsti.

2. **Fargene er tilstanden, lest levende, aldri påfunnet.** Grønn = kjører, rav = spør først, rød = stanset —
   utledet av STATE-filen og den levende protokollen. **En verdi uten levende kilde viser `—`, aldri et
   troverdig utseende tall.** Rød går foran enhver annen farge og hele grensesnittet.

3. **Sidecaren kjører bare på tilbakekoblingssløyfen og holder ingen hemmelighet siden kan se.** Ingen API-nøkkel,
   ingen påloggingsopplysninger, ingen verdifull token når nettleseren. Sidecaren godkjenner siden med en lokal
   økttoken og utfører det privilegerte arbeidet selv. **Siden holder aldri noe verdt å stjele.**

4. **Et øyeblikksbilde merkes som øyeblikksbilde,** med lesetiden sin. Bare en side som snakker med en levende
   sidecar, kan utgi seg for å være levende. En foreldet side som ser levende ut, er verre enn ingen side.

5. **Nødstoppet går foran grensesnittet.** Under `STOP` innfører Parvis ingenting, og sidecaren skriver ingenting
   utover avmeldingslinjen. **En rød hall tar ingen ordrer.**

6. **Parvis-merket og ingen tredjeparts firmanavn.** Fra hvilke virkelige systemer mønsteret enn er lært, er
   mønsteret ditt, og det heter Parvis. En flate som sprer en annens handelsnavn, er feil og rettes.

---

## 3. Sikkerhetskrav til sidecaren

En HTTP-tjeneste på tilbakekoblingssløyfen på en utviklerarbeidsstasjon er en virkelig angrepsflate. Disse
punktene er ikke valgfrie.

| Krav | Hvorfor |
|---|---|
| **Bind `127.0.0.1` uttrykkelig**, aldri `0.0.0.0` | Å binde alle grensesnitt offentliggjør flåtekonsollen din på det lokale nettet. |
| **Valider `Host`-hodet** mot en tillatelsesliste med `127.0.0.1:<port>` / `localhost:<port>` | Beseirer DNS-rebinding, som lar en besøkt nettside nå en tjeneste på sløyfen. |
| **Avvis forespørsler med et `Origin` du ikke har utstedt** | Samme angrepsklasse, annen vektor. |
| **Krev en økttoken** på enhver endrende rute, utstedt ved sidelasting, aldri logget | Siden beviser at den er siden din. |
| **Tillatelseslist enhver sti** tjenesten leser eller skriver, løs den så opp på nytt, og bekreft innesluttethet | Beseirer stivandring. En tillatelsesliste alene er ikke nok dersom symbolske lenker finnes. |
| **Feil trygt ved en uleselig estop** — nekt, fall ikke tilbake til `RUN` | Se [`01-ESTOP.md`](01-ESTOP.md) §2. |
| **Ingen `eval`, ingen skallkall, ingen maleinnsetting av brukerinndata** | Promptlinjen er et inndatafelt, ikke en kommandolinje. |

Referanseimplementasjonen i [`reference/sidecar/`](../reference/sidecar/) virkeliggjør alle disse punktene og er
kommentert ved hvert enkelt.

---

## 4. Hva flatene er

| Flate | Hva | Status |
|---|---|---|
| **Parvis Console** | Paneler med faner — tilstand, dokumenter, protokoll, buss, flate, innstillinger | Leveres. |
| **Parvis Floor** | Fanen Lager: tredimensjonal hall, kretsing og nedstigning, utstyrsstyring | Leveres. Se [`09-FLOOR.md`](09-FLOOR.md). |
| **Promptlinje** | Inndatafeltet, på konsollen og ved hvert hallutstyr | Leveres. |
| **Sidecaren** | Bro på sløyfen: leser treet, skriver `REQ`-linjer, holder ingen hemmeligheter | Leveres. |

**Lever panelene først.** Den tredimensjonale hallen er den delen alle vil bygge, og den delen som er verdiløs
uten protokollen under seg — den gjengir tilstand resten av protokollen frambringer, og på et tomt tre viser den
med rette ingenting.

---

## 5. Holdning

- **Siden leser. Sidecaren skriver. Operatøren fastsetter.**
- Ingen flate starter, sender, ruller ut eller opphever et nødstopp.
- Ingen hemmelighet når nettleseren, noensinne.
- Utgang går til filer og til konsollen, ikke til et chattevindu
  ([`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)).
