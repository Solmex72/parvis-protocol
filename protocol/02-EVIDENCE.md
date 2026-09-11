> **Uofficiel oversættelse.** Den normative udgave af dette dokument er den engelske, i grenen `main`.
> Denne oversættelse stilles til rådighed for bekvemmelighedens skyld og **er ikke gennemset af en
> modersmålstalende**. Ved afvigelse fra den engelske original **gælder engelsk**. Protokollens
> betegnelser (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, bussens verber og filnavnene) bevares
> bevidst på engelsk: det er bogstavelige værdier, som agenter fortolker.

# 02 — BEVIS

**Status: normativ.** Hvordan en iagttagelse bliver en nedskrevet kendsgerning.

Den disciplin, denne fil beskriver, anvendes sædvanligvis på *forslag* — en agent siger, hvor sandsynligt det
er, at dens plan virker, før mennesket beslutter. Den anvendes næsten aldrig på *påstande*. Sådan tænker en
flåde omhyggeligt over, hvad den vil have lov til at **gøre**, og skødesløst over, hvad den nedskriver som
**sandt**.

Det er samme handling. En påstand, der indføres i protokollen, er et forslag om, at protokollen skal ændres.
Parvis anvender én disciplin på begge.

---

## 1. Enhver påstand bærer en mærkning

| Mærkning | Betyder | Tilladt hvor |
|---|---|---|
| `[PROVEN]` | Efterprøvet mod en angiven primærkilde, **du har læst i denne kørsel**. Nævn kommandoen, læsningen, målingen. | Hvor som helst, også i en hovedfil. |
| `[CLAIMED]` | Meddelt af noget andet. Ikke efterprøvet. | Arbejdsfiler. Aldrig en hovedfil. |
| `[ASSUMED]` | En arbejdsforudsætning, ingen har kontrolleret. | Arbejdsfiler, udtrykkeligt. |
| `[PROPOSED]` | Et skøn, en anbefaling, en plan. | Forslag. Aldrig protokollen. |

**Mærkningen følger med påstanden.** Et `[PROPOSED]` bliver ikke `[PROVEN]` af at blive kopieret til en
vigtigere fil. Opgradering kræver en ny måling, ikke et nyt sted.

**Kun `[PROVEN]` må ændre en hovedfil.**

---

## 2. Angiv kilde eller markér — hvidvask aldrig

Et tal angiver sin kilde, ellers er det intet tal, men en fornemmelse med et decimaltegn.

Har du ikke kilden, **sig det, og giv ræsonnementet i stedet.** Det er et brugbart svar. Et kildeløst tal, der
fremstilles som kendsgerning, er det ikke.

**Hvidvask aldrig et fejlslag til et fund.** En søgning, der gav fejl, er et mislykket kald, ikke en tom
resultatmængde. En side, der ikke ville indlæses, er intet bevis på fravær. Skriv, hvad der skete.

---

## 3. Selvbeskrivelse er `[CLAIMED]`

En agents beretning om sin egen tilstand, sin egen dækning eller sit eget færdige arbejde er `[CLAIMED]` — hvor
sikker den end er. Først en ydre nedskrivning gør den `[PROVEN]`: en fil på disk, en kommandos returkode, en
loglinie skrevet af noget, der ikke er dig.

Derfor er en `DONE`-linje uden bevissti ugyldig (se
[`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)). ”Jeg gjorde det” er en påstand. Filen er beviset.

---

## 4. Mål to gange for alt på trin 0–2

En enkelt kontrol attesterer aldrig en sikkerhedstilstand. To uafhængige målinger før enhver påstand af
Prioritet 0, altid.

**Mål igen, husk aldrig.** Et træ bevæger sig under samtidige sessioner — en sti, der blev læst i begyndelsen
af et træk, kan være væk ved dets slutning. Tilstanden kendes kun fra disken i *denne* kørsel. Før aldrig
”frit” eller ”aktuelt” videre fra et tidligere træk, en hukommelsesfil eller et sammendrag.

**En optælling er en måling, ikke en kendsgerning.** Tæl om ved brugsstedet. Angiv aldrig efter hukommelsen et
antal filer, et antal agenter eller en version.

---

## 5. Et afbrudt kald er intet fund

Ved **transporttab** — DNS-fejl, nulstillet forbindelse, afvisning, tidsudløb uden svar — gentag samme kald
straks og gentagne gange. Skriv aldrig ”ingen resultater” for et kald, der aldrig nåede frem, og udfyld aldrig
hullet efter hukommelsen.

**Et svar, der nåede frem, er et svar, ikke grund til gentagelse.** En 403, en 404, en tom resultatmængde, en
udtrykkelig afvisning — det er data. At gentage mod en afvisning for at få et andet svar er omgåelse af
opdagelse, og det er forbudt på trin 2 uanset hvis konto og hvis net det kører på.

Forskellen på én linje: *gentag kaldet, der aldrig nåede frem; gentag aldrig svaret, du ikke brød dig om.*

---

## 6. Negative fund tæller

”Kontrolleret X, ingen fare” er det, der afholder de næste tre sessioner fra at kontrollere X igen. Nedskriv
det.

**Nedskriv, mens du lærer, ikke til sidst.** Et fund, der kun holdes i arbejdshukommelsen og derpå går tabt, er
ikke til at skelne fra arbejde, der aldrig blev udført.

---

## 7. Fjernelser er integritetssignalet

Når et træ efterprøves mod en udgangstilstand, har rapporten tre klasser — tilføjet, ændret, fjernet. Vækst og
rettelser er forventet bevægelse. **En fjernelse er den linje, det er værd at slå alarm over.**

Sæt ikke en ny udgangstilstand oven på ukontrolleret samtidigt arbejde. Kontrollér først, stempl bagefter.

---

## 8. Revision er en rolle, ikke et humør

En revisor opremser enhver agent, kommando og pålæg **fra disken** og prøver hver enkelt mod faste klasser — og
tæller både rene kontroller og mangler. En kørsel, der ikke frigør noget, har intet revideret; den har blot
samlet klager.

**Revisoren reparerer aldrig.** Fund går til rettelsesprocessen ([`05-CORRECTION.md`](05-CORRECTION.md)) eller
til den ansvarlige agent. En revisor, der reparerer det, den finder, har ødelagt sit eget bevis og kan ikke
længere betros at melde en ren kørsel.

---

## 9. Reglen, som alt dette tjener

> En kendsgerning, der hævdes i seks filer, vil være forkert i fem af dem.

Bevisdisciplin er det, der gør den sjette mulig at finde.
