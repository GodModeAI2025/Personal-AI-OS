# Agenten-Anweisungen (Multi-KI Setup)

Dieses Verzeichnis enthält spezifische Hinweise, wie du dein Personal-AI-OS mit den verschiedenen KI-Systemen verbindest. Das Grundprinzip ist bei allen identisch: Du gibst der KI Zugriff auf die Dateien in diesem Ordner, damit sie deinen Kontext kennt.

## Übersicht: So verbindest du jede KI

| KI-System | Methode | Kontext-Dateien |
|---|---|---|
| **Manus** | Manus hat direkten Dateizugriff. Starte Manus einfach im `Personal-AI-OS/`-Ordner oder lade die Dateien als Projektdateien hoch. | Alle Dateien automatisch verfügbar |
| **ChatGPT (OpenAI)** | Erstelle einen Custom GPT und lade `SYSTEM_PROMPT.md` + `05_System/Context/` als Knowledge Base hoch. Alternativ: Dateien per Chat-Upload. | SYSTEM_PROMPT.md, ME.md, GOALS.md, TASKS.md |
| **Claude (Anthropic)** | Erstelle ein Claude Project und füge die System-Dateien als Project Knowledge hinzu. Oder nutze Claude Code im Projektordner. | SYSTEM_PROMPT.md, ME.md, GOALS.md, TASKS.md |
| **Gemini (Google)** | Lade die Dateien in Google AI Studio hoch oder nutze sie als System Instructions. Bei Gemini Advanced: Dateien per Chat-Upload. | SYSTEM_PROMPT.md, ME.md, GOALS.md, TASKS.md |
| **Grok (xAI)** | Lade die relevanten Kontext-Dateien per Chat-Upload hoch. | SYSTEM_PROMPT.md, ME.md, GOALS.md, TASKS.md |

## Wichtig: KI-Ergebnisse zurückspeichern

Damit dein System wächst, sollte jede KI ihre Ergebnisse als Markdown-Datei zurück in das System speichern. Bei KIs mit Dateizugriff (Manus, Claude Code, Cursor) passiert das automatisch. Bei Chat-basierten KIs (ChatGPT, Gemini, Grok) kopierst du die relevanten Outputs manuell als `.md`-Datei in den passenden Ordner (meistens `00_Inbox/` oder direkt in `01_Projects/`).

## Tipp: Der "Kontext-Sandwich"

Wenn du eine KI ohne direkten Dateizugriff nutzt, verwende den "Kontext-Sandwich":

1. **Oben**: Lade `SYSTEM_PROMPT.md` hoch (oder kopiere den Inhalt als erste Nachricht).
2. **Mitte**: Lade die projektspezifischen Dateien hoch (z.B. das Projekt-Markdown aus `01_Projects/`).
3. **Unten**: Stelle deine eigentliche Frage oder Aufgabe.

So hat die KI den vollen Kontext, ohne dass du alles neu erklären musst.
