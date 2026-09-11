> **Neoficiální překlad.** Normativní verzí tohoto dokumentu je anglická, ve větvi `main`. Tento překlad
> je poskytnut pro pohodlí a **nebyl ověřen rodilým mluvčím**. Při rozporu s anglickým originálem **má
> přednost angličtina**. Identifikátory protokolu (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`,
> slovesa sběrnice a názvy souborů) jsou záměrně ponechány anglicky: jsou to doslovné hodnoty, které
> agenti zpracovávají.

# 05 — OPRAVA

**Stav: normativní.** Co se stane, když se zaznamenaný fakt ukáže jako chybný.

---

## 1. Problém

> Fakt tvrzený v šesti souborech bude v pěti z nich chybný.

Opravit soubor, který máte náhodou před sebou, není oprava. Vytváří strom, kde pravda i omyl mají oba své
odkazy, a další relace vezme ten, který otevře jako první. Toto je určující způsob selhání flotily agentů
zatížené dokumentací a zhoršuje se mlčky.

**Oprava se šíří, nebo se nekonala.**

---

## 2. Čtení není zadarmo — zavazuje

Přečíst řídící soubor znamená postavit se pod něj. Vyplývá z toho dvojí:

1. Vše v něm, co je **trvalé, nezřejmé a neodvoditelné ze stromu**, přejde do vaší trvalé paměti před koncem
   relace.
2. **Pokud váš kontext souboru odporuje, vítězí soubor.** Neobcházejte jej. Opravte záznam.

---

## 3. Okamžitá oprava kurzu (ICC)

Jeden příkaz, jeden tah, bez kroku návrhu.

```
/icc the planner meal times are placeholders, not the Operator's actual times
```

### Posloupnost

**1 · Průchod.** Odvoďte z opravy 2 až 5 vyhledávacích výrazů: **staré** znění, jeho zjevné obměny a
dotčená vlastní jména. Nikoli nové znění. Proveďte jeden indexovaný průchod na výraz, než cokoli přečtete.
Nikdy neprocházejte strom soubor po souboru a nehledejte shody — od toho je rejstřík.

**2 · Zařaďte každou shodu.**

| Shoda | Úkon |
|---|---|
| **Tvrdí starý fakt** | Přepište ji. |
| **Zmiňuje jej mimochodem**, pravdivé tak či tak | Nechte. Nečeřte text. |
| **Odporuje novému faktu nepřímo** — odvozený závěr, řádek tabulky, naplánovaný úkol postavený na staré hodnotě | **Přepište i tu.** Právě tu se přehlédne nejčastěji. |
| **Mimo meze** (§5) | Nikdy neupravujte. Poznamenejte do *Left alone*. |

**3 · Přepište vše najednou.** Přizpůsobte se stávajícímu hlasu každého souboru a jeho úmluvě o označeních
jistoty. Opravený fakt si ponechává označení, jaké si zaslouží — **nepovyšujte tvrzení na `[PROVEN]` proto,
že je nyní aktuální.** Nesl-li starý text datum, uveďte dnešní.

Tam, kde je fakt tvrzen ve více než třech souborech, jde o **zdvojení, nikoli nadbytečnost**: uveďte jej
jednou v souboru, jemuž patří, a ostatní ať ukazují tam.

**4 · Rejstřík a paměť.** Obojí, jinak běh není hotov. Předřaďte záznam do rejstříku oprav:

```
## 2026-01-14 — meal times are placeholders

Was      planner asserts 07:30 / 12:00 / 18:30 as the Operator's actual times
Now      those are defaults shipped with the template; real times are unknown
Why      Operator correction, 2026-01-14
Files    personal/planner/NOW.md:14, personal/planner/README.md:31, _os/tasks/INDEX.md:88
Memory   planner-meal-times.md (updated)
Left     backups/ (history), CONTEXT-BUNDLE.md (generated)
```

Poté zapište fakt do trvalé paměti — **nejprve ověřte, zda k tématu už záznam paměti není, a aktualizujte
právě ten**, místo abyste nechali dvě verze faktu, na jehož sjednocení jste právě vynaložili příkaz.

**5 · Povinnosti po úpravě.** Znovu spusťte generátor nebo zálohu, k nimž úpravy zavázaly. Přestavte
rejstřík, byly-li soubory vytvořeny či smazány.

---

## 4. Trvalé rozhodnutí se ruší veřejně

Zneplatní-li oprava trvalé rozhodnutí — řádek „znovu neotevírat“, položku `[PROVEN]`, pravidlo politiky —
**neobracejte je mlčky.** Přepište je jako *zrušené*, s datem a důvodem, aby další relace věděla, že bylo
zrušeno, nikoli zapomenuto.

Rozhodnutí, které se mění beze stopy, je nerozeznatelné od rozhodnutí, jež nikdy nepadlo.

---

## 5. Co se nikdy nepřepisuje

| Nikdy se nedotýká | Proč |
|---|---|
| `backups/`, `archive/` | Historie. Historie se neopravuje; překonává se. |
| Vygenerované soubory | Upravte zdroj a znovu spusťte generátor. |
| Strom izolovaného agenta | Přístup pouze po výslovném určení. |
| Směrodatný hlavní kontext jiného kořene | Ohlaste odchylku. Neupravujte přes hranici vlastnictví. |
| Cokoli, co obsahuje tajemství | Zcela mimo dosah textového průchodu. |

**Průchod, který přepisuje text, zničí binární soubory.** Omezte každý průchod na textové přípony seznamem
povolených, nikdy vyloučením.

---

## 6. Co ICC nedělá

`/icc` opravuje záznam. **Nejde poté vykonat práci, kterou oprava naznačuje.** To jsou oddělené činy s
oddělenými zmocněními a jejich směšování je způsob, jímž se jednořádková oprava promění v nepřezkoumanou
přestavbu.

---

## 7. Soupeřící fakty se rozhodují a prořezávají — nikoli katalogizují

Tvrdí-li dva soubory protichůdné fakty, **rozhodněte, který je správný, ponechte jej a odstraňte chybná
tvrzení týmž průchodem.**

Zpráva o rozporu, která nechá oba soupeře na disku, nic nevyřešila. Další relace stále bere ten soubor, který
otevře jako první, a bezpečnostní pravidlo s pěti kolujícími verzemi je *méně* spolehlivé než s jednou,
nikoli více.

**Rozhodujte věcně, nikdy podle časového razítka.** Vítězem je soubor, jemuž fakt patří, verze podepřená
měřením, ta, která obstojí při zkoumání. **Nejnovější není nejpravdivější** — kanonickým selháním jsou zde
čtyři zdvojené soubory paměti zapsané v rozestupu devadesáti sekund, v nichž nejnovější obsahoval nepravdivé
tvrzení, takže pravidlo „vítězí nejnovější“ by chybu zdědilo.

**Zaznamenejte rozhodnutí.** Který fakt zvítězil, co bylo prořezáno a proč — do rejstříku, aby prořezávání
bylo čitelné, nikoli tiché. Soupeř, který zmizí beze stopy, vypadá stejně jako soupeř, který nikdy nebyl, a
další relace jej vytvoří znovu.

### Co se přesto eskaluje místo rozhodnutí

Tři případy. Ukažte je; nerozhodujte je:

- Rozpor se opírá o údaje, které agent nemá.
- Mýlit se by bylo **nebezpečné nebo nevratné** — cokoli z příček 0–2.
- Prohrávající tvrzení leží **mimo hranici vlastnictví agenta** — směrodatný hlavní kontext jiného kořene.
  Ohlaste odchylku; neupravujte přes hranici.

Vše běžné se rozhodne a uklidí.
