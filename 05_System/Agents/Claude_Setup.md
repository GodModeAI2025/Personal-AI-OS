# Claude Setup: Personal-AI-OS

Claude kann das Personal-AI-OS auf zwei Arten nutzen: als **Project Knowledge** Snapshot oder, in MCP-fähigen lokalen Setups, per Live-Zugriff auf den Memory-Server. Project Knowledge ist praktisch, aber kein automatischer Live-Sync.

MCP-Snippet erzeugen:

```bash
node tools/memory-server/bin/paios-memory.js init
```

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
Starte alle neuen Konversationen innerhalb dieses Projekts. Wenn du Project Knowledge nutzt und deine lokalen Markdown-Dateien aktualisierst, lösche die alte Version im "Project Knowledge" und lade die neue hoch. Wenn dein Claude-Setup MCP nutzt, greift Claude live über `memory_search`, `memory_context` und `memory_remember` auf die lokale Memory-Schicht zu.
