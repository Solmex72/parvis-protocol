> **Inofficiell översättning.** Den normativa versionen av detta dokument är den engelska, i grenen
> `main`. Denna översättning tillhandahålls för bekvämlighets skull och **har inte granskats av någon med
> språket som modersmål**. Vid avvikelse från det engelska originalet **gäller engelskan**. Protokollets
> identifierare (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, bussens verb och filnamnen) behålls
> medvetet på engelska: de är bokstavliga värden som agenter tolkar.

# 06 — DATAZONER

**Status: normativ.** Var en fil får bo.

---

## 1. Varför ett förbud inte fungerade

Den ursprungliga regeln löd *”inga hemligheter, aldrig, ingenstans”* — **utan någon plats att lägga privata
data i stället.**

Ett förbud utan destination följs inte. Det kringgås, och privat material hamnar av misstag i det
synkroniserade trädet. Det hände upprepade gånger, även genom en agent som själv omfattades av regeln.

**Regeln är ett styrningsbeslut, inte ett förbud.**

---

## 2. De två zonerna

| Zon | Egenskap | Innehåller |
|---|---|---|
| **PUBLIC** | Synkroniserar till molnlagring. **Behandla varje byte som publicerad.** | Doktrin, uppdrag, agentdefinitioner, arkitektur, affärssammanhang, efterforskning, teknisk dokumentation |
| **PRIVATE** | **Utanför varje synkroniseringsrot** — och utanför användarprofilen, så att omdirigering av kända mappar inte heller når dit | Hemligheter, verkliga personer och deras personuppgifter, privata projekt och media, allt som vore olämpligt att finna i en säkerhetskopia |

### Provet

> *Vore det ett problem om detta låg i en molnögonblicksbild om ett år?*

Ja → PRIVATE. Nej → PUBLIC. Vid verklig osäkerhet → **PRIVATE.** Priset för överklassificering är obekvämlighet.
Priset för underklassificering går inte att ta tillbaka.

### Vet vad som faktiskt synkroniserar

Kontrollera detta på den verkliga maskinen, inte på antagande. På en vanlig arbetsstation kan flera
synkroniseringsklienter köra samtidigt, och allt under användarens mappar för dokument, skrivbord eller bilder
lämnar maskinen och bevaras i versionshistoriken i veckor. **Att radera lokalt återkallar det inte.**

Två följder som var för sig orsakar verkliga fel:

1. **Byggutdata måste styras om** ut ur en synkroniseringsrot, annars fördärvar spegeln den mitt i bygget.
2. **Nycklar bor utanför**, medvetet och som standard.

---

## 3. Undantaget: inloggningsuppgifter hör till ingen zon

**Aktiva inloggningsuppgifter — lösenord, API-nycklar, tokens, sändningsnycklar — hör hemma i en
lösenordshanterare, inte i något av filsystemen.**

Den privata zonen innehåller *privata data*. En lösenordshanterare innehåller *inloggningsuppgifter*. Detta är
ingen hårklyveri: en privat katalog är inte krypterad som standard, och en fil är en fil. I det ögonblick en
kopieras, citeras i en utskrift eller bifogas något är den röjd.

**Formulera den privata zonens säkerhetsegenskap snävt och överdriv den aldrig.** Dess enda bevisade egenskap
är vanligen att *inget kopierar den någonstans*. Utan verifierad kryptering av hela disken eller enskilda filer
är den inte krypterad, inte säkerhetskopierad och inget kassaskåp.

---

## 4. Klassificeringen är Operatörens och är justerbar

Håll den levande tabellen i en enda fil — `DATA-CLASSIFICATION.md` — där Operatören flyttar kategorier mellan
zoner och som varje agent läser i stället för att gissa.

Denna protokollfil anger **mekanismen**. Den filen anger **policyn**. Där de två skiljer sig vinner policyfilen.

---

## 5. Följder för agenter

- **Ingen hemlighet i något träd som paketeras.** Ett sammanhangspaket finns till för att klistras in i en ny
  session. Namnge vad som hålls och var; aldrig värdet.
- **Ingen hemlighet når `surface/`.** Den visas på skärmen.
- **Ingen hemlighet når en webbläsare.** Se [`07-INTERFACE.md`](07-INTERFACE.md) §3.
- **Dölj genom hänvisning, inte genom radering.** `<api key — see password manager entry "acme-prod">` håller
  faktumet sökbart utan att röja värdet.

---

## 6. Gallra utan förlust

Innan något lämnar arbetsträdet:

1. Kopiera det till ett förseglat förvar **utanför rötterna** — en arkivfil, inte nåbar med glob.
2. Förbered sökvägarna i `marked-deletion.md` / `marked-archive.md`.
3. **Utförandet är Operatörens hand**, med trädet i ro.

Radera aldrig i mängd under pågående samtidighet.
