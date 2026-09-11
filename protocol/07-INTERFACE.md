> **Neoficiální překlad.** Normativní verzí tohoto dokumentu je anglická, ve větvi `main`. Tento překlad
> je poskytnut pro pohodlí a **nebyl ověřen rodilým mluvčím**. Při rozporu s anglickým originálem **má
> přednost angličtina**. Identifikátory protokolu (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`,
> slovesa sběrnice a názvy souborů) jsou záměrně ponechány anglicky: jsou to doslovné hodnoty, které
> agenti zpracovávají.

# 07 — VRSTVA ROZHRANÍ

**Stav: normativní.** Toto je soubor, po němž je projekt pojmenován.

Každý povrch, jehož se člověk dotkne, je **Parvis**. Pohled na halu jen pro čtení je *Parvis HMI*; dlaždicová
nabídka, z níž řídíte flotilu, je *Parvis Console*.

---

## 1. Pravidlo, díky němuž HTML funguje

> Stránka prohlížeče je **obrazovka a klávesnice**, nikoli program s přístupem na disk.

Tento jediný fakt ovládá celou vrstvu:

- **Stránka ukazuje a sbírá.** Vykresluje stav a přijímá vstup. Otevřena z cesty k souboru sama o sobě
  **nemůže číst strom ani zapsat příkaz.** Pískoviště prohlížeče obojí zakazuje, a to je přednost.
- **Sidecar staví most.** Malá služba na místní smyčce — vázaná na `127.0.0.1` a na nic jiného — je jediné,
  co čte strom pro stránku a zapisuje to, co stránka odešle. Stránka si vyžádá stav pomocí `GET`; stránka
  odešle prompt pomocí `POST`; sidecar vykoná práci s diskem. **Bez sidecaru není živý Parvis — je jen
  snímek.**
- **Nic neobchází přezkum.** Prompt odeslaný z Parvisu je **vložení, nikoli provedení.** Sidecar zapíše
  řádek `REQ` do rejstříku úkolů a zastaví se. Nikdy nespouští agenta, nikdy neprovádí příkaz, nikdy
  neodesílá. Potvrzení nové práce zůstává stiskem klávesy Operátora.

Proto stránka „funguje“: stránka je poctivá v tom, že je oknem, sidecar odvádí malou skutečnou práci na
okraji a **přezkum stále stojí mezi promptem a pohybujícím se strojem.**

---

## 2. Tvrdé požadavky — na každý povrch Parvis

1. **Soběstačný.** Jeden soubor HTML: CSS a JS uvnitř, žádné vnější skripty, žádná CDN. Pouze webová písma
   se skutečným záložním řetězcem. Musí se vykreslit offline z cesty k souboru.

2. **Barvy jsou stav, čtený živě, nikdy předstíraný.** Zelená = běží, jantarová = nejdřív se zeptej, červená
   = zastaveno — odvozeno ze souboru STATE a z živého rejstříku. **Hodnota bez živého zdroje ukazuje `—`,
   nikdy věrohodně vypadající číslo.** Červená přebíjí každou jinou barvu i celé rozhraní.

3. **Sidecar běží pouze na místní smyčce a nedrží žádné tajemství, jež by stránka mohla vidět.** Žádný klíč
   API, žádné přihlašovací údaje, žádný cenný token nedosáhne prohlížeče. Sidecar ověřuje stránku místním
   tokenem relace a privilegovanou práci vykoná sám. **Stránka nikdy nedrží nic, co by stálo za krádež.**

4. **Snímek se označuje jako snímek,** s časem čtení. Pouze stránka hovořící s živým sidecarem se smí
   vydávat za živou. Zastaralá stránka, která vypadá živě, je horší než žádná stránka.

5. **Nouzové zastavení přebíjí rozhraní.** Při `STOP` Parvis nic nevkládá a sidecar nezapisuje nic než řádek
   odhlášení. **Červená hala nepřijímá příkazy.**

6. **Značka Parvis a žádná jména cizích společností.** Z jakýchkoli skutečných systémů byl vzor odpozorován,
   vzor je váš a jmenuje se Parvis. Povrch, který šíří cizí obchodní jméno, je chybný a opravuje se.

---

## 3. Bezpečnostní požadavky na sidecar

Služba HTTP na místní smyčce na vývojářské stanici je skutečná plocha útoku. Tyto body nejsou volitelné.

| Požadavek | Proč |
|---|---|
| **Vázejte `127.0.0.1` výslovně**, nikdy `0.0.0.0` | Vázání na všechna rozhraní zveřejní konzoli vaší flotily v místní síti. |
| **Ověřujte hlavičku `Host`** proti seznamu povolených `127.0.0.1:<port>` / `localhost:<port>` | Poráží DNS rebinding, jímž navštívená webová stránka dosáhne na službu místní smyčky. |
| **Odmítejte požadavky s `Origin`, který jste nevydali** | Táž třída útoku, jiný vektor. |
| **Vyžadujte token relace** na každé měnící cestě, vydaný při načtení stránky, nikdy nezaznamenaný | Stránka dokáže, že je vaše stránka. |
| **Vložte na seznam povolených každou cestu**, kterou služba přečte či zapíše, pak ji znovu rozřešte a potvrďte vnoření | Poráží průchod cestami. Samotný seznam povolených nestačí, existují-li symbolické odkazy. |
| **Při nečitelném estop selhávejte bezpečně** — odmítněte, nevracejte se k `RUN` | Viz [`01-ESTOP.md`](01-ESTOP.md) §2. |
| **Žádný `eval`, žádné volání shellu, žádné vkládání uživatelského vstupu do šablon** | Lišta promptu je vstupní pole, nikoli příkazový řádek. |

Referenční implementace v [`reference/sidecar/`](../reference/sidecar/) uskutečňuje všechny tyto body a je
opatřena komentářem v místě každého z nich.

---

## 4. Jaké jsou povrchy

| Povrch | Co | Stav |
|---|---|---|
| **Parvis Console** | Panely se záložkami — stav, dokumenty, rejstřík, sběrnice, povrch, nastavení | Dodáváno. |
| **Parvis Floor** | Záložka Sklad: trojrozměrná hala, oblet a sestup, ovládání zařízení | Dodáváno. Viz [`09-FLOOR.md`](09-FLOOR.md). |
| **Lišta promptu** | Vstupní pole, na konzoli i u každého halového zařízení | Dodáváno. |
| **Sidecar** | Most na místní smyčce: čte strom, zapisuje řádky `REQ`, nedrží tajemství | Dodáváno. |

**Dodejte nejprve panely.** Trojrozměrná hala je ta část, kterou chce postavit každý, a ta část, jež bez
rejstříku pod sebou nemá cenu — vykresluje stav, který vytváří zbytek protokolu, a na prázdném stromu
správně neukazuje nic.

---

## 5. Postoj

- **Stránka čte. Sidecar zapisuje. Operátor potvrzuje.**
- Žádný povrch nespouští, neodesílá, nenasazuje ani neruší nouzové zastavení.
- Žádné tajemství nedosáhne prohlížeče, nikdy.
- Výstup jde do souborů a na konzoli, nikoli do okna chatu
  ([`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)).
