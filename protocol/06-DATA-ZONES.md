> **Onofficiële vertaling.** De normatieve versie van dit document is de Engelse, in de branch `main`.
> Deze vertaling wordt voor het gemak aangeboden en **is niet door een moedertaalspreker
> gecontroleerd**. Bij afwijking van het Engelse origineel **geldt het Engels**. De
> protocolaanduidingen (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, de busverba en de
> bestandsnamen) blijven bewust in het Engels: het zijn letterlijke waarden die agents uitlezen.

# 06 — GEGEVENSZONES

**Status: normatief.** Waar een bestand mag wonen.

---

## 1. Waarom een verbod niet werkte

De oorspronkelijke regel luidde *"geen geheimen, nooit, nergens"* — **zonder enige plek om privégegevens in
plaats daarvan neer te zetten.**

Een verbod zonder bestemming wordt niet nageleefd. Het wordt omzeild, en privémateriaal belandt per
ongeluk in de gesynchroniseerde boom. Dat is herhaaldelijk gebeurd, ook door een agent die zelf onder de
regel viel.

**De regel is een routeringsbeslissing, geen verbod.**

---

## 2. De twee zones

| Zone | Eigenschap | Bevat |
|---|---|---|
| **PUBLIC** | Synchroniseert naar cloudopslag. **Behandel elke byte als gepubliceerd.** | Doctrine, opdrachten, agentdefinities, architectuur, bedrijfscontext, onderzoek, technische documentatie |
| **PRIVATE** | **Buiten elke synchronisatiewortel** — en buiten het gebruikersprofiel, zodat ook omleiding van bekende mappen er niet bij kan | Geheimen, echte personen en hun persoonsgegevens, privéprojecten en -media, alles wat het verkeerd zou zijn in een back-up aan te treffen |

### De toets

> *Zou het een probleem zijn als dit over een jaar in een cloudmomentopname stond?*

Ja → PRIVATE. Nee → PUBLIC. Bij echte twijfel → **PRIVATE.** De prijs van te hoog indelen is ongemak. De
prijs van te laag indelen is onomkeerbaar.

### Weet wat er werkelijk synchroniseert

Controleer dit op de echte machine, niet op aanname. Op een gangbare werkplek kunnen meerdere
synchronisatieprogramma's tegelijk draaien, en alles onder de mappen documenten, bureaublad of afbeeldingen
van de gebruiker verlaat de machine en wordt wekenlang in de versiegeschiedenis bewaard. **Lokaal
verwijderen haalt het niet terug.**

Twee gevolgen die elk echte storingen veroorzaken:

1. **Bouwuitvoer moet worden omgeleid** naar buiten een synchronisatiewortel, anders beschadigt de spiegel
   haar midden in de bouw.
2. **Sleutels wonen buiten**, bewust en standaard.

---

## 3. De uitzondering: inloggegevens horen bij geen van beide zones

**Actieve inloggegevens — wachtwoorden, API-sleutels, tokens, streamsleutels — horen in een
wachtwoordbeheerder, niet in een van beide bestandssystemen.**

De privézone bevat *privégegevens*. Een wachtwoordbeheerder bevat *inloggegevens*. Dit is geen muggenzifterij:
een privémap is standaard niet versleuteld, en een bestand is een bestand. Zodra er een wordt gekopieerd, in
een transcript geciteerd of ergens aan gehecht, is het bekendgemaakt.

**Formuleer de beveiligingseigenschap van de privézone eng en overschat haar nooit.** Haar enige bewezen
eigenschap is meestal dat *niets haar ergens heen kopieert*. Zonder geverifieerde volledige-schijf- of
per-bestandsversleuteling is zij niet versleuteld, niet geback-upt en geen kluis.

---

## 4. De indeling is van de Operator, en zij is aanpasbaar

Houd de levende tabel in één bestand — `DATA-CLASSIFICATION.md` — waar de Operator categorieën tussen zones
verplaatst en dat elke agent leest in plaats van te gokken.

Dit protocolbestand benoemt het **mechanisme**. Dat bestand benoemt het **beleid**. Waar de twee van elkaar
afwijken, wint het beleidsbestand.

---

## 5. Gevolgen voor agents

- **Geen geheim in enige boom die wordt ingepakt.** Een contextpakket bestaat om in een nieuwe sessie te
  worden geplakt. Benoem wat er wordt bewaard en waar; nooit de waarde.
- **Geen geheim bereikt `surface/`.** Die wordt op het scherm getoond.
- **Geen geheim bereikt een browser.** Zie [`07-INTERFACE.md`](07-INTERFACE.md) §3.
- **Onderdruk door verwijzing, niet door verwijdering.** `<api key — see password manager entry
  "acme-prod">` houdt het feit vindbaar zonder de waarde prijs te geven.

---

## 6. Snoeien zonder verlies

Voordat er iets de werkboom verlaat:

1. Kopieer het naar een verzegelde opslag **buiten de wortels** — een archiefbestand, niet met glob
   bereikbaar.
2. Zet de paden klaar in `marked-deletion.md` / `marked-archive.md`.
3. **De uitvoering is de hand van de Operator**, met de boom tot rust gebracht.

Verwijder nooit massaal onder actieve gelijktijdigheid.
