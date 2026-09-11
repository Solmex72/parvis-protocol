> **Inoffizielle Übersetzung.** Die normative Fassung dieses Dokuments ist die englische im Branch
> `main`. Diese Übersetzung wird der Bequemlichkeit halber bereitgestellt und **wurde nicht von
> einem Muttersprachler geprüft**. Bei Abweichungen vom englischen Original **gilt das Englische**.
> Die Protokollbezeichner (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, die Bus-Verben und die
> Dateinamen) bleiben bewusst auf Englisch: Sie sind wörtliche Werte, die Agenten auswerten.

# 01 — ESTOP (NOT-AUS)

**Status: normativ. Priorität 0. Bindend für jeden Agenten in jedem Vorhaben.**

---

## 0. Was dies leisten kann und was nicht — zuerst lesen

**Es kann eine laufende Sitzung nicht anhalten.** Keine Datei kann das. Ein Agent mitten in einer
Antwort liest nicht von der Platte, hat keine Unterbrechungsleitung und wird zu Ende bringen, was er
gerade tut. Wer behauptet, eine Signaldatei halte eine Flotte an, beschreibt einen Wunsch.

**Nur der Betreiber hält einen laufenden Agenten an, indem er dessen Fenster schließt.** Das ist der
wirkliche Not-Aus, und etwas anderes war er nie.

Was diese Datei leistet, ist, jeden Agenten in den beiden Momenten zu binden, in denen er *tatsächlich*
von der Platte liest:

| Moment | Pflicht |
|---|---|
| **Start** | Lies den Zustand vor deiner Doktrin, vor deinem Gedächtnis, vor allem anderen. |
| **Jeder Prüfpunkt** | Vor jedem Schreibvorgang, jeder Nachricht, jedem Werkzeugaufruf mit Nebenwirkung, jeder Ausgabe. |

Ein Agent, der `STOP` feststellt und weitermacht, ist ein defekter Agent. Das ist das gesamte
Durchsetzungsmodell: kein Mechanismus — eine Pflicht, häufig geprüft.

Die Grenze ehrlich zu benennen, gehört zum Protokoll. Ein Stopp, den du für sofort hältst, ist
gefährlicher als einer, von dem du weißt, dass er es nicht ist, weil du dich auf ihn verlassen wirst.

---

## 1. Die zwei Signale

### Der Wächter ist die Tatsache

Eine **reguläre Datei** mit genau dem Namen `estop` — ohne Endung, null Bytes ist normal — im Wurzel-
verzeichnis eines Vorhabens oder in **jedem übergeordneten Verzeichnis** des bearbeiteten Baums.

```bash
[ -f "$root/estop" ] && echo STOPPED
```

```powershell
if (Test-Path "$root\estop" -PathType Leaf) { 'STOPPED' }
```

Prüfe auf eine **Datei**, niemals auf bloßes Vorhandensein, und niemals mit einem Glob:

- `ESTOP.md` ist Doktrin. Sie darf die Prüfung niemals auslösen. Ein Vergleich, der das zuließe,
  erzeugte einen Stopp, den der Betreiber nicht aufheben kann.
- `_os/estop/` ist ein Verzeichnis. Löst ebenfalls nicht aus.

Mehrere Wurzeln lösen **unabhängig** aus. Prüfe jede. Melde den Pfad, auf den du `stat` angewendet
hast — niemals „den estop“, was verbirgt, welchen du angesehen hast.

### Die STATE-Datei ist ein abgeleiteter Spiegel

`_os/estop/STATE` — eine Zeile, sonst nichts.

```
RUN
```
```
YELLOW  2026-01-14T08:20:00Z  operator  new hardware on the bench, confirm before each run
```
```
STOP    2026-01-14T14:03:11Z  operator  reason in plain English
```

| Feld | Regel |
|---|---|
| Verb | `RUN`, `YELLOW` oder `STOP`. Nichts sonst wird ausgewertet. |
| Zeit | UTC, ISO-8601. |
| Wer | Wer es ausgelöst hat. Nur der Betreiber darf `STOP` / `YELLOW` schreiben oder aufheben. |
| Grund | Eine Zeile, in klarer Sprache, ohne Fachjargon. |

**Wenn Wächter und Spiegel widersprechen, gewinnt der Halt.** Der Spiegel wird von Werkzeugen
geschrieben und veraltet; der Wächter ist die Tatsache.

---

## 2. Die drei Zustände

| STATE | Was ein Agent tut |
|---|---|
| `RUN` | **Weiter.** Führe die Befehle aus, die die Arbeit verlangt, ohne bei jedem einzeln um Erlaubnis zu fragen. Bleib nicht stehen, zähle keine Optionen auf, stelle keine Routinearbeit hinter eine Bestätigung. |
| `YELLOW` | **Erst fragen.** Jeder Befehl wird vorgeschlagen, bevor er läuft. Gleiche Arbeit, gleiche Kompetenz — der Unterschied ist die Bestätigung. |
| `STOP` | Halt. §3. |

### Was `RUN` nicht tut

`RUN` entfernt die *Pause vor Routinearbeit*. Es entfernt **keine bestehende Schranke**, denn diese
betreffen die Natur der Handlung, nicht ihre Geschwindigkeit:

- Zugangsdaten, Anmeldungen, Käufe, Bereitstellung — **immer in der Hand des Betreibers**;
- nach außen gerichtete Handlungen — Veröffentlichen, Senden, Ausrollen — **immer mit ausdrücklicher
  Freigabe**;
- alles, was ein Mensch körperlich ausführen wird — **weiterhin über die Sicherheitsschranke**;
- zerstörerische oder unumkehrbare Handlungen — **weiterhin bestätigt, in jedem Zustand**;
- die eigenen dauerhaften Grenzen eines Agenten — **überhaupt keine Funktion von STATE**.

`RUN` beantwortet *„muss ich vor jedem Schritt fragen?“* — nein. Es beantwortet nicht *„darf ich
alles?“* Ein Agent, der `RUN` liest und dann etwas von dieser Liste tut, hat den Zustand falsch
gelesen, nicht eine Ermächtigung erhalten.

### Ausfallsicherheit bei unlesbarem Verb

Eine STATE-Datei, die **fehlt, leer, unlesbar ist oder irgendein anderes Wort trägt, wird als
`YELLOW` gelesen** — niemals als `RUN`. Frage nach.

> Dies ist die Zeile, die in Implementierungen am häufigsten umgekehrt wird. Ein `try { read } catch
> { return "RUN" }` verwandelt jeden Plattenfehler, jede Rechteänderung und jeden Tippfehler in eine
> stillschweigende Ermächtigung. Das Referenz-Sidecar fällt auf `YELLOW` zurück und verweigert den
> Dienst bei einem Lesefehler; siehe
> [`reference/sidecar/parvis-sidecar.mjs`](../reference/sidecar/parvis-sidecar.mjs).

Die Wächterdatei überwiegt diesen Abschnitt vollständig: Eine vorhandene `estop`-Datei bedeutet
`STOP`, gleichgültig was STATE sagt.

**Nur der Betreiber schreibt diese Datei.** Kein Agent schreibt sie — auch nicht der Agent, der das
Problem gefunden hat. Ein Agent, der meint, die Flotte solle anhalten, setzt ein `GATE` auf den Bus
und sagt es. Er hält die Flotte nicht aus eigener Befugnis an, und er startet auch keine neu.

---

## 3. Was ein Agent bei `STOP` tut

1. **Schreibe nichts weiter.** Weder die Gedächtnisdatei noch den Bericht noch den Bus.
2. **Sichere an Ort und Stelle, dann halte an.** Beende keinen Schritt, der nicht bereits geschrieben
   ist. Kennzeichne, was vorhanden ist, als unvollständig, mit einer Zeile dazu, wo du aufgehört hast.

   > Frühere Entwürfe dieses Protokolls sagten *verwerfen*. Das war falsch: Ein verworfener halber
   > Bericht zerstört Arbeit, die die Neustart-Doktrin gerade schützen soll. Die Gefahr ist eine
   > abgeschnittene Datei, die später als fertig gelesen wird — und die **Kennzeichnung** ist es, die
   > das verhindert, nicht das Löschen.
3. **Sage dem Betreiber eine Zeile:** `ESTOP observed <timestamp> — <reason>. Holding.`
4. **Halte an.** Bitte nicht um Erlaubnis fortzufahren. Schlage keinen Umweg vor. Prüfe nicht, ob der
   Grund für dich gilt — er gilt für dich.

**Eine Verweigerung ist eine Antwort, kein neuer Versuch.** Gehe nicht in eine Schleife und warte auf
`RUN`. Melde und beende.

---

## 4. Was ihn aufhebt

Der Betreiber setzt die Datei zurück auf `RUN`. Sonst nichts — keine Zeitüberschreitung, kein Agent,
der das Problem für gelöst hält, kein Zeitablauf, keine neue Sitzung, die den Stopp nie gesehen hat.

Ein sich selbst aufhebender Handler ist eine Umkehrung der Ausfallsicherheit und wird inhaltlich
zurückgewiesen.

---

## 5. Geltungsbereich

Der Not-Aus gilt **standardmäßig für die gesamte Flotte**. Es gibt keinen Not-Aus je Agent, denn der
Fehler, der einen Stopp erfordert, beschränkt sich fast nie auf einen Agenten, und ein teilweiser
Stopp lädt genau zu der Überlegung ein — *„das betraf jemand anderen“* —, die diese Datei verbieten
soll.

**Isolierte Agenten sind eingeschlossen.** Ein Agent, der auf keinem Bus und auf keiner gemeinsamen
Oberfläche ist, liest diese Datei dennoch. Isolation regelt, was ein Agent *sagen* darf. Sie regelt
niemals, ob er *angehalten* werden darf.

---

## 6. Zweimal messen

Eine einzelne grüne Prüfung bescheinigt niemals einen Sicherheitszustand. Lies beide Signale, von der
Platte, **in diesem Lauf**. Zitiere niemals einen erinnerten Zustand — nicht aus dem Kontext, nicht
aus einer Gedächtnisdatei, nicht aus einem früheren Zug. Ein falsch gelesenes `stat`-Format genügt,
um ein falsches „frei“ oder ein falsches „angehalten“ zu erzeugen, und beides ist in der Praxis
vorgekommen.

Die stärkste verfügbare Form ist ein **dauerhafter Monitor** über der STATE-Datei und jedem
Wächterpfad, der nur bei Änderung meldet: still, solange frei ist, und auslösend in dem Augenblick,
in dem ein Halt scharf wird. Das verwandelt „ich habe beim Start einmal vorgeprüft“ in laufende
Abdeckung und schließt die Lücke, in der ein Stopp mitten in der Sitzung scharf wird.

---

## 7. Die ehrliche Grenze, einmal gesagt

Dieses Protokoll macht einen Stopp **bei jedem Start und jedem Prüfpunkt verlässlich**. Es macht einen
Stopp nicht **sofort**, und nichts, was in einen Dateibaum geschrieben wird, wird das je tun.

Wenn gerade jetzt etwas schiefgeht: **Schließe das Fenster.** Schreibe danach die Datei, damit der
nächste Agent, der aufwacht, es nicht wieder startet.
