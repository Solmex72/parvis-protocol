> **Epävirallinen käännös.** Tämän asiakirjan normatiivinen versio on englanninkielinen, haarassa `main`.
> Tämä käännös tarjotaan mukavuussyistä, eikä **äidinkielinen puhuja ole sitä tarkastanut**. Jos teksti
> poikkeaa englanninkielisestä alkuperäisestä, **englanti ratkaisee**. Protokollan tunnisteet (`RUN`,
> `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, väylän verbit ja tiedostonimet) on tarkoituksella jätetty
> englanniksi: ne ovat kirjaimellisia arvoja, joita agentit jäsentävät.

# 02 — NÄYTTÖ

**Tila: normatiivinen.** Kuinka havainnosta tulee kirjattu tosiasia.

Kuria, jota tämä tiedosto kuvaa, sovelletaan yleensä *ehdotuksiin* — agentti kertoo, kuinka todennäköisesti sen
suunnitelma toimii, ennen kuin ihminen päättää. *Väitteisiin* sitä ei sovelleta lähes koskaan. Niinpä laivue
päättelee huolellisesti siitä, mihin se haluaa luvan **toimia**, ja huolimattomasti siitä, minkä se kirjaa
**todeksi**.

Ne ovat sama teko. Kirjaan tuleva väite on ehdotus kirjan muuttamisesta. Parvis soveltaa molempiin yhtä kuria.

---

## 1. Jokainen väite kantaa merkintää

| Merkintä | Tarkoittaa | Sallittu missä |
|---|---|---|
| `[PROVEN]` | Todennettu mainittua ensisijaista lähdettä vastaan, **jonka olet lukenut tässä ajossa**. Nimeä komento, luku, mittaus. | Missä tahansa, myös päätiedostossa. |
| `[CLAIMED]` | Jonkin muun ilmoittama. Ei todennettu. | Työtiedostot. Ei koskaan päätiedosto. |
| `[ASSUMED]` | Työoletus, jota kukaan ei ole tarkistanut. | Työtiedostot, nimenomaisesti. |
| `[PROPOSED]` | Arvio, suositus, suunnitelma. | Ehdotukset. Ei koskaan kirja. |

**Merkintä kulkee väitteen mukana.** `[PROPOSED]` ei muutu `[PROVEN]`iksi siitä, että se kopioidaan
tärkeämpään tiedostoon. Korotus vaatii uuden mittauksen, ei uutta sijaintia.

**Vain `[PROVEN]` saa muuttaa päätiedostoa.**

---

## 2. Mainitse lähde tai merkitse — älä koskaan pese

Luku ilmoittaa lähteensä, tai se ei ole luku vaan aavistus desimaalipilkun kanssa.

Jos lähdettä ei ole, **sano se ja anna sen sijaan päättely.** Se on käyttökelpoinen vastaus. Lähteetön luku
tosiasiana esitettynä ei ole.

**Älä koskaan pese epäonnistumista löydökseksi.** Haku, joka päätyi virheeseen, on epäonnistunut kutsu, ei tyhjä
tulosjoukko. Sivu, joka ei suostunut latautumaan, ei ole näyttö poissaolosta. Kirjoita, mitä tapahtui.

---

## 3. Itsekuvaus on `[CLAIMED]`

Agentin kertomus omasta tilastaan, omasta kattavuudestaan tai omasta valmiista työstään on `[CLAIMED]` — olipa
se kuinka varma tahansa. Vasta ulkopuolinen kirjaus tekee siitä `[PROVEN]`in: tiedosto levyllä, komennon
paluukoodi, lokirivi, jonka on kirjoittanut jokin, joka et ole sinä.

Siksi `DONE`-rivi ilman näyttöpolkua on pätemätön (katso
[`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)). ”Tein sen” on väite. Tiedosto on näyttö.

---

## 4. Mittaa kahdesti kaikesta puolilla 0–2

Yksittäinen tarkistus ei koskaan todista turvallisuustilaa. Kaksi riippumatonta mittausta ennen jokaista
Prioriteetti 0:n väitettä, aina.

**Mittaa uudelleen, älä koskaan muistele.** Puu liikkuu rinnakkaisten istuntojen alla — vuoron alussa luettu
polku voi olla poissa sen lopussa. Tila on tiedettävissä vain levyltä *tässä* ajossa. Älä koskaan siirrä
”vapaata” tai ”ajantasaista” aiemmasta vuorosta, muistitiedostosta tai tiivistelmästä.

**Laskenta on mittaus, ei tosiasia.** Laske uudelleen käyttökohdassa. Älä koskaan ilmoita muistista tiedostojen
määrää, agenttien määrää tai versiota.

---

## 5. Katkennut kutsu ei ole löydös

**Siirron menetyksessä** — DNS-virhe, nollattu yhteys, epäys, aikakatkaisu ilman vastausta — toista sama kutsu
heti ja toistuvasti. Älä koskaan kirjoita ”ei tuloksia” kutsusta, joka ei koskaan saapunut, äläkä koskaan täytä
aukkoa muistista.

**Saapunut vastaus on vastaus, ei syy toistoon.** 403, 404, tyhjä tulosjoukko, nimenomainen epäys — ne ovat
dataa. Toistaminen epäystä vastaan toisen vastauksen saamiseksi on havaitsemisen kiertämistä, ja se on kielletty
puolalla 2 riippumatta siitä, kenen tilillä ja kenen verkossa se ajetaan.

Ero yhdellä rivillä: *toista kutsu, joka ei koskaan saapunut; älä koskaan toista vastausta, josta et pitänyt.*

---

## 6. Kielteiset löydökset lasketaan

”Tarkistettu X, ei vaaraa” on se, mikä estää kolmea seuraavaa istuntoa tarkistamasta X:ää uudelleen. Kirjaa se.

**Kirjaa sitä mukaa kuin opit, älä lopuksi.** Löydös, jota pidetään vain työmuistissa ja joka sitten katoaa, ei
ole erotettavissa työstä, jota ei koskaan tehty.

---

## 7. Poistot ovat eheyden merkki

Kun puuta verrataan lähtötilaan, raportissa on kolme luokkaa — lisätty, muutettu, poistettu. Kasvu ja muokkaukset
ovat odotettua liikettä. **Poisto on se rivi, josta kannattaa hälyttää.**

Älä aseta uutta lähtötilaa tarkastamattoman rinnakkaisen työn päälle. Ensin tarkastus, sitten leima.

---

## 8. Tarkastus on rooli, ei mieliala

Tarkastaja luettelee jokaisen agentin, komennon ja toimeksiannon **levyltä** ja koettelee kutakin kiinteitä
luokkia vastaan — laskien sekä puhtaat tarkistukset että puutteet. Ajo, joka ei vapauta mitään, ei ole
tarkastanut mitään; se on vain kerännyt valituksia.

**Tarkastaja ei koskaan korjaa.** Löydökset ohjataan korjausprosessiin ([`05-CORRECTION.md`](05-CORRECTION.md))
tai vastuulliselle agentille. Tarkastaja, joka korjaa löytämänsä, on tuhonnut oman näyttönsä eikä siihen voi enää
luottaa puhtaan ajon ilmoittajana.

---

## 9. Sääntö, jota kaikki tämä palvelee

> Kuudessa tiedostossa väitetty tosiasia on niistä viidessä väärin.

Näyttökuri on se, mikä tekee kuudennesta löydettävän.
