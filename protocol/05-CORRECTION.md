> **Inofficiell översättning.** Den normativa versionen av detta dokument är den engelska, i grenen
> `main`. Denna översättning tillhandahålls för bekvämlighets skull och **har inte granskats av någon med
> språket som modersmål**. Vid avvikelse från det engelska originalet **gäller engelskan**. Protokollets
> identifierare (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, bussens verb och filnamnen) behålls
> medvetet på engelska: de är bokstavliga värden som agenter tolkar.

# 05 — RÄTTELSE

**Status: normativ.** Vad som händer när ett antecknat faktum visar sig vara fel.

---

## 1. Problemet

> Ett faktum som hävdas i sex filer kommer att vara fel i fem av dem.

Att rätta den fil du råkar ha framför dig är ingen rättelse. Det skapar ett träd där både sanningen och felet
har hänvisningar, och nästa session tar den som öppnas först. Detta är det utmärkande felläget för en
dokumentationstung agentflotta, och det förvärras tyst.

**En rättelse sprider sig, eller så skedde den inte.**

---

## 2. Att läsa är inte gratis — det förpliktar

Att läsa en styrande fil ställer dig under den. Två saker följer:

1. Allt i den som är **beständigt, icke uppenbart och inte härledbart ur trädet** går till ditt bestående
   minne före sessionens slut.
2. **Motsäger ditt sammanhang filen vinner filen.** Gå inte runt den. Rätta protokollet.

---

## 3. Omedelbar kursrättelse (ICC)

Ett kommando, ett drag, utan förslagssteg.

```
/icc the planner meal times are placeholders, not the Operator's actual times
```

### Ordningen

**1 · Svep.** Härled ur rättelsen 2 till 5 söktermer: den **gamla** formuleringen, dess uppenbara varianter
och de egennamn som berörs. Inte den nya formuleringen. Kör ett indexerat svep per term innan du läser något.
Gå aldrig igenom trädet fil för fil för att hitta träffar — det är vad indexet är till för.

**2 · Klassificera varje träff.**

| Träff | Åtgärd |
|---|---|
| **Hävdar det gamla faktumet** | Skriv om den. |
| **Nämner det i förbigående**, sant i båda fallen | Låt vara. Rör inte i texten. |
| **Motsäger det nya faktumet indirekt** — en härledd slutsats, en tabellrad, ett schemalagt jobb byggt på det gamla värdet | **Skriv om även den.** Den missas oftast. |
| **Utanför gränserna** (§5) | Redigera aldrig. Anteckna under *Left alone*. |

**3 · Skriv om allt på en gång.** Följ varje fils befintliga röst och dess konvention för
tillförlitlighetsmärkning. Ett rättat faktum behåller den märkning det förtjänar — **uppgradera inte ett
påstående till `[PROVEN]` för att det nu är aktuellt.** Bar den gamla texten ett datum, sätt dagens.

Där ett faktum hävdas i fler än tre filer är det **dubblering, inte redundans**: ange det en gång i den fil
som äger det, och låt de övriga peka dit.

**4 · Liggare och minne.** Båda, annars är körningen inte klar. Lägg en post överst i rättelseliggaren:

```
## 2026-01-14 — meal times are placeholders

Was      planner asserts 07:30 / 12:00 / 18:30 as the Operator's actual times
Now      those are defaults shipped with the template; real times are unknown
Why      Operator correction, 2026-01-14
Files    personal/planner/NOW.md:14, personal/planner/README.md:31, _os/tasks/INDEX.md:88
Memory   planner-meal-times.md (updated)
Left     backups/ (history), CONTEXT-BUNDLE.md (generated)
```

Skriv sedan faktumet till det bestående minnet — **kontrollera först om det redan finns en minnespost i
ämnet och uppdatera den**, i stället för att lämna två versioner av ett faktum du just lagt ett kommando på
att ena.

**5 · Skyldigheter efter redigering.** Kör om den generator eller säkerhetskopiering som redigeringarna
krävde. Bygg om indexet om filer skapats eller raderats.

---

## 4. Ett stående beslut rivs upp öppet

Om en rättelse ogiltigförklarar ett stående beslut — en rad ”ta inte upp igen”, en `[PROVEN]`-post, en
policyregel — **vänd det inte tyst.** Skriv om det som *upprivet*, med datum och skäl, så att nästa session
vet att det upphävts och inte glömts.

Ett beslut som ändras utan spår är oskiljbart från ett beslut som aldrig fattades.

---

## 5. Vad som aldrig skrivs om

| Rörs aldrig | Varför |
|---|---|
| `backups/`, `archive/` | Historia. Historia rättas inte; den ersätts. |
| Genererade filer | Redigera källan och kör om generatorn. |
| En isolerad agents träd | Åtkomst endast efter uttryckligt utpekande. |
| En annan rots auktoritativa huvudsammanhang | Rapportera avvikelsen. Redigera inte över en ägandegräns. |
| Allt som innehåller en hemlighet | Helt utom räckhåll för ett textsvep. |

**Ett svep som skriver om text kommer att förstöra binärfiler.** Begränsa varje svep till textändelser via en
tillåtlista, aldrig genom uteslutning.

---

## 6. Vad ICC inte gör

`/icc` rättar protokollet. **Det går sedan inte och utför det arbete rättelsen antyder.** Det är skilda
handlingar med skilda bemyndiganden, och att blanda ihop dem är hur en enradig rättelse blir en ogranskad
ombyggnad.

---

## 7. Konkurrerande fakta avgörs och gallras — katalogiseras inte

När två filer hävdar motstridiga fakta, **avgör vilket som är rätt, behåll det och ta bort de felaktiga
påståendena i samma svep.**

En konfliktrapport som lämnar båda konkurrenterna på disk har inte löst något. Nästa session tar fortfarande
den fil som öppnas först, och en säkerhetsregel med fem cirkulerande versioner är *mindre* tillförlitlig än
en med en enda, inte mer.

**Avgör i sak, aldrig efter tidsstämpel.** Vinnaren är den fil som äger faktumet, den version som bärs upp av
en mätning, den som håller för granskning. **Det nyaste är inte det sannaste** — det kanoniska felet här är
fyra dubblerade minnesfiler skrivna med nittio sekunders mellanrum, där den nyaste innehöll det falska
påståendet, så att en regel om att ”det nyaste vinner” hade ärvt felet.

**Anteckna avgörandet.** Vilket faktum som vann, vad som gallrades och varför — i liggaren, så att gallringen
blir läsbar i stället för tyst. En konkurrent som försvinner utan spår ser exakt ut som en konkurrent som
aldrig funnits, och nästa session skapar den på nytt.

### Vad som ändå eskaleras i stället för att avgöras

Tre fall. Visa dem; avgör dem inte:

- Motsägelsen vilar på uppgifter agenten inte har.
- Att ha fel vore **osäkert eller oåterkalleligt** — allt på pinnarna 0–2.
- Det förlorande påståendet ligger **utanför agentens ägandegräns** — en annan rots auktoritativa
  huvudsammanhang. Rapportera avvikelsen; redigera inte över gränsen.

Allt vardagligt avgörs och städas.
