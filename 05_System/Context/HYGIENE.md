# System-Hygiene (Verrottungsschutz)

*Ein Personal-AI-OS ist nur so gut wie seine Pflege. Ohne Hygiene-Regeln wird es schnell zu einer unübersichtlichen Müllhalde. Diese Datei definiert die Wartungsregeln, die du (und die KI) einhalten müssen.*

## 1. Inbox-Hygiene (Wöchentlich)
- **Regel**: Die `00_Inbox` darf niemals mehr als 20 Dateien enthalten.
- **Aktion**: Einmal pro Woche (idealerweise während der Weekly Synthesis) wird die Inbox komplett geleert. Alles wird entweder in Projekte, Areas, Resources verschoben oder gelöscht.
- **KI-Anweisung**: Wenn die KI bemerkt, dass die Inbox zu voll wird, soll sie proaktiv vorschlagen: "Deine Inbox ist voll. Soll ich dir beim Aufräumen helfen?"

## 2. Projekt-Hygiene (Monatlich)
- **Regel**: Projekte in `01_Projects` müssen aktiv sein.
- **Aktion**: Wenn ein Projekt länger als 30 Tage nicht bearbeitet wurde, wird es entweder nach `04_Archive` verschoben (pausiert/abgebrochen) oder die Priorität wird in `TASKS.md` erhöht.
- **KI-Anweisung**: Bei der Weekly Synthesis prüft die KI das letzte Änderungsdatum der Projekte und schlägt inaktive Projekte zur Archivierung vor.

## 3. Ressourcen-Hygiene (Quartalsweise)
- **Regel**: `03_Resources` ist kein schwarzes Loch für Lesezeichen.
- **Aktion**: Alle 3 Monate werden Ressourcen, die nie verlinkt oder genutzt wurden, archiviert oder gelöscht.
- **KI-Anweisung**: Die KI achtet darauf, dass neue Ressourcen immer mit bestehenden Notizen verlinkt werden (Networked Thinking). Isolierte Notizen sind wertlos.

## 4. Kontext-Hygiene (Quartalsweise)
- **Regel**: Das "Gehirn" (`05_System/Context/`) muss aktuell bleiben.
- **Aktion**: Zu Beginn jedes neuen Quartals werden `GOALS.md` und `IDENTITY.md` zwingend aktualisiert.
- **KI-Anweisung**: Wenn die KI feststellt, dass die Quartalsziele in `GOALS.md` abgelaufen sind, verweigert sie die Planung neuer Aufgaben, bis die Ziele aktualisiert wurden.

## 5. Die "Löschen ist okay"-Regel
- Es ist besser, eine mittelmäßige Notiz zu löschen, als das System damit zu verstopfen. Wenn eine Information in 2 Minuten gegoogelt werden kann, muss sie nicht in `03_Resources` gespeichert werden.

## 6. Datenschutz-Hygiene (Vor jedem Commit/Push)
- **Regel**: Echte persönliche Inhalte gehören nur in ein privates Repo oder in ignorierte lokale Dateien.
- **Aktion**: Vor jedem Commit prüft die KI `git status --short` und `git diff --cached`.
- **KI-Anweisung**: Wenn private Inhalte in einem öffentlichen Repo auftauchen, bricht die KI den Commit ab und schlägt eine private Ablage vor.
