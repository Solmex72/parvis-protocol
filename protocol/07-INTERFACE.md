> **Inoffizielle Übersetzung.** Die normative Fassung dieses Dokuments ist die englische im Branch
> `main`. Diese Übersetzung wird der Bequemlichkeit halber bereitgestellt und **wurde nicht von
> einem Muttersprachler geprüft**. Bei Abweichungen vom englischen Original **gilt das Englische**.
> Die Protokollbezeichner (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, die Bus-Verben und die
> Dateinamen) bleiben bewusst auf Englisch: Sie sind wörtliche Werte, die Agenten auswerten.

# 07 — DIE SCHNITTSTELLENSCHICHT

**Status: normativ.** Dies ist die Datei, nach der das Projekt benannt ist.

Jede Oberfläche, die ein Mensch berührt, ist **Parvis**. Die schreibgeschützte Hallenansicht ist das
*Parvis HMI*; das Kachelmenü, von dem aus du die Flotte steuerst, ist die *Parvis Console*.

---

## 1. Die Regel, die das HTML funktionieren lässt

> Eine Browserseite ist eine **Anzeige und eine Tastatur**, kein Programm mit Plattenzugriff.

Diese eine Tatsache regiert die gesamte Schicht:

- **Die Seite zeigt und sammelt.** Sie stellt Zustand dar und nimmt Eingaben entgegen. Von einem
  Dateipfad aus geöffnet, kann sie für sich allein **den Baum nicht lesen und keinen Auftrag
  schreiben.** Die Browser-Sandbox verbietet beides, und das ist ein Vorzug.
- **Das Sidecar schlägt die Brücke.** Ein kleiner Dienst auf der Rückschleife — gebunden an
  `127.0.0.1`, sonst nichts — ist das Einzige, was den Baum für die Seite liest und schreibt, was die
  Seite absendet. Die Seite holt den Zustand per `GET`; die Seite sendet einen Prompt per `POST`; das
  Sidecar erledigt die Plattenarbeit. **Kein Sidecar, kein lebendes Parvis — nur eine
  Momentaufnahme.**
- **Nichts umgeht die Prüfung.** Ein aus Parvis abgesandter Prompt ist eine **Einschleusung, keine
  Ausführung**. Das Sidecar schreibt eine `REQ`-Zeile in das Aufgabenverzeichnis und hält an. Es
  startet niemals einen Agenten, führt niemals einen Befehl aus, sendet niemals. Neue Arbeit
  freizugeben bleibt der Tastendruck des Betreibers.

Darum „funktioniert“ die Seite: Die Seite ist ehrlich darüber, ein Fenster zu sein, das Sidecar
erledigt die kleine echte Arbeit am Rand, und **die Prüfung steht weiterhin zwischen einem Prompt
und einer sich bewegenden Maschine.**

---

## 2. Harte Anforderungen — jede Parvis-Oberfläche

1. **In sich geschlossen.** Eine HTML-Datei: CSS und JS inline, keine externen Skripte, kein CDN.
   Webschriften nur mit echter Rückfallkette. Sie muss offline von einem Dateipfad aus darstellbar
   sein.

2. **Die Farben sind der Zustand, live gelesen, niemals vorgetäuscht.** Grün = läuft, Bernstein =
   erst fragen, Rot = angehalten — abgeleitet aus der STATE-Datei und dem lebenden Register. **Ein
   Wert ohne lebende Quelle zeigt `—`, niemals eine plausibel aussehende Zahl.** Rot überwiegt jede
   andere Farbe und die gesamte Oberfläche.

3. **Das Sidecar läuft nur auf der Rückschleife und hält kein Geheimnis, das die Seite sehen kann.**
   Kein API-Schlüssel, kein Zugangsdatum, kein werthaltiges Token erreicht den Browser. Das Sidecar
   authentifiziert die Seite mit einem lokalen Sitzungstoken und erledigt die privilegierte Arbeit
   selbst. **Die Seite hält niemals etwas, das zu stehlen sich lohnt.**

4. **Eine Momentaufnahme wird als Momentaufnahme gekennzeichnet,** mit ihrer Lesezeit. Nur eine
   Seite, die mit einem lebenden Sidecar spricht, darf sich als live ausgeben. Eine veraltete Seite,
   die live aussieht, ist schlimmer als gar keine Seite.

5. **Der Not-Aus überwiegt die Schnittstelle.** Unter `STOP` schleust Parvis nichts ein und das
   Sidecar schreibt nichts außer der Abmeldezeile. **Eine rote Halle nimmt keine Aufträge an.**

6. **Parvis-Marke und keine Firmennamen Dritter.** Von welchen realen Systemen das Muster auch
   gelernt wurde, das Muster ist deines und es heißt Parvis. Eine Oberfläche, die den Handelsnamen
   eines anderen mitliefert, ist falsch und wird korrigiert.

---

## 3. Sicherheitsanforderungen an das Sidecar

Ein HTTP-Dienst auf der Rückschleife eines Entwicklerarbeitsplatzes ist eine echte Angriffsfläche.
Diese Punkte sind nicht optional.

| Anforderung | Warum |
|---|---|
| **Binde `127.0.0.1` ausdrücklich**, niemals `0.0.0.0` | Alle Schnittstellen zu binden veröffentlicht deine Flottenkonsole im lokalen Netz. |
| **Prüfe den `Host`-Header** gegen eine Positivliste aus `127.0.0.1:<port>` / `localhost:<port>` | Vereitelt DNS-Rebinding, über das eine besuchte Webseite einen Rückschleifendienst erreicht. |
| **Weise Anfragen mit einem `Origin` zurück, den du nicht ausgestellt hast** | Dieselbe Angriffsklasse, anderer Vektor. |
| **Verlange ein Sitzungstoken** auf jeder verändernden Route, beim Seitenaufbau ausgestellt, niemals protokolliert | Die Seite weist nach, dass sie deine Seite ist. |
| **Setze jeden Pfad**, den der Dienst liest oder schreibt, **auf eine Positivliste**, löse ihn dann erneut auf und bestätige die Eingrenzung | Vereitelt Pfaddurchquerung. Eine Positivliste allein genügt nicht, wenn symbolische Verknüpfungen existieren. |
| **Falle bei unlesbarem estop sicher aus** — verweigere, falle nicht auf `RUN` zurück | Siehe [`01-ESTOP.md`](01-ESTOP.md) §2. |
| **Kein `eval`, kein Shell-Aufruf, keine Vorlageninterpolation von Benutzereingaben** | Die Prompt-Leiste ist eine Einschleusungseingabe, keine Kommandozeile. |

Die Referenzimplementierung in [`reference/sidecar/`](../reference/sidecar/) setzt all dies um und ist
an der Stelle jedes einzelnen Punktes kommentiert.

---

## 4. Was die Oberflächen sind

| Oberfläche | Was | Stand |
|---|---|---|
| **Parvis Console** | Tafeln mit Reitern — Zustand, Dokumente, Register, Bus, Oberfläche, Einstellungen | Ausgeliefert. |
| **Parvis Floor** | Der Lager-Reiter: 3D-Halle, Umkreisen und Eintauchen, Gerätesteuerung | Ausgeliefert. Siehe [`09-FLOOR.md`](09-FLOOR.md). |
| **Prompt-Leiste** | Die Einschleusungseingabe, auf der Konsole und an jedem Hallengerät | Ausgeliefert. |
| **Das Sidecar** | Rückschleifenbrücke: liest den Baum, schreibt `REQ`-Zeilen, hält kein Geheimnis | Ausgeliefert. |

**Liefere zuerst die Tafeln aus.** Die 3D-Halle ist der Teil, den jeder bauen will, und der Teil, der
ohne das Register darunter wertlos ist — sie stellt Zustand dar, den der Rest des Protokolls
erzeugt, und auf einem leeren Baum zeigt sie zutreffend nichts.

---

## 5. Grundsatz

- **Die Seite liest. Das Sidecar schreibt. Der Betreiber gibt frei.**
- Keine Oberfläche startet, sendet, rollt aus oder hebt einen Not-Aus auf.
- Kein Geheimnis erreicht den Browser, niemals.
- Ausgaben gehen in Dateien und an die Konsole, nicht in ein Chatfenster
  ([`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)).
