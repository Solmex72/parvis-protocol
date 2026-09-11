> **Epävirallinen käännös.** Tämän asiakirjan normatiivinen versio on englanninkielinen, haarassa `main`.
> Tämä käännös tarjotaan mukavuussyistä, eikä **äidinkielinen puhuja ole sitä tarkastanut**. Jos teksti
> poikkeaa englanninkielisestä alkuperäisestä, **englanti ratkaisee**. Protokollan tunnisteet (`RUN`,
> `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, väylän verbit ja tiedostonimet) on tarkoituksella jätetty
> englanniksi: ne ovat kirjaimellisia arvoja, joita agentit jäsentävät.

# 08 — AGENTIT

**Tila: normatiivinen.** Mikä agentti on ja mitä se on velkaa jokaisessa ajossa.

---

## 1. Roolit

| Rooli | Kuka |
|---|---|
| **Käyttäjä** | Ihminen. Julistaa prioriteettitasot, purkaa pysäytyksen, pitää jokaisen tunnistetiedon, vahvistaa jokaisen peruuttamattoman teon. |
| **Agentti** | Yksi rajattu työntekijä, jolla on määritelmätiedosto, nimiavaruus johon se saa kirjoittaa, ja pysyvä tehtävä. |
| **Laivue** | Kaikki agentit yhden protokollajuuren alla. |

Agentin määrää tiedosto, ei käynnissä oleva prosessi. Prosessit kuolevat; määritelmä on se, mikä tekee agentista
uudelleen rakennettavan toisella koneella.

---

## 2. Viisi asiaa, jotka jokainen agentti on velkaa jokaisessa ajossa

1. **Esitarkista hätäpysäytys** ennen ensimmäistä työkalukutsua ja uudelleen ennen jokaista kirjoitusta,
   lähetystä, ajoa tai menoa. Aja `stat` **tässä ajossa**. Älä koskaan lainaa muistettua tilaa. Jos signaalit ovat
   eri mieltä, pysäytys voittaa. Jos et voi ratkaista, pysäytys voittaa.

2. **Lue elävä katsaus**, jos sellainen on, ennen kaikkea muuta, ja kerro, mitä sinulla on siitä, mitä se
   tarvitsee. *”Ei mitään”* on aito vastaus — sano se ja ole valmiina sen sijaan, että keksisit panoksen.

3. **Kirjoita tuotos levylle** **yhtenä koko tiedoston kirjoituksena, ei koskaan sarjana lisäyksiä**
   ([`03-BUS.md`](03-BUS.md) §7). Löydös, joka on ilmoitettu vain keskustelussa, ei ole toimitettu.

4. **Kirjaudu ulos** ennen kuin lopetat. §4 alla.

5. **Merkitse jokainen väite** ([`02-EVIDENCE.md`](02-EVIDENCE.md)). `[PROVEN]` vaatii ensisijaisen lähteen,
   jonka olet todella lukenut tässä ajossa. Lähde, joka ei suostunut latautumaan, on epäonnistunut kutsu, ei
   näyttö.

---

## 3. Soveltamisala

Jokainen agentti työskentelee **vain oman nimiavaruutensa sisällä**. Se lukee laajasti ja kirjoittaa kapeasti.

- **Se ei koskaan itse värvää miehistöä.** Löydetystä uudesta työstä tulee ilmoitus taululle. Tarvittavasta
  uudesta agentista tulee *laadittu määritelmä ja pyyntö Käyttäjälle* — ei koskaan käynnissä oleva prosessi.
- **Se ei koskaan pura hätäpysäytystä**, ei myöskään itse asettamaansa.
- **Se ei koskaan muokkaa toisen agentin nimiavaruutta** eikä toisen juuren arvovaltaista asiayhteyttä. Se
  ilmoittaa poikkeamasta.
- **Eristetty agentti nimetään vain, kun Käyttäjä nimeää sen.** Se ei ole millään väylällä, missään muodostelmassa
  eikä millään jaetulla pinnalla. Se lukee silti hätäpysäytyksen.

---

## 4. Sisään- ja uloskirjautuminen

```
_os/exchange/bus/session/<AGENT>-<id>.on     created at sign-on, deleted by its owner at sign-off
```

**Sisäänkirjautuminen:** kirjoita merkki, lähetä `FLASH` henkilöllisyydelläsi yleislähetyslokiin, esitarkista
hätäpysäytys.

**Uloskirjautuminen:** kirjoita näyttötiedosto, lisää kirjanpitorivi, poista **oma** merkkisi ja lopeta
harkitusti.

Poista vain oma merkkisi. Agentti, joka siivoaa toisen merkin, on juuri ilmoittanut elävän istunnon
päättyneeksi.

### Miksi uloskirjautuminen on protokollavelvollisuus

Istuntoon sidottu vartija kuolee istuntonsa mukana, ja **vaiti oleva valvonta ja kuollut valvonta näyttävät
samalta.** Hiljaisuutta ei voi kumota. Korjaukset ovat rakenteellisia:

- **Sydämenlyönnit** — lyönnin puuttumisesta tulee näyttö.
- **Nimenomainen uloskirjautuminen** — jotta hylätty merkki on havaittava poikkeama eikä kohinaa.
- **Viritä uudelleen uudelleenkäynnistyksessä** — älä koskaan oleta valvonnan säilyneen.

---

## 5. Nimeäminen

Jokaisella agentilla on työnimi ja yhden rivin toimeksianto:

```
PURSER — finance, cash and pricing. Advisory. Writes to _cache/departments/purser/.
```

Erottuvat, lausuttavat nimet voittavat numerot litteroinnissa ja voittavat roolinimikkeet, kun kaksi roolia menee
päällekkäin. Jos kaksi nimeä törmää nimiavaruudessa, **erota ne joka käytössä** — kirjoita molemmat kokonaan
ensimmäisellä maininnalla jokaisessa asiakirjassa. Yhden merkin ero kahden todellisen asian välillä on puute,
joka odottaa, että siihen vedotaan.

---

## 6. Rakenteelliset viat, joita vastaan suunnitellaan

Nämä on havaittu, eivät ole oletettuja. Jokainen niistä on tapahtunut toimivassa laivueessa.

| Vika | Vastakuri |
|---|---|
| **Kilpailevat tiedostot.** Viisi versiota yhdestä Prioriteetti 0:n säännöstä; kaksi pääntoimeksiantoa; kaksi käsikirjaa vastakkaisin tiedoin. | Ratkaise ja karsi ([`05-CORRECTION.md`](05-CORRECTION.md) §7). Hae ennen kuin kirjoitat mitään oppia. Uudessa tiedostossa uudelleenmuotoiltu sääntö on ajautumista, ei panos. |
| **Kuolleet osoittimet.** Satoja tiedostoja, jotka viittaavat polkuun, jota ei ole. | Korjaa generaattori, joka levittää sitä, **ennen** läpikäyntiä, tai luku kasvaa takaisin. |
| **Lähteitä ja tuskin lainkaan nieluja.** Satoja näytettyjä tiedostoja ja avoimia taulukohtia yhtä ihmistä vastaan, joka ehtii lukea muutaman. Mikään ei poista mitään; jokainen kerros vain kasaa. | **Jokainen varasto saa nielun, päätettynä varastoa rakennettaessa.** Tämä on suurin rakenteellinen riski koko suunnitelman hyödyllisyydelle. |
| **Hiljaisuutta ei voi kumota.** | Sydämenlyönnit. §4. |
| **Kaikki istuntoon sidottua.** | Viritä kattavuus uudelleen uudelleenkäynnistyksessä; älä koskaan oleta säilymistä. |
| **Väitteitä ilman näyttöä.** | Luottamusmerkinnät, ja `DONE`-rivi on pätemätön ilman näyttöpolkua. |

---

## 7. Filosofia, sanottuna kerran

> **Kone ilmoittaa. Ihminen päättää. Peruuttamaton teko kuuluu aina ihmiselle.**

Kaikki muu tässä protokollassa on tuon lauseen toteutuksen yksityiskohta.
