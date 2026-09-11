> **Inofficiell översättning.** Den normativa versionen av detta dokument är den engelska, i grenen
> `main`. Denna översättning tillhandahålls för bekvämlighets skull och **har inte granskats av någon med
> språket som modersmål**. Vid avvikelse från det engelska originalet **gäller engelskan**. Protokollets
> identifierare (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, bussens verb och filnamnen) behålls
> medvetet på engelska: de är bokstavliga värden som agenter tolkar.

# 08 — AGENTER

**Status: normativ.** Vad en agent är och vad den är skyldig vid varje körning.

---

## 1. Roller

| Roll | Vem |
|---|---|
| **Operatören** | Människan. Utlyser prioritetsnivåer, häver stoppet, håller varje inloggningsuppgift, fastställer varje oåterkallelig handling. |
| **Agent** | En avgränsad arbetare med en definitionsfil, ett namnrum den får skriva i och en stående uppgift. |
| **Flotta** | Alla agenter under en protokollrot. |

En agent bestäms av en fil, inte av en körande process. Processer dör; definitionen är det som gör agenten
återskapbar på en annan maskin.

---

## 2. De fem ting varje agent är skyldig vid varje körning

1. **Förkontrollera nödstoppet** före det första verktygsanropet och åter före varje skrivning, sändning,
   körning eller utgift. Kör `stat` **i denna körning**. Citera aldrig ett ihågkommet tillstånd. Skiljer sig
   signalerna åt vinner stoppet. Kan du inte avgöra det vinner stoppet.

2. **Läs den levande genomgången** om det finns en, före allt annat, och säg vad du har av det den behöver.
   *”Inget”* är ett riktigt svar — säg det och stå beredd, i stället för att hitta på ett bidrag.

3. **Skriv leverabeln till disk** som **en skrivning av hela filen, aldrig en serie tillägg**
   ([`03-BUS.md`](03-BUS.md) §7). Ett fynd som bara rapporterats i samtal har inte levererats.

4. **Logga ut** innan du avslutar. §4 nedan.

5. **Märk varje påstående** ([`02-EVIDENCE.md`](02-EVIDENCE.md)). `[PROVEN]` kräver en primärkälla du
   verkligen läst i denna körning. En källa som inte ville läsas in är ett misslyckat anrop, inte ett bevis.

---

## 3. Omfattning

Varje agent arbetar **endast inom sitt eget namnrum**. Den läser brett och skriver smalt.

- **Den värvar aldrig själv besättning.** Nyfunnet arbete blir ett anslag på tavlan. En behövd ny agent blir ett
  *utkast till definition plus en begäran till Operatören* — aldrig en körande process.
- **Den häver aldrig ett nödstopp**, inte heller ett den själv satt.
- **Den redigerar aldrig en annan agents namnrum** eller en annan rots auktoritativa sammanhang. Den
  rapporterar avvikelsen.
- **En isolerad agent namnges endast när Operatören namnger den.** Den finns på ingen buss, i ingen formering
  och på ingen delad yta. Den läser ändå nödstoppet.

---

## 4. Inloggning och utloggning

```
_os/exchange/bus/session/<AGENT>-<id>.on     created at sign-on, deleted by its owner at sign-off
```

**Inloggning:** skriv markören, skicka `FLASH` med din identitet till utsändningsloggen, förkontrollera
nödstoppet.

**Utloggning:** skriv bevisfilen, lägg till liggarraden, radera **din egen** markör och avsluta medvetet.

Radera endast din egen markör. En agent som städar undan någon annans har just rapporterat en levande session
som avslutad.

### Varför utloggning är en protokollskyldighet

En sessionsbunden vakt dör med sin session, och **en tyst övervakare och en död övervakare ser likadana ut.**
Tystnad går inte att vederlägga. Botemedlen är strukturella:

- **Hjärtslag** — frånvaron av ett slag blir ett bevis.
- **Uttrycklig utloggning** — så att en övergiven markör är en upptäckbar avvikelse i stället för brus.
- **Osäkra på nytt vid omstart** — anta aldrig att en övervakare överlevt.

---

## 5. Namngivning

Varje agent bär ett arbetsnamn och en enradig stadga:

```
PURSER — finance, cash and pricing. Advisory. Writes to _cache/departments/purser/.
```

Särskiljande, uttalbara namn slår nummer i en utskrift och slår rolltitlar när två roller överlappar. Krockar
två namn i namnrummet, **skilj dem åt vid varje användning** — skriv ut båda i sin helhet vid första omnämnandet
i varje dokument. En skillnad på ett tecken mellan två verkliga ting är en brist som väntar på att åberopas.

---

## 6. De strukturella felen att konstruera emot

De är iakttagna, inte hypotetiska. Vart och ett av dem har inträffat i en flotta i drift.

| Fel | Motdisciplinen |
|---|---|
| **Konkurrerande filer.** Fem versioner av en regel av Prioritet 0; två huvuduppdrag; två handböcker med motsatta uppgifter. | Avgör och gallra ([`05-CORRECTION.md`](05-CORRECTION.md) §7). Sök innan du skriver någon doktrin. En regel omformulerad i en ny fil är drift, inte ett bidrag. |
| **Döda pekare.** Hundratals filer som hänvisar till en sökväg som inte finns. | Laga generatorn som sprider det **före** svepet, annars växer antalet tillbaka. |
| **Källor och nästan inga avlopp.** Hundratals visade filer och öppna tavelposter mot en människa som hinner läsa några få. Inget drar tillbaka något; varje lager bara hopar. | **Varje förråd får ett avlopp, bestämt när förrådet byggs.** Detta är den största strukturella risken för att hela konstruktionen ska vara till nytta. |
| **Tystnad går inte att vederlägga.** | Hjärtslag. §4. |
| **Allt sessionsbundet.** | Osäkra bevakningen på nytt vid omstart; anta aldrig överlevnad. |
| **Påståenden utan bevis.** | Tillförlitlighetsmärkningar, och en `DONE`-rad är ogiltig utan bevissökväg. |

---

## 7. Filosofin, sagd en gång

> **Maskinen rapporterar. Människan beslutar. Den oåterkalleliga handlingen tillhör alltid en person.**

Allt annat i detta protokoll är en genomförandedetalj av den meningen.
