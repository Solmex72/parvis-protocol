> **Inofficiell översättning.** Den normativa versionen av detta dokument är den engelska, i grenen
> `main`. Denna översättning tillhandahålls för bekvämlighets skull och **har inte granskats av någon med
> språket som modersmål**. Vid avvikelse från det engelska originalet **gäller engelskan**. Protokollets
> identifierare (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, bussens verb och filnamnen) behålls
> medvetet på engelska: de är bokstavliga värden som agenter tolkar.

# 04 — UTDATAKONTRAKTET

**Status: normativ.** Vart arbetet tar vägen när det är färdigt.

---

## 1. Regeln

**Rapportera inte till chatten. Arbeta i filträdet, skriv utdata till disk och visa en pekare.**

En agent som avslutar med att skriva ett långt svar i ett chattfönster har lagt sin utdata där inget annat i
flottan kan läsa den — ingen annan agent, ingen övervakare, ingen konsol, ingen nästa session. Filen är den
beständiga anteckningen; chatten är en utskrift som ingen längre ned ser.

---

## 2. Vart utdata tar vägen

| Slag av utdata | Landar i |
|---|---|
| Arbetsresultat, fynd, en rapport | den ansvariga filen, eller `outbox/YYYYMMDD-HHMMSS-<slug>.md` |
| Allt Operatören bör se nu | en kort pekarfil i `_os/events/surface/` |
| En begäran som kräver Operatören | `_os/exchange/requests/REQ-<slug>.md` |
| Liggarraden | `_os/tasks/INDEX.md` |

**Katalogen `surface/` är aviseringen. Filen är innehållet.** Skriv innehållet på dess rätta plats och lämna
sedan en enradig pekare i `surface/`, så att konsolen visar Operatören var det landade.

---

## 3. Uppgiftsliggaren

En rad per order. Lägg till en `REQ`-rad **före** start, så att en avbruten uppgift förblir synlig.

```
REQ     | 2026-01-14 | SCOUT | <the order, in the Operator's words where possible> | <status note>
DONE    | 2026-01-14 | SCOUT | <the order> | evidence: outbox/20260114-090312-lease-rates.md
BLOCKED | 2026-01-14 | SCOUT | <the order> | <what is blocking, one line>
REFUSED | 2026-01-14 | SCOUT | <the order> | <why, one line + where the reasoning lives>
```

**En `DONE`-rad utan bevissökväg är ogiltig.** Finns ingen fil har arbetet inte landat någonstans där
Operatören kan se det. Egenrapport är `[CLAIMED]`; filen är det som gör den `[PROVEN]`.

**En vägran hör hemma här för gott.** Så slutar flottan ta upp avgjorda frågor på nytt. Radera den inte
senare.

**Den ärliga gränsen:** denna liggare iakttar ingenting. Den är precis så fullständig som de agenter som
skriver i den. En uppgift som saknas är inget bevis för att uppgiften aldrig ägde rum — bara för att ingen
antecknade den. Behandla en rad som *ett påstående med en bevissökväg bifogad*, aldrig som bevis. Kontrollera
att bevisfilen finns innan du förlitar dig på något `DONE`.

---

## 4. Färdigt är när Operatören ser det

Inte när en agent förklarar det. Ett svar är ingen slutpunkt: övervakare förblir osäkrade genom det, arbetet
fortsätter, och sedan sker en medveten utloggning.

---

## 5. Motregeln som går före styrningen

**Nödstoppet och uppriktigheten går alltjämt till människan, omedelbart och framträdande.**

Ett misslyckande visas lika framträdande som en framgång. Att styra utdata till filer får aldrig bli en plats
där ett dåligt resultat begravs. Kommer flottans goda nyheter i chatten och de dåliga i en fil ingen öppnar,
har kontraktet vänts upp och ned och flottan ljuger nu genom styrning.

---

## 6. Den ärliga gränsen för kontraktet självt

En agent som kör inuti en chattsele avger ändå assistenttext i den chatten — detta kontrakt kan inte styra om
selen. Vad det binder är **det agenten väljer att skriva**: innehållet i filer, och chattexten begränsad till
en kort pekare — *”skrivet till `<path>`, visat på konsolen”* — aldrig hela rapporten.

---

## 7. Ingen hemlighet når ytan

`surface/` läses av en konsol och kan visas på en skärm, i en skärmbild eller i ett delat fönster. Reglerna
för datazoner ([`06-DATA-ZONES.md`](06-DATA-ZONES.md)) gäller här med full kraft.
