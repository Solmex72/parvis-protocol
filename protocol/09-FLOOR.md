> **Inoffizielle Übersetzung.** Die normative Fassung dieses Dokuments ist die englische im Branch
> `main`. Diese Übersetzung wird der Bequemlichkeit halber bereitgestellt und **wurde nicht von
> einem Muttersprachler geprüft**. Bei Abweichungen vom englischen Original **gilt das Englische**.
> Die Protokollbezeichner (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, die Bus-Verben und die
> Dateinamen) bleiben bewusst auf Englisch: Sie sind wörtliche Werte, die Agenten auswerten.

# 09 — DIE HALLE

**Status: normativ für den Visualisierer; informativ als Modell.**
Umgesetzt durch [`reference/sidecar/hmi.html`](../reference/sidecar/hmi.html).

---

## 1. Die Behauptung

Eine Agentenflotte ist schwer zu sehen. Ein Dateibaum ist eine Liste, eine Prozesstabelle ist eine
Liste, und ein Protokoll ist eine Liste — sodass das einzige Bild, das irgendjemand von einer
laufenden Flotte hat, mehrere Listen sind, die nicht zueinander passen.

**Ein automatisiertes Lager ist dieselbe Maschine, und es ist seit vierzig Jahren lesbar.** Krane
bewegen Lasten unter einem Leitsystem zwischen Regalen, und die aufsichtführende Person liest eine
Halle mit Hunderten gleichzeitiger Bewegungen auf einen Blick, an der Farbe, ohne eine einzige Zeile
Text zu lesen.

Parvis borgt sich das. Nicht als Zierde — als *Abbildung*, in der jedes Lagerobjekt genau einer Sache
im Baum entspricht und in der sich die Sicherheitsregeln des Lagers selbst als die
Sicherheitsregeln des Protokolls erweisen, bereits an der richtigen Stelle gezeichnet.

---

## 2. Die Abbildung

| In der Halle | In der Flotte | Gelesen aus |
|---|---|---|
| **Kran** | ein Agent oder eine lebende Sitzung | die Sitzungsmarker in `_os/exchange/bus/session/` |
| **Palette** | ein Verzeichnis | der Baum selbst; das Etikett der Palette ist ihr Pfad |
| **Regalplatz** | wo dieses Verzeichnis liegt | sein übergeordnetes Verzeichnis |
| **Eine Palette öffnen** | in das Verzeichnis hinabsteigen | **ein weiteres ganzes Lager** — §4 |
| **Induct** (Wareneingangstor) | eintreffende Arbeit | eine `REQ`-Zeile in `_os/tasks/INDEX.md` |
| **Spur** (Warenausgangstor) | ein abgehendes Ergebnis | eine Datei in `_os/events/surface/`, ein Export |
| **Förderband** | der Dateibus | `_os/exchange/bus/` — wie Arbeit sich bewegt, ohne dass ein Kran sie trägt |
| **Lastwagen** | ein externer Dienst oder eine andere KI | die Grenze. §5 |

Der Punkt ist nicht das Bild. Der Punkt ist, dass **du diesen Bildschirm bereits lesen kannst**, wenn
du je vor einem Lagerleitsystem gestanden hast — und wenn nicht, ist das Modell dennoch auf eine
Weise greifbar, wie es ein Verzeichnislisting nicht ist.

---

## 3. Die Farben

Ein Blick, vor jeder Navigation:

| Farbe | In der Halle | In der Flotte |
|---|---|---|
| **GRÜN** | in Bewegung — ein Kran trägt eine Last | ein Agent arbeitet; eine lebende Sitzung mitten in der Aufgabe |
| **BLAU** | eingeplant — in der Warteschlange, noch nicht begonnen | ein Aushang am Aufgabenbrett: beauftragt, wartet auf einen Agenten |
| **BERNSTEIN** | Achtung — ein Platz verlangt eine Entscheidung | `YELLOW`: vor jeder Handlung fragen |
| **ROT** | Not-Aus — diese Zone ist angehalten | `STOP`: der Not-Aus ist scharf und diese Wurzel ist eingefroren |
| **GRAU** | leer oder keine lebende Quelle | keine Daten. Niemals eine Vermutung. |

Dies ist kein neues Schema. Es ist der Zustand, den der Baum bereits enthält, dargestellt.

**Rot gewinnt immer den Blick.** Eine einzige rote Zone hält das Auge vor jedem Grün an, genau so,
wie der Stopp jedes andere Signal überwiegt ([`01`](01-ESTOP.md)). **Eine Halle, die Grün über einer
roten Zone zeigt, lügt** — und das ist der bestimmte Fehlschlag, den diese Regel verbieten soll.

**Grau ist Pflicht, wo es keine lebende Quelle gibt.** Ein Platz ohne Daten wird grau dargestellt und
zeigt `—`. Er wird niemals grün dargestellt, weil Grün die angenehme Voreinstellung ist
([`07`](07-INTERFACE.md) §2.2).

---

## 4. Das verschachtelte Lager

**Öffne eine Palette, und du siehst keine Kiste. Du siehst ein weiteres ganzes Lager** — mit eigenen
Kranen, eigenen Paletten, eigenen Toren.

Das ist genau der Dateibaum. Ein Vorhaben ist ein Lager; seine Abteilungen sind Gassen; ihre Dateien
sind Paletten; und eine Palette, die selbst ein Verzeichnis ist, ist eine weitere Halle. Der
Visualisierer ist daher **eine einzige Ansicht, die hinabsteigt**, mit denselben Bedienelementen in
jeder Tiefe, weil jede Ebene ein Lager *ist*. Auf dem Weg nach unten gibt es nichts Neues zu lernen.

Die Rekursion ist der ganze Grund, warum die Metapher trägt, statt bloße Verkleidung zu sein. Ein
Dashboard, das nur die oberste Ebene darstellt, ist ein Foto einer Flotte; eines, das hinabsteigt,
ist eine Ansicht davon.

---

## 5. Lastwagen docken an der Grenze an — sie fahren niemals in die Halle

Hier hört das Modell auf, eine Visualisierung zu sein, und beginnt, etwas durchzusetzen.

Ein externer Dienst — eine andere KI, eine API, ein Anbieter — ist ein **Lastwagen**. Und in einem
echten Lager setzt ein Lastwagen an ein Tor zurück. Er fährt nicht in die Halle, bewegt keinen Kran,
betritt kein Regal und öffnet kein verschachteltes Lager. Er stellt eine Last an einem Induct ab oder
holt eine von einem Spur, und das ist der gesamte Umfang seines Zugriffs.

**Dieses Tor ist die Schleuse.** Jeder externe Austausch findet am Rand statt, gefiltert, und nichts
Externes kommt im Baum frei.

**Die Papiere eines Lastwagens sind ungeprüft und damit unglaubwürdig.** Eine auf einem Lastwagen
eintreffende Last ist eingehende *Daten*, kein Auftrag an die Halle. Sie wird eingeschleust und
geprüft wie alles andere, niemals bei Ankunft befolgt. Das ist die Grenze der Anweisungsquelle aus
[`03`](03-BUS.md) §5, gezeichnet als Laderampe — und gezeichnet an der einen Stelle, an der jemand,
der auf den Bildschirm schaut, sehen kann, dass sie eingehalten wird.

Wenn deine Darstellung einen Lastwagen in die Halle stellt, ist die Darstellung falsch und die
Architektur, die sie zeichnet, ebenso.

---

## 6. Zwei Oberflächen, zwei Aufgaben

| | **Die Halle** (diese Datei) | **Die Konsole** ([`07`](07-INTERFACE.md)) |
|---|---|---|
| Was sie ist | eine 3D-Halle, live betrachtet | ein Kachelmenü, nach Zugriff gestuft |
| Was sie zeigt | **wie das System ist** — jeder Agent, jedes Verzeichnis, jeder Zustand auf einmal | **was du tun kannst** — Werkzeug wählen, Arbeit erledigen |
| Das Verb | schauen, verstehen, entscheiden | ausführen, nutzen, erzeugen |

**Die Halle zeigt, wie die Maschine denkt; die Konsole dient dem Handeln nach dem, was du daraus
schließt.** Das eine ist eine Karte, das andere eine Werkbank. Eine Steuerungsoberfläche braucht
beides, und der Fehler ist, nur die hübsche zu bauen.

---

## 7. Bedienelemente

Die Navigation war es, die das Original benutzbar machte, nicht die Farbe allein:

| Bedienung | Bewirkt |
|---|---|
| **Ziehen** | die Halle umkreisen — drehen, neigen, eine Gasse entlangblicken |
| **Draufsicht** | in einen Grundriss von oben wechseln. Umkreisen für Tiefe, Grundriss für Anordnung |
| **Klick auf eine Palette** | in sie hinabsteigen — ein weiteres Lager, dieselben Bedienelemente |
| **Scrollen** | zoomen |

Dieselben Bedienelemente in jeder Tiefe. Nicht verhandelbar: Eine Ansicht, deren Bedienung sich beim
Hinabsteigen ändert, hat das Versprechen gebrochen, dass jede Ebene ein Lager ist.

### Die Kamera ist orthografisch, mit Absicht

Es gibt **keine perspektivische Verjüngung**. Parallele Linien laufen niemals zusammen, und ein Platz
am fernen Ende einer Gasse wird genau so groß dargestellt wie einer vor deinen Füßen.

Das wirkt einen Moment lang falsch — das Auge erwartet Konvergenz und liest deren Fehlen, als stünde
es in den Kisten und schaute hinaus. Es ist trotzdem der richtige Tausch, und es ist das, was
Leitbildschirme für echte automatisierte Hallen verwenden: **der ganze Sinn ist, Plätze über die
Halle hinweg auf einen Blick zu vergleichen**, und eine perspektivische Kamera macht das ferne Ende
einer Gasse kleiner, matter und schwerer zu beurteilen als das nahe. Unter Perspektive sehen „dieses
Regal ist voller“ und „dieses Regal ist näher“ gleich aus. Unter einer orthografischen Kamera nicht.

Verdeckung ist weiterhin real — abgewandte Flächen werden verworfen, und nähere Geometrie übermalt
fernere. Es ist eine flache Kamera, keine flache Szene.

Geräte sind außerdem über ein **Seitenmenü** erreichbar, nach Art gruppiert — Krane, Paletten, die
beiden Tore, das Förderband, die Lastwagen. Eine Auswahl aus dem Menü oder aus der Halle öffnet
dieselben Bedienelemente, denn eine Halle, durch die man nur navigieren kann, indem man kleine
Kisten in einer 3D-Szene anklickt, ist eine Vorführung und kein Instrument.

---

## 8. Was die Halle darf und was nicht

Jede Beschränkung aus [`07`](07-INTERFACE.md) §5 gilt. Die Linie wird an einer bestimmten Stelle
gezogen:

**Die Halle darf einschleusen. Sie darf niemals ausführen.**

Das ist dieselbe Linie, die [`07`](07-INTERFACE.md) §1 bereits für die Konsole zieht, und sie ist es,
die Geräten überhaupt Bedienelemente erlaubt. Einen Kran auszuwählen und ihm Arbeit zuzuweisen,
schreibt eine `REQ`-Zeile, die diesen Agenten nennt, und legt ein `TELL` in seinen Posteingang. **Es
startet nichts.** Kein Prozess wird gestartet, kein Befehl läuft, und der Agent nimmt die Arbeit in
seinem eigenen nächsten Lauf auf — oder auch nicht.

Zwei Folgen, die man leicht falsch macht:

- **Zugewiesene Arbeit ist immer noch kein Auftrag.** Die `REQ`-Zeile ist die maßgebliche
  Aufzeichnung; die Posteingangszeile verweist nur darauf. Eine Datei, die einem Agenten *befähle* —
  oder die aus dem Baum heraus die Befugnis des Betreibers beanspruchte — wäre der
  Sicherheitsvorfall, den [`03`](03-BUS.md) §5 bestimmt, und das in die Oberfläche einzubauen wäre
  schlimmer, als es von Hand zu tun. Die Befugnis ist der Betreiber im Gespräch. Die Halle schreibt
  die Aufzeichnung, nicht die Anweisung.
- **Manche Geräte bekommen bewusst keine Bedienelemente.** Das Förderband ist schreibgeschützt: Eine
  Konsole, die Zeilen auf den Bus schreiben könnte, würde eine Befugnis herstellen, die das Protokoll
  ihr verweigert. Lastwagen haben überhaupt keine Bedienelemente — §5.

**Unter `STOP` wird die Halle rot dargestellt und schleust nichts ein.** Eine rote Halle nimmt keine
Aufträge an.

Die ehrliche Grenze, einmal gesagt: **Dies ist ein Foto des Baums zu einem Zeitpunkt, kein lebender
Telemetriestrom.** Es fragt in Abständen ab. Zwischen den Abfragen ist es veraltet, es zeigt, wann es
zuletzt gelesen hat, und es wird grau, statt etwas anderes vorzugeben, wenn das Sidecar nicht mehr
antwortet.
