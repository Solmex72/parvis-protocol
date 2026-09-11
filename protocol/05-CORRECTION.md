> **Inoffizielle Übersetzung.** Die normative Fassung dieses Dokuments ist die englische im Branch
> `main`. Diese Übersetzung wird der Bequemlichkeit halber bereitgestellt und **wurde nicht von
> einem Muttersprachler geprüft**. Bei Abweichungen vom englischen Original **gilt das Englische**.
> Die Protokollbezeichner (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, die Bus-Verben und die
> Dateinamen) bleiben bewusst auf Englisch: Sie sind wörtliche Werte, die Agenten auswerten.

# 05 — KORREKTUR

**Status: normativ.** Was geschieht, wenn sich eine festgehaltene Tatsache als falsch erweist.

---

## 1. Das Problem

> Eine Tatsache, die in sechs Dateien behauptet wird, ist in fünf davon falsch.

Die Datei zu korrigieren, die man gerade vor sich hat, ist keine Korrektur. Sie erzeugt einen Baum,
in dem die Wahrheit und der Fehler beide Belege haben und die nächste Sitzung diejenige nimmt, die
sie zuerst öffnet. Dies ist der kennzeichnende Fehlermodus einer dokumentationslastigen
Agentenflotte, und er verschärft sich lautlos.

**Eine Korrektur breitet sich aus, oder sie hat nicht stattgefunden.**

---

## 2. Lesen ist nicht umsonst — es verpflichtet

Eine leitende Datei zu lesen, stellt dich unter sie. Zweierlei folgt daraus:

1. Alles darin, was **dauerhaft, nicht offensichtlich und nicht aus dem Baum ableitbar** ist, geht
   vor Sitzungsende in dein dauerhaftes Gedächtnis.
2. **Wenn dein Kontext der Datei widerspricht, gewinnt die Datei.** Umgehe sie nicht. Korrigiere die
   Aufzeichnung.

---

## 3. Sofortige Kurskorrektur (ICC)

Ein Befehl, ein Zug, ohne Vorschlagsschritt.

```
/icc the planner meal times are placeholders, not the Operator's actual times
```

### Der Ablauf

**1 · Durchsuchen.** Leite aus der Korrektur 2 bis 5 Suchbegriffe ab: die **alte** Formulierung, ihre
naheliegenden Varianten und die beteiligten Eigennamen. Nicht die neue Formulierung. Führe je Begriff
einen indizierten Durchlauf aus, bevor du irgendetwas liest. Durchlaufe niemals den Baum Datei für
Datei, um Treffer zu finden — dafür ist der Index da.

**2 · Klassifiziere jeden Treffer.**

| Treffer | Handlung |
|---|---|
| **Behauptet die alte Tatsache** | Schreibe ihn um. |
| **Erwähnt sie nebenbei**, in beiden Fällen zutreffend | Lass ihn. Rühre den Text nicht auf. |
| **Widerspricht der neuen Tatsache mittelbar** — eine nachgelagerte Schlussfolgerung, eine Tabellenzeile, ein geplanter Auftrag, der auf dem alten Wert beruht | **Schreibe ihn ebenfalls um.** Dieser wird am häufigsten übersehen. |
| **Außerhalb der Grenzen** (§5) | Niemals bearbeiten. Vermerke ihn unter *Left alone*. |

**3 · Schreibe alles auf einmal um.** Passe dich der vorhandenen Stimme jeder Datei und ihrer
Konvention für Vertrauensauszeichnungen an. Eine korrigierte Tatsache behält die Auszeichnung, die
sie verdient — **stufe eine Behauptung nicht auf `[PROVEN]` hoch, weil sie nun aktuell ist.** Trug
der alte Text ein Datum, setze das heutige.

Wo eine Tatsache in mehr als drei Dateien behauptet wird, ist das **Verdopplung, keine Redundanz**:
Nenne sie einmal in der Datei, der sie gehört, und lass die übrigen dorthin zeigen.

**4 · Register und Gedächtnis.** Beides, sonst ist der Lauf nicht beendet. Stelle einen Eintrag an den
Anfang des Korrekturregisters:

```
## 2026-01-14 — meal times are placeholders

Was      planner asserts 07:30 / 12:00 / 18:30 as the Operator's actual times
Now      those are defaults shipped with the template; real times are unknown
Why      Operator correction, 2026-01-14
Files    personal/planner/NOW.md:14, personal/planner/README.md:31, _os/tasks/INDEX.md:88
Memory   planner-meal-times.md (updated)
Left     backups/ (history), CONTEXT-BUNDLE.md (generated)
```

Schreibe die Tatsache anschließend ins dauerhafte Gedächtnis — **prüfe dabei zuerst, ob es zu dem
Thema bereits einen Gedächtniseintrag gibt, und aktualisiere diesen**, statt zwei Fassungen einer
Tatsache zu hinterlassen, die du gerade mit einem Befehl vereinheitlicht hast.

**5 · Pflichten nach der Bearbeitung.** Führe den Generator oder die Sicherung erneut aus, zu der die
Änderungen verpflichten. Baue den Index neu auf, wenn Dateien angelegt oder gelöscht wurden.

---

## 4. Eine dauerhafte Entscheidung wird offen umgestoßen

Wenn eine Korrektur eine dauerhafte Entscheidung entwertet — eine Zeile „nicht erneut aufrollen“,
einen `[PROVEN]`-Eintrag, eine Richtlinie — **kippe sie nicht stillschweigend.** Schreibe sie als
*umgestoßen* um, mit Datum und Grund, damit die nächste Sitzung weiß, dass sie aufgehoben und nicht
vergessen wurde.

Eine Entscheidung, die sich spurlos ändert, ist von einer Entscheidung, die nie getroffen wurde,
nicht zu unterscheiden.

---

## 5. Was niemals umgeschrieben wird

| Niemals angefasst | Warum |
|---|---|
| `backups/`, `archive/` | Geschichte. Geschichte wird nicht korrigiert; sie wird überholt. |
| Erzeugte Dateien | Bearbeite die Quelle und führe den Generator erneut aus. |
| Der Baum eines isolierten Agenten | Zugriff nur über Namensnennung. |
| Der maßgebliche Hauptkontext einer anderen Wurzel | Melde die Abweichung. Bearbeite nichts über eine Eigentumsgrenze hinweg. |
| Alles, was ein Geheimnis enthält | Völlig außerhalb der Reichweite eines Textdurchlaufs. |

**Ein Durchlauf, der Text umschreibt, wird Binärdateien zerstören.** Begrenze jeden Durchlauf über
eine Positivliste auf Textendungen, niemals über Ausschluss.

---

## 6. Was ICC nicht tut

`/icc` korrigiert die Aufzeichnung. **Es geht danach nicht hin und erledigt die Arbeit, die die
Korrektur nahelegt.** Das sind getrennte Handlungen mit getrennten Ermächtigungen, und sie zu
vermengen ist der Weg, auf dem aus einer einzeiligen Korrektur ein ungeprüfter Umbau wird.

---

## 7. Konkurrierende Tatsachen werden entschieden und beschnitten — nicht katalogisiert

Wenn zwei Dateien einander widersprechende Tatsachen behaupten, **entscheide, welche richtig ist,
behalte sie und entferne die falschen Behauptungen im selben Durchgang.**

Ein Konfliktbericht, der beide Konkurrenten auf der Platte lässt, hat nichts gelöst. Die nächste
Sitzung nimmt weiterhin die Datei, die sie zuerst öffnet, und eine Sicherheitsregel mit fünf
umlaufenden Fassungen ist *weniger* verlässlich als eine mit einer einzigen, nicht mehr.

**Entscheide nach der Sache, niemals nach dem Zeitstempel.** Gewinner ist die Datei, der die Tatsache
gehört, die durch eine Messung gestützte Fassung, diejenige, die der Prüfung standhält. **Das Neueste
ist nicht das Wahrste** — der klassische Fehlschlag hier sind vier doppelte Gedächtnisdateien,
geschrieben innerhalb von neunzig Sekunden, bei denen die neueste die falsche Behauptung enthielt,
sodass eine Regel „das Neueste gewinnt“ den Fehler geerbt hätte.

**Halte die Entscheidung fest.** Welche Tatsache gewonnen hat, was beschnitten wurde und warum — im
Register, damit das Beschneiden nachvollziehbar statt lautlos ist. Ein Konkurrent, der spurlos
verschwindet, sieht genauso aus wie einer, den es nie gab, und die nächste Sitzung legt ihn erneut an.

### Was dennoch eskaliert statt entschieden wird

Drei Fälle. Melde sie; entscheide sie nicht:

- Der Widerspruch hängt von Informationen ab, die der Agent nicht hat.
- Ein Irrtum wäre **unsicher oder unumkehrbar** — alles auf den Sprossen 0–2.
- Die unterlegene Behauptung liegt **außerhalb der Eigentumsgrenze des Agenten** — der maßgebliche
  Hauptkontext einer anderen Wurzel. Melde die Abweichung; bearbeite nichts über die Grenze hinweg.

Alles Gewöhnliche wird entschieden und aufgeräumt.
