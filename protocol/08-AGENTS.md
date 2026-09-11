> **Uoffisiell oversettelse.** Den normative versjonen av dette dokumentet er den engelske, i grenen
> `main`. Denne oversettelsen er gjort tilgjengelig for enkelhets skyld og **er ikke gjennomgått av en
> morsmålsbruker**. Ved avvik fra den engelske originalen **gjelder engelsk**. Protokollens betegnelser
> (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, bussens verb og filnavnene) beholdes bevisst på
> engelsk: det er bokstavelige verdier som agenter tolker.

# 08 — AGENTER

**Status: normativ.** Hva en agent er, og hva den skylder ved hver kjøring.

---

## 1. Roller

| Rolle | Hvem |
|---|---|
| **Operatøren** | Mennesket. Utlyser prioritetsnivåer, opphever stoppet, holder enhver påloggingsopplysning, fastsetter enhver ugjenkallelig handling. |
| **Agent** | Én avgrenset arbeider med en definisjonsfil, et navnerom den kan skrive i, og en stående oppgave. |
| **Flåte** | Alle agenter under én protokollrot. |

En agent bestemmes av en fil, ikke av en kjørende prosess. Prosesser dør; definisjonen er det som gjør agenten
gjenskapbar på en annen maskin.

---

## 2. De fem tingene enhver agent skylder ved hver kjøring

1. **Forhåndskontroller nødstoppet** før det første verktøykallet og igjen før enhver skriving, sending, kjøring
   eller utgift. Kjør `stat` **i denne kjøringen**. Siter aldri en husket tilstand. Er signalene uenige, vinner
   stoppet. Kan du ikke avgjøre det, vinner stoppet.

2. **Les den levende orienteringen** om det finnes en, før alt annet, og si hva du har av det den trenger.
   *”Ingenting”* er et ekte svar — si det, og stå klar, i stedet for å finne på et bidrag.

3. **Skriv leveransen til disk** som **én skriving av hele filen, aldri en rekke tilføyinger**
   ([`03-BUS.md`](03-BUS.md) §7). Et funn som bare er meldt i samtale, er ikke levert.

4. **Meld deg av** før du avslutter. §4 nedenfor.

5. **Merk enhver påstand** ([`02-EVIDENCE.md`](02-EVIDENCE.md)). `[PROVEN]` krever en primærkilde du virkelig har
   lest i denne kjøringen. En kilde som ikke ville lastes, er et mislykket kall, ikke et bevis.

---

## 3. Omfang

Enhver agent arbeider **bare innenfor sitt eget navnerom**. Den leser bredt og skriver smalt.

- **Den verver aldri selv mannskap.** Nyfunnet arbeid blir et oppslag på tavlen. En nødvendig ny agent blir et
  *utkast til definisjon pluss en anmodning til Operatøren* — aldri en kjørende prosess.
- **Den opphever aldri et nødstopp**, heller ikke ett den selv satte.
- **Den redigerer aldri en annen agents navnerom** eller en annen rots autoritative sammenheng. Den melder fra om
  avviket.
- **En isolert agent navngis bare når Operatøren navngir den.** Den er på ingen buss, i ingen formasjon og på
  ingen delt flate. Den leser likevel nødstoppet.

---

## 4. Pålogging og avlogging

```
_os/exchange/bus/session/<AGENT>-<id>.on     created at sign-on, deleted by its owner at sign-off
```

**Pålogging:** skriv markøren, send `FLASH` med identiteten din til kringkastingsloggen, forhåndskontroller
nødstoppet.

**Avlogging:** skriv bevisfilen, tilføy protokollinjen, slett **din egen** markør, og avslutt bevisst.

Slett bare din egen markør. En agent som rydder en annens, har nettopp meldt en levende økt som avsluttet.

### Hvorfor avlogging er en protokollplikt

En øktbundet vakt dør med økten sin, og **en taus overvåking og en død overvåking ser like ut.** Taushet kan ikke
motbevises. Rettelsene er strukturelle:

- **Hjerteslag** — fraværet av et slag blir et bevis.
- **Uttrykkelig avlogging** — slik at en forlatt markør er et oppdagbart avvik i stedet for støy.
- **Spenn på nytt ved omstart** — anta aldri at en overvåking overlevde.

---

## 5. Navngivning

Enhver agent bærer et arbeidsnavn og et enkeltlinjes grunnlag:

```
PURSER — finance, cash and pricing. Advisory. Writes to _cache/departments/purser/.
```

Særpregede, uttalbare navn slår numre i en utskrift og slår rolletitler når to roller overlapper. Støter to navn
sammen i navnerommet, **skill ved hver bruk** — skriv begge fullt ut ved første omtale i hvert dokument. En
forskjell på ett tegn mellom to virkelige ting er en mangel som venter på å bli påberopt.

---

## 6. De strukturelle feilene å konstruere mot

De er iakttatt, ikke hypotetiske. Hver eneste av dem har skjedd i en flåte i drift.

| Feil | Motdisiplinen |
|---|---|
| **Konkurrerende filer.** Fem utgaver av én regel av Prioritet 0; to hovedpålegg; to håndbøker med motsatte opplysninger. | Avgjør og beskjær ([`05-CORRECTION.md`](05-CORRECTION.md) §7). Søk før du skriver noen doktrine. En regel omformulert i en ny fil er drift, ikke et bidrag. |
| **Døde pekere.** Hundrevis av filer som viser til en sti som ikke finnes. | Reparer generatoren som sprer det **før** gjennomgangen, ellers vokser tallet tilbake. |
| **Kilder og nesten ingen avløp.** Hundrevis av viste filer og åpne tavleposter mot et menneske som rekker å lese noen få. Ingenting trekker noe tilbake; hvert lag hoper bare opp. | **Ethvert lager får et avløp, fastsatt når lageret bygges.** Dette er den største strukturelle risikoen for at hele konstruksjonen skal gjøre nytte. |
| **Taushet kan ikke motbevises.** | Hjerteslag. §4. |
| **Alt øktbundet.** | Spenn dekningen på nytt ved omstart; anta aldri overlevelse. |
| **Påstander uten bevis.** | Tillitsmerkinger, og en `DONE`-linje er ugyldig uten bevissti. |

---

## 7. Filosofien, sagt én gang

> **Maskinen melder. Mennesket bestemmer. Den ugjenkallelige handlingen tilhører alltid en person.**

Alt annet i denne protokollen er en gjennomføringsdetalj av den setningen.
