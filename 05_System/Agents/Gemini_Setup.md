# Gemini Setup: Permanentes Personal-AI-OS

Um Gemini dauerhaft mit deinem Personal-AI-OS zu verbinden, nutzen wir die **Gemini Gems** Funktion (verfügbar in Gemini Advanced). Gems sind personalisierte KI-Assistenten, die ihre Anweisungen behalten.

## Schritt-für-Schritt Installation

1. **Gem erstellen**:
   - Öffne gemini.google.com.
   - Klicke in der linken Seitenleiste auf **"Explore Gems"** (Gems entdecken) und dann auf **"New Gem"** (Neues Gem erstellen).

2. **Grunddaten ausfüllen**:
   - **Name**: `Personal-AI-OS`

3. **Instructions (System-Prompt) einfügen**:
   - Da Gems aktuell (Stand 2026) keine separaten Datei-Uploads für die permanente Wissensbasis unterstützen wie ChatGPT oder Claude, müssen wir den Inhalt deiner Kontext-Dateien direkt in die Instructions kopieren.
   - Öffne deine lokalen Dateien (`SOUL.md`, `IDENTITY.md`, `ME.md`, `GOALS.md`, `TASKS.md`) und kopiere ihren Inhalt.
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

--- ENDE KONTEXT ---

Kern-Verhalten:
- Werte-Check: Prüfe jede deiner Antworten gegen meine Werte und roten Linien. Schlage nichts vor, was diesen widerspricht.
- Identitäts-Check: Passe deine Antworten an meinen aktuellen Entwicklungsstand an.
- Thinking Mode: Wenn ich nachdenken will, stelle Fragen. Liefere keine fertigen Lösungen.
- Output: Wenn wir eine Erkenntnis haben, formatiere sie als sauberen Markdown-Codeblock, damit ich sie in mein lokales Dateisystem kopieren kann.
```

4. **Speichern**:
   - Klicke auf Speichern. Das Gem erscheint nun in deiner Seitenleiste.

## Nutzung im Alltag
Starte deine Chats über das `Personal-AI-OS` Gem. Wenn du deine lokalen Markdown-Dateien aktualisierst, musst du daran denken, das Gem zu bearbeiten und den Text in den Instructions entsprechend anzupassen.
