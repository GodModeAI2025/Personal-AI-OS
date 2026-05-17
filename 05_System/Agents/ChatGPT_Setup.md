# ChatGPT Setup: Personal-AI-OS

Um ChatGPT mit deinem Personal-AI-OS zu verbinden, nutzt du entweder einen Live-Connector/API-Zugriff oder die **Custom GPT** Funktion als Knowledge-Snapshot. Wenn dein ChatGPT-Setup keinen Live-Zugriff auf den lokalen Memory-Server erlaubt, musst du den Snapshot aktualisieren.

Aktuellen Snapshot erzeugen:

```bash
node tools/memory-server/bin/paios-memory.js context --profile chatgpt --write
```

## Schritt-für-Schritt Installation

1. **Custom GPT erstellen**:
   - Öffne ChatGPT (Plus/Pro Account erforderlich).
   - Klicke links in der Seitenleiste auf **"Explore GPTs"** und dann oben rechts auf **"Create"**.
   - Wechsle oben vom Tab "Create" auf den Tab **"Configure"**.

2. **Grunddaten ausfüllen**:
   - **Name**: `Personal-AI-OS`
   - **Description**: `Lokales Personal-AI-OS: Markdown-Memory, Kontext-Snapshots und Thinking Partner.`

3. **Wissensbasis (Knowledge) hochladen**:
   - Scrolle nach unten zum Bereich **"Knowledge"**.
   - Klicke auf "Upload files" und lade diese Core-Dateien aus deinem `05_System/Context/` Ordner hoch:
     - `SOUL.md`
     - `IDENTITY.md`
     - `ME.md`
     - `GOALS.md`
     - `TASKS.md`
     - `MEMORY.md`
     - `LEARNINGS.md`
     - `STANDARDS.md`
     - `HYGIENE.md`

4. **Instructions (System-Prompt) einfügen**:
   - Kopiere den folgenden Text in das große Feld **"Instructions"**:

```text
Du bist mein Personal-AI-OS. Deine Aufgabe ist es, als mein "Arbeitsgedächtnis" und "Thinking Partner" zu fungieren.

WICHTIG: Lese-Reihenfolge bei jedem Start
Bevor du auf meinen ersten Prompt antwortest, MUSST du die hochgeladenen Dateien in deiner Knowledge Base in dieser Reihenfolge lesen:
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
- Datenschutz: Veröffentliche oder speichere keine echten privaten Inhalte in öffentlichen Repositories oder öffentlich geteilten GPTs.
```

5. **Speichern**:
   - Klicke oben rechts auf **"Create"** oder **"Update"**.
   - Wähle "Only me" (Nur für mich sichtbar).

## Nutzung im Alltag
Pinne diesen Custom GPT in deiner Seitenleiste an. Starte alle wichtigen Chats über diesen GPT. Wenn sich deine Ziele (`GOALS.md`), deine Identität (`IDENTITY.md`) oder `MEMORY.md` ändern, erzeuge einen neuen Snapshot und lade ihn in der Knowledge Base hoch.
