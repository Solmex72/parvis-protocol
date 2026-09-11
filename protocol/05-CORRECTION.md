> **Uofficiel oversættelse.** Den normative udgave af dette dokument er den engelske, i grenen `main`.
> Denne oversættelse stilles til rådighed for bekvemmelighedens skyld og **er ikke gennemset af en
> modersmålstalende**. Ved afvigelse fra den engelske original **gælder engelsk**. Protokollens
> betegnelser (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, bussens verber og filnavnene) bevares
> bevidst på engelsk: det er bogstavelige værdier, som agenter fortolker.

# 05 — RETTELSE

**Status: normativ.** Hvad der sker, når en nedskrevet kendsgerning viser sig at være forkert.

---

## 1. Problemet

> En kendsgerning, der hævdes i seks filer, vil være forkert i fem af dem.

At rette den fil, du tilfældigvis har foran dig, er ingen rettelse. Det skaber et træ, hvor både sandheden og
fejlen har henvisninger, og næste session tager den, der åbnes først. Dette er den kendetegnende fejlmåde for
en dokumentationstung agentflåde, og den forværres tavst.

**En rettelse breder sig, eller også fandt den ikke sted.**

---

## 2. At læse er ikke gratis — det forpligter

At læse en styrende fil stiller dig under den. To ting følger:

1. Alt i den, der er **varigt, ikke indlysende og ikke udledeligt af træet**, går til din varige hukommelse før
   sessionens slutning.
2. **Modsiger din sammenhæng filen, vinder filen.** Gå ikke uden om den. Ret protokollen.

---

## 3. Øjeblikkelig kursrettelse (ICC)

Én kommando, ét træk, uden forslagstrin.

```
/icc the planner meal times are placeholders, not the Operator's actual times
```

### Rækkefølgen

**1 · Gennemløb.** Udled af rettelsen 2 til 5 søgeord: den **gamle** formulering, dens åbenlyse varianter og de
egennavne, der indgår. Ikke den nye formulering. Kør ét indekseret gennemløb pr. søgeord, før du læser noget.
Gå aldrig træet igennem fil for fil for at finde træffere — det er, hvad indekset er til.

**2 · Klassificér hver træffer.**

| Træffer | Handling |
|---|---|
| **Hævder den gamle kendsgerning** | Omskriv den. |
| **Nævner den i forbifarten**, sandt i begge tilfælde | Lad den være. Rør ikke i teksten. |
| **Modsiger den nye kendsgerning indirekte** — en afledt slutning, en tabelrække, et planlagt job bygget på den gamle værdi | **Omskriv også den.** Den overses oftest. |
| **Uden for grænserne** (§5) | Redigér aldrig. Notér under *Left alone*. |

**3 · Omskriv det hele på én gang.** Følg hver fils bestående stemme og dens sædvane for tillidsmærkning. En
rettet kendsgerning beholder den mærkning, den fortjener — **opgradér ikke en påstand til `[PROVEN]`, fordi den
nu er aktuel.** Bar den gamle tekst en dato, sæt dagens.

Hvor en kendsgerning hævdes i mere end tre filer, er det **fordobling, ikke redundans**: angiv den én gang i den
fil, der ejer den, og lad de øvrige pege derhen.

**4 · Protokol og hukommelse.** Begge, ellers er kørslen ikke færdig. Sæt en post øverst i rettelsesprotokollen:

```
## 2026-01-14 — meal times are placeholders

Was      planner asserts 07:30 / 12:00 / 18:30 as the Operator's actual times
Now      those are defaults shipped with the template; real times are unknown
Why      Operator correction, 2026-01-14
Files    personal/planner/NOW.md:14, personal/planner/README.md:31, _os/tasks/INDEX.md:88
Memory   planner-meal-times.md (updated)
Left     backups/ (history), CONTEXT-BUNDLE.md (generated)
```

Skriv derefter kendsgerningen til den varige hukommelse — **kontrollér først, om der allerede findes en
hukommelsespost om emnet, og opdatér den**, i stedet for at efterlade to udgaver af en kendsgerning, du netop
har brugt en kommando på at forene.

**5 · Pligter efter redigering.** Kør den generator eller sikkerhedskopiering igen, som redigeringerne krævede.
Genopbyg indekset, hvis filer er oprettet eller slettet.

---

## 4. En stående beslutning omstødes åbent

Hvis en rettelse ugyldiggør en stående beslutning — en linje ”tag ikke op igen”, en `[PROVEN]`-post, en
politikregel — **vend den ikke tavst.** Omskriv den som *omstødt*, med dato og grund, så næste session ved, at
den er ophævet og ikke glemt.

En beslutning, der ændrer sig uden spor, er ikke til at skelne fra en beslutning, der aldrig blev truffet.

---

## 5. Hvad der aldrig omskrives

| Røres aldrig | Hvorfor |
|---|---|
| `backups/`, `archive/` | Historie. Historie rettes ikke; den afløses. |
| Genererede filer | Redigér kilden, og kør generatoren igen. |
| En isoleret agents træ | Adgang kun efter udtrykkelig udpegning. |
| En anden rods autoritative hovedsammenhæng | Indberet afvigelsen. Redigér ikke over en ejerskabsgrænse. |
| Alt, der indeholder en hemmelighed | Helt uden for rækkevidde af et tekstgennemløb. |

**Et gennemløb, der omskriver tekst, vil ødelægge binære filer.** Begræns hvert gennemløb til tekstendelser via
en tilladelsesliste, aldrig ved udelukkelse.

---

## 6. Hvad ICC ikke gør

`/icc` retter protokollen. **Den går derefter ikke ud og udfører det arbejde, rettelsen antyder.** Det er
adskilte handlinger med adskilte bemyndigelser, og at blande dem sammen er, hvordan en enkeltlinjet rettelse
bliver til en ugennemset ombygning.

---

## 7. Konkurrerende kendsgerninger afgøres og beskæres — katalogiseres ikke

Når to filer hævder modstridende kendsgerninger, **afgør, hvilken der er rigtig, behold den, og fjern de
forkerte påstande i samme gennemløb.**

En konfliktrapport, der lader begge konkurrenter blive på disken, har intet løst. Næste session tager stadig den
fil, der åbnes først, og en sikkerhedsregel med fem cirkulerende udgaver er *mindre* pålidelig end én med en
enkelt, ikke mere.

**Afgør efter sagens kerne, aldrig efter tidsstempel.** Vinderen er den fil, der ejer kendsgerningen, den udgave,
der bæres af en måling, den, der holder til prøvelse. **Det nyeste er ikke det sandeste** — den kanoniske fejl
her er fire fordoblede hukommelsesfiler skrevet med halvfems sekunders mellemrum, hvor den nyeste indeholdt den
falske påstand, så en regel om at ”det nyeste vinder” ville have arvet fejlen.

**Nedskriv afgørelsen.** Hvilken kendsgerning der vandt, hvad der blev beskåret, og hvorfor — i protokollen, så
beskæringen bliver læselig i stedet for tavs. En konkurrent, der forsvinder uden spor, ser nøjagtig ud som en
konkurrent, der aldrig fandtes, og næste session skaber den på ny.

### Hvad der alligevel opskaleres i stedet for at afgøres

Tre tilfælde. Vis dem; afgør dem ikke:

- Modsigelsen hviler på oplysninger, agenten ikke har.
- At tage fejl ville være **usikkert eller uigenkaldeligt** — alt på trin 0–2.
- Den tabende påstand ligger **uden for agentens ejerskabsgrænse** — en anden rods autoritative
  hovedsammenhæng. Indberet afvigelsen; redigér ikke over grænsen.

Alt almindeligt afgøres og ryddes op.
