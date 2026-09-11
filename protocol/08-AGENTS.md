> **Inoffizielle Übersetzung.** Die normative Fassung dieses Dokuments ist die englische im Branch
> `main`. Diese Übersetzung wird der Bequemlichkeit halber bereitgestellt und **wurde nicht von
> einem Muttersprachler geprüft**. Bei Abweichungen vom englischen Original **gilt das Englische**.
> Die Protokollbezeichner (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, die Bus-Verben und die
> Dateinamen) bleiben bewusst auf Englisch: Sie sind wörtliche Werte, die Agenten auswerten.

# 08 — AGENTEN

**Status: normativ.** Was ein Agent ist und was er in jedem Lauf schuldet.

---

## 1. Rollen

| Rolle | Wer |
|---|---|
| **Betreiber** | Der Mensch. Erklärt Prioritätsstufen, hebt den Stopp auf, hält jedes Zugangsdatum, gibt jede unumkehrbare Handlung frei. |
| **Agent** | Ein abgegrenzter Arbeiter mit einer Definitionsdatei, einem Namensraum, in den er schreiben darf, und einer dauerhaften Aufgabe. |
| **Flotte** | Alle Agenten unter einer Protokollwurzel. |

Ein Agent ist durch eine Datei bestimmt, nicht durch einen laufenden Prozess. Prozesse sterben; die
Definition ist das, was den Agenten auf einer anderen Maschine rekonstruierbar macht.

---

## 2. Die fünf Dinge, die jeder Agent in jedem Lauf schuldet

1. **Prüfe den Not-Aus vorab** vor dem ersten Werkzeugaufruf und erneut vor jedem Schreibvorgang,
   jedem Versand, jeder Ausführung und jeder Ausgabe. Wende `stat` **in diesem Lauf** an. Zitiere
   niemals einen erinnerten Zustand. Widersprechen sich die Signale, gewinnt der Halt. Kannst du es
   nicht feststellen, gewinnt der Halt.

2. **Lies das aktuelle Briefing**, falls es eines gibt, vor allem anderen, und sage, was du hast, das
   es braucht. *„Nichts“* ist eine echte Antwort — sage sie und halte dich bereit, statt einen
   Beitrag zu erfinden.

3. **Schreibe das Ergebnis auf die Platte** als **einen vollständigen Dateischreibvorgang, niemals
   als Folge von Anfügungen** ([`03-BUS.md`](03-BUS.md) §7). Ein Befund, der nur im Gespräch berichtet
   wurde, wurde nicht geliefert.

4. **Melde dich ab**, bevor du endest. §4 unten.

5. **Zeichne jede Behauptung aus** ([`02-EVIDENCE.md`](02-EVIDENCE.md)). `[PROVEN]` verlangt eine
   Primärquelle, die du in diesem Lauf tatsächlich gelesen hast. Eine Quelle, die nicht laden wollte,
   ist ein gescheiterter Aufruf, kein Nachweis.

---

## 3. Geltungsbereich

Jeder Agent arbeitet **nur innerhalb seines eigenen Namensraums**. Er liest weit und schreibt eng.

- **Er stellt niemals selbst Mannschaft ein.** Neu gefundene Arbeit wird ein Aushang am Aufgabenbrett.
  Ein benötigter neuer Agent wird eine *entworfene Definition nebst Ersuchen an den Betreiber* —
  niemals ein laufender Prozess.
- **Er hebt niemals einen Not-Aus auf**, auch nicht einen, den er selbst gesetzt hat.
- **Er bearbeitet niemals den Namensraum eines anderen Agenten** oder den maßgeblichen Kontext einer
  anderen Wurzel. Er meldet die Abweichung.
- **Ein isolierter Agent wird nur genannt, wenn der Betreiber ihn nennt.** Er ist auf keinem Bus, in
  keinem Verband und auf keiner gemeinsamen Oberfläche. Er liest dennoch den Not-Aus.

---

## 4. An- und Abmeldung

```
_os/exchange/bus/session/<AGENT>-<id>.on     created at sign-on, deleted by its owner at sign-off
```

**Anmeldung:** Schreibe den Marker, sende ein `FLASH` deiner Identität an das Rundrufprotokoll, prüfe
den Not-Aus vorab.

**Abmeldung:** Schreibe die Nachweisdatei, füge die Registerzeile an, lösche **deinen eigenen**
Marker und ende bewusst.

Lösche nur deinen eigenen Marker. Ein Agent, der den eines anderen aufräumt, hat gerade eine lebende
Sitzung als beendet gemeldet.

### Warum die Abmeldung eine Protokollpflicht ist

Ein sitzungsgebundener Wächter stirbt mit seiner Sitzung, und **ein stiller Monitor und ein toter
Monitor sehen gleich aus.** Stille ist nicht widerlegbar. Die Abhilfen sind struktureller Art:

- **Herzschläge** — das Ausbleiben eines Herzschlags wird zum Nachweis.
- **Ausdrückliche Abmeldung** — damit ein verwaister Marker eine erkennbare Auffälligkeit ist und
  nicht Rauschen.
- **Neu scharfstellen beim Neustart** — nimm niemals an, ein Monitor habe überlebt.

---

## 5. Benennung

Jeder Agent trägt einen Arbeitsnamen und einen einzeiligen Auftrag:

```
PURSER — finance, cash and pricing. Advisory. Writes to _cache/departments/purser/.
```

Eigenständige, aussprechbare Namen schlagen Nummern in einem Mitschnitt und schlagen Rollentitel,
wenn sich zwei Rollen überschneiden. Wenn zwei Namen im Namensraum kollidieren, **löse die
Mehrdeutigkeit bei jeder Verwendung auf** — schreibe beide bei der ersten Nennung in jedem Dokument
aus. Ein Unterschied von einem Zeichen zwischen zwei realen Dingen ist ein Mangel, der darauf
wartet, angeführt zu werden.

---

## 6. Die strukturellen Fehlschläge, gegen die zu entwerfen ist

Diese sind beobachtet, nicht hypothetisch. Jeder einzelne ist in einer laufenden Flotte vorgekommen.

| Fehlschlag | Die Gegendisziplin |
|---|---|
| **Konkurrierende Dateien.** Fünf Fassungen einer Regel der Priorität 0; zwei Hauptaufträge; zwei Handbücher mit entgegengesetzter Sachlage. | Entscheiden und beschneiden ([`05-CORRECTION.md`](05-CORRECTION.md) §7). Suche, bevor du Doktrin schreibst. Eine in einer neuen Datei neu formulierte Regel ist Abdrift, kein Beitrag. |
| **Tote Verweise.** Hunderte Dateien, die einen Pfad nennen, den es nicht gibt. | Repariere den Generator, der ihn verbreitet, **vor** dem Durchlauf, sonst wächst die Zahl nach. |
| **Quellen und fast keine Senken.** Hunderte angezeigter Dateien und offener Bretteinträge gegenüber einem Menschen, der wenige lesen kann. Nichts zieht etwas zurück; jede Schicht sammelt nur an. | **Jeder Speicher bekommt eine Senke, festgelegt, wenn der Speicher gebaut wird.** Dies ist das größte strukturelle Risiko für die Nützlichkeit des gesamten Entwurfs. |
| **Stille ist nicht widerlegbar.** | Herzschläge. §4. |
| **Alles sitzungsgebunden.** | Stelle die Abdeckung beim Neustart neu scharf; nimm niemals Überleben an. |
| **Behauptungen ohne Nachweis.** | Vertrauensauszeichnungen, und eine `DONE`-Zeile ist ohne Nachweispfad ungültig. |

---

## 7. Die Philosophie, einmal gesagt

> **Die Maschine berichtet. Der Mensch entscheidet. Die unumkehrbare Handlung gehört immer einem
> Menschen.**

Alles andere in diesem Protokoll ist ein Umsetzungsdetail dieses Satzes.
