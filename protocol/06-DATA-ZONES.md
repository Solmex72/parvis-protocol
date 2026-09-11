> **Epävirallinen käännös.** Tämän asiakirjan normatiivinen versio on englanninkielinen, haarassa `main`.
> Tämä käännös tarjotaan mukavuussyistä, eikä **äidinkielinen puhuja ole sitä tarkastanut**. Jos teksti
> poikkeaa englanninkielisestä alkuperäisestä, **englanti ratkaisee**. Protokollan tunnisteet (`RUN`,
> `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, väylän verbit ja tiedostonimet) on tarkoituksella jätetty
> englanniksi: ne ovat kirjaimellisia arvoja, joita agentit jäsentävät.

# 06 — TIETOVYÖHYKKEET

**Tila: normatiivinen.** Missä tiedosto saa asua.

---

## 1. Miksi kielto ei toiminut

Alkuperäinen sääntö kuului *”ei salaisuuksia, ei koskaan, ei missään”* — **eikä yksityisille tiedoille ollut
mitään paikkaa sen sijaan.**

Kieltoa ilman määränpäätä ei noudateta. Se kierretään, ja yksityinen aineisto päätyy vahingossa
synkronoituun puuhun. Näin kävi toistuvasti, myös agentin toimesta, joka itse oli säännön alainen.

**Sääntö on reitityspäätös, ei kielto.**

---

## 2. Kaksi vyöhykettä

| Vyöhyke | Ominaisuus | Sisältää |
|---|---|---|
| **PUBLIC** | Synkronoituu pilvitallennukseen. **Käsittele jokaista tavua julkaistuna.** | Oppi, toimeksiannot, agenttimääritelmät, arkkitehtuuri, liiketoiminnan asiayhteys, tutkimus, tekninen dokumentaatio |
| **PRIVATE** | **Jokaisen synkronointijuuren ulkopuolella** — ja käyttäjäprofiilin ulkopuolella, jottei tunnettujen kansioiden uudelleenohjauskaan yllä sinne | Salaisuudet, todelliset henkilöt ja heidän henkilötietonsa, yksityiset hankkeet ja media, kaikki, mitä olisi väärin löytää varmuuskopiosta |

### Koe

> *Olisiko ongelma, jos tämä olisi vuoden päästä pilvitilannekuvassa?*

Kyllä → PRIVATE. Ei → PUBLIC. Aidossa epävarmuudessa → **PRIVATE.** Yliluokittelun hinta on hankaluus.
Aliluokittelun hintaa ei voi perua.

### Tiedä, mikä todella synkronoituu

Tarkista tämä oikealla koneella, ei olettamalla. Tavallisella työasemalla voi olla käynnissä useita
synkronointiohjelmia yhtä aikaa, ja kaikki käyttäjän asiakirja-, työpöytä- tai kuvakansioiden alla oleva poistuu
koneelta ja säilyy versiohistoriassa viikkoja. **Paikallinen poistaminen ei kutsu sitä takaisin.**

Kaksi seurausta, joista kumpikin aiheuttaa todellisia vikoja:

1. **Käännöksen tuotos on ohjattava** ulos synkronointijuuresta, tai peili turmelee sen kesken käännöksen.
2. **Avaimet asuvat ulkopuolella**, tarkoituksella ja oletusarvoisesti.

---

## 3. Poikkeus: tunnistetiedot eivät kuulu kumpaankaan vyöhykkeeseen

**Voimassa olevat tunnistetiedot — salasanat, API-avaimet, tokenit, lähetysavaimet — kuuluvat
salasanojenhallintaan, eivät kumpaankaan tiedostojärjestelmään.**

Yksityinen vyöhyke sisältää *yksityisiä tietoja*. Salasanojenhallinta sisältää *tunnistetietoja*. Tämä ei ole
saivartelua: yksityistä hakemistoa ei ole oletusarvoisesti salattu, ja tiedosto on tiedosto. Sillä hetkellä, kun
jokin niistä kopioidaan, lainataan litteroinnissa tai liitetään johonkin, se on paljastettu.

**Ilmaise yksityisen vyöhykkeen turvaominaisuus suppeasti äläkä koskaan liioittele sitä.** Sen ainoa todistettu
ominaisuus on yleensä se, että *mikään ei kopioi sitä minnekään*. Ilman todennettua koko levyn tai
tiedostokohtaista salausta se ei ole salattu, ei varmuuskopioitu eikä kassakaappi.

---

## 4. Luokittelu on Käyttäjän, ja se on säädettävissä

Pidä elävä taulukko yhdessä tiedostossa — `DATA-CLASSIFICATION.md` — jossa Käyttäjä siirtää luokkia vyöhykkeiden
välillä ja jota jokainen agentti lukee arvaamisen sijaan.

Tämä protokollatiedosto ilmaisee **mekanismin**. Tuo tiedosto ilmaisee **linjauksen**. Missä nämä kaksi ovat eri
mieltä, linjaustiedosto voittaa.

---

## 5. Seuraukset agenteille

- **Ei salaisuuksia missään puussa, joka paketoidaan.** Asiayhteyspaketti on olemassa liitettäväksi uuteen
  istuntoon. Nimeä, mitä säilytetään ja missä; ei koskaan arvoa.
- **Yksikään salaisuus ei yllä hakemistoon `surface/`.** Se näytetään näytöllä.
- **Yksikään salaisuus ei yllä selaimeen.** Katso [`07-INTERFACE.md`](07-INTERFACE.md) §3.
- **Peitä viittauksella, ei poistamalla.** `<api key — see password manager entry "acme-prod">` pitää tosiasian
  löydettävissä paljastamatta arvoa.

---

## 6. Karsinta ilman menetystä

Ennen kuin mikään poistuu työpuusta:

1. Kopioi se sinetöityyn varastoon **juurten ulkopuolelle** — arkistotiedostoon, ei glob-haulla tavoitettavaksi.
2. Valmistele polut tiedostoihin `marked-deletion.md` / `marked-archive.md`.
3. **Suoritus on Käyttäjän käsi**, puun ollessa levossa.

Älä koskaan poista joukoittain käynnissä olevan rinnakkaisuuden aikana.
