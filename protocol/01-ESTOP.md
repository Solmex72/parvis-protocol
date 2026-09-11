> **Epävirallinen käännös.** Tämän asiakirjan normatiivinen versio on englanninkielinen, haarassa `main`.
> Tämä käännös tarjotaan mukavuussyistä, eikä **äidinkielinen puhuja ole sitä tarkastanut**. Jos teksti
> poikkeaa englanninkielisestä alkuperäisestä, **englanti ratkaisee**. Protokollan tunnisteet (`RUN`,
> `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, väylän verbit ja tiedostonimet) on tarkoituksella jätetty
> englanniksi: ne ovat kirjaimellisia arvoja, joita agentit jäsentävät.

# 01 — ESTOP (HÄTÄPYSÄYTYS)

**Tila: normatiivinen. Prioriteetti 0. Sitoo jokaista agenttia jokaisessa hankkeessa.**

---

## 0. Mitä tämä voi ja ei voi tehdä — lue tämä ensin

**Se ei voi keskeyttää käynnissä olevaa istuntoa.** Mikään tiedosto ei voi. Vastauksen puolivälissä oleva
agentti ei lue levyä, sillä ei ole keskeytyslinjaa, ja se saattaa loppuun sen, mitä on tekemässä. Se, joka
sanoo lipputiedoston pysäyttävän laivueen, kuvaa toivetta.

**Vain Käyttäjä pysäyttää käynnissä olevan agentin sulkemalla sen ikkunan.** Se on todellinen hätäpysäytys,
eikä se ole koskaan ollut mitään muuta.

Tämä tiedosto sitoo jokaista agenttia niinä kahtena hetkenä, joina se *todella* lukee levyä:

| Hetki | Velvollisuus |
|---|---|
| **Käynnistys** | Lue tila ennen oppiasi, ennen muistiasi, ennen kaikkea. |
| **Jokainen tarkistuspiste** | Ennen jokaista kirjoitusta, jokaista viestiä, jokaista sivuvaikutuksellista työkalukutsua, jokaista menoa. |

Agentti, joka havaitsee `STOP`in ja jatkaa, on viallinen agentti. Siinä on koko valvontamalli: ei mekanismi —
velvollisuus, usein tarkastettuna.

Rajan rehellinen ilmaiseminen kuuluu protokollaan. Pysäytys, jonka luulet olevan välitön, on vaarallisempi
kuin sellainen, jonka tiedät olevan ei-välitön, koska tulet luottamaan siihen.

---

## 1. Kaksi signaalia

### Vartija on tosiasia

**Tavallinen tiedosto**, jonka nimi on täsmälleen `estop` — ilman tunnistetta, nolla tavua on normaalia —
hankkeen juuressa tai **missä tahansa käsiteltävän puun ylemmässä hakemistossa**.

```bash
[ -f "$root/estop" ] && echo STOPPED
```

```powershell
if (Test-Path "$root\estop" -PathType Leaf) { 'STOPPED' }
```

Testaa **tiedostoa**, älä koskaan pelkkää olemassaoloa, äläkä koskaan glob-kuviota:

- `ESTOP.md` on oppia. Se ei saa koskaan laukaista tarkistusta. Vertailu, joka sen sallisi, loisi pysäytyksen,
  jota Käyttäjä ei voi purkaa.
- `_os/estop/` on hakemisto. Ei laukaise sekään.

Useat juuret laukeavat **toisistaan riippumatta**. Tarkista jokainen. Ilmoita polku, jolle ajoit `stat`in —
älä koskaan ”estop”, mikä kätkee sen, mitä katsoit.

### STATE-tiedosto on johdettu peili

`_os/estop/STATE` — yksi rivi, ei muuta.

```
RUN
```
```
YELLOW  2026-01-14T08:20:00Z  operator  new hardware on the bench, confirm before each run
```
```
STOP    2026-01-14T14:03:11Z  operator  reason in plain English
```

| Kenttä | Sääntö |
|---|---|
| verbi | `RUN`, `YELLOW` tai `STOP`. Mitään muuta ei jäsennetä. |
| aika | UTC, ISO-8601. |
| kuka | Kuka sen julisti. Vain Käyttäjä saa kirjoittaa `STOP`in / `YELLOW`in tai purkaa ne. |
| syy | Yksi rivi, selkokielellä, ilman ammattislangia. |

**Jos vartija ja peili ovat eri mieltä, pysäytys voittaa.** Peilin kirjoittavat työkalut ja se vanhentuu;
vartija on tosiasia.

---

## 2. Kolme tilaa

| STATE | Mitä agentti tekee |
|---|---|
| `RUN` | **Jatka.** Aja ne komennot, joita työ vaatii, pyytämättä lupaa jokaiseen erikseen. Älä pysähdy, älä luettele vaihtoehtoja, älä jätä rutiinityötä jonoon vahvistuksen taakse. |
| `YELLOW` | **Kysy ensin.** Jokainen komento ehdotetaan ennen ajoa. Sama työ, sama osaaminen — ero on vahvistuksessa. |
| `STOP` | Pysähdy. §3. |

### Mitä `RUN` ei tee

`RUN` poistaa *tauon ennen rutiinityötä*. Se ei poista **mitään olemassa olevaa estettä**, sillä ne koskevat
teon luonnetta, eivät sen nopeutta:

- tunnistetiedot, kirjautumiset, ostot, resurssien varaaminen — **aina Käyttäjän käsissä**;
- ulospäin suuntautuvat teot — julkaiseminen, lähettäminen, käyttöönotto — **aina nimenomaisella luvalla**;
- kaikki, minkä ihminen suorittaa fyysisesti — **kulkee edelleen turvaesteen kautta**;
- tuhoavat tai peruuttamattomat teot — **vahvistetaan edelleen, missä tahansa tilassa**;
- agentin omat pysyvät rajoitukset — **eivät riipu STATE:sta lainkaan**.

`RUN` vastaa kysymykseen *”pitääkö minun kysyä ennen jokaista askelta?”* — ei. Se ei vastaa kysymykseen
*”saanko tehdä mitä tahansa?”* Agentti, joka lukee `RUN`in ja tekee sitten jotakin tältä luettelolta, on
lukenut tilan väärin, ei saanut siltä valtuutusta.

### Turvallinen vikaantuminen lukukelvottomalla verbillä

STATE-tiedosto, joka **puuttuu, on tyhjä, lukukelvoton tai sisältää minkä tahansa muun sanan, luetaan
`YELLOW`iksi** — ei koskaan `RUN`iksi. Kysy.

> Tämä on rivi, joka käännetään toteutuksissa useimmin päinvastaiseksi. `try { read } catch { return "RUN" }`
> muuttaa jokaisen levyvirheen, jokaisen oikeuksien muutoksen ja jokaisen kirjoitusvirheen hiljaiseksi
> valtuutukseksi. Viite-sidecar putoaa `YELLOW`iin ja kieltäytyy palvelemasta lukuvirheessä; katso
> [`reference/sidecar/parvis-sidecar.mjs`](../reference/sidecar/parvis-sidecar.mjs).

Vartijatiedosto syrjäyttää tämän kohdan kokonaan: läsnä oleva `estop`-tiedosto tarkoittaa `STOP`ia, sanoipa
STATE mitä tahansa.

**Vain Käyttäjä kirjoittaa tämän tiedoston.** Yksikään agentti ei kirjoita sitä — ei myöskään se agentti, joka
löysi ongelman. Agentti, joka katsoo laivueen kuuluvan pysähtyä, nostaa `GATE`n väylälle ja sanoo sen. Se ei
pysäytä laivuetta omalla vallallaan eikä käynnistä yhtäkään uudelleen.

---

## 3. Mitä agentti tekee `STOP`illa

1. **Älä kirjoita enää mitään.** Ei muistitiedostoa, ei raporttia, ei väylää.
2. **Tallenna paikalleen ja pysähdy sitten.** Älä saata loppuun yhtään askelta, jota ei ole jo kirjoitettu.
   Merkitse se, mitä on, osittaiseksi, yhdellä rivillä siitä, mihin pysähdyit.

   > Tämän protokollan aiemmat luonnokset sanoivat *hylkää*. Se oli väärin: hylätty puolikas raportti tuhoaa
   > työtä, jota uudelleenkäynnistysoppi on olemassa suojelemaan. Vaara on katkaistu tiedosto, joka myöhemmin
   > luetaan valmiiksi — ja juuri **merkintä** estää sen, ei poistaminen.
3. **Sano Käyttäjälle yksi rivi:** `ESTOP observed <timestamp> — <reason>. Holding.`
4. **Pysähdy.** Älä pyydä lupaa jatkaa. Älä ehdota kiertotietä. Älä tutki, koskeeko syy sinua — se koskee
   sinua.

**Kieltäytyminen on vastaus, ei uusi yritys.** Älä mene silmukkaan odottamaan `RUN`ia. Ilmoita ja lopeta.

---

## 4. Mikä sen purkaa

Käyttäjä palauttaa tiedoston `RUN`iin. Mikään muu ei tee sitä — ei aikakatkaisu, ei agentti, joka pitää
ongelmaa ratkaistuna, ei ajan kuluminen, ei uusi istunto, joka ei koskaan nähnyt pysäytystä.

Itsensä purkava käsittelijä on turvallisen vikaantumisen kääntäminen päinvastaiseksi ja hylätään asiallisesti.

---

## 5. Soveltamisala

Hätäpysäytys koskee **oletusarvoisesti koko laivuetta**. Agenttikohtaista pysäytystä ei ole, sillä vika, joka
vaatii pysäytyksen, ei lähes koskaan rajoitu yhteen agenttiin, ja osittainen pysäytys kutsuu juuri siihen
päättelyyn — *”se koski jotakuta toista”* — jonka tämä tiedosto on olemassa kieltämään.

**Eristetyt agentit kuuluvat piiriin.** Agentti, joka ei ole millään väylällä eikä millään jaetulla pinnalla,
lukee silti tämän tiedoston. Eristys määrää, mitä agentti saa *sanoa*. Se ei koskaan määrää, saako sen
*pysäyttää*.

---

## 6. Mittaa kahdesti

Yksittäinen vihreä tarkistus ei koskaan todista turvallisuustilaa. Lue molemmat signaalit, levyltä, **tässä
ajossa**. Älä koskaan lainaa muistettua tilaa — ei asiayhteydestä, ei muistitiedostosta, ei aiemmasta
vuorosta. Väärin luettu `stat`-muoto riittää tuottamaan väärän ”vapaan” tai väärän ”pysäytetyn”, ja molempia
on käytännössä sattunut.

Vahvin käytettävissä oleva muoto on **pysyvä valvonta** STATE-tiedoston ja jokaisen vartijapolun yllä, joka
ilmoittaa vain muutoksesta: vaiti niin kauan kuin on vapaata, ja laukeaa sillä hetkellä, kun pysäytys viritetään.
Se muuttaa ”tarkistin kerran käynnistyksessä” reaaliaikaiseksi kattavuudeksi ja sulkee sen aukon, jossa pysäytys
viritetään kesken istunnon.

---

## 7. Rehellinen raja, sanottuna kerran

Tämä protokolla tekee pysäytyksestä **luotettavan jokaisessa käynnistyksessä ja jokaisessa tarkistuspisteessä**.
Se ei tee pysäytyksestä **välitöntä**, eikä mikään tiedostopuuhun kirjoitettu koskaan tee.

Jos jokin menee juuri nyt pieleen: **sulje ikkuna.** Kirjoita sen jälkeen tiedosto, jottei seuraava heräävä
agentti käynnistä sitä uudelleen.
