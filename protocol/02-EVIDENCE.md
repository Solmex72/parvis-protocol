> **Uoffisiell oversettelse.** Den normative versjonen av dette dokumentet er den engelske, i grenen
> `main`. Denne oversettelsen er gjort tilgjengelig for enkelhets skyld og **er ikke gjennomgått av en
> morsmålsbruker**. Ved avvik fra den engelske originalen **gjelder engelsk**. Protokollens betegnelser
> (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, bussens verb og filnavnene) beholdes bevisst på
> engelsk: det er bokstavelige verdier som agenter tolker.

# 02 — BEVIS

**Status: normativ.** Hvordan en iakttakelse blir en nedskrevet kjensgjerning.

Disiplinen denne filen beskriver, brukes vanligvis på *forslag* — en agent sier hvor sannsynlig det er at planen
dens virker, før mennesket bestemmer. Den brukes nesten aldri på *påstander*. Slik tenker en flåte nøye over hva
den vil ha lov til å **gjøre**, og skjødesløst over hva den skriver ned som **sant**.

Det er samme handling. En påstand som føres inn i protokollen, er et forslag om at protokollen skal endres.
Parvis bruker én disiplin på begge.

---

## 1. Enhver påstand bærer en merking

| Merking | Betyr | Tillatt hvor |
|---|---|---|
| `[PROVEN]` | Etterprøvd mot en oppgitt primærkilde **du har lest i denne kjøringen**. Nevn kommandoen, lesingen, målingen. | Hvor som helst, også i en hovedfil. |
| `[CLAIMED]` | Meldt av noe annet. Ikke etterprøvd. | Arbeidsfiler. Aldri en hovedfil. |
| `[ASSUMED]` | En arbeidsforutsetning ingen har kontrollert. | Arbeidsfiler, uttrykkelig. |
| `[PROPOSED]` | Et anslag, en anbefaling, en plan. | Forslag. Aldri protokollen. |

**Merkingen følger med påstanden.** Et `[PROPOSED]` blir ikke `[PROVEN]` av å bli kopiert til en viktigere fil.
Oppgradering krever en ny måling, ikke et nytt sted.

**Bare `[PROVEN]` kan endre en hovedfil.**

---

## 2. Oppgi kilde eller merk — hvitvask aldri

Et tall oppgir kilden sin, ellers er det ikke et tall, men en anelse med et desimaltegn.

Har du ikke kilden, **si det, og gi resonnementet i stedet.** Det er et brukbart svar. Et kildeløst tall
framstilt som kjensgjerning er det ikke.

**Hvitvask aldri en svikt til et funn.** Et søk som ga feil, er et mislykket kall, ikke et tomt resultatsett. En
side som ikke ville lastes, er ikke bevis på fravær. Skriv hva som skjedde.

---

## 3. Selvbeskrivelse er `[CLAIMED]`

En agents beretning om sin egen tilstand, sin egen dekning eller sitt eget ferdige arbeid er `[CLAIMED]` — uansett
hvor sikker den er. Først en ytre nedskriving gjør den `[PROVEN]`: en fil på disk, en kommandos returkode, en
loggelinje skrevet av noe som ikke er deg.

Derfor er en `DONE`-linje uten bevissti ugyldig (se
[`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)). ”Jeg gjorde det” er en påstand. Filen er beviset.

---

## 4. Mål to ganger for alt på trinn 0–2

En enkelt kontroll bekrefter aldri en sikkerhetstilstand. To uavhengige målinger før enhver påstand av Prioritet
0, alltid.

**Mål på nytt, husk aldri.** Et tre beveger seg under samtidige økter — en sti som ble lest ved begynnelsen av et
trekk, kan være borte ved slutten. Tilstanden er bare kjennbar fra disken i *denne* kjøringen. Før aldri ”ledig”
eller ”gjeldende” videre fra et tidligere trekk, en minnefil eller et sammendrag.

**En opptelling er en måling, ikke en kjensgjerning.** Tell på nytt ved brukspunktet. Oppgi aldri fra minnet et
antall filer, et antall agenter eller en versjon.

---

## 5. Et avbrutt kall er ikke et funn

Ved **transporttap** — DNS-feil, tilbakestilt forbindelse, avvisning, tidsavbrudd uten svar — gjenta samme kall
straks og gjentatte ganger. Skriv aldri ”ingen resultater” for et kall som aldri kom fram, og fyll aldri hullet
fra minnet.

**Et svar som kom fram, er et svar, ikke grunn til gjentakelse.** En 403, en 404, et tomt resultatsett, en
uttrykkelig avvisning — det er data. Å gjenta mot en avvisning for å få et annet svar er omgåelse av oppdagelse,
og det er forbudt på trinn 2 uansett hvem sin konto og hvem sitt nett det kjører på.

Forskjellen på én linje: *gjenta kallet som aldri kom fram; gjenta aldri svaret du ikke likte.*

---

## 6. Negative funn teller

”Kontrollerte X, ingen fare” er det som hindrer de tre neste øktene i å kontrollere X igjen. Skriv det ned.

**Skriv ned mens du lærer, ikke til slutt.** Et funn som bare holdes i arbeidsminnet og deretter går tapt, er
ikke til å skille fra arbeid som aldri ble utført.

---

## 7. Fjerninger er integritetssignalet

Når et tre etterprøves mot en utgangstilstand, har rapporten tre klasser — lagt til, endret, fjernet. Vekst og
redigeringer er ventet bevegelse. **En fjerning er linjen det er verdt å slå alarm om.**

Sett ikke en ny utgangstilstand oppå ukontrollert samtidig arbeid. Kontroller først, stemple etterpå.

---

## 8. Revisjon er en rolle, ikke et humør

En revisor ramser opp enhver agent, kommando og pålegg **fra disken** og prøver hver enkelt mot faste klasser —
og teller både rene kontroller og mangler. En kjøring som ikke frigjør noe, har ikke revidert noe; den har bare
samlet klager.

**Revisoren reparerer aldri.** Funn går til rettelsesprosessen ([`05-CORRECTION.md`](05-CORRECTION.md)) eller til
den ansvarlige agenten. En revisor som reparerer det den finner, har ødelagt sitt eget bevis og kan ikke lenger
betros å melde en ren kjøring.

---

## 9. Regelen alt dette tjener

> En kjensgjerning som hevdes i seks filer, vil være feil i fem av dem.

Bevisdisiplin er det som gjør den sjette mulig å finne.
