> **Uofficiel oversættelse.** Den normative udgave af dette dokument er den engelske, i grenen `main`.
> Denne oversættelse stilles til rådighed for bekvemmelighedens skyld og **er ikke gennemset af en
> modersmålstalende**. Ved afvigelse fra den engelske original **gælder engelsk**. Protokollens
> betegnelser (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, bussens verber og filnavnene) bevares
> bevidst på engelsk: det er bogstavelige værdier, som agenter fortolker.

# 09 — HALLEN

**Status: normativ for visualiseringen; oplysende som model.**
Gennemført i [`reference/sidecar/hmi.html`](../reference/sidecar/hmi.html).

---

## 1. Påstanden

En flåde af agenter er svær at se. Et filtræ er en liste, en procestabel er en liste, og en log er en liste — så
det eneste billede, nogen har af en flåde i drift, er flere lister, der ikke passer sammen.

**Et automatiseret lager er samme maskine, og det har været læseligt i fyrre år.** Kraner flytter laster mellem
reoler under et styresystem, og den, der har opsynet, læser en hal med hundredvis af samtidige bevægelser med
ét blik, på farven, uden at læse en eneste linje tekst.

Parvis låner det. Ikke som udsmykning — som en *afbildning*, hvor hver lagergenstand svarer til nøjagtig én ting
i træet, og hvor lagerets egne sikkerhedsregler viser sig at være protokollens sikkerhedsregler, allerede tegnet
det rette sted.

---

## 2. Afbildningen

| I hallen | I flåden | Læses af |
|---|---|---|
| **Kran** | en agent, eller en levende session | sessionsmarkørerne i `_os/exchange/bus/session/` |
| **Palle** | et katalog | træet selv; pallens mærkat er dens sti |
| **Reolplads** | hvor det katalog bor | dets overordnede |
| **Åbne en palle** | stige ned i kataloget | **endnu et helt lager** — §4 |
| **Induct** (indgangsport) | arbejde, der kommer ind | en `REQ`-linje i `_os/tasks/INDEX.md` |
| **Spur** (udgangsport) | en leverance, der går ud | en fil i `_os/events/surface/`, en eksport |
| **Transportbånd** | filbussen | `_os/exchange/bus/` — hvordan arbejde flyttes, uden at en kran bærer det |
| **Lastbil** | en ydre tjeneste eller en anden AI | grænsen. §5 |

Pointen er ikke billedet. Pointen er, at **du allerede kan læse denne skærm**, hvis du nogensinde har stået
foran et lagerstyresystem — og hvis ikke, er modellen alligevel håndgribelig på en måde, en kataloglistning
ikke er.

---

## 3. Farverne

Ét blik, før nogen navigering:

| Farve | I hallen | I flåden |
|---|---|---|
| **GRØN** | i bevægelse — en kran bærer en last | en agent arbejder; en levende session midt i en opgave |
| **BLÅ** | planlagt — i kø, endnu ikke begyndt | et opslag på tavlen: bestilt, venter på en agent |
| **RAV** | opmærksomhed — en plads kræver en beslutning | `YELLOW`: spørg før hver handling |
| **RØD** | nødstop — den zone står stille | `STOP`: stoppet er spændt, og denne rod er frosset |
| **GRÅ** | tom, eller ingen levende kilde | ingen data. Aldrig et gæt. |

Dette er intet nyt skema. Det er den tilstand, træet allerede rummer, gengivet.

**Rød vinder altid blikket.** En enkelt rød zone standser øjet før al grøn, præcis som stoppet går forud for
ethvert andet signal ([`01`](01-ESTOP.md)). **En hal, der viser grønt over en rød zone, lyver** — og det er
netop den fejl, denne regel findes for at forbyde.

**Grå er obligatorisk, hvor der ikke er nogen levende kilde.** En plads uden data gengives grå og viser `—`. Den
gengives aldrig grøn, fordi grøn er den behagelige standardværdi ([`07`](07-INTERFACE.md) §2.2).

---

## 4. Det indlejrede lager

**Åbn en palle, og du ser ikke på en kasse. Du ser på endnu et helt lager** — med egne kraner, egne paller, egne
porte.

Dette er nøjagtig filtræet. Et foretagende er et lager; dets afdelinger er gange; deres filer er paller; og en
palle, der selv er et katalog, er endnu en hal. Visualiseringen er altså **ét enkelt syn, der stiger ned**, med
samme styring i hver dybde, fordi hvert niveau *er* et lager. Der er intet nyt at lære på vejen ned.

Rekursionen er hele grunden til, at billedet holder i stedet for at være et skal. Et instrumentbræt, der kun
gengiver det øverste niveau, er et fotografi af en flåde; ét, der stiger ned, er et syn af den.

---

## 5. Lastbiler lægger til ved grænsen — de kører aldrig ind i hallen

Her ophører modellen med at være en visualisering og begynder at håndhæve noget.

En ydre tjeneste — en anden AI, et API, en leverandør — er en **lastbil**. Og i et virkeligt lager bakker en
lastbil op til en port. Den kører ikke ind i hallen, flytter ingen kran, går ikke ind i en reol og åbner intet
indlejret lager. Den sætter en last af ved en induct eller henter én ved en spur, og det er hele dens adgang.

**Den port er slusen.** Enhver ydre udveksling sker i kanten, filtreret, og intet ydre kommer løs inde i træet.

**En lastbils papirer er ikke til at stole på, før de er kontrolleret.** En last, der kommer på en lastbil, er
indgående *data*, ikke en ordre til hallen. Den indføres og gennemses som alt andet, adlydes aldrig ved ankomst.
Det er instrukskildens grænse fra [`03`](03-BUS.md) §5, tegnet som en lasterampe — og tegnet det ene sted, hvor
en, der ser på skærmen, kan se den overholdt.

Sætter din gengivelse en lastbil i hallen, er gengivelsen forkert, og det samme er den arkitektur, den tegner.

---

## 6. To flader, to opgaver

| | **Hallen** (denne fil) | **Konsollen** ([`07`](07-INTERFACE.md)) |
|---|---|---|
| Hvad det er | en tredimensionel hal, set live | en flisemenu, trappet efter adgang |
| Hvad den viser | **hvordan systemet står** — hver agent, katalog og tilstand på én gang | **hvad du kan gøre** — vælg værktøjet, udfør arbejdet |
| Udsagnsordet | se, forstå, beslutte | køre, bruge, frembringe |

**Hallen viser, hvordan maskinen tænker; konsollen er til at handle ud fra det, du slutter.** Den ene er et kort,
den anden en høvlebænk. En styreflade har brug for begge, og fejlen er at bygge kun den smukke.

---

## 7. Styring

Det var navigeringen, der gjorde originalen brugbar, ikke farven alene:

| Styring | Gør |
|---|---|
| **Træk** | kredse om hallen — dreje, vippe, se ned ad en gang |
| **Ovenfra** | skifte til en plan set ovenfra. Kredsning for dybde, plan for indretning |
| **Klik på en palle** | stige ned i den — endnu et lager, samme styring |
| **Rul** | zoome |

Samme styring i hver dybde. Ikke til forhandling: et syn, hvis samspil ændrer sig, efterhånden som du stiger ned,
har brudt løftet om, at hvert niveau er et lager.

### Kameraet er ortografisk, med vilje

Der er **ingen perspektivisk formindskelse**. Parallelle linjer mødes aldrig, og en plads i den fjerne ende af
en gang gengives nøjagtig lige så stor som en ved dine fødder.

Det virker forkert et øjeblik — øjet venter konvergens og læser dens fravær, som om det stod inde i kasserne og
så ud. Det er alligevel den rette afvejning, og det er, hvad styreskærme til virkelige automatiserede haller
bruger: **hele pointen er at sammenligne pladser tværs gennem hallen med ét blik**, og et perspektivkamera gør
gangens fjerne ende mindre, mattere og sværere at bedømme end den nære. I perspektiv ser ”den reol er fyldigere”
og ”den reol er tættere på” ens ud. Med et ortografisk kamera ikke.

Tildækning er stadig virkelig — bortvendte flader kasseres, og nærmere geometri maler over fjernere. Det er et
fladt kamera, ikke en flad scene.

Udstyr nås også fra en **sidemenu**, grupperet efter art — kraner, paller, de to porte, transportbåndet,
lastbilerne. Valg fra menuen eller fra hallen åbner samme styring, for en hal, man kun kan færdes i ved at klikke
på små kasser i en tredimensionel scene, er en fremvisning og intet instrument.

---

## 8. Hvad hallen må og ikke må

Enhver begrænsning fra [`07`](07-INTERFACE.md) §5 gælder. Linjen trækkes ét bestemt sted:

**Hallen må indføre. Den må aldrig udføre.**

Det er samme linje, som [`07`](07-INTERFACE.md) §1 allerede trækker for konsollen, og det er den, der
overhovedet lader udstyr have styring. At vælge en kran og rette arbejde til den skriver en `REQ`-linje, der
navngiver den agent, og lægger et `TELL` i dens indbakke. **Det starter intet.** Ingen proces startes, ingen
kommando køres, og agenten tager arbejdet op ved sin egen næste kørsel — eller lader være.

To følger, der let bliver forkerte:

- **Rettet arbejde er stadig ingen ordre.** `REQ`-linjen er den kanoniske nedskrivning; indbakkelinjen peger blot
  på den. En fil, der *befalede* en agent — eller gjorde krav på Operatørens myndighed inde fra træet — ville
  være den sikkerhedshændelse, [`03`](03-BUS.md) §5 fastlægger, og at bygge det ind i fladen ville være værre end
  at gøre det i hånden. Myndigheden er Operatøren i samtale. Hallen skriver nedskrivningen, ikke instruksen.
- **Noget udstyr får bevidst ingen styring.** Transportbåndet er skrivebeskyttet: en konsol, der kunne skrive
  linjer på bussen, ville fremstille en myndighed, protokollen nægter den. Lastbiler har slet ingen styring — §5.

**Under `STOP` gengives hallen rød og indfører intet.** En rød hal tager ingen ordrer.

Den ærlige grænse, sagt én gang: **dette er et fotografi af træet i ét øjeblik, ikke et levende telemetriflow.**
Den spørger med mellemrum. Mellem spørgsmålene er den forældet, viser, hvornår den senest læste, og bliver grå i
stedet for at lade som noget andet, når sidecaren holder op med at svare.
