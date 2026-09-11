> **Uofficiel oversættelse.** Den normative udgave af dette dokument er den engelske, i grenen `main`.
> Denne oversættelse stilles til rådighed for bekvemmelighedens skyld og **er ikke gennemset af en
> modersmålstalende**. Ved afvigelse fra den engelske original **gælder engelsk**. Protokollens
> betegnelser (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, bussens verber og filnavnene) bevares
> bevidst på engelsk: det er bogstavelige værdier, som agenter fortolker.

# 04 — UDGANGSKONTRAKTEN

**Status: normativ.** Hvor arbejdet havner, når det er færdigt.

---

## 1. Reglen

**Rapportér ikke til chatten. Arbejd i filtræet, skriv udgangen til disk, og vis en peger.**

En agent, der slutter med at skrive et langt svar i et chatvindue, har lagt sin udgang, hvor intet andet i
flåden kan læse den — ingen anden agent, ingen overvågning, ingen konsol, ingen næste session. Filen er den
varige nedskrivning; chatten er en udskrift, ingen længere nede ser.

---

## 2. Hvor udgangen havner

| Slags udgang | Lander i |
|---|---|
| Arbejdsresultat, fund, en rapport | den ansvarlige fil, eller `outbox/YYYYMMDD-HHMMSS-<slug>.md` |
| Alt, Operatøren bør se nu | en kort pegerfil i `_os/events/surface/` |
| En anmodning, der kræver Operatøren | `_os/exchange/requests/REQ-<slug>.md` |
| Protokollinjen | `_os/tasks/INDEX.md` |

**Kataloget `surface/` er underretningen. Filen er indholdet.** Skriv indholdet på dets rette plads, og efterlad
så en enkeltlinjet peger i `surface/`, så konsollen viser Operatøren, hvor det landede.

---

## 3. Opgaveprotokollen

Én linje pr. ordre. Tilføj en `REQ`-linje **før** start, så en afbrudt opgave forbliver synlig.

```
REQ     | 2026-01-14 | SCOUT | <the order, in the Operator's words where possible> | <status note>
DONE    | 2026-01-14 | SCOUT | <the order> | evidence: outbox/20260114-090312-lease-rates.md
BLOCKED | 2026-01-14 | SCOUT | <the order> | <what is blocking, one line>
REFUSED | 2026-01-14 | SCOUT | <the order> | <why, one line + where the reasoning lives>
```

**En `DONE`-linje uden bevissti er ugyldig.** Er der ingen fil, er arbejdet ikke landet nogen steder, hvor
Operatøren kan se det. Selvrapport er `[CLAIMED]`; filen er det, der gør den `[PROVEN]`.

**En afvisning hører til her for altid.** Sådan holder flåden op med at tage afgjorte spørgsmål op igen. Slet
den ikke senere.

**Den ærlige grænse:** denne protokol iagttager intet. Den er præcis så fuldstændig som de agenter, der skriver
i den. En manglende opgave er intet bevis på, at opgaven aldrig fandt sted — kun på, at ingen nedskrev den.
Behandl en linje som *en påstand med en bevissti vedhæftet*, aldrig som bevis. Kontrollér, at bevisfilen findes,
før du forlader dig på noget `DONE`.

---

## 4. Færdigt er, når Operatøren ser det

Ikke når en agent erklærer det. Et svar er intet standsningspunkt: overvågninger forbliver spændte igennem det,
arbejdet fortsætter, og så sker der en bevidst afmelding.

---

## 5. Modreglen, der går forud for styringen

**Nødstoppet og åbenheden går fortsat til mennesket, straks og iøjnefaldende.**

Et fejlslag vises lige så iøjnefaldende som en succes. At styre udgang til filer må aldrig blive et sted, hvor
et dårligt resultat begraves. Kommer flådens gode nyheder i chatten og de dårlige i en fil, ingen åbner, er
kontrakten vendt om, og flåden lyver nu gennem styring.

---

## 6. Den ærlige grænse for kontrakten selv

En agent, der kører inde i et chatsele, afgiver stadig assistenttekst i den chat — denne kontrakt kan ikke
omdirigere selen. Hvad den binder, er **det, agenten vælger at skrive**: indholdet i filer, og chatteksten
begrænset til en kort peger — *”skrevet til `<path>`, vist på konsollen”* — aldrig hele rapporten.

---

## 7. Ingen hemmelighed når fladen

`surface/` læses af en konsol og kan vises på en skærm, i et skærmbillede eller i et delt vindue. Reglerne for
datazoner ([`06-DATA-ZONES.md`](06-DATA-ZONES.md)) gælder her med fuld styrke.
