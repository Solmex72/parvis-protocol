> **Epävirallinen käännös.** Tämän asiakirjan normatiivinen versio on englanninkielinen, haarassa `main`.
> Tämä käännös tarjotaan mukavuussyistä, eikä **äidinkielinen puhuja ole sitä tarkastanut**. Jos teksti
> poikkeaa englanninkielisestä alkuperäisestä, **englanti ratkaisee**. Protokollan tunnisteet (`RUN`,
> `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, väylän verbit ja tiedostonimet) on tarkoituksella jätetty
> englanniksi: ne ovat kirjaimellisia arvoja, joita agentit jäsentävät.

# 05 — KORJAUS

**Tila: normatiivinen.** Mitä tapahtuu, kun kirjattu tosiasia osoittautuu vääräksi.

---

## 1. Ongelma

> Kuudessa tiedostossa väitetty tosiasia on niistä viidessä väärin.

Sen tiedoston korjaaminen, joka sattuu olemaan edessäsi, ei ole korjaus. Se luo puun, jossa sekä totuudella että
virheellä on viitteensä, ja seuraava istunto ottaa sen, jonka avaa ensin. Tämä on dokumentaatiopainotteisen
agenttilaivueen tunnusomainen vikatila, ja se pahenee hiljaa.

**Korjaus leviää, tai sitä ei tapahtunut.**

---

## 2. Lukeminen ei ole ilmaista — se velvoittaa

Ohjaavan tiedoston lukeminen asettaa sinut sen alle. Siitä seuraa kaksi asiaa:

1. Kaikki siinä oleva, joka on **kestävää, ei-ilmeistä eikä puusta johdettavissa**, siirtyy pysyvään muistiisi
   ennen istunnon päättymistä.
2. **Jos asiayhteytesi on ristiriidassa tiedoston kanssa, tiedosto voittaa.** Älä kierrä sitä. Korjaa kirja.

---

## 3. Välitön suunnankorjaus (ICC)

Yksi komento, yksi vuoro, ilman ehdotusvaihetta.

```
/icc the planner meal times are placeholders, not the Operator's actual times
```

### Järjestys

**1 · Läpikäynti.** Johda korjauksesta 2–5 hakutermiä: **vanha** muotoilu, sen ilmeiset muunnelmat ja mukana
olevat erisnimet. Ei uutta muotoilua. Aja yksi indeksoitu läpikäynti termiä kohti ennen kuin luet mitään. Älä
koskaan kulje puuta tiedosto kerrallaan osumia etsien — siihen indeksi on.

**2 · Luokittele jokainen osuma.**

| Osuma | Toimenpide |
|---|---|
| **Väittää vanhan tosiasian** | Kirjoita se uusiksi. |
| **Mainitsee sen ohimennen**, tosi kummassakin tapauksessa | Jätä se. Älä pöyhi tekstiä. |
| **On ristiriidassa uuden tosiasian kanssa välillisesti** — johdettu päätelmä, taulukkorivi, vanhan arvon varaan rakennettu ajastettu työ | **Kirjoita sekin uusiksi.** Tämä jää useimmin huomaamatta. |
| **Rajojen ulkopuolella** (§5) | Älä koskaan muokkaa. Merkitse kohtaan *Left alone*. |

**3 · Kirjoita kaikki uusiksi kerralla.** Mukaudu kunkin tiedoston olemassa olevaan ääneen ja sen
luottamusmerkintätapaan. Korjattu tosiasia säilyttää sen merkinnän, jonka ansaitsee — **älä korota väitettä
`[PROVEN]`iksi siksi, että se on nyt ajantasainen.** Jos vanhassa tekstissä oli päiväys, merkitse tämän päivän.

Kun tosiasia on väitetty useammassa kuin kolmessa tiedostossa, kyse on **kahdentumisesta, ei redundanssista**:
ilmaise se kerran siinä tiedostossa, joka sen omistaa, ja anna muiden osoittaa sinne.

**4 · Kirja ja muisti.** Molemmat, tai ajo ei ole valmis. Lisää merkintä korjauskirjan alkuun:

```
## 2026-01-14 — meal times are placeholders

Was      planner asserts 07:30 / 12:00 / 18:30 as the Operator's actual times
Now      those are defaults shipped with the template; real times are unknown
Why      Operator correction, 2026-01-14
Files    personal/planner/NOW.md:14, personal/planner/README.md:31, _os/tasks/INDEX.md:88
Memory   planner-meal-times.md (updated)
Left     backups/ (history), CONTEXT-BUNDLE.md (generated)
```

Kirjoita sen jälkeen tosiasia pysyvään muistiin — **tarkista ensin, onko aiheesta jo muistimerkintä, ja päivitä
juuri se** sen sijaan, että jättäisit kaksi versiota tosiasiasta, jonka yhdistämiseen käytit juuri yhden
komennon.

**5 · Muokkauksen jälkeiset velvollisuudet.** Aja uudelleen se generaattori tai varmuuskopiointi, johon
muokkaukset velvoittivat. Rakenna indeksi uudelleen, jos tiedostoja luotiin tai poistettiin.

---

## 4. Pysyvä päätös kumotaan avoimesti

Jos korjaus mitätöi pysyvän päätöksen — rivin ”ei oteta uudelleen esiin”, `[PROVEN]`-kohdan, linjaussäännön —
**älä käännä sitä hiljaa.** Kirjoita se uusiksi *kumottuna*, päiväyksen ja syyn kanssa, jotta seuraava istunto
tietää sen olevan kumottu eikä unohdettu.

Päätös, joka muuttuu jäljettä, ei ole erotettavissa päätöksestä, jota ei koskaan tehty.

---

## 5. Mitä ei koskaan kirjoiteta uusiksi

| Ei koskaan kosketa | Miksi |
|---|---|
| `backups/`, `archive/` | Historia. Historiaa ei korjata; se ohitetaan. |
| Luodut tiedostot | Muokkaa lähdettä ja aja generaattori uudelleen. |
| Eristetyn agentin puu | Pääsy vain nimenomaisella osoituksella. |
| Toisen juuren arvovaltainen pääasiayhteys | Ilmoita poikkeamasta. Älä muokkaa omistusrajan yli. |
| Kaikki, mikä sisältää salaisuuden | Täysin tekstiläpikäynnin ulottumattomissa. |

**Läpikäynti, joka kirjoittaa tekstiä uusiksi, tuhoaa binääritiedostoja.** Rajaa jokainen läpikäynti
tekstipäätteisiin sallittujen luettelolla, ei koskaan poissulkemalla.

---

## 6. Mitä ICC ei tee

`/icc` korjaa kirjan. **Se ei mene sen jälkeen tekemään sitä työtä, jota korjaus edellyttää.** Ne ovat erillisiä
tekoja erillisin valtuuksin, ja niiden sekoittaminen on se tapa, jolla yhden rivin korjauksesta tulee
tarkastamaton uudelleenrakennus.

---

## 7. Kilpailevat tosiasiat ratkaistaan ja karsitaan — ei luetteloida

Kun kaksi tiedostoa väittää ristiriitaisia tosiasioita, **päätä, kumpi on oikein, säilytä se ja poista väärät
väitteet samalla läpikäynnillä.**

Ristiriitaraportti, joka jättää molemmat kilpailijat levylle, ei ole ratkaissut mitään. Seuraava istunto ottaa
yhä sen tiedoston, jonka avaa ensin, ja turvallisuussääntö, jolla on viisi liikkeellä olevaa versiota, on
*vähemmän* luotettava kuin sellainen, jolla on yksi, ei enemmän.

**Ratkaise asiallisesti, ei koskaan aikaleiman mukaan.** Voittaja on se tiedosto, joka omistaa tosiasian, se
versio, jota mittaus kannattelee, se, joka kestää tarkastelun. **Uusin ei ole tosin** — kanoninen
epäonnistuminen tässä on neljä kahdentunutta muistitiedostoa, jotka kirjoitettiin yhdeksänkymmenen sekunnin
välein ja joista uusin sisälsi väärän väitteen, joten sääntö ”uusin voittaa” olisi perinyt virheen.

**Kirjaa ratkaisu.** Mikä tosiasia voitti, mitä karsittiin ja miksi — kirjaan, jotta karsinta on luettavissa eikä
hiljaista. Kilpailija, joka katoaa jäljettä, näyttää täsmälleen samalta kuin kilpailija, jota ei koskaan ollut, ja
seuraava istunto luo sen uudelleen.

### Mikä silti viedään ylöspäin sen sijaan, että ratkaistaisiin

Kolme tapausta. Näytä ne; älä ratkaise niitä:

- Ristiriita nojaa tietoon, jota agentilla ei ole.
- Väärässä oleminen olisi **turvatonta tai peruuttamatonta** — kaikki puolilla 0–2.
- Häviävä väite sijaitsee **agentin omistusrajan ulkopuolella** — toisen juuren arvovaltainen pääasiayhteys.
  Ilmoita poikkeamasta; älä muokkaa rajan yli.

Kaikki tavanomainen ratkaistaan ja siivotaan.
