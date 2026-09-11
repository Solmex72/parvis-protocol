> **Inoffizielle Übersetzung.** Die normative Fassung dieses Dokuments ist die englische im Branch
> `main`. Diese Übersetzung wird der Bequemlichkeit halber bereitgestellt und **wurde nicht von
> einem Muttersprachler geprüft**. Bei Abweichungen vom englischen Original **gilt das Englische**.
> Die Protokollbezeichner (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, die Bus-Verben und die
> Dateinamen) bleiben bewusst auf Englisch: Sie sind wörtliche Werte, die Agenten auswerten.

# 06 — DATENZONEN

**Status: normativ.** Wo eine Datei leben darf.

---

## 1. Warum ein Verbot nicht funktionierte

Die ursprüngliche Regel lautete *„keine Geheimnisse, nie, nirgends“* — **ohne jeden Ort, an dem man
private Daten stattdessen ablegen könnte.**

Ein Verbot ohne Ziel wird nicht befolgt. Es wird umgangen, und privates Material landet
versehentlich im synchronisierten Baum. Das geschah wiederholt, auch durch einen Agenten, der selbst
der Regel unterlag.

**Die Regel ist eine Weiterleitungsentscheidung, kein Verbot.**

---

## 2. Die zwei Zonen

| Zone | Eigenschaft | Enthält |
|---|---|---|
| **PUBLIC** | Synchronisiert in die Cloud. **Behandle jedes Byte als veröffentlicht.** | Doktrin, Aufträge, Agentendefinitionen, Architektur, Geschäftskontext, Recherche, technische Dokumentation |
| **PRIVATE** | **Außerhalb jeder Synchronisationswurzel** — und außerhalb des Benutzerprofils, damit auch die Umleitung bekannter Ordner nicht herankommt | Geheimnisse, reale Personen und ihre personenbezogenen Daten, private Projekte und Medien, alles, was in einer Sicherung zu finden falsch wäre |

### Der Test

> *Wäre es ein Problem, wenn dies in einem Jahr in einer Cloud-Momentaufnahme läge?*

Ja → PRIVATE. Nein → PUBLIC. Bei echter Unsicherheit → **PRIVATE.** Die Kosten einer zu hohen
Einstufung sind Unbequemlichkeit. Die Kosten einer zu niedrigen lassen sich nicht rückgängig machen.

### Wisse, was tatsächlich synchronisiert

Prüfe das auf der realen Maschine, nicht aus Annahme. Auf einem üblichen Arbeitsplatz können mehrere
Synchronisationsprogramme gleichzeitig laufen, und alles unter den Ordnern Dokumente, Desktop oder
Bilder verlässt die Maschine und wird wochenlang im Versionsverlauf aufbewahrt. **Lokales Löschen
holt es nicht zurück.**

Zwei Folgen, die jede für sich reale Fehlschläge verursachen:

1. **Build-Ausgaben müssen umgeleitet werden**, aus einer Synchronisationswurzel heraus, sonst
   beschädigt der Spiegel sie mitten im Build.
2. **Schlüssel leben außerhalb**, bewusst und standardmäßig.

---

## 3. Die Ausnahme: Zugangsdaten gehören keiner Zone an

**Aktive Zugangsdaten — Passwörter, API-Schlüssel, Token, Stream-Schlüssel — gehören in einen
Passwortmanager, nicht in eines der beiden Dateisysteme.**

Die private Zone enthält *private Daten*. Ein Passwortmanager enthält *Zugangsdaten*. Das ist keine
Wortklauberei: Ein privates Verzeichnis ist standardmäßig nicht verschlüsselt, und eine Datei ist
eine Datei. In dem Augenblick, in dem eine kopiert, in einen Mitschnitt zitiert oder an irgendetwas
angehängt wird, ist sie offengelegt.

**Benenne die Sicherheitseigenschaft der privaten Zone eng und überzeichne sie niemals.** Ihre
einzige bewiesene Eigenschaft ist gewöhnlich, dass *nichts sie irgendwohin kopiert*. Ohne geprüfte
Voll- oder Dateiverschlüsselung ist sie nicht verschlüsselt, nicht gesichert und kein Tresor.

---

## 4. Die Einstufung gehört dem Betreiber und ist anpassbar

Halte die lebende Tabelle in einer einzigen Datei — `DATA-CLASSIFICATION.md` — in der der Betreiber
Kategorien zwischen Zonen verschiebt und die jeder Agent liest, statt zu raten.

Diese Protokolldatei nennt den **Mechanismus**. Jene Datei nennt die **Richtlinie**. Wo beide
abweichen, gewinnt die Richtliniendatei.

---

## 5. Folgen für Agenten

- **Kein Geheimnis in einem Baum, der gebündelt wird.** Ein Kontextbündel existiert, um in eine neue
  Sitzung eingefügt zu werden. Nenne, was gehalten wird und wo; niemals den Wert.
- **Kein Geheimnis erreicht `surface/`.** Es wird auf dem Bildschirm angezeigt.
- **Kein Geheimnis erreicht einen Browser.** Siehe [`07-INTERFACE.md`](07-INTERFACE.md) §3.
- **Schwärze durch Verweis, nicht durch Löschen.** `<api key — see password manager entry
  "acme-prod">` hält die Tatsache auffindbar, ohne den Wert offenzulegen.

---

## 6. Beschneiden ohne Verlust

Bevor irgendetwas den Arbeitsbaum verlässt:

1. Kopiere es in einen versiegelten Speicher **außerhalb der Wurzeln** — eine Archivdatei, nicht über
   Glob erreichbar.
2. Trage die Pfade in `marked-deletion.md` / `marked-archive.md` ein.
3. **Die Ausführung ist die Hand des Betreibers**, bei zur Ruhe gebrachtem Baum.

Niemals Massenlöschung unter laufender Nebenläufigkeit.
