> **Uoffisiell oversettelse.** Den normative versjonen av dette dokumentet er den engelske, i grenen
> `main`. Denne oversettelsen er gjort tilgjengelig for enkelhets skyld og **er ikke gjennomgått av en
> morsmålsbruker**. Ved avvik fra den engelske originalen **gjelder engelsk**. Protokollens betegnelser
> (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, bussens verb og filnavnene) beholdes bevisst på
> engelsk: det er bokstavelige verdier som agenter tolker.

# 04 — UTGANGSKONTRAKTEN

**Status: normativ.** Hvor arbeidet havner når det er ferdig.

---

## 1. Regelen

**Rapporter ikke til chatten. Arbeid i filtreet, skriv utgangen til disk, og vis en peker.**

En agent som avslutter med å skrive et langt svar i et chattevindu, har lagt utgangen sin der ingenting annet i
flåten kan lese den — ingen annen agent, ingen overvåking, ingen konsoll, ingen neste økt. Filen er den varige
nedskrivingen; chatten er en utskrift ingen lenger nede ser.

---

## 2. Hvor utgangen havner

| Slag av utgang | Lander i |
|---|---|
| Arbeidsresultat, funn, en rapport | den ansvarlige filen, eller `outbox/YYYYMMDD-HHMMSS-<slug>.md` |
| Alt Operatøren bør se nå | en kort pekerfil i `_os/events/surface/` |
| En anmodning som krever Operatøren | `_os/exchange/requests/REQ-<slug>.md` |
| Protokollinjen | `_os/tasks/INDEX.md` |

**Katalogen `surface/` er varselet. Filen er innholdet.** Skriv innholdet på dets rette plass, og legg så igjen
en enkeltlinjes peker i `surface/`, slik at konsollen viser Operatøren hvor det landet.

---

## 3. Oppgaveprotokollen

Én linje per ordre. Tilføy en `REQ`-linje **før** start, slik at en avbrutt oppgave forblir synlig.

```
REQ     | 2026-01-14 | SCOUT | <the order, in the Operator's words where possible> | <status note>
DONE    | 2026-01-14 | SCOUT | <the order> | evidence: outbox/20260114-090312-lease-rates.md
BLOCKED | 2026-01-14 | SCOUT | <the order> | <what is blocking, one line>
REFUSED | 2026-01-14 | SCOUT | <the order> | <why, one line + where the reasoning lives>
```

**En `DONE`-linje uten bevissti er ugyldig.** Finnes ingen fil, har arbeidet ikke landet noe sted der Operatøren
kan se det. Selvrapport er `[CLAIMED]`; filen er det som gjør den `[PROVEN]`.

**En avvisning hører til her for godt.** Slik slutter flåten å ta opp avgjorte spørsmål igjen. Slett den ikke
senere.

**Den ærlige grensen:** denne protokollen iakttar ingenting. Den er nøyaktig så fullstendig som agentene som
skriver i den. En manglende oppgave er ikke bevis på at oppgaven aldri fant sted — bare på at ingen skrev den
ned. Behandle en linje som *en påstand med en bevissti vedlagt*, aldri som bevis. Kontroller at bevisfilen
finnes, før du stoler på noe `DONE`.

---

## 4. Ferdig er når Operatøren ser det

Ikke når en agent erklærer det. Et svar er ikke et stanspunkt: overvåkinger forblir spent gjennom det, arbeidet
fortsetter, og så skjer en bevisst avmelding.

---

## 5. Motregelen som går foran styringen

**Nødstoppet og åpenheten går fortsatt til mennesket, straks og iøynefallende.**

En svikt vises like iøynefallende som en suksess. Å styre utgang til filer må aldri bli et sted der et dårlig
resultat begraves. Kommer flåtens gode nyheter i chatten og de dårlige i en fil ingen åpner, er kontrakten snudd
om, og flåten lyver nå gjennom styring.

---

## 6. Den ærlige grensen for selve kontrakten

En agent som kjører inne i et chattesele, avgir fortsatt assistenttekst i den chatten — denne kontrakten kan
ikke omdirigere selen. Det den binder, er **det agenten velger å skrive**: innholdet i filer, og chatteksten
begrenset til en kort peker — *”skrevet til `<path>`, vist på konsollen”* — aldri hele rapporten.

---

## 7. Ingen hemmelighet når flaten

`surface/` leses av en konsoll og kan vises på en skjerm, i et skjermbilde eller i et delt vindu. Reglene for
datasoner ([`06-DATA-ZONES.md`](06-DATA-ZONES.md)) gjelder her med full kraft.
