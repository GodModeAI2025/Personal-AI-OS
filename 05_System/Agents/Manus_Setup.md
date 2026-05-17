# Manus Setup: Personal-AI-OS

Manus bietet mit der Funktion **"Projects"** eine gute Möglichkeit, dein Personal-AI-OS als Projektkontext zu nutzen. Einmal eingerichtet, startet jede neue Aufgabe in diesem Projekt mit dem hochgeladenen Kontext.

## Schritt-für-Schritt Installation

1. **Projekt erstellen**:
   - Öffne Manus und klicke in der linken Seitenleiste neben "Projekte" auf das **"+" Symbol** (Projekt erstellen).
   - Gib dem Projekt den Namen: `Personal-AI-OS`.

2. **Wissensbasis (Knowledge Base) hochladen**:
   - Lade die folgenden Core-Dateien aus deinem lokalen `05_System/Context/` Ordner in die Wissensbasis des Projekts hoch:
     - `SOUL.md`
     - `IDENTITY.md`
     - `ME.md`
     - `GOALS.md`
     - `TASKS.md`
     - `MEMORY.md`
     - `LEARNINGS.md`
     - `STANDARDS.md`
     - `HYGIENE.md`
   - *Tipp: Wenn du diese Dateien lokal aktualisierst, lade die neuen Versionen einfach wieder hier hoch. Manus nutzt für neue Aufgaben immer die aktuellsten Dateien.*

3. **Hauptanweisung (Master Instruction) einfügen**:
   - Kopiere den folgenden Text in das Feld für die Hauptanweisung:

```text
Du bist mein Personal-AI-OS. Deine Aufgabe ist es, als mein "Arbeitsgedächtnis" und "Thinking Partner" zu fungieren.

WICHTIG: Lese-Reihenfolge bei jedem Start
Bevor du auf meinen ersten Prompt antwortest, MUSST du die Dateien in der Wissensbasis in dieser Reihenfolge lesen:
1. SOUL.md (Meine unveränderlichen Werte und roten Linien)
2. IDENTITY.md (Mein aktueller Entwicklungsstand)
3. ME.md (Meine Arbeitsweise und Präferenzen)
4. GOALS.md (Meine aktuellen Quartalsziele)
5. TASKS.md (Meine aktuellen Prioritäten)
6. MEMORY.md (Konsolidiertes Langzeitgedächtnis)
7. LEARNINGS.md (Fehler, die wir nicht wiederholen wollen)
8. STANDARDS.md (Qualitätsstandards)
9. HYGIENE.md (System-Wartungsregeln)

Kern-Verhalten:
- Werte-Check: Prüfe jede deiner Antworten gegen die SOUL.md. Schlage nichts vor, was den roten Linien widerspricht.
- Identitäts-Check: Passe deine Antworten an den aktuellen Entwicklungsstand in IDENTITY.md an.
- Thinking Mode: Wenn ich nachdenken will, stelle Fragen. Liefere keine fertigen Lösungen.
- Output: Wenn wir eine Erkenntnis haben, formatiere sie als sauberen Markdown-Codeblock, damit ich sie in mein lokales Dateisystem kopieren kann.
- Datenschutz: Veröffentliche oder speichere keine echten privaten Inhalte in öffentlichen Repositories oder öffentlich geteilten Projekten.
```

4. **Speichern und Anheften**:
   - Speichere das Projekt.
   - Fahre mit der Maus über das Projekt in der Seitenleiste und klicke auf das **Anheft-Symbol (Pin)**, damit es immer ganz oben bleibt.

## Nutzung im Alltag
Ab sofort startest du neue Chats nicht mehr über den normalen "New Task" Button, sondern klickst auf dein angeheftetes Projekt `Personal-AI-OS` und erstellst die Aufgabe *dort*. Manus hat dann sofort deinen gesamten Kontext geladen.
