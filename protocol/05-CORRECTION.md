> **Uoffisiell oversettelse.** Den normative versjonen av dette dokumentet er den engelske, i grenen
> `main`. Denne oversettelsen er gjort tilgjengelig for enkelhets skyld og **er ikke gjennomgått av en
> morsmålsbruker**. Ved avvik fra den engelske originalen **gjelder engelsk**. Protokollens betegnelser
> (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, bussens verb og filnavnene) beholdes bevisst på
> engelsk: det er bokstavelige verdier som agenter tolker.

# 05 — RETTELSE

**Status: normativ.** Hva som skjer når en nedskrevet kjensgjerning viser seg å være feil.

---

## 1. Problemet

> En kjensgjerning som hevdes i seks filer, vil være feil i fem av dem.

Å rette filen du tilfeldigvis har foran deg, er ingen rettelse. Det skaper et tre der både sannheten og feilen
har henvisninger, og neste økt tar den som åpnes først. Dette er den kjennetegnende feilmåten for en
dokumentasjonstung agentflåte, og den forverres taust.

**En rettelse sprer seg, eller så fant den ikke sted.**

---

## 2. Å lese er ikke gratis — det forplikter

Å lese en styrende fil setter deg under den. To ting følger:

1. Alt i den som er **varig, ikke innlysende og ikke utledbart av treet**, går til det varige minnet ditt før
   økten slutter.
2. **Motsier sammenhengen din filen, vinner filen.** Gå ikke utenom den. Rett protokollen.

---

## 3. Umiddelbar kursrettelse (ICC)

Én kommando, ett trekk, uten forslagssteg.

```
/icc the planner meal times are placeholders, not the Operator's actual times
```

### Rekkefølgen

**1 · Gjennomgang.** Utled av rettelsen 2 til 5 søkeord: den **gamle** formuleringen, dens åpenbare varianter og
egennavnene som inngår. Ikke den nye formuleringen. Kjør én indeksert gjennomgang per søkeord før du leser noe.
Gå aldri gjennom treet fil for fil for å finne treff — det er hva indeksen er til for.

**2 · Klassifiser hvert treff.**

| Treff | Handling |
|---|---|
| **Hevder den gamle kjensgjerningen** | Skriv den om. |
| **Nevner den i forbifarten**, sant uansett | La den være. Rør ikke i teksten. |
| **Motsier den nye kjensgjerningen indirekte** — en avledet slutning, en tabellrad, en planlagt jobb bygd på den gamle verdien | **Skriv også den om.** Den overses oftest. |
| **Utenfor grensene** (§5) | Rediger aldri. Noter under *Left alone*. |

**3 · Skriv om alt på én gang.** Følg hver fils bestående stemme og dens sedvane for tillitsmerking. En rettet
kjensgjerning beholder den merkingen den fortjener — **oppgrader ikke en påstand til `[PROVEN]` fordi den nå er
gjeldende.** Bar den gamle teksten en dato, sett dagens.

Der en kjensgjerning hevdes i mer enn tre filer, er det **dobling, ikke redundans**: oppgi den én gang i filen
som eier den, og la de øvrige peke dit.

**4 · Protokoll og minne.** Begge, ellers er kjøringen ikke ferdig. Sett en post øverst i rettelsesprotokollen:

```
## 2026-01-14 — meal times are placeholders

Was      planner asserts 07:30 / 12:00 / 18:30 as the Operator's actual times
Now      those are defaults shipped with the template; real times are unknown
Why      Operator correction, 2026-01-14
Files    personal/planner/NOW.md:14, personal/planner/README.md:31, _os/tasks/INDEX.md:88
Memory   planner-meal-times.md (updated)
Left     backups/ (history), CONTEXT-BUNDLE.md (generated)
```

Skriv deretter kjensgjerningen til det varige minnet — **kontroller først om det allerede finnes en minnepost om
emnet, og oppdater den**, i stedet for å etterlate to utgaver av en kjensgjerning du nettopp har brukt en
kommando på å forene.

**5 · Plikter etter redigering.** Kjør på nytt den generatoren eller sikkerhetskopieringen redigeringene krevde.
Bygg indeksen på nytt dersom filer er opprettet eller slettet.

---

## 4. En stående beslutning omgjøres åpent

Dersom en rettelse ugyldiggjør en stående beslutning — en linje ”ta ikke opp igjen”, en `[PROVEN]`-post, en
policyregel — **snu den ikke taust.** Skriv den om som *omgjort*, med dato og grunn, slik at neste økt vet at den
er opphevet og ikke glemt.

En beslutning som endrer seg uten spor, er ikke til å skille fra en beslutning som aldri ble tatt.

---

## 5. Hva som aldri skrives om

| Røres aldri | Hvorfor |
|---|---|
| `backups/`, `archive/` | Historie. Historie rettes ikke; den avløses. |
| Genererte filer | Rediger kilden, og kjør generatoren på nytt. |
| En isolert agents tre | Tilgang bare etter uttrykkelig utpeking. |
| En annen rots autoritative hovedsammenheng | Meld fra om avviket. Rediger ikke over en eierskapsgrense. |
| Alt som inneholder en hemmelighet | Helt utenfor rekkevidde for en tekstgjennomgang. |

**En gjennomgang som skriver om tekst, vil ødelegge binærfiler.** Begrens hver gjennomgang til tekstendelser via
en tillatelsesliste, aldri ved utelukkelse.

---

## 6. Hva ICC ikke gjør

`/icc` retter protokollen. **Den går deretter ikke ut og utfører arbeidet rettelsen antyder.** Det er atskilte
handlinger med atskilte bemyndigelser, og å blande dem er hvordan en enkeltlinjes rettelse blir til en
ugjennomgått ombygging.

---

## 7. Konkurrerende kjensgjerninger avgjøres og beskjæres — katalogiseres ikke

Når to filer hevder motstridende kjensgjerninger, **avgjør hvilken som er riktig, behold den, og fjern de gale
påstandene i samme gjennomgang.**

En konfliktrapport som lar begge konkurrentene bli på disken, har ikke løst noe. Neste økt tar fortsatt den filen
som åpnes først, og en sikkerhetsregel med fem sirkulerende utgaver er *mindre* pålitelig enn én med en eneste,
ikke mer.

**Avgjør på saklig grunnlag, aldri etter tidsstempel.** Vinneren er filen som eier kjensgjerningen, utgaven som
bæres av en måling, den som holder for gransking. **Det nyeste er ikke det sanneste** — den kanoniske feilen her
er fire doblede minnefiler skrevet med nitti sekunders mellomrom, der den nyeste inneholdt den falske påstanden,
slik at en regel om at ”det nyeste vinner” ville ha arvet feilen.

**Skriv ned avgjørelsen.** Hvilken kjensgjerning som vant, hva som ble beskåret, og hvorfor — i protokollen, slik
at beskjæringen blir lesbar i stedet for taus. En konkurrent som forsvinner uten spor, ser nøyaktig ut som en
konkurrent som aldri fantes, og neste økt skaper den på nytt.

### Hva som likevel eskaleres i stedet for å avgjøres

Tre tilfeller. Vis dem; avgjør dem ikke:

- Motsigelsen hviler på opplysninger agenten ikke har.
- Å ta feil ville være **utrygt eller ugjenkallelig** — alt på trinn 0–2.
- Den tapende påstanden ligger **utenfor agentens eierskapsgrense** — en annen rots autoritative
  hovedsammenheng. Meld fra om avviket; rediger ikke over grensen.

Alt alminnelig avgjøres og ryddes opp.
