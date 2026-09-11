> **Inoffizielle Übersetzung.** Die normative Fassung dieses Dokuments ist die englische im Branch
> `main`. Diese Übersetzung wird der Bequemlichkeit halber bereitgestellt und **wurde nicht von
> einem Muttersprachler geprüft**. Bei Abweichungen vom englischen Original **gilt das Englische**.
> Die Protokollbezeichner (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, die Bus-Verben und die
> Dateinamen) bleiben bewusst auf Englisch: Sie sind wörtliche Werte, die Agenten auswerten.

# 04 — DER AUSGABEVERTRAG

**Status: normativ.** Wohin Arbeit geht, wenn sie fertig ist.

---

## 1. Die Regel

**Berichte nicht in den Chat. Arbeite im Dateibaum, schreibe die Ausgabe auf die Platte und lege
einen Zeiger offen.**

Ein Agent, der damit endet, eine lange Antwort in ein Chatfenster zu schreiben, hat seine Ausgabe
dorthin gelegt, wo nichts sonst in der Flotte sie lesen kann — kein anderer Agent, kein Monitor,
keine Konsole, keine nächste Sitzung. Die Datei ist die dauerhafte Aufzeichnung; der Chat ist ein
Mitschnitt, den niemand weiter unten sieht.

---

## 2. Wohin die Ausgabe geht

| Art der Ausgabe | Landet in |
|---|---|
| Arbeitsergebnis, Befunde, ein Bericht | die zuständige Datei oder `outbox/YYYYMMDD-HHMMSS-<slug>.md` |
| Alles, was der Betreiber jetzt sehen soll | eine kurze Zeigerdatei in `_os/events/surface/` |
| Ein Ersuchen, das den Betreiber braucht | `_os/exchange/requests/REQ-<slug>.md` |
| Die Registerzeile | `_os/tasks/INDEX.md` |

**Das Verzeichnis `surface/` ist die Benachrichtigung. Die Datei ist die Substanz.** Schreibe die
Substanz an ihren richtigen Ort und lege dann einen einzeiligen Zeiger in `surface/`, damit die
Konsole dem Betreiber zeigt, wo sie gelandet ist.

---

## 3. Das Aufgabenverzeichnis

Eine Zeile je Auftrag. Füge eine `REQ`-Zeile **vor** dem Beginn an, damit eine unterbrochene Aufgabe
sichtbar bleibt.

```
REQ     | 2026-01-14 | SCOUT | <the order, in the Operator's words where possible> | <status note>
DONE    | 2026-01-14 | SCOUT | <the order> | evidence: outbox/20260114-090312-lease-rates.md
BLOCKED | 2026-01-14 | SCOUT | <the order> | <what is blocking, one line>
REFUSED | 2026-01-14 | SCOUT | <the order> | <why, one line + where the reasoning lives>
```

**Eine `DONE`-Zeile ohne Nachweispfad ist ungültig.** Wenn es keine Datei gibt, ist die Arbeit
nirgends gelandet, wo der Betreiber sie sehen kann. Selbstauskunft ist `[CLAIMED]`; die Datei ist
das, was sie `[PROVEN]` macht.

**Eine Verweigerung gehört dauerhaft hierher.** So hört die Flotte auf, entschiedene Fragen erneut
aufzurollen. Lösche sie später nicht.

**Die ehrliche Grenze:** Dieses Verzeichnis beobachtet nichts. Es ist genau so vollständig wie die
Agenten, die hineinschreiben. Eine fehlende Aufgabe ist kein Beleg dafür, dass die Aufgabe nie
stattfand — nur dafür, dass niemand sie festgehalten hat. Behandle eine Zeile als *eine Behauptung
mit angehängtem Nachweispfad*, niemals als Beweis. Prüfe, ob die Nachweisdatei existiert, bevor du
dich auf ein `DONE` verlässt.

---

## 4. Fertig ist, wenn der Betreiber es sieht

Nicht, wenn ein Agent es erklärt. Eine Antwort ist kein Haltepunkt: Monitore bleiben darüber hinaus
scharf, die Arbeit geht weiter, und dann erfolgt eine bewusste Abmeldung.

---

## 5. Die Gegenregel, die dem Weiterleiten vorgeht

**Der Not-Aus und die Offenheit gehen weiterhin an den Menschen, sofort und deutlich sichtbar.**

Ein Fehlschlag wird mit derselben Deutlichkeit gezeigt wie ein Erfolg. Das Weiterleiten von Ausgaben
in Dateien darf niemals zu einem Ort werden, an dem ein schlechtes Ergebnis vergraben wird. Wenn die
guten Nachrichten der Flotte im Chat ankommen und die schlechten in einer Datei, die niemand öffnet,
ist der Vertrag umgekehrt worden, und die Flotte lügt nun durch Weiterleitung.

---

## 6. Die ehrliche Grenze des Vertrags selbst

Ein Agent, der in einem Chat-Gerüst läuft, gibt weiterhin Assistententext in diesem Chat aus —
dieser Vertrag kann das Gerüst nicht umleiten. Was er bindet, ist **das, was ein Agent zu schreiben
wählt**: die Substanz in Dateien und der Chattext beschränkt auf einen kurzen Zeiger — *„geschrieben
nach `<path>`, an die Konsole gemeldet“* — niemals der vollständige Bericht.

---

## 7. Kein Geheimnis erreicht die Oberfläche

`surface/` wird von einer Konsole gelesen und kann auf einem Bildschirm, in einer Bildschirmaufnahme
oder in einem geteilten Fenster erscheinen. Die Datenzonenregeln
([`06-DATA-ZONES.md`](06-DATA-ZONES.md)) gelten hier in vollem Umfang.
