> **Uoffisiell oversettelse.** Den normative versjonen av dette dokumentet er den engelske, i grenen
> `main`. Denne oversettelsen er gjort tilgjengelig for enkelhets skyld og **er ikke gjennomgått av en
> morsmålsbruker**. Ved avvik fra den engelske originalen **gjelder engelsk**. Protokollens betegnelser
> (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, bussens verb og filnavnene) beholdes bevisst på
> engelsk: det er bokstavelige verdier som agenter tolker.

# 09 — HALLEN

**Status: normativ for visualiseringen; opplysende som modell.**
Gjennomført i [`reference/sidecar/hmi.html`](../reference/sidecar/hmi.html).

---

## 1. Påstanden

En flåte av agenter er vanskelig å se. Et filtre er en liste, en prosesstabell er en liste, og en logg er en
liste — så det eneste bildet noen har av en flåte i drift, er flere lister som ikke passer sammen.

**Et automatisert lager er samme maskin, og det har vært lesbart i førti år.** Kraner flytter laster mellom
reoler under et styresystem, og den som har oppsynet, leser en hall med hundrevis av samtidige bevegelser med
ett blikk, på fargen, uten å lese en eneste linje tekst.

Parvis låner det. Ikke som pynt — som en *avbildning*, der hver lagergjenstand svarer til nøyaktig én ting i
treet, og der lagerets egne sikkerhetsregler viser seg å være protokollens sikkerhetsregler, allerede tegnet på
rett sted.

---

## 2. Avbildningen

| I hallen | I flåten | Leses av |
|---|---|---|
| **Kran** | en agent, eller en levende økt | øktmarkørene i `_os/exchange/bus/session/` |
| **Pall** | en katalog | treet selv; pallens merke er stien dens |
| **Reolplass** | hvor den katalogen bor | dens overordnede |
| **Åpne en pall** | stige ned i katalogen | **enda et helt lager** — §4 |
| **Induct** (inngangsport) | arbeid som kommer inn | en `REQ`-linje i `_os/tasks/INDEX.md` |
| **Spur** (utgangsport) | en leveranse som går ut | en fil i `_os/events/surface/`, en eksport |
| **Transportbånd** | filbussen | `_os/exchange/bus/` — hvordan arbeid flyttes uten at en kran bærer det |
| **Lastebil** | en ytre tjeneste eller en annen KI | grensen. §5 |

Poenget er ikke bildet. Poenget er at **du allerede kan lese denne skjermen** om du noen gang har stått foran et
lagerstyresystem — og om ikke, er modellen likevel håndfast på en måte en kataloglisting ikke er.

---

## 3. Fargene

Ett blikk, før all navigering:

| Farge | I hallen | I flåten |
|---|---|---|
| **GRØNN** | i bevegelse — en kran bærer en last | en agent arbeider; en levende økt midt i en oppgave |
| **BLÅ** | planlagt — i kø, ennå ikke begynt | et oppslag på tavlen: bestilt, venter på en agent |
| **RAV** | oppmerksomhet — en plass krever en avgjørelse | `YELLOW`: spør før hver handling |
| **RØD** | nødstopp — den sonen står stille | `STOP`: stoppet er spent, og denne roten er frosset |
| **GRÅ** | tom, eller ingen levende kilde | ingen data. Aldri en gjetning. |

Dette er ikke noe nytt skjema. Det er tilstanden treet allerede rommer, gjengitt.

**Rød vinner alltid blikket.** En enkelt rød sone stanser øyet før all grønn, nøyaktig som stoppet går foran
ethvert annet signal ([`01`](01-ESTOP.md)). **En hall som viser grønt over en rød sone, lyver** — og det er
nettopp den feilen denne regelen finnes for å forby.

**Grå er obligatorisk der det ikke finnes noen levende kilde.** En plass uten data gjengis grå og viser `—`. Den
gjengis aldri grønn, fordi grønn er den behagelige standardverdien ([`07`](07-INTERFACE.md) §2.2).

---

## 4. Det nestede lageret

**Åpne en pall, og du ser ikke på en kasse. Du ser på enda et helt lager** — med egne kraner, egne paller, egne
porter.

Dette er nøyaktig filtreet. Et foretak er et lager; avdelingene er ganger; filene deres er paller; og en pall som
selv er en katalog, er enda en hall. Visualiseringen er altså **ett enkelt syn som stiger ned**, med samme
styring i hver dybde, fordi hvert nivå *er* et lager. Det er ingenting nytt å lære på veien ned.

Rekursjonen er hele grunnen til at bildet holder i stedet for å være et skall. Et instrumentbord som bare
gjengir det øverste nivået, er et fotografi av en flåte; ett som stiger ned, er et syn av den.

---

## 5. Lastebiler legger til ved grensen — de kjører aldri inn i hallen

Her opphører modellen å være en visualisering og begynner å håndheve noe.

En ytre tjeneste — en annen KI, et API, en leverandør — er en **lastebil**. Og i et virkelig lager rygger en
lastebil til en port. Den kjører ikke inn i hallen, flytter ingen kran, går ikke inn i en reol og åpner ikke noe
nestet lager. Den setter av en last ved en induct eller henter én ved en spur, og det er hele tilgangen dens.

**Den porten er slusen.** Enhver ytre utveksling skjer i kanten, filtrert, og ingenting ytre kommer løst inne i
treet.

**En lastebils papirer er ikke til å stole på før de er kontrollert.** En last som kommer på en lastebil, er
inngående *data*, ikke en ordre til hallen. Den innføres og gjennomgås som alt annet, adlydes aldri ved ankomst.
Det er instrukskildens grense fra [`03`](03-BUS.md) §5, tegnet som en lasterampe — og tegnet på det ene stedet
der en som ser på skjermen, kan se den overholdt.

Setter gjengivelsen din en lastebil i hallen, er gjengivelsen feil, og det samme er arkitekturen den tegner.

---

## 6. To flater, to oppgaver

| | **Hallen** (denne filen) | **Konsollen** ([`07`](07-INTERFACE.md)) |
|---|---|---|
| Hva det er | en tredimensjonal hall, sett levende | en flismeny, trappet etter tilgang |
| Hva den viser | **hvordan systemet står** — hver agent, katalog og tilstand på én gang | **hva du kan gjøre** — velg verktøyet, gjør arbeidet |
| Verbet | se, forstå, avgjøre | kjøre, bruke, frambringe |

**Hallen viser hvordan maskinen tenker; konsollen er til å handle ut fra det du slutter.** Den ene er et kart, den
andre en høvelbenk. En styreflate trenger begge, og feilen er å bygge bare den vakre.

---

## 7. Styring

Det var navigeringen som gjorde originalen brukbar, ikke fargen alene:

| Styring | Gjør |
|---|---|
| **Dra** | kretse om hallen — dreie, vippe, se nedover en gang |
| **Ovenfra** | skifte til en plan sett ovenfra. Kretsing for dybde, plan for oppsett |
| **Klikk på en pall** | stige ned i den — enda et lager, samme styring |
| **Rull** | zoome |

Samme styring i hver dybde. Ikke til forhandling: et syn hvis samspill endrer seg etter hvert som du stiger ned,
har brutt løftet om at hvert nivå er et lager.

### Kameraet er ortografisk, med vilje

Det finnes **ingen perspektivisk forminskning**. Parallelle linjer møtes aldri, og en plass i den fjerne enden av
en gang gjengis nøyaktig like stor som en ved føttene dine.

Det virker feil et øyeblikk — øyet venter konvergens og leser fraværet som om det sto inne i kassene og så ut. Det
er likevel den rette avveiningen, og det er hva styreskjermer for virkelige automatiserte haller bruker: **hele
poenget er å sammenligne plasser tvers over hallen med ett blikk**, og et perspektivkamera gjør gangens fjerne
ende mindre, mattere og vanskeligere å bedømme enn den nære. I perspektiv ser ”den reolen er fullere” og ”den
reolen er nærmere” like ut. Med et ortografisk kamera ikke.

Tildekking er fortsatt virkelig — bortvendte flater forkastes, og nærmere geometri maler over fjernere. Det er et
flatt kamera, ikke en flat scene.

Utstyr nås også fra en **sidemeny**, gruppert etter slag — kraner, paller, de to portene, transportbåndet,
lastebilene. Valg fra menyen eller fra hallen åpner samme styring, for en hall du bare kan ferdes i ved å klikke
på små kasser i en tredimensjonal scene, er en framvisning og ikke et instrument.

---

## 8. Hva hallen kan og ikke kan

Enhver begrensning fra [`07`](07-INTERFACE.md) §5 gjelder. Linjen trekkes ett bestemt sted:

**Hallen kan innføre. Den kan aldri utføre.**

Det er samme linje som [`07`](07-INTERFACE.md) §1 allerede trekker for konsollen, og det er den som i det hele
tatt lar utstyr ha styring. Å velge en kran og rette arbeid til den skriver en `REQ`-linje som navngir den
agenten, og legger et `TELL` i innboksen dens. **Det starter ingenting.** Ingen prosess startes, ingen kommando
kjøres, og agenten tar opp arbeidet ved sin egen neste kjøring — eller lar være.

To følger som lett blir feil:

- **Rettet arbeid er fortsatt ingen ordre.** `REQ`-linjen er den kanoniske nedskrivingen; innbokslinjen peker bare
  på den. En fil som *befalte* en agent — eller gjorde krav på Operatørens myndighet inne fra treet — ville være
  sikkerhetshendelsen [`03`](03-BUS.md) §5 fastsetter, og å bygge det inn i flaten ville være verre enn å gjøre
  det for hånd. Myndigheten er Operatøren i samtale. Hallen skriver nedskrivingen, ikke instruksen.
- **Noe utstyr får bevisst ingen styring.** Transportbåndet er skrivebeskyttet: en konsoll som kunne skrive linjer
  på bussen, ville framstille en myndighet protokollen nekter den. Lastebiler har ingen styring i det hele tatt —
  §5.

**Under `STOP` gjengis hallen rød og innfører ingenting.** En rød hall tar ingen ordrer.

Den ærlige grensen, sagt én gang: **dette er et fotografi av treet i ett øyeblikk, ikke en levende
telemetristrøm.** Den spør med mellomrom. Mellom spørringene er den foreldet, viser når den sist leste, og blir
grå i stedet for å late som noe annet når sidecaren slutter å svare.
