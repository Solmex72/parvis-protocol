> **Uofficiel oversættelse.** Den normative udgave af dette dokument er den engelske, i grenen `main`.
> Denne oversættelse stilles til rådighed for bekvemmelighedens skyld og **er ikke gennemset af en
> modersmålstalende**. Ved afvigelse fra den engelske original **gælder engelsk**. Protokollens
> betegnelser (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, bussens verber og filnavnene) bevares
> bevidst på engelsk: det er bogstavelige værdier, som agenter fortolker.

# 01 — ESTOP (NØDSTOP)

**Status: normativ. Prioritet 0. Bindende for enhver agent i ethvert foretagende.**

---

## 0. Hvad dette kan og ikke kan — læs dette først

**Det kan ikke standse en igangværende session.** Ingen fil kan det. En agent midt i et svar læser ikke disken,
har ingen afbrydelseslinje og gør det færdigt, den er i gang med. Den, der siger, at en flagfil standser en
flåde, beskriver et ønske.

**Kun Operatøren standser en kørende agent ved at lukke dens vindue.** Det er det virkelige nødstop, og det har
aldrig været andet.

Hvad denne fil gør, er at binde enhver agent i de to øjeblikke, hvor den *rent faktisk* læser disken:

| Øjeblik | Pligt |
|---|---|
| **Opstart** | Læs tilstanden før din doktrin, før din hukommelse, før alt. |
| **Hvert kontrolpunkt** | Før enhver skrivning, enhver besked, ethvert værktøjskald med sideeffekt, ethvert forbrug. |

En agent, der ser `STOP` og fortsætter, er en defekt agent. Det er hele håndhævelsesmodellen: ikke en mekanisme
— en pligt, kontrolleret ofte.

At angive grænsen ærligt hører til protokollen. Et stop, du tror er øjeblikkeligt, er farligere end et, du ved
ikke er det, fordi du vil forlade dig på det.

---

## 1. De to signaler

### Vagten er kendsgerningen

En **almindelig fil** med navnet nøjagtigt `estop` — uden filendelse, nul byte er normalt — i roden af et
foretagende eller i **et hvilket som helst overordnet katalog** i det træ, der arbejdes på.

```bash
[ -f "$root/estop" ] && echo STOPPED
```

```powershell
if (Test-Path "$root\estop" -PathType Leaf) { 'STOPPED' }
```

Afprøv en **fil**, aldrig blot forekomst, og aldrig et globmønster:

- `ESTOP.md` er doktrin. Den må aldrig udløse kontrollen. En sammenligning, der tillod det, ville skabe et
  stop, Operatøren ikke kan ophæve.
- `_os/estop/` er et katalog. Udløser heller ikke.

Flere rødder udløser **uafhængigt**. Kontrollér hver enkelt. Angiv den sti, du kørte `stat` på — aldrig
”estoppet”, hvilket skjuler, hvilken du kiggede på.

### STATE-filen er et afledt spejl

`_os/estop/STATE` — én linje, intet andet.

```
RUN
```
```
YELLOW  2026-01-14T08:20:00Z  operator  new hardware on the bench, confirm before each run
```
```
STOP    2026-01-14T14:03:11Z  operator  reason in plain English
```

| Felt | Regel |
|---|---|
| verbum | `RUN`, `YELLOW` eller `STOP`. Intet andet fortolkes. |
| tid | UTC, ISO-8601. |
| hvem | Hvem der udråbte det. Kun Operatøren må skrive `STOP` / `YELLOW` eller ophæve dem. |
| grund | Én linje, i klart sprog, uden fagjargon. |

**Hvis vagten og spejlet er uenige, vinder stoppet.** Spejlet skrives af værktøjer og bliver forældet; vagten
er kendsgerningen.

---

## 2. De tre tilstande

| STATE | Hvad en agent gør |
|---|---|
| `RUN` | **Fortsæt.** Kør de kommandoer, arbejdet kræver, uden at bede om lov ved hver enkelt. Stands ikke, opremsning ikke muligheder, sæt ikke rutinearbejde i kø bag en bekræftelse. |
| `YELLOW` | **Spørg først.** Hver kommando foreslås, før den køres. Samme arbejde, samme kunnen — forskellen er bekræftelsen. |
| `STOP` | Stands. §3. |

### Hvad `RUN` ikke gør

`RUN` fjerner *pausen før rutinearbejde*. Det fjerner **ingen bestående spærring**, for de angår handlingens
art, ikke dens hastighed:

- adgangsoplysninger, logins, indkøb, tildeling af ressourcer — **altid i Operatørens hænder**;
- udadvendte handlinger — offentliggøre, sende, udrulle — **altid med udtrykkelig tilladelse**;
- alt, som et menneske skal udføre fysisk — **går fortsat gennem sikkerhedsspærringen**;
- ødelæggende eller uigenkaldelige handlinger — **bekræftes fortsat, i enhver tilstand**;
- en agents egne stående begrænsninger — **afhænger slet ikke af STATE**.

`RUN` besvarer spørgsmålet *”skal jeg spørge før hvert skridt?”* — nej. Det besvarer ikke spørgsmålet *”må jeg
hvad som helst?”* En agent, der læser `RUN` og derpå gør noget fra denne liste, har læst tilstanden forkert,
ikke fået bemyndigelse af den.

### Fejlsikring ved ulæseligt verbum

En STATE-fil, der **mangler, er tom, ulæselig eller bærer et hvilket som helst andet ord, læses som `YELLOW`**
— aldrig som `RUN`. Spørg.

> Dette er den linje, der oftest vendes om i implementeringer. Et `try { read } catch { return "RUN" }` gør
> enhver diskfejl, enhver rettighedsændring og enhver tastefejl til en tavs bemyndigelse. Reference-sidecaren
> falder til `YELLOW` og nægter at betjene ved en læsefejl; se
> [`reference/sidecar/parvis-sidecar.mjs`](../reference/sidecar/parvis-sidecar.mjs).

Vagtfilen går helt forud for dette afsnit: en tilstedeværende `estop`-fil betyder `STOP`, hvad STATE end
siger.

**Kun Operatøren skriver denne fil.** Ingen agent skriver den — heller ikke den agent, der fandt problemet. En
agent, der mener, flåden bør standse, rejser et `GATE` på bussen og siger det. Den standser ikke flåden på egen
myndighed, og den genstarter ingen.

---

## 3. Hvad en agent gør ved `STOP`

1. **Skriv ikke mere.** Hverken hukommelsesfilen, rapporten eller bussen.
2. **Gem på stedet, og stands så.** Fuldfør intet skridt, der ikke allerede er skrevet. Mærk det, der findes,
   som ufuldstændigt, med én linje om, hvor du standsede.

   > Tidligere udkast til denne protokol sagde *kassér*. Det var forkert: en kasseret halv rapport ødelægger
   > arbejde, som genstartsdoktrinen findes for at beskytte. Faren er en afkortet fil, der senere læses som
   > færdig — og det er **mærkningen**, der forhindrer det, ikke sletningen.
3. **Sig én linje til Operatøren:** `ESTOP observed <timestamp> — <reason>. Holding.`
4. **Stands.** Bed ikke om lov til at fortsætte. Foreslå ingen omvej. Undersøg ikke, om grunden gælder dig —
   den gælder dig.

**En afvisning er et svar, ikke et nyt forsøg.** Gå ikke i sløjfe og vent på `RUN`. Indberet og afslut.

---

## 4. Hvad der ophæver det

Operatøren stiller filen tilbage til `RUN`. Intet andet gør det — ikke en tidsgrænse, ikke en agent, der anser
problemet for løst, ikke tidens gang, ikke en ny session, der aldrig så stoppet.

En håndtering, der ophæver sig selv, er en omvending af fejlsikringen og afvises efter sagens kerne.

---

## 5. Omfang

Nødstoppet gælder **som udgangspunkt hele flåden**. Der findes intet stop per agent, for den fejl, der kræver
et stop, begrænser sig næsten aldrig til én agent, og et delvist stop indbyder til netop den tankegang — *”det
handlede om en anden”* — som denne fil findes for at forbyde.

**Isolerede agenter er omfattet.** En agent, der ikke er på nogen bus og ingen delt flade, læser alligevel
denne fil. Isolation styrer, hvad en agent må *sige*. Den styrer aldrig, om den må *standses*.

---

## 6. Mål to gange

En enkelt grøn kontrol attesterer aldrig en sikkerhedstilstand. Læs begge signaler, fra disken, **i denne
kørsel**. Citér aldrig en husket tilstand — hverken fra sammenhængen, en hukommelsesfil eller et tidligere
træk. Et fejllæst `stat`-format er nok til at give et falsk ”frit” eller et falsk ”standset”, og begge dele er
sket i praksis.

Den stærkeste tilgængelige form er en **vedvarende overvågning** af STATE-filen og hver vagtsti, der kun melder
ved ændring: tavs så længe der er frit, og udløser i det øjeblik et stop spændes. Det omsætter ”jeg
kontrollerede én gang ved opstart” til dækning i realtid og lukker det hul, hvor et stop spændes midt i en
session.

---

## 7. Den ærlige grænse, sagt én gang

Denne protokol gør et stop **pålideligt ved hver opstart og hvert kontrolpunkt**. Den gør ikke et stop
**øjeblikkeligt**, og intet skrevet i et filtræ vil nogensinde gøre det.

Går noget galt lige nu: **luk vinduet.** Skriv derefter filen, så den næste agent, der vågner, ikke starter det
igen.
