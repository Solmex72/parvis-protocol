> **Inofficiell översättning.** Den normativa versionen av detta dokument är den engelska, i grenen
> `main`. Denna översättning tillhandahålls för bekvämlighets skull och **har inte granskats av någon med
> språket som modersmål**. Vid avvikelse från det engelska originalet **gäller engelskan**. Protokollets
> identifierare (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, bussens verb och filnamnen) behålls
> medvetet på engelska: de är bokstavliga värden som agenter tolkar.

# 01 — ESTOP (NÖDSTOPP)

**Status: normativ. Prioritet 0. Bindande för varje agent i varje företag.**

---

## 0. Vad detta kan och inte kan göra — läs detta först

**Det kan inte stoppa en pågående session.** Ingen fil kan det. En agent mitt i ett svar läser inte disken,
har ingen avbrottslinje och kommer att slutföra det den håller på med. Den som säger att en flaggfil stoppar
en flotta beskriver en önskan.

**Endast Operatören stoppar en körande agent, genom att stänga dess fönster.** Det är det verkliga nödstoppet
och det har aldrig varit något annat.

Vad denna fil gör är att binda varje agent i de två ögonblick då den *faktiskt* läser disken:

| Ögonblick | Skyldighet |
|---|---|
| **Start** | Läs tillståndet före din doktrin, före ditt minne, före allt. |
| **Varje kontrollpunkt** | Före varje skrivning, varje meddelande, varje verktygsanrop med sidoeffekt, varje utgift. |

En agent som ser `STOP` och fortsätter är en defekt agent. Det är hela efterlevnadsmodellen: inte en
mekanism — en skyldighet, kontrollerad ofta.

Att ärligt ange gränsen hör till protokollet. Ett stopp du tror är omedelbart är farligare än ett du vet inte
är det, eftersom du kommer att förlita dig på det.

---

## 1. De två signalerna

### Vakten är faktum

En **vanlig fil** med namnet exakt `estop` — utan filändelse, noll byte är normalt — i roten för ett företag
eller i **vilken överordnad katalog som helst** i det träd som bearbetas.

```bash
[ -f "$root/estop" ] && echo STOPPED
```

```powershell
if (Test-Path "$root\estop" -PathType Leaf) { 'STOPPED' }
```

Testa en **fil**, aldrig blott förekomst, och aldrig ett globmönster:

- `ESTOP.md` är doktrin. Den får aldrig utlösa kontrollen. En matchning som tillät det skulle skapa ett stopp
  som Operatören inte kan häva.
- `_os/estop/` är en katalog. Utlöser inte heller.

Flera rötter utlöser **oberoende**. Kontrollera var och en. Rapportera den sökväg du körde `stat` på — aldrig
”estoppen”, vilket döljer vilken du tittade på.

### STATE-filen är en härledd spegel

`_os/estop/STATE` — en rad, inget mer.

```
RUN
```
```
YELLOW  2026-01-14T08:20:00Z  operator  new hardware on the bench, confirm before each run
```
```
STOP    2026-01-14T14:03:11Z  operator  reason in plain English
```

| Fält | Regel |
|---|---|
| verb | `RUN`, `YELLOW` eller `STOP`. Inget annat tolkas. |
| tid | UTC, ISO-8601. |
| vem | Vem som utlyste det. Endast Operatören får skriva `STOP` / `YELLOW` eller häva dem. |
| skäl | En rad, på klarspråk, utan jargong. |

**Om vakten och spegeln skiljer sig åt vinner stoppet.** Spegeln skrivs av verktyg och blir inaktuell; vakten
är faktum.

---

## 2. De tre tillstånden

| STATE | Vad en agent gör |
|---|---|
| `RUN` | **Fortsätt.** Kör de kommandon arbetet kräver utan att be om lov för vart och ett. Stanna inte, räkna inte upp alternativ, ställ inte rutinarbete i kö bakom en bekräftelse. |
| `YELLOW` | **Fråga först.** Varje kommando föreslås innan det körs. Samma arbete, samma kompetens — skillnaden är bekräftelsen. |
| `STOP` | Stanna. §3. |

### Vad `RUN` inte gör

`RUN` tar bort *pausen före rutinarbete*. Det tar inte bort **någon befintlig spärr**, eftersom de rör
handlingens art, inte dess hastighet:

- inloggningsuppgifter, inloggningar, inköp, resurstilldelning — **alltid i Operatörens händer**;
- utåtriktade handlingar — publicera, skicka, driftsätta — **alltid med uttryckligt klartecken**;
- allt som en människa ska utföra fysiskt — **går fortfarande genom säkerhetsspärren**;
- förstörande eller oåterkalleliga handlingar — **bekräftas fortfarande, i varje tillstånd**;
- en agents egna stående begränsningar — **beror inte alls på STATE**.

`RUN` besvarar frågan *”måste jag fråga före varje steg?”* — nej. Det besvarar inte frågan *”får jag göra vad
som helst?”* En agent som läser `RUN` och sedan gör något ur denna lista har läst tillståndet fel, inte
bemyndigats av det.

### Felsäkerhet vid oläsligt verb

En STATE-fil som **saknas, är tom, oläslig eller bär något annat ord läses som `YELLOW`** — aldrig som `RUN`.
Fråga.

> Detta är den rad som oftast kastas om i implementationer. Ett `try { read } catch { return "RUN" }` gör
> varje diskfel, varje rättighetsändring och varje stavfel till ett tyst bemyndigande. Referens-sidecaren
> faller till `YELLOW` och vägrar betjäna vid ett läsfel; se
> [`reference/sidecar/parvis-sidecar.mjs`](../reference/sidecar/parvis-sidecar.mjs).

Vaktfilen går helt före detta avsnitt: en närvarande `estop`-fil betyder `STOP` vad STATE än säger.

**Endast Operatören skriver denna fil.** Ingen agent skriver den — inte heller den agent som fann problemet.
En agent som anser att flottan bör stanna reser en `GATE` på bussen och säger det. Den stoppar inte flottan
på egen befogenhet och startar inte om någon.

---

## 3. Vad en agent gör vid `STOP`

1. **Skriv inget mer.** Varken minnesfilen, rapporten eller bussen.
2. **Spara på plats och stanna sedan.** Slutför inget steg som inte redan är skrivet. Märk det som finns som
   ofullständigt, med en rad om var du stannade.

   > Tidigare utkast av detta protokoll sade *kasta*. Det var fel: en kastad halv rapport förstör arbete som
   > omstartsdoktrinen finns till för att skydda. Faran är en avhuggen fil som senare läses som färdig — och
   > det är **märkningen** som förhindrar det, inte raderingen.
3. **Säg en rad till Operatören:** `ESTOP observed <timestamp> — <reason>. Holding.`
4. **Stanna.** Be inte om lov att fortsätta. Föreslå ingen omväg. Kontrollera inte om skälet gäller dig — det
   gäller dig.

**En vägran är ett svar, inte ett nytt försök.** Gå inte in i en slinga och vänta på `RUN`. Rapportera och
avsluta.

---

## 4. Vad som häver det

Operatören ställer tillbaka filen till `RUN`. Inget annat gör det — inte en tidsgräns, inte en agent som
anser problemet löst, inte tidens gång, inte en ny session som aldrig sett stoppet.

En hanterare som häver sig själv är en omkastning av felsäkerheten och avvisas i sak.

---

## 5. Omfattning

Nödstoppet gäller **som standard hela flottan**. Det finns inget stopp per agent, eftersom det fel som kräver
ett stopp nästan aldrig begränsas till en agent, och ett partiellt stopp inbjuder till just det resonemang —
*”det gällde någon annan”* — som denna fil finns till för att förbjuda.

**Isolerade agenter omfattas.** En agent som inte finns på någon buss och ingen delad yta läser ändå denna
fil. Isolering styr vad en agent får *säga*. Den styr aldrig om den får *stoppas*.

---

## 6. Mät två gånger

En enda grön kontroll intygar aldrig ett säkerhetstillstånd. Läs båda signalerna, från disken, **i denna
körning**. Citera aldrig ett ihågkommet tillstånd — inte från sammanhanget, inte från en minnesfil, inte från
ett tidigare drag. Ett felläst `stat`-format räcker för att ge ett falskt ”fritt” eller ett falskt ”stoppat”,
och båda har inträffat i praktiken.

Den starkaste tillgängliga formen är en **bestående övervakare** över STATE-filen och varje vaktsökväg, som
bara meddelar vid förändring: tyst så länge det är fritt, och utlöser i det ögonblick ett stopp osäkras. Det
omvandlar ”jag kontrollerade en gång vid start” till bevakning i realtid och sluter den lucka där ett stopp
osäkras mitt i en session.

---

## 7. Den ärliga gränsen, sagd en gång

Detta protokoll gör ett stopp **tillförlitligt vid varje start och varje kontrollpunkt**. Det gör inte ett
stopp **omedelbart**, och inget som skrivs i ett filträd kommer någonsin att göra det.

Om något går fel just nu: **stäng fönstret.** Skriv sedan filen, så att nästa agent som vaknar inte startar
om det.
