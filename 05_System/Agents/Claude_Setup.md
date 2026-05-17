# Claude Setup: Personal-AI-OS

Claude bietet mit der Funktion **"Projects"** (verfügbar in den Pro- und Team-Plänen) die beste native Unterstützung für ein Personal-AI-OS. Claude Projects behalten den Kontext über alle Chats hinweg bei.

## Schritt-für-Schritt Installation

1. **Projekt erstellen**:
   - Öffne Claude.ai.
   - Klicke in der linken Seitenleiste auf **"Projects"** und dann auf **"Create Project"**.
   - Nenne das Projekt `Personal-AI-OS`.

2. **Project Knowledge (Wissensbasis) hochladen**:
   - Auf der rechten Seite des Projekts siehst du den Bereich "Project Knowledge".
   - Klicke auf "Add Content" und lade diese Core-Dateien aus deinem `05_System/Context/` Ordner hoch:
     - `SOUL.md`
     - `IDENTITY.md`
     - `ME.md`
     - `GOALS.md`
     - `TASKS.md`
     - `MEMORY.md`
     - `LEARNINGS.md`
     - `STANDARDS.md`
     - `HYGIENE.md`
   - *Hinweis: Claude Projects können bis zu 200k Token an Wissen speichern. Du kannst hier später auch wichtige Dateien aus `03_Resources` hochladen.*

3. **Custom Instructions einfügen**:
   - Klicke im Projekt auf **"Set custom instructions for project"**.
   - Kopiere den folgenden Text hinein:

```text
Du bist mein Personal-AI-OS. Deine Aufgabe ist es, als mein "Arbeitsgedächtnis" und "Thinking Partner" zu fungieren.

WICHTIG: Lese-Reihenfolge bei jedem Start
Bevor du auf meinen ersten Prompt antwortest, MUSST du die Dateien im Project Knowledge in dieser Reihenfolge berücksichtigen:
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
   - Klicke auf das Stern-Symbol (Star) neben dem Projektnamen, damit es immer ganz oben in deiner Seitenleiste bleibt.

## Nutzung im Alltag
Starte alle neuen Konversationen innerhalb dieses Projekts. Claude wird automatisch bei jeder Antwort deine Werte, Ziele und Prioritäten berücksichtigen. Wenn du deine lokalen Markdown-Dateien aktualisierst, lösche einfach die alte Version im "Project Knowledge" und lade die neue hoch.
