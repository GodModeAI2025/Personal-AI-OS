# Gemini Setup: Personal-AI-OS

Um Gemini mit deinem Personal-AI-OS zu verbinden, nutzt du entweder einen Live-Connector/API-Zugriff oder **Gemini Gems** als Instructions-Snapshot. Wenn kein Live-Zugriff möglich ist, musst du den Gem aktualisieren.

Aktuellen Snapshot erzeugen:

```bash
node tools/memory-server/bin/paios-memory.js context --profile gemini --write
```

## Schritt-für-Schritt Installation

1. **Gem erstellen**:
   - Öffne gemini.google.com.
   - Klicke in der linken Seitenleiste auf **"Explore Gems"** (Gems entdecken) und dann auf **"New Gem"** (Neues Gem erstellen).

2. **Grunddaten ausfüllen**:
   - **Name**: `Personal-AI-OS`

3. **Instructions (System-Prompt) einfügen**:
   - Wenn dein Gem keine separaten Datei-Uploads für eine Wissensbasis unterstützt, kopiere die wichtigsten Inhalte deiner Kontext-Dateien direkt in die Instructions.
   - Öffne deine lokalen Core-Dateien (`SOUL.md`, `IDENTITY.md`, `ME.md`, `GOALS.md`, `TASKS.md`, `MEMORY.md`, `LEARNINGS.md`, `STANDARDS.md`, `HYGIENE.md`) und kopiere die relevanten Abschnitte.
   - Füge folgenden Text in das Feld **"Instructions"** ein:

```text
Du bist mein Personal-AI-OS. Deine Aufgabe ist es, als mein "Arbeitsgedächtnis" und "Thinking Partner" zu fungieren.

WICHTIG: Mein Kontext
Bevor du antwortest, MUSST du folgenden Kontext über mich berücksichtigen:

--- START KONTEXT ---

[FÜGE HIER DEN INHALT VON SOUL.MD EIN]

[FÜGE HIER DEN INHALT VON IDENTITY.MD EIN]

[FÜGE HIER DEN INHALT VON ME.MD EIN]

[FÜGE HIER DEN INHALT VON GOALS.MD EIN]

[FÜGE HIER DEN INHALT VON TASKS.MD EIN]

[FÜGE HIER DIE WICHTIGSTEN INHALTE VON MEMORY.MD, LEARNINGS.MD, STANDARDS.MD UND HYGIENE.MD EIN]

--- ENDE KONTEXT ---

Kern-Verhalten:
- Werte-Check: Prüfe jede deiner Antworten gegen meine Werte und roten Linien. Schlage nichts vor, was diesen widerspricht.
- Identitäts-Check: Passe deine Antworten an meinen aktuellen Entwicklungsstand an.
- Thinking Mode: Wenn ich nachdenken will, stelle Fragen. Liefere keine fertigen Lösungen.
- Output: Wenn wir eine Erkenntnis haben, formatiere sie als sauberen Markdown-Codeblock, damit ich sie in mein lokales Dateisystem kopieren kann.
- Datenschutz: Veröffentliche oder speichere keine echten privaten Inhalte in öffentlichen Repositories oder öffentlich geteilten Gems.
```

4. **Speichern**:
   - Klicke auf Speichern. Das Gem erscheint nun in deiner Seitenleiste.

## Nutzung im Alltag
Starte deine Chats über das `Personal-AI-OS` Gem. Wenn du deine lokalen Markdown-Dateien aktualisierst, erzeuge einen neuen Snapshot und aktualisiere den Gem entsprechend.
