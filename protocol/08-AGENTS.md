> **Neoficiální překlad.** Normativní verzí tohoto dokumentu je anglická, ve větvi `main`. Tento překlad
> je poskytnut pro pohodlí a **nebyl ověřen rodilým mluvčím**. Při rozporu s anglickým originálem **má
> přednost angličtina**. Identifikátory protokolu (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`,
> slovesa sběrnice a názvy souborů) jsou záměrně ponechány anglicky: jsou to doslovné hodnoty, které
> agenti zpracovávají.

# 08 — AGENTI

**Stav: normativní.** Co je agent a co dluží při každém běhu.

---

## 1. Role

| Role | Kdo |
|---|---|
| **Operátor** | Člověk. Vyhlašuje úrovně priority, ruší zastavení, drží všechny přihlašovací údaje, potvrzuje každý nevratný čin. |
| **Agent** | Jeden vymezený pracovník se souborem definice, jmenným prostorem, do nějž smí zapisovat, a trvalým úkolem. |
| **Flotila** | Všichni agenti pod jedním kořenem protokolu. |

Agenta určuje soubor, nikoli běžící proces. Procesy umírají; definice je to, co činí agenta obnovitelným na
jiném stroji.

---

## 2. Pět věcí, které každý agent dluží při každém běhu

1. **Předem zkontrolujte nouzové zastavení** před prvním voláním nástroje a znovu před každým zápisem,
   odesláním, spuštěním či výdajem. Proveďte `stat` **v tomto běhu**. Nikdy necitujte zapamatovaný stav.
   Rozcházejí-li se signály, vítězí zastavení. Nelze-li to určit, vítězí zastavení.

2. **Přečtěte živý souhrn**, existuje-li, přede vším ostatním, a řekněte, co máte z toho, co potřebuje.
   *„Nic“* je pravá odpověď — řekněte ji a buďte připraveni, místo abyste si vymýšleli příspěvek.

3. **Zapište výstup práce na disk** jako **jeden zápis celého souboru, nikdy jako sérii připojení**
   ([`03-BUS.md`](03-BUS.md) §7). Zjištění sdělené jen v rozhovoru nebylo doručeno.

4. **Odhlaste se** dříve, než skončíte. §4 níže.

5. **Označte každé tvrzení** ([`02-EVIDENCE.md`](02-EVIDENCE.md)). `[PROVEN]` vyžaduje primární zdroj, který
   jste v tomto běhu skutečně četli. Zdroj, který se nenačetl, je neúspěšné volání, nikoli důkaz.

---

## 3. Rozsah

Každý agent pracuje **pouze uvnitř vlastního jmenného prostoru**. Čte široce a zapisuje úzce.

- **Nikdy si sám nenajímá posádku.** Nalezená nová práce se stává vývěskou na nástěnce. Potřebný nový agent
  se stává *sepsanou definicí plus žádostí Operátorovi* — nikdy běžícím procesem.
- **Nikdy neruší nouzové zastavení**, ani to, které sám umístil.
- **Nikdy neupravuje jmenný prostor jiného agenta** ani směrodatný kontext jiného kořene. Ohlašuje odchylku.
- **Izolovaný agent se jmenuje pouze tehdy, když jej jmenuje Operátor.** Není na žádné sběrnici, v žádné
  sestavě ani na žádném sdíleném povrchu. Nouzové zastavení přesto čte.

---

## 4. Přihlášení a odhlášení

```
_os/exchange/bus/session/<AGENT>-<id>.on     created at sign-on, deleted by its owner at sign-off
```

**Přihlášení:** zapište značku, odešlete `FLASH` se svou totožností do všesměrového protokolu, předem
zkontrolujte nouzové zastavení.

**Odhlášení:** zapište soubor důkazu, připojte řádek rejstříku, smažte **vlastní** značku a skončete
uváženě.

Mažte pouze vlastní značku. Agent, který uklidí cizí, právě ohlásil živou relaci jako ukončenou.

### Proč je odhlášení povinností protokolu

Pozorovatel vázaný na relaci umírá se svou relací a **tichý monitor a mrtvý monitor vypadají stejně.** Ticho
je nevyvratitelné. Nápravy jsou strukturální:

- **Tep** — chybějící úder se stává důkazem.
- **Výslovné odhlášení** — aby opuštěná značka byla zjistitelnou odchylkou, nikoli šumem.
- **Znovunatažení při restartu** — nikdy nepředpokládejte, že monitor přežil.

---

## 5. Pojmenování

Každý agent nese pracovní jméno a jednořádkovou listinu:

```
PURSER — finance, cash and pricing. Advisory. Writes to _cache/departments/purser/.
```

Rozlišitelná, vyslovitelná jména jsou lepší než čísla v přepisu a lepší než názvy rolí, když se dvě role
překrývají. Střetnou-li se dvě jména ve jmenném prostoru, **rozlišujte při každém užití** — napište obě
plně při první zmínce v každém dokumentu. Rozdíl jednoho znaku mezi dvěma skutečnými věcmi je vada čekající,
až se na ni někdo odvolá.

---

## 6. Strukturální selhání, proti nimž se navrhuje

Jsou pozorovaná, nikoli domnělá. Každé z nich se ve fungující flotile stalo.

| Selhání | Protikázeň |
|---|---|
| **Soupeřící soubory.** Pět verzí jednoho pravidla Priority 0; dva hlavní pokyny; dvě příručky s opačnými údaji. | Rozhodnout a prořezat ([`05-CORRECTION.md`](05-CORRECTION.md) §7). Hledejte, než napíšete jakoukoli doktrínu. Pravidlo přeformulované v novém souboru je unášení, nikoli příspěvek. |
| **Mrtvé ukazatele.** Stovky souborů odkazujících na neexistující cestu. | Opravte generátor, který to šíří, **před** průchodem, jinak počet znovu naroste. |
| **Zdroje a téměř žádné odtoky.** Stovky vystavených souborů a otevřených položek nástěnky proti člověku, který jich přečte pár. Nic nic neodebírá; každá vrstva jen hromadí. | **Každé úložiště dostane odtok, určený při jeho stavbě.** To je největší strukturální riziko pro užitečnost celého návrhu. |
| **Ticho je nevyvratitelné.** | Tep. §4. |
| **Vše vázané na relaci.** | Natáhněte pokrytí znovu při restartu; nikdy nepředpokládejte přežití. |
| **Tvrzení bez důkazu.** | Označení jistoty, a řádek `DONE` je bez cesty k důkazu neplatný. |

---

## 7. Filozofie, řečená jednou

> **Stroj hlásí. Člověk rozhoduje. Nevratný čin patří vždy člověku.**

Vše ostatní v tomto protokolu je podrobností provedení této věty.
