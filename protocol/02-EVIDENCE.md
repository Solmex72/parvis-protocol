> **Inoffizielle Übersetzung.** Die normative Fassung dieses Dokuments ist die englische im Branch
> `main`. Diese Übersetzung wird der Bequemlichkeit halber bereitgestellt und **wurde nicht von
> einem Muttersprachler geprüft**. Bei Abweichungen vom englischen Original **gilt das Englische**.
> Die Protokollbezeichner (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, die Bus-Verben und die
> Dateinamen) bleiben bewusst auf Englisch: Sie sind wörtliche Werte, die Agenten auswerten.

# 02 — NACHWEIS

**Status: normativ.** Wie eine Beobachtung zu einer festgehaltenen Tatsache wird.

Die Disziplin, die diese Datei beschreibt, wird gewöhnlich auf *Vorschläge* angewandt — ein Agent
sagt, wie wahrscheinlich es ist, dass sein Plan funktioniert, bevor der Mensch entscheidet. Auf
*Behauptungen* wird sie fast nie angewandt. So denkt eine Flotte sorgfältig darüber nach, wofür sie
die Erlaubnis zum **Handeln** will, und nachlässig darüber, was sie als **wahr** festhält.

Das ist dieselbe Handlung. Eine Behauptung, die in die Aufzeichnung eingeht, ist ein Vorschlag, die
Aufzeichnung zu ändern. Parvis wendet auf beides eine einzige Disziplin an.

---

## 1. Jede Behauptung trägt eine Auszeichnung

| Auszeichnung | Bedeutet | Zulässig wo |
|---|---|---|
| `[PROVEN]` | Gegen eine zitierte Primärquelle geprüft, **die du in diesem Lauf gelesen hast**. Nenne den Befehl, den Lesevorgang, die Messung. | Überall, auch in einer Hauptdatei. |
| `[CLAIMED]` | Von etwas anderem berichtet. Ungeprüft. | Arbeitsdateien. Niemals eine Hauptdatei. |
| `[ASSUMED]` | Eine Arbeitsannahme, die niemand geprüft hat. | Arbeitsdateien, ausdrücklich. |
| `[PROPOSED]` | Eine Schätzung, eine Empfehlung, ein Plan. | Vorschläge. Niemals die Aufzeichnung. |

**Die Auszeichnung wandert mit der Behauptung.** Ein `[PROPOSED]` wird nicht dadurch zu `[PROVEN]`,
dass man es in eine wichtigere Datei kopiert. Eine Höherstufung erfordert eine neue Messung, keinen
neuen Ort.

**Nur `[PROVEN]` darf eine Hauptdatei ändern.**

---

## 2. Zitiere oder kennzeichne — wasche niemals weiß

Eine Zahl nennt ihre Quelle, sonst ist sie keine Zahl, sondern eine Ahnung mit einem Komma darin.

Wenn du die Quelle nicht hast, **sage das und gib stattdessen die Begründung an.** Das ist eine
brauchbare Antwort. Eine quellenlose, als Tatsache dargestellte Zahl ist es nicht.

**Wasche niemals einen Fehlschlag zu einem Befund weiß.** Eine Suche, die fehlschlug, ist ein
gescheiterter Aufruf, keine leere Ergebnismenge. Eine Seite, die nicht laden wollte, ist kein Beleg
für Abwesenheit. Schreibe auf, was geschehen ist.

---

## 3. Selbstbeschreibung ist `[CLAIMED]`

Der Bericht eines Agenten über seinen eigenen Zustand, seine eigene Abdeckung oder seine eigene
erledigte Arbeit ist `[CLAIMED]` — gleichgültig, wie überzeugt er ist. Erst eine äußere Aufzeichnung
macht daraus `[PROVEN]`: eine Datei auf der Platte, der Rückgabewert eines Befehls, eine
Protokollzeile, die von etwas geschrieben wurde, das nicht du bist.

Deshalb ist eine `DONE`-Zeile ohne Nachweispfad ungültig (siehe
[`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)). „Ich habe es getan“ ist eine Behauptung. Die Datei
ist der Beweis.

---

## 4. Zweimal messen bei allem auf den Sprossen 0–2

Eine einzelne Prüfung bescheinigt niemals einen Sicherheitszustand. Zwei unabhängige Messungen vor
jeder Aussage der Priorität 0, immer.

**Miss erneut, erinnere dich niemals.** Ein Baum bewegt sich unter gleichzeitigen Sitzungen — ein zu
Beginn eines Zuges gelesener Pfad kann an dessen Ende verschwunden sein. Der Zustand ist nur von der
Platte in *diesem* Lauf erkennbar. Übernimm niemals „frei“ oder „aktuell“ aus einem früheren Zug,
einer Gedächtnisdatei oder einer Zusammenfassung.

**Eine Zählung ist eine Messung, keine Tatsache.** Zähle am Ort der Verwendung erneut. Zitiere
niemals eine Dateizahl, eine Agentenzahl oder eine Version aus dem Gedächtnis.

---

## 5. Ein abgerissener Aufruf ist kein Befund

Bei **Transportverlust** — DNS-Fehler, zurückgesetzte Verbindung, Verweigerung, Zeitüberschreitung
ohne Antwort — wiederhole denselben Aufruf sofort und wiederholt. Schreibe niemals „keine
Ergebnisse“ für einen Aufruf, der nie ankam, und fülle die Lücke niemals aus dem Gedächtnis.

**Eine Antwort, die ankam, ist eine Antwort, kein Anlass zur Wiederholung.** Ein 403, ein 404, eine
leere Ergebnismenge, eine ausdrückliche Verweigerung — das sind Daten. Gegen eine Verweigerung
erneut anzulaufen, um eine andere Antwort zu bekommen, ist Umgehung von Erkennung und auf Sprosse 2
untersagt, gleichgültig auf wessen Konto oder in wessen Netz es läuft.

Der Unterschied in einer Zeile: *Wiederhole den Aufruf, der nie ankam; wiederhole niemals die
Antwort, die dir nicht gefiel.*

---

## 6. Negative Befunde zählen

„X geprüft, keine Gefahr“ ist das, was die nächsten drei Sitzungen davon abhält, X erneut zu prüfen.
Halte es fest.

**Halte fest, während du lernst, nicht am Ende.** Ein Befund, der nur im Arbeitsgedächtnis gehalten
und dann verloren wird, ist von nie geleisteter Arbeit nicht zu unterscheiden.

---

## 7. Entfernungen sind das Integritätssignal

Beim Abgleich eines Baums gegen einen Ausgangsstand hat der Bericht drei Klassen — hinzugefügt,
geändert, entfernt. Wachstum und Änderungen sind erwartete Bewegung. **Eine Entfernung ist die
Zeile, bei der Alarm angebracht ist.**

Setze keinen neuen Ausgangsstand über ungeprüfte gleichzeitige Arbeit. Erst prüfen, dann stempeln.

---

## 8. Prüfung ist eine Rolle, keine Stimmung

Ein Prüfer zählt jeden Agenten, jeden Befehl und jeden Auftrag **von der Platte** auf und prüft jeden
gegen feste Klassen — wobei er saubere Prüfungen ebenso zählt wie Mängel. Ein Lauf, der nichts
freigibt, hat nichts geprüft; er hat nur Beschwerden gesammelt.

**Der Prüfer repariert niemals.** Befunde gehen an den Korrekturprozess
([`05-CORRECTION.md`](05-CORRECTION.md)) oder an den zuständigen Agenten. Ein Prüfer, der repariert,
was er findet, hat seinen eigenen Nachweis zerstört und kann nicht länger als verlässlicher Melder
eines sauberen Laufs gelten.

---

## 9. Die Regel, der all dies dient

> Eine Tatsache, die in sechs Dateien behauptet wird, ist in fünf davon falsch.

Nachweisdisziplin ist das, was die sechste auffindbar macht.
