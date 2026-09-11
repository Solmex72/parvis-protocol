> **Inofficiell översättning.** Den normativa versionen av detta dokument är den engelska, i grenen
> `main`. Denna översättning tillhandahålls för bekvämlighets skull och **har inte granskats av någon med
> språket som modersmål**. Vid avvikelse från det engelska originalet **gäller engelskan**. Protokollets
> identifierare (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, bussens verb och filnamnen) behålls
> medvetet på engelska: de är bokstavliga värden som agenter tolkar.

# 07 — GRÄNSSNITTSLAGRET

**Status: normativ.** Detta är filen projektet är uppkallat efter.

Varje yta en människa rör vid är **Parvis**. Den skrivskyddade hallvyn är *Parvis HMI*; rutmenyn du styr
flottan från är *Parvis Console*.

---

## 1. Regeln som får HTML:en att fungera

> En webbläsarsida är en **skärm och ett tangentbord**, inte ett program med diskåtkomst.

Det enda faktumet styr hela lagret:

- **Sidan visar och samlar in.** Den återger tillstånd och tar emot inmatning. Öppnad från en filsökväg kan
  den på egen hand **varken läsa trädet eller skriva en order.** Webbläsarens sandlåda förbjuder båda, och det
  är en förtjänst.
- **Sidecaren slår bron.** En liten tjänst på återkopplingsslingan — bunden till `127.0.0.1` och inget annat —
  är det enda som läser trädet åt sidan och skriver det sidan skickar in. Sidan hämtar tillståndet med `GET`;
  sidan skickar en prompt med `POST`; sidecaren utför diskarbetet. **Ingen sidecar, ingen levande Parvis — bara
  en ögonblicksbild.**
- **Inget kringgår granskningen.** En prompt som skickas från Parvis är en **inmatning, inte ett utförande.**
  Sidecaren skriver en `REQ`-rad i uppgiftsliggaren och stannar. Den startar aldrig en agent, kör aldrig ett
  kommando, skickar aldrig. Att fastställa nytt arbete förblir Operatörens tangenttryckning.

Därför ”fungerar” sidan: sidan är ärlig med att vara ett fönster, sidecaren gör det lilla verkliga arbetet i
kanten, och **granskningen står alltjämt mellan en prompt och en maskin i rörelse.**

---

## 2. Hårda krav — varje Parvis-yta

1. **Självförsörjande.** En HTML-fil: CSS och JS inbäddade, inga externa skript, ingen CDN. Endast webbtypsnitt
   med en verklig reservkedja. Den måste återges offline från en filsökväg.

2. **Färgerna är tillståndet, lästa live, aldrig påhittade.** Grönt = kör, bärnsten = fråga först, rött =
   stoppat — härledda ur STATE-filen och den levande liggaren. **Ett värde utan levande källa visar `—`, aldrig
   ett trovärdigt utseende tal.** Rött går före varje annan färg och hela gränssnittet.

3. **Sidecaren kör endast på återkopplingsslingan och håller ingen hemlighet sidan kan se.** Ingen API-nyckel,
   inga inloggningsuppgifter, ingen värdefull token når webbläsaren. Sidecaren autentiserar sidan med en lokal
   sessionstoken och utför det privilegierade arbetet själv. **Sidan håller aldrig något värt att stjäla.**

4. **En ögonblicksbild märks som ögonblicksbild,** med sin lästid. Endast en sida som talar med en levande
   sidecar får utge sig för att vara live. En inaktuell sida som ser live ut är värre än ingen sida.

5. **Nödstoppet går före gränssnittet.** Under `STOP` matar Parvis in ingenting och sidecaren skriver inget
   utom utloggningsraden. **En röd hall tar inga order.**

6. **Parvis varumärke och inga tredjepartsföretagsnamn.** Från vilka verkliga system mönstret än lärdes är
   mönstret ditt och det heter Parvis. En yta som sprider någon annans handelsnamn är felaktig och rättas.

---

## 3. Säkerhetskrav på sidecaren

En HTTP-tjänst på återkopplingsslingan på en utvecklararbetsstation är en verklig angreppsyta. Dessa punkter är
inte valfria.

| Krav | Varför |
|---|---|
| **Bind `127.0.0.1` uttryckligen**, aldrig `0.0.0.0` | Att binda alla gränssnitt publicerar din flottkonsol i det lokala nätet. |
| **Validera `Host`-huvudet** mot en tillåtlista med `127.0.0.1:<port>` / `localhost:<port>` | Besegrar DNS-rebinding, varigenom en besökt webbsida når en tjänst på slingan. |
| **Avvisa begäranden med ett `Origin` du inte utfärdat** | Samma angreppsklass, annan vektor. |
| **Kräv en sessionstoken** på varje förändrande rutt, utfärdad vid sidladdning, aldrig loggad | Sidan bevisar att den är din sida. |
| **Tillåtlista varje sökväg** tjänsten läser eller skriver, lös sedan upp den på nytt och bekräfta inneslutning | Besegrar sökvägsvandring. En tillåtlista ensam räcker inte om symboliska länkar finns. |
| **Fall säkert vid en oläslig estop** — vägra, fall inte tillbaka till `RUN` | Se [`01-ESTOP.md`](01-ESTOP.md) §2. |
| **Ingen `eval`, inget skalanrop, ingen mallinfogning av användarindata** | Promptraden är ett inmatningsfält, inte en kommandorad. |

Referensimplementationen i [`reference/sidecar/`](../reference/sidecar/) förverkligar alla dessa punkter och är
kommenterad vid var och en.

---

## 4. Vilka ytorna är

| Yta | Vad | Status |
|---|---|---|
| **Parvis Console** | Paneler med flikar — tillstånd, dokument, liggare, buss, yta, inställningar | Levereras. |
| **Parvis Floor** | Fliken Lager: tredimensionell hall, kretsning och nedstigning, utrustningsstyrning | Levereras. Se [`09-FLOOR.md`](09-FLOOR.md). |
| **Promptrad** | Inmatningsfältet, på konsolen och vid varje hallutrustning | Levereras. |
| **Sidecaren** | Bro på slingan: läser trädet, skriver `REQ`-rader, håller inga hemligheter | Levereras. |

**Leverera panelerna först.** Den tredimensionella hallen är den del alla vill bygga och den del som är
värdelös utan liggaren under sig — den återger tillstånd som resten av protokollet frambringar, och på ett tomt
träd visar den riktigt nog ingenting.

---

## 5. Hållning

- **Sidan läser. Sidecaren skriver. Operatören fastställer.**
- Ingen yta startar, skickar, driftsätter eller häver ett nödstopp.
- Ingen hemlighet når webbläsaren, någonsin.
- Utdata går till filer och till konsolen, inte till ett chattfönster
  ([`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)).
