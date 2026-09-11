> **Uoffisiell oversettelse.** Den normative versjonen av dette dokumentet er den engelske, i grenen
> `main`. Denne oversettelsen er gjort tilgjengelig for enkelhets skyld og **er ikke gjennomgått av en
> morsmålsbruker**. Ved avvik fra den engelske originalen **gjelder engelsk**. Protokollens betegnelser
> (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, bussens verb og filnavnene) beholdes bevisst på
> engelsk: det er bokstavelige verdier som agenter tolker.

# 01 — ESTOP (NØDSTOPP)

**Status: normativ. Prioritet 0. Bindende for enhver agent i ethvert foretak.**

---

## 0. Hva dette kan og ikke kan — les dette først

**Det kan ikke stanse en pågående økt.** Ingen fil kan det. En agent midt i et svar leser ikke disken, har ingen
avbruddslinje og vil fullføre det den holder på med. Den som sier at en flaggfil stanser en flåte, beskriver et
ønske.

**Bare Operatøren stanser en kjørende agent, ved å lukke vinduet dens.** Det er det virkelige nødstoppet, og det
har aldri vært noe annet.

Det denne filen gjør, er å binde enhver agent i de to øyeblikkene den *faktisk* leser disken:

| Øyeblikk | Plikt |
|---|---|
| **Oppstart** | Les tilstanden før doktrinen din, før minnet ditt, før alt. |
| **Hvert kontrollpunkt** | Før enhver skriving, enhver melding, ethvert verktøykall med sidevirkning, enhver utgift. |

En agent som ser `STOP` og fortsetter, er en defekt agent. Det er hele håndhevingsmodellen: ikke en mekanisme —
en plikt, kontrollert ofte.

Å oppgi grensen ærlig hører til protokollen. Et stopp du tror er øyeblikkelig, er farligere enn ett du vet ikke
er det, fordi du kommer til å stole på det.

---

## 1. De to signalene

### Vakten er kjensgjerningen

En **vanlig fil** med navnet nøyaktig `estop` — uten filendelse, null byte er normalt — i roten av et foretak
eller i **hvilken som helst overordnet katalog** i treet det arbeides på.

```bash
[ -f "$root/estop" ] && echo STOPPED
```

```powershell
if (Test-Path "$root\estop" -PathType Leaf) { 'STOPPED' }
```

Prøv en **fil**, aldri bare forekomst, og aldri et globmønster:

- `ESTOP.md` er doktrine. Den må aldri utløse kontrollen. En sammenligning som tillot det, ville skape et stopp
  Operatøren ikke kan oppheve.
- `_os/estop/` er en katalog. Utløser heller ikke.

Flere røtter utløser **uavhengig**. Kontroller hver enkelt. Oppgi den stien du kjørte `stat` på — aldri
”estoppen”, som skjuler hvilken du så på.

### STATE-filen er et avledet speil

`_os/estop/STATE` — én linje, ingenting mer.

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
| verb | `RUN`, `YELLOW` eller `STOP`. Ingenting annet tolkes. |
| tid | UTC, ISO-8601. |
| hvem | Hvem som utlyste det. Bare Operatøren kan skrive `STOP` / `YELLOW` eller oppheve dem. |
| grunn | Én linje, på klart språk, uten fagsjargong. |

**Er vakten og speilet uenige, vinner stoppet.** Speilet skrives av verktøy og blir foreldet; vakten er
kjensgjerningen.

---

## 2. De tre tilstandene

| STATE | Hva en agent gjør |
|---|---|
| `RUN` | **Fortsett.** Kjør kommandoene arbeidet krever uten å be om lov ved hver enkelt. Stans ikke, rams ikke opp alternativer, sett ikke rutinearbeid i kø bak en bekreftelse. |
| `YELLOW` | **Spør først.** Hver kommando foreslås før den kjøres. Samme arbeid, samme dyktighet — forskjellen er bekreftelsen. |
| `STOP` | Stans. §3. |

### Hva `RUN` ikke gjør

`RUN` fjerner *pausen før rutinearbeid*. Det fjerner **ingen bestående sperre**, for de gjelder handlingens art,
ikke hastigheten:

- påloggingsopplysninger, innlogginger, innkjøp, tildeling av ressurser — **alltid i Operatørens hender**;
- utadrettede handlinger — publisere, sende, rulle ut — **alltid med uttrykkelig klarsignal**;
- alt et menneske skal utføre fysisk — **går fortsatt gjennom sikkerhetssperren**;
- ødeleggende eller ugjenkallelige handlinger — **bekreftes fortsatt, i enhver tilstand**;
- en agents egne stående begrensninger — **avhenger ikke av STATE i det hele tatt**.

`RUN` svarer på spørsmålet *”må jeg spørre før hvert steg?”* — nei. Det svarer ikke på spørsmålet *”kan jeg gjøre
hva som helst?”* En agent som leser `RUN` og deretter gjør noe fra denne listen, har lest tilstanden feil, ikke
blitt bemyndiget av den.

### Feilsikring ved uleselig verb

En STATE-fil som **mangler, er tom, uleselig eller bærer et hvilket som helst annet ord, leses som `YELLOW`** —
aldri som `RUN`. Spør.

> Dette er linjen som oftest snus om i implementasjoner. Et `try { read } catch { return "RUN" }` gjør enhver
> diskfeil, enhver rettighetsendring og enhver skrivefeil til en taus bemyndigelse. Referanse-sidecaren faller
> til `YELLOW` og nekter å betjene ved en lesefeil; se
> [`reference/sidecar/parvis-sidecar.mjs`](../reference/sidecar/parvis-sidecar.mjs).

Vaktfilen går helt foran dette avsnittet: en tilstedeværende `estop`-fil betyr `STOP` uansett hva STATE sier.

**Bare Operatøren skriver denne filen.** Ingen agent skriver den — heller ikke den agenten som fant problemet. En
agent som mener flåten bør stanse, reiser et `GATE` på bussen og sier det. Den stanser ikke flåten på egen
myndighet, og den starter ingen på nytt.

---

## 3. Hva en agent gjør ved `STOP`

1. **Skriv ikke mer.** Verken minnefilen, rapporten eller bussen.
2. **Lagre på stedet, og stans så.** Fullfør ikke noe steg som ikke allerede er skrevet. Merk det som finnes som
   ufullstendig, med én linje om hvor du stanset.

   > Tidligere utkast til denne protokollen sa *forkast*. Det var feil: en forkastet halv rapport ødelegger
   > arbeid omstartsdoktrinen finnes for å verne. Faren er en avkortet fil som senere leses som ferdig — og det
   > er **merkingen** som hindrer det, ikke slettingen.
3. **Si én linje til Operatøren:** `ESTOP observed <timestamp> — <reason>. Holding.`
4. **Stans.** Be ikke om lov til å fortsette. Foreslå ingen omvei. Undersøk ikke om grunnen gjelder deg — den
   gjelder deg.

**En avvisning er et svar, ikke et nytt forsøk.** Gå ikke i løkke og vent på `RUN`. Meld fra og avslutt.

---

## 4. Hva som opphever det

Operatøren setter filen tilbake til `RUN`. Ingenting annet gjør det — ikke en tidsgrense, ikke en agent som anser
problemet løst, ikke tidens gang, ikke en ny økt som aldri så stoppet.

En håndtering som opphever seg selv, er en omvending av feilsikringen og avvises på saklig grunnlag.

---

## 5. Omfang

Nødstoppet gjelder **som standard hele flåten**. Det finnes ikke noe stopp per agent, for feilen som krever et
stopp, begrenser seg nesten aldri til én agent, og et delvis stopp innbyr til nettopp den tankegangen — *”det
gjaldt en annen”* — som denne filen finnes for å forby.

**Isolerte agenter er omfattet.** En agent som ikke er på noen buss og ingen delt flate, leser likevel denne
filen. Isolasjon styrer hva en agent kan *si*. Den styrer aldri om den kan *stanses*.

---

## 6. Mål to ganger

En enkelt grønn kontroll bekrefter aldri en sikkerhetstilstand. Les begge signalene, fra disken, **i denne
kjøringen**. Siter aldri en husket tilstand — verken fra sammenhengen, en minnefil eller et tidligere trekk. Et
feillest `stat`-format er nok til å gi et falskt ”ledig” eller et falskt ”stanset”, og begge deler har skjedd i
praksis.

Den sterkeste tilgjengelige formen er en **vedvarende overvåking** av STATE-filen og hver vaktsti, som bare
melder ved endring: taus så lenge det er ledig, og utløser i det øyeblikket et stopp spennes. Det gjør ”jeg
kontrollerte én gang ved oppstart” om til dekning i sanntid og lukker gapet der et stopp spennes midt i en økt.

---

## 7. Den ærlige grensen, sagt én gang

Denne protokollen gjør et stopp **pålitelig ved hver oppstart og hvert kontrollpunkt**. Den gjør ikke et stopp
**øyeblikkelig**, og ingenting skrevet i et filtre vil noen gang gjøre det.

Går noe galt akkurat nå: **lukk vinduet.** Skriv deretter filen, så den neste agenten som våkner, ikke starter
det igjen.
