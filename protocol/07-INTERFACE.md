> **Epävirallinen käännös.** Tämän asiakirjan normatiivinen versio on englanninkielinen, haarassa `main`.
> Tämä käännös tarjotaan mukavuussyistä, eikä **äidinkielinen puhuja ole sitä tarkastanut**. Jos teksti
> poikkeaa englanninkielisestä alkuperäisestä, **englanti ratkaisee**. Protokollan tunnisteet (`RUN`,
> `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, väylän verbit ja tiedostonimet) on tarkoituksella jätetty
> englanniksi: ne ovat kirjaimellisia arvoja, joita agentit jäsentävät.

# 07 — KÄYTTÖLIITTYMÄKERROS

**Tila: normatiivinen.** Tämä on se tiedosto, jonka mukaan hanke on nimetty.

Jokainen pinta, johon ihminen koskee, on **Parvis**. Vain luettava hallinäkymä on *Parvis HMI*; ruutuvalikko,
josta ohjaat laivuetta, on *Parvis Console*.

---

## 1. Sääntö, joka saa HTML:n toimimaan

> Selainsivu on **näyttö ja näppäimistö**, ei ohjelma, jolla on levypääsy.

Tuo yksi tosiasia hallitsee koko kerrosta:

- **Sivu näyttää ja kerää.** Se esittää tilan ja ottaa vastaan syötettä. Tiedostopolusta avattuna se ei
  yksinään **voi lukea puuta eikä kirjoittaa määräystä.** Selaimen hiekkalaatikko kieltää molemmat, ja se on
  ansio.
- **Sidecar rakentaa sillan.** Pieni takaisinkytkentäsilmukan palvelu — sidottuna osoitteeseen `127.0.0.1` eikä
  mihinkään muuhun — on ainoa, joka lukee puun sivun puolesta ja kirjoittaa sen, minkä sivu lähettää. Sivu hakee
  tilan `GET`illä; sivu lähettää kehotteen `POST`illa; sidecar tekee levytyön. **Ei sidecaria, ei elävää
  Parvisia — vain tilannekuva.**
- **Mikään ei kierrä tarkastelua.** Parvisista lähetetty kehote on **syöttö, ei suoritus.** Sidecar kirjoittaa
  `REQ`-rivin tehtäväkirjaan ja pysähtyy. Se ei koskaan käynnistä agenttia, ei koskaan aja komentoa, ei koskaan
  lähetä. Uuden työn vahvistaminen pysyy Käyttäjän näppäinpainalluksena.

Siksi sivu ”toimii”: sivu on rehellinen siitä, että se on ikkuna, sidecar tekee pienen todellisen työn reunalla,
ja **tarkastelu seisoo yhä kehotteen ja liikkuvan koneen välissä.**

---

## 2. Kovat vaatimukset — jokaiselle Parvis-pinnalle

1. **Omavarainen.** Yksi HTML-tiedosto: CSS ja JS sisällytettynä, ei ulkoisia skriptejä, ei CDN:ää. Vain
   verkkokirjasimet aidolla varaketjulla. Sen on esityttävä verkottomana tiedostopolusta.

2. **Värit ovat tila, luettuna elävänä, ei koskaan teeskenneltynä.** Vihreä = käynnissä, keltainen = kysy ensin,
   punainen = pysäytetty — johdettuina STATE-tiedostosta ja elävästä kirjasta. **Arvo ilman elävää lähdettä
   näyttää `—`, ei koskaan uskottavan näköistä lukua.** Punainen syrjäyttää jokaisen muun värin ja koko
   käyttöliittymän.

3. **Sidecar toimii vain takaisinkytkentäsilmukassa eikä säilytä salaisuutta, jonka sivu voisi nähdä.** Yksikään
   API-avain, tunnistetieto tai arvokas token ei yllä selaimeen. Sidecar todentaa sivun paikallisella
   istuntotokenilla ja tekee etuoikeutetun työn itse. **Sivu ei koskaan säilytä mitään varastamisen arvoista.**

4. **Tilannekuva merkitään tilannekuvaksi,** lukuaikoineen. Vain sivu, joka keskustelee elävän sidecarin kanssa,
   saa esiintyä elävänä. Vanhentunut sivu, joka näyttää elävältä, on pahempi kuin ei sivua lainkaan.

5. **Hätäpysäytys syrjäyttää käyttöliittymän.** `STOP`in aikana Parvis ei syötä mitään, eikä sidecar kirjoita
   muuta kuin uloskirjautumisrivin. **Punainen halli ei ota määräyksiä.**

6. **Parvis-tuotemerkki, eikä kolmansien yritysten nimiä.** Mistä todellisista järjestelmistä kaava onkin
   opittu, kaava on sinun ja sen nimi on Parvis. Pinta, joka levittää toisen kauppanimeä, on väärin ja
   korjataan.

---

## 3. Sidecarin turvavaatimukset

Takaisinkytkentäsilmukan HTTP-palvelu kehittäjän työasemalla on todellinen hyökkäyspinta. Nämä kohdat eivät ole
valinnaisia.

| Vaatimus | Miksi |
|---|---|
| **Sido `127.0.0.1` nimenomaisesti**, ei koskaan `0.0.0.0` | Kaikkien rajapintojen sitominen julkaisee laivuekonsolisi lähiverkkoon. |
| **Tarkista `Host`-otsake** sallittujen luetteloa `127.0.0.1:<port>` / `localhost:<port>` vastaan | Kukistaa DNS-rebindingin, jolla vierailtu verkkosivu yltää silmukan palveluun. |
| **Hylkää pyynnöt, joissa on `Origin`, jota et ole antanut** | Sama hyökkäysluokka, eri vektori. |
| **Vaadi istuntotoken** jokaisella muuttavalla reitillä, annettuna sivun latauksessa, ei koskaan lokiin | Sivu todistaa olevansa sinun sivusi. |
| **Salli luettelossa jokainen polku**, jonka palvelu lukee tai kirjoittaa, ratkaise se sitten uudelleen ja vahvista sisältyvyys | Kukistaa polkujen läpikäynnin. Pelkkä sallittujen luettelo ei riitä, jos symbolisia linkkejä on. |
| **Vikaannu turvallisesti lukukelvottomalla estopilla** — kieltäydy, älä palaa `RUN`iin | Katso [`01-ESTOP.md`](01-ESTOP.md) §2. |
| **Ei `eval`ia, ei kuoren kutsua, ei käyttäjäsyötteen mallipohjasijoitusta** | Kehotepalkki on syöttökenttä, ei komentorivi. |

Viitetoteutus hakemistossa [`reference/sidecar/`](../reference/sidecar/) toteuttaa kaikki nämä kohdat, ja se on
kommentoitu kunkin kohdalla.

---

## 4. Mitä pinnat ovat

| Pinta | Mikä | Tila |
|---|---|---|
| **Parvis Console** | Välilehtipaneelit — tila, asiakirjat, kirja, väylä, pinta, asetukset | Toimitetaan. |
| **Parvis Floor** | Varasto-välilehti: kolmiulotteinen halli, kiertäminen ja laskeutuminen, laitteiden ohjaus | Toimitetaan. Katso [`09-FLOOR.md`](09-FLOOR.md). |
| **Kehotepalkki** | Syöttökenttä, konsolilla ja jokaisen hallilaitteen luona | Toimitetaan. |
| **Sidecar** | Silmukkasilta: lukee puun, kirjoittaa `REQ`-rivejä, ei säilytä salaisuuksia | Toimitetaan. |

**Toimita paneelit ensin.** Kolmiulotteinen halli on se osa, jonka kaikki haluavat rakentaa, ja se osa, joka on
arvoton ilman kirjaa allaan — se esittää tilaa, jonka muu protokolla tuottaa, ja tyhjässä puussa se näyttää
oikeutetusti tyhjää.

---

## 5. Kanta

- **Sivu lukee. Sidecar kirjoittaa. Käyttäjä vahvistaa.**
- Yksikään pinta ei käynnistä, lähetä, ota käyttöön eikä pura hätäpysäytystä.
- Yksikään salaisuus ei yllä selaimeen, ei koskaan.
- Tuotos menee tiedostoihin ja konsolille, ei keskusteluikkunaan
  ([`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)).
