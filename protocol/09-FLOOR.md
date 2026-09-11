> **Epävirallinen käännös.** Tämän asiakirjan normatiivinen versio on englanninkielinen, haarassa `main`.
> Tämä käännös tarjotaan mukavuussyistä, eikä **äidinkielinen puhuja ole sitä tarkastanut**. Jos teksti
> poikkeaa englanninkielisestä alkuperäisestä, **englanti ratkaisee**. Protokollan tunnisteet (`RUN`,
> `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, väylän verbit ja tiedostonimet) on tarkoituksella jätetty
> englanniksi: ne ovat kirjaimellisia arvoja, joita agentit jäsentävät.

# 09 — HALLI

**Tila: normatiivinen visualisoijalle; tiedoksi antava mallina.**
Toteutettu tiedostossa [`reference/sidecar/hmi.html`](../reference/sidecar/hmi.html).

---

## 1. Väite

Agenttilaivuetta on vaikea nähdä. Tiedostopuu on luettelo, prosessitaulukko on luettelo ja loki on luettelo —
joten ainoa kuva, joka kenelläkään on toimivasta laivueesta, on useita luetteloita, jotka eivät täsmää.

**Automatisoitu varasto on sama kone, ja se on ollut luettavissa neljäkymmentä vuotta.** Nosturit siirtävät
kuormia hyllyjen välillä ohjausjärjestelmän alaisuudessa, ja valvova ihminen lukee hallin, jossa on satoja
samanaikaisia liikkeitä, yhdellä silmäyksellä, värin perusteella, lukematta riviäkään tekstiä.

Parvis lainaa sen. Ei koristeeksi — *kuvaukseksi*, jossa jokainen varastokohde vastaa täsmälleen yhtä asiaa
puussa, ja jossa varaston omat turvasäännöt osoittautuvat protokollan turvasäännöiksi, jo oikeaan paikkaan
piirrettyinä.

---

## 2. Kuvaus

| Hallissa | Laivueessa | Luetaan |
|---|---|---|
| **Nosturi** | agentti tai elävä istunto | istuntomerkit hakemistossa `_os/exchange/bus/session/` |
| **Lava** | hakemisto | puu itse; lavan tunniste on sen polku |
| **Hyllypaikka** | missä tuo hakemisto asuu | sen ylähakemisto |
| **Lavan avaaminen** | hakemistoon laskeutuminen | **toinen kokonainen varasto** — §4 |
| **Induct** (tuloportti) | saapuva työ | `REQ`-rivi tiedostossa `_os/tasks/INDEX.md` |
| **Spur** (lähtöportti) | lähtevä tuotos | tiedosto hakemistossa `_os/events/surface/`, vienti |
| **Kuljetin** | tiedostoväylä | `_os/exchange/bus/` — kuinka työ siirtyy ilman että nosturi kantaa sitä |
| **Kuorma-auto** | ulkoinen palvelu tai toinen tekoäly | raja. §5 |

Pointti ei ole kuva. Pointti on se, että **osaat jo lukea tämän näytön**, jos olet joskus seissyt
varastonohjausjärjestelmän edessä — ja jos et, malli on silti konkreettinen tavalla, jota hakemistolistaus ei
ole.

---

## 3. Värit

Yksi silmäys, ennen mitään navigointia:

| Väri | Hallissa | Laivueessa |
|---|---|---|
| **VIHREÄ** | liikkeessä — nosturi kantaa kuormaa | agentti työskentelee; elävä istunto kesken tehtävän |
| **SININEN** | aikataulutettu — jonossa, ei vielä aloitettu | ilmoitus taululla: tilattu, odottaa agenttia |
| **KELTAINEN** | huomio — paikka vaatii päätöksen | `YELLOW`: kysy ennen jokaista toimenpidettä |
| **PUNAINEN** | hätäpysäytys — tuo vyöhyke seisoo | `STOP`: pysäytys on viritetty ja tämä juuri on jäädytetty |
| **HARMAA** | tyhjä tai ei elävää lähdettä | ei tietoja. Ei koskaan arvaus. |

Tämä ei ole uusi kaava. Se on se tila, jonka puu jo sisältää, esitettynä.

**Punainen voittaa aina silmäyksen.** Yksi punainen vyöhyke pysäyttää silmän ennen mitään vihreää, aivan kuten
pysäytys syrjäyttää jokaisen muun signaalin ([`01`](01-ESTOP.md)). **Halli, joka näyttää vihreää punaisen
vyöhykkeen päällä, valehtelee** — ja juuri sen vian tämä sääntö on olemassa kieltämään.

**Harmaa on pakollinen siellä, missä elävää lähdettä ei ole.** Paikka ilman tietoja esitetään harmaana ja näyttää
`—`. Sitä ei koskaan esitetä vihreänä, koska vihreä on miellyttävä oletusarvo ([`07`](07-INTERFACE.md) §2.2).

---

## 4. Sisäkkäinen varasto

**Avaa lava, etkä katso laatikkoa. Katsot toista kokonaista varastoa** — omine nostureineen, omine lavoineen,
omine portteineen.

Tämä on täsmälleen tiedostopuu. Hanke on varasto; sen osastot ovat käytäviä; niiden tiedostot ovat lavoja; ja
lava, joka itse on hakemisto, on toinen halli. Visualisoija on siis **yksi näkymä, joka laskeutuu**, samoin
ohjaimin joka syvyydellä, koska jokainen taso *on* varasto. Alaspäin mentäessä ei ole mitään uutta opittavaa.

Rekursio on koko syy siihen, miksi vertaus kestää sen sijaan, että olisi kuori. Koontinäyttö, joka esittää vain
ylimmän tason, on valokuva laivueesta; sellainen, joka laskeutuu, on näkymä siihen.

---

## 5. Kuorma-autot kiinnittyvät rajalle — ne eivät koskaan aja halliin

Tässä malli lakkaa olemasta visualisointi ja alkaa panna jotakin täytäntöön.

Ulkoinen palvelu — toinen tekoäly, API, toimittaja — on **kuorma-auto**. Ja todellisessa varastossa kuorma-auto
peruuttaa porttiin. Se ei aja halliin, ei siirrä nosturia, ei mene hyllyyn eikä avaa sisäkkäistä varastoa. Se
jättää kuorman inductiin tai noutaa sellaisen spurista, ja siinä on koko sen pääsy.

**Tuo portti on sulku.** Jokainen ulkoinen vaihto tapahtuu reunalla, suodatettuna, eikä mikään ulkoinen pääse
irti puun sisälle.

**Kuorma-auton papereihin ei luoteta ennen kuin ne on tarkistettu.** Kuorma-autolla saapuva kuorma on saapuvaa
*dataa*, ei määräys hallille. Se syötetään ja tarkastetaan kuten kaikki muukin, eikä sitä koskaan totella
saapuessa. Se on ohjelähteen raja kohdasta [`03`](03-BUS.md) §5, piirrettynä lastauslaituriksi — ja piirrettynä
siihen ainoaan paikkaan, jossa näyttöä katsova voi nähdä sen noudatetun.

Jos esityksesi asettaa kuorma-auton halliin, esitys on väärä ja niin on sen piirtämä arkkitehtuurikin.

---

## 6. Kaksi pintaa, kaksi tehtävää

| | **Halli** (tämä tiedosto) | **Konsoli** ([`07`](07-INTERFACE.md)) |
|---|---|---|
| Mikä se on | kolmiulotteinen halli, katsottuna elävänä | ruutuvalikko, porrastettuna pääsyn mukaan |
| Mitä se näyttää | **millainen järjestelmä on** — jokainen agentti, hakemisto ja tila kerralla | **mitä voit tehdä** — valitse työkalu, tee työ |
| Verbi | katsoa, ymmärtää, päättää | ajaa, käyttää, tuottaa |

**Halli näyttää, kuinka kone ajattelee; konsoli on toimimista varten sen mukaan, mitä päättelet.** Toinen on
kartta, toinen työpenkki. Ohjauspinta tarvitsee molemmat, ja virhe on rakentaa vain se kaunis.

---

## 7. Ohjaimet

Juuri navigointi teki alkuperäisestä käyttökelpoisen, ei väri yksin:

| Ohjain | Tekee |
|---|---|
| **Vedä** | kiertää hallia — kääntää, kallistaa, katsoa käytävää pitkin |
| **Ylhäältä** | siirtyä ylhäältä katsottuun pohjapiirrokseen. Kierto syvyyteen, pohjapiirros sijoitteluun |
| **Napsauta lavaa** | laskeutua siihen — toinen varasto, samat ohjaimet |
| **Vieritä** | zoomata |

Samat ohjaimet joka syvyydellä. Ei neuvoteltavissa: näkymä, jonka vuorovaikutus muuttuu laskeuduttaessa, on
rikkonut lupauksen siitä, että jokainen taso on varasto.

### Kamera on ortografinen, tarkoituksella

**Perspektiivistä supistumista ei ole.** Yhdensuuntaiset viivat eivät koskaan kohtaa, ja käytävän kaukopäässä
oleva paikka esitetään täsmälleen yhtä suurena kuin jalkojesi juuressa oleva.

Se näyttää hetken väärältä — silmä odottaa yhtymistä ja lukee sen puuttumisen kuin seisoisi laatikoiden sisällä
katsoen ulos. Se on silti oikea vaihtokauppa, ja juuri sitä todellisten automatisoitujen hallien ohjausnäytöt
käyttävät: **koko pointti on verrata paikkoja halin poikki yhdellä silmäyksellä**, ja perspektiivikamera tekee
käytävän kaukopäästä pienemmän, himmeämmän ja vaikeammin arvioitavan kuin lähipäästä. Perspektiivissä ”tuo hylly
on täydempi” ja ”tuo hylly on lähempänä” näyttävät samalta. Ortografisella kameralla eivät.

Peittyminen on yhä todellista — poispäin kääntyvät pinnat karsitaan ja lähempi geometria maalaa kauemman yli. Se
on litteä kamera, ei litteä näkymä.

Laitteet ovat tavoitettavissa myös **sivuvalikosta**, lajeittain ryhmiteltyinä — nosturit, lavat, kaksi porttia,
kuljetin, kuorma-autot. Valinta valikosta tai hallista avaa samat ohjaimet, koska halli, jossa voi liikkua vain
napsauttamalla pieniä laatikoita kolmiulotteisessa näkymässä, on esittely eikä väline.

---

## 8. Mitä halli saa ja ei saa tehdä

Jokainen rajoitus kohdasta [`07`](07-INTERFACE.md) §5 pätee. Viiva vedetään yhteen tiettyyn kohtaan:

**Halli saa syöttää. Se ei koskaan saa suorittaa.**

Se on sama viiva, jonka [`07`](07-INTERFACE.md) §1 jo vetää konsolille, ja juuri se sallii laitteilla olla
ohjaimia lainkaan. Nosturin valitseminen ja työn osoittaminen sille kirjoittaa `REQ`-rivin, joka nimeää kyseisen
agentin, ja jättää `TELL`in sen postilaatikkoon. **Se ei käynnistä mitään.** Yhtään prosessia ei käynnistetä,
yhtään komentoa ei ajeta, ja agentti ottaa työn omassa seuraavassa ajossaan — tai ei ota.

Kaksi seurausta, jotka menevät helposti väärin:

- **Osoitettu työ ei silti ole määräys.** `REQ`-rivi on kanoninen kirjaus; postilaatikkorivi vain osoittaa
  siihen. Tiedosto, joka *käskisi* agenttia — tai vaatisi Käyttäjän valtaa puun sisältä — olisi se
  turvallisuustapahtuma, jonka [`03`](03-BUS.md) §5 määrittelee, ja sen rakentaminen pintaan olisi pahempaa kuin
  tehdä se käsin. Valta on Käyttäjä keskustelussa. Halli kirjoittaa kirjauksen, ei ohjetta.
- **Osa laitteista ei saa ohjaimia, tarkoituksella.** Kuljetin on vain luettava: konsoli, joka voisi kirjoittaa
  rivejä väylälle, valmistaisi valtaa, jonka protokolla siltä kieltää. Kuorma-autoilla ei ole ohjaimia lainkaan
  — §5.

**`STOP`in aikana halli esitetään punaisena eikä se syötä mitään.** Punainen halli ei ota määräyksiä.

Rehellinen raja, sanottuna kerran: **tämä on valokuva puusta yhdellä hetkellä, ei elävä telemetriavirta.** Se
kysyy väliajoin. Kyselyjen välillä se on vanhentunut, näyttää milloin viimeksi luki, ja harmaantuu sen sijaan,
että teeskentelisi muuta, kun sidecar lakkaa vastaamasta.
