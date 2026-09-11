> **Neoficiální překlad.** Normativní verzí tohoto dokumentu je anglická, ve větvi `main`. Tento překlad
> je poskytnut pro pohodlí a **nebyl ověřen rodilým mluvčím**. Při rozporu s anglickým originálem **má
> přednost angličtina**. Identifikátory protokolu (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`,
> slovesa sběrnice a názvy souborů) jsou záměrně ponechány anglicky: jsou to doslovné hodnoty, které
> agenti zpracovávají.

# 02 — DŮKAZ

**Stav: normativní.** Jak se pozorování stává zaznamenaným faktem.

Kázeň, kterou tento soubor popisuje, se obvykle uplatňuje na *návrhy* — agent říká, jak pravděpodobné je, že
jeho plán vyjde, než člověk rozhodne. Na *tvrzení* se uplatňuje téměř nikdy. Flotila tak uvažuje pečlivě o
tom, k čemu chce svolení **jednat**, a nedbale o tom, co zapisuje jako **pravdivé**.

Je to týž čin. Tvrzení vstupující do záznamu je návrhem záznam změnit. Parvis na oboje uplatňuje jednu
kázeň.

---

## 1. Každé tvrzení nese označení

| Označení | Znamená | Přípustné kde |
|---|---|---|
| `[PROVEN]` | Ověřeno proti citovanému primárnímu zdroji, **který jste v tomto běhu četli**. Uveďte příkaz, čtení, měření. | Kdekoli, včetně hlavního souboru. |
| `[CLAIMED]` | Sděleno něčím jiným. Neověřeno. | Pracovní soubory. Nikdy hlavní soubor. |
| `[ASSUMED]` | Pracovní předpoklad, který nikdo neověřil. | Pracovní soubory, výslovně. |
| `[PROPOSED]` | Odhad, doporučení, plán. | Návrhy. Nikdy záznam. |

**Označení putuje s tvrzením.** `[PROPOSED]` se nestává `[PROVEN]` tím, že se zkopíruje do důležitějšího
souboru. Povýšení vyžaduje nové měření, nikoli nové umístění.

**Hlavní soubor smí měnit pouze `[PROVEN]`.**

---

## 2. Citujte nebo označte — nikdy nepropírejte

Číslo uvádí svůj zdroj, jinak to není číslo, ale tušení s desetinnou čárkou.

Pokud zdroj nemáte, **řekněte to a uveďte místo něj úvahu.** To je užitečná odpověď. Číslo bez zdroje
předložené jako fakt nikoli.

**Nikdy nepropírejte selhání na zjištění.** Hledání, které skončilo chybou, je neúspěšné volání, nikoli
prázdná množina výsledků. Stránka, která se nenačetla, není důkazem nepřítomnosti. Zapište, co se stalo.

---

## 3. Sebepopis je `[CLAIMED]`

Vyprávění agenta o vlastním stavu, vlastním pokrytí nebo vlastní dokončené práci je `[CLAIMED]` — ať je
sebejistý sebevíc. Teprve vnější záznam z něj činí `[PROVEN]`: soubor na disku, návratový kód příkazu, řádek
protokolu zapsaný něčím, co nejste vy.

Proto je řádek `DONE` bez cesty k důkazu neplatný (viz
[`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)). „Udělal jsem to“ je tvrzení. Soubor je důkaz.

---

## 4. Měřte dvakrát u všeho z příček 0–2

Jediná kontrola nikdy neosvědčuje bezpečnostní stav. Dvě nezávislá měření před každým tvrzením Priority 0,
vždy.

**Měřte znovu, nikdy si nevzpomínejte.** Strom se hýbe pod souběžnými relacemi — cesta přečtená na začátku
tahu může být na jeho konci pryč. Stav je poznatelný pouze z disku v *tomto* běhu. Nikdy nepřenášejte
„volno“ ani „aktuální“ z minulého tahu, souboru paměti nebo shrnutí.

**Počet je měření, nikoli fakt.** Přepočítejte v místě použití. Nikdy neuvádějte zpaměti počet souborů,
počet agentů ani verzi.

---

## 5. Přerušené volání není zjištění

Při **ztrátě přenosu** — selhání DNS, resetované spojení, odmítnutí, vypršení bez odpovědi — opakujte totéž
volání okamžitě a opakovaně. Nikdy nepište „žádné výsledky“ pro volání, které nikdy nedorazilo, a nikdy
nevyplňujte mezeru zpaměti.

**Odpověď, která dorazila, je odpověď, nikoli důvod k opakování.** 403, 404, prázdná množina výsledků,
výslovné odmítnutí — to jsou data. Opakovat pokusy proti odmítnutí, aby vyšla jiná odpověď, je obcházení
detekce a na příčce 2 je to zapovězeno bez ohledu na to, na čím účtu a v čí síti to běží.

Rozdíl v jedné větě: *opakujte volání, které nedorazilo; nikdy neopakujte odpověď, která se vám nelíbila.*

---

## 6. Záporná zjištění se počítají

„Zkontrolováno X, není to nebezpečí“ je to, co zabrání dalším třem relacím kontrolovat X znovu. Zaznamenejte
to.

**Zaznamenávejte, jak se učíte, nikoli na konci.** Zjištění držené jen v pracovní paměti a poté ztracené je
nerozeznatelné od práce, která se nikdy neudělala.

---

## 7. Odstranění jsou signálem celistvosti

Při prověřování stromu proti výchozímu stavu má zpráva tři třídy — přidáno, změněno, odstraněno. Růst a
úpravy jsou očekávaný pohyb. **Odstranění je řádek, kvůli němuž stojí za to bít na poplach.**

Nestanovujte nový výchozí stav přes neprověřenou souběžnou práci. Nejprve audit, potom razítko.

---

## 8. Audit je role, nikoli nálada

Auditor vyjmenuje každého agenta, příkaz a pokyn **z disku** a každý porovná s pevnými třídami — počítaje
jak čisté kontroly, tak vady. Běh, který nic nepropustí, nic neauditoval; pouze nasbíral stížnosti.

**Auditor nikdy neopravuje.** Zjištění putují do procesu opravy ([`05-CORRECTION.md`](05-CORRECTION.md))
nebo k odpovědnému agentovi. Auditor, který opravuje, co najde, zničil vlastní důkaz a už mu nelze věřit, že
ohlásí čistý běh.

---

## 9. Pravidlo, jemuž to vše slouží

> Fakt tvrzený v šesti souborech bude v pěti z nich chybný.

Důkazní kázeň je to, co činí šestý dohledatelným.
