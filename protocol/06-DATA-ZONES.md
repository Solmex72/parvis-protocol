> **Neoficiální překlad.** Normativní verzí tohoto dokumentu je anglická, ve větvi `main`. Tento překlad
> je poskytnut pro pohodlí a **nebyl ověřen rodilým mluvčím**. Při rozporu s anglickým originálem **má
> přednost angličtina**. Identifikátory protokolu (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`,
> slovesa sběrnice a názvy souborů) jsou záměrně ponechány anglicky: jsou to doslovné hodnoty, které
> agenti zpracovávají.

# 06 — DATOVÉ ZÓNY

**Stav: normativní.** Kde smí soubor žít.

---

## 1. Proč zákaz nefungoval

Původní pravidlo znělo *„žádná tajemství, nikdy, nikde“* — **a přitom nebylo žádné místo, kam by se soukromá
data dala uložit místo toho.**

Zákaz bez místa určení se nedodržuje. Obchází se a soukromý materiál se omylem ocitá v synchronizovaném
stromu. To se stalo opakovaně, včetně agenta, který sám témuž pravidlu podléhal.

**Pravidlo je rozhodnutí o směrování, nikoli zákaz.**

---

## 2. Dvě zóny

| Zóna | Vlastnost | Obsahuje |
|---|---|---|
| **PUBLIC** | Synchronizuje se do cloudu. **Považujte každý bajt za zveřejněný.** | Doktrínu, pokyny, definice agentů, architekturu, obchodní kontext, výzkum, technickou dokumentaci |
| **PRIVATE** | **Mimo každý kořen synchronizace** — a mimo uživatelský profil, aby tam nedosáhlo ani přesměrování známých složek | Tajemství, skutečné osoby a jejich osobní údaje, soukromé projekty a média, vše, co by bylo nemístné najít v záloze |

### Zkouška

> *Byl by problém, kdyby to za rok bylo v cloudovém snímku?*

Ano → PRIVATE. Ne → PUBLIC. Při skutečné nejistotě → **PRIVATE.** Cenou nadřazení je nepohodlí. Cenu
podřazení nelze vzít zpět.

### Vězte, co se skutečně synchronizuje

Ověřte to na skutečném stroji, nikoli z domněnky. Na běžné pracovní stanici může běžet několik
synchronizačních klientů naráz a vše ve složkách dokumentů, plochy či obrázků uživatele opouští stroj a
uchovává se v historii verzí po týdny. **Místní smazání to nestáhne zpět.**

Dva důsledky, z nichž každý působí skutečná selhání:

1. **Výstup sestavení musí být přesměrován** mimo kořen synchronizace, jinak jej zrcadlo uprostřed sestavení
   poškodí.
2. **Klíče žijí venku**, záměrně a ve výchozím nastavení.

---

## 3. Výjimka: přihlašovací údaje nepatří do žádné zóny

**Živé přihlašovací údaje — hesla, klíče API, tokeny, vysílací klíče — patří do správce hesel, nikoli do
žádného ze souborových systémů.**

Soukromá zóna obsahuje *soukromá data*. Správce hesel obsahuje *přihlašovací údaje*. Není to hnidopišství:
soukromý adresář není ve výchozím stavu šifrovaný a soubor je soubor. V okamžiku, kdy je některý zkopírován,
citován v přepisu nebo k něčemu přiložen, je vyzrazen.

**Formulujte bezpečnostní vlastnost soukromé zóny úzce a nikdy ji nepřehánějte.** Její jedinou prokázanou
vlastností obvykle je, že *ji nic nikam nekopíruje*. Bez ověřeného šifrování celého disku nebo jednotlivých
souborů není šifrovaná, není zálohovaná a není trezor.

---

## 4. Zařazení patří Operátorovi a je nastavitelné

Držte živou tabulku v jediném souboru — `DATA-CLASSIFICATION.md` — kde Operátor přesouvá kategorie mezi
zónami a který každý agent čte, místo aby hádal.

Tento soubor protokolu popisuje **mechanismus**. Onen soubor popisuje **politiku**. Kde se oba rozcházejí,
vítězí soubor politiky.

---

## 5. Důsledky pro agenty

- **Žádné tajemství ve stromu, který se balí.** Balík kontextu existuje proto, aby se vložil do nové relace.
  Pojmenujte, co se drží a kde; nikdy hodnotu.
- **Žádné tajemství nedosáhne `surface/`.** Zobrazuje se na obrazovce.
- **Žádné tajemství nedosáhne prohlížeče.** Viz [`07-INTERFACE.md`](07-INTERFACE.md) §3.
- **Zakrývejte odkazem, nikoli smazáním.** `<api key — see password manager entry "acme-prod">` udržuje fakt
  dohledatelný, aniž vyzradí hodnotu.

---

## 6. Prořezávání bez ztráty

Než cokoli opustí pracovní strom:

1. Zkopírujte to do zapečetěného úložiště **mimo kořeny** — do archivního souboru, nedosažitelného globem.
2. Připravte cesty v `marked-deletion.md` / `marked-archive.md`.
3. **Provedení je ruka Operátora**, se stromem uvedeným do klidu.

Nikdy nemažte hromadně za činné souběžnosti.
