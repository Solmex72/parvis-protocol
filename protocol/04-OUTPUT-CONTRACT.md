> **Epävirallinen käännös.** Tämän asiakirjan normatiivinen versio on englanninkielinen, haarassa `main`.
> Tämä käännös tarjotaan mukavuussyistä, eikä **äidinkielinen puhuja ole sitä tarkastanut**. Jos teksti
> poikkeaa englanninkielisestä alkuperäisestä, **englanti ratkaisee**. Protokollan tunnisteet (`RUN`,
> `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, väylän verbit ja tiedostonimet) on tarkoituksella jätetty
> englanniksi: ne ovat kirjaimellisia arvoja, joita agentit jäsentävät.

# 04 — TUOTOSSOPIMUS

**Tila: normatiivinen.** Minne työ menee, kun se on valmis.

---

## 1. Sääntö

**Älä raportoi keskusteluun. Työskentele tiedostopuussa, kirjoita tuotos levylle ja näytä osoitin.**

Agentti, joka lopettaa kirjoittamalla pitkän vastauksen keskusteluikkunaan, on pannut tuotoksensa sinne, missä
mikään muu laivueessa ei voi lukea sitä — ei toinen agentti, ei valvonta, ei konsoli, ei seuraava istunto.
Tiedosto on kestävä kirjaus; keskustelu on litterointi, jota kukaan myöhempi ei näe.

---

## 2. Minne tuotos menee

| Tuotoksen laji | Päätyy |
|---|---|
| Työn tulos, löydökset, raportti | vastuutiedostoon tai `outbox/YYYYMMDD-HHMMSS-<slug>.md` |
| Kaikki, mitä Käyttäjän pitäisi nähdä nyt | lyhyt osoitintiedosto hakemistoon `_os/events/surface/` |
| Pyyntö, joka vaatii Käyttäjää | `_os/exchange/requests/REQ-<slug>.md` |
| Kirjanpitorivi | `_os/tasks/INDEX.md` |

**Hakemisto `surface/` on ilmoitus. Tiedosto on sisältö.** Kirjoita sisältö omalle paikalleen ja jätä sitten
yhden rivin osoitin hakemistoon `surface/`, jotta konsoli näyttää Käyttäjälle, minne se päätyi.

---

## 3. Tehtäväkirja

Yksi rivi kutakin määräystä kohti. Lisää `REQ`-rivi **ennen** aloitusta, jotta keskeytynyt tehtävä pysyy
näkyvissä.

```
REQ     | 2026-01-14 | SCOUT | <the order, in the Operator's words where possible> | <status note>
DONE    | 2026-01-14 | SCOUT | <the order> | evidence: outbox/20260114-090312-lease-rates.md
BLOCKED | 2026-01-14 | SCOUT | <the order> | <what is blocking, one line>
REFUSED | 2026-01-14 | SCOUT | <the order> | <why, one line + where the reasoning lives>
```

**`DONE`-rivi ilman näyttöpolkua on pätemätön.** Jos tiedostoa ei ole, työ ei päätynyt mihinkään, missä Käyttäjä
voisi sen nähdä. Oma ilmoitus on `[CLAIMED]`; tiedosto on se, mikä tekee siitä `[PROVEN]`in.

**Kieltäytyminen kuuluu tänne pysyvästi.** Näin laivue lakkaa ottamasta ratkaistuja kysymyksiä uudelleen esiin.
Älä poista sitä myöhemmin.

**Rehellinen raja:** tämä kirja ei havainnoi mitään. Se on täsmälleen niin täydellinen kuin siihen kirjoittavat
agentit. Puuttuva tehtävä ei ole näyttö siitä, ettei tehtävää koskaan ollut — vain siitä, ettei kukaan kirjannut
sitä. Käsittele riviä *väitteenä, johon on liitetty näyttöpolku*, ei koskaan näyttönä. Tarkista, että
näyttötiedosto on olemassa, ennen kuin luotat mihinkään `DONE`en.

---

## 4. Valmis on se, että Käyttäjä näkee sen

Ei se, että agentti julistaa sen. Vastaus ei ole pysähdyskohta: valvonnat pysyvät viritettyinä sen läpi, työ
jatkuu, ja sitten tapahtuu harkittu uloskirjautuminen.

---

## 5. Vastasääntö, joka syrjäyttää reitityksen

**Hätäpysäytys ja suoruus menevät edelleen ihmiselle, heti ja näkyvästi.**

Epäonnistuminen näytetään yhtä näkyvästi kuin onnistuminen. Tuotoksen reitittäminen tiedostoihin ei saa koskaan
muuttua paikaksi, johon huono tulos haudataan. Jos laivueen hyvät uutiset tulevat keskusteluun ja huonot
tiedostoon, jota kukaan ei avaa, sopimus on käännetty päinvastaiseksi ja laivue valehtelee nyt reitityksellä.

---

## 6. Sopimuksen oma rehellinen raja

Keskusteluvaljaissa ajava agentti tuottaa yhä avustajatekstiä siihen keskusteluun — tämä sopimus ei voi ohjata
valjaita uudelleen. Se sitoo **sen, minkä agentti valitsee kirjoittaa**: sisällön tiedostoihin ja
keskustelutekstin lyhyeksi osoittimeksi — *”kirjoitettu polkuun `<path>`, näytetty konsolilla”* — ei koskaan koko
raporttia.

---

## 7. Yksikään salaisuus ei yllä pinnalle

Hakemiston `surface/` lukee konsoli, ja se voidaan näyttää näytöllä, kuvakaappauksessa tai jaetussa ikkunassa.
Tietovyöhykkeiden säännöt ([`06-DATA-ZONES.md`](06-DATA-ZONES.md)) pätevät tässä täydellä voimalla.
