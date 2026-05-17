# Personal-AI-OS

Ein toolunabhängiges, Markdown-basiertes Personal Operating System. Es dient als zentraler Wissensspeicher und als "Arbeitsgedächtnis" für dich und deine KI-Agenten (Manus, OpenAI/ChatGPT, Gemini, Anthropic/Claude, Grok).

Dieses System basiert auf den neuesten Erkenntnissen des Personal Knowledge Managements (PKM), der Kognitionsforschung (Cognitive Offloading) und der PARA-Methode [1] [2].

## Warum dieses System?

Herkömmliche KI-Chats starten immer bei null. Sie kennen deine Projekte, deine Ziele und deine Arbeitsweise nicht. Dieses Personal-AI-OS löst das Problem, indem es eine **Kontext-Schicht** einzieht. 

Egal welche KI du nutzt: Du gibst ihr Zugriff auf diesen Ordner (per Upload, Cursor, Claude Code oder Manus), und sie weiß sofort, wer du bist, woran du arbeitest und wie sie dir helfen kann.

## Die Architektur (PARA-Methode)

Das System ist in fünf Hauptbereiche unterteilt:

1. **`00_Inbox/`**: Der temporäre Sammelpunkt. Hier landen schnelle Notizen, Web-Clippings, heruntergeladene PDFs oder Bilder. Die KI hilft dir später beim Sortieren.
2. **`01_Projects/`**: Aktive Initiativen mit einem klaren Ziel und einer Deadline (z.B. "Website Relaunch").
3. **`02_Areas/`**: Laufende Verantwortungsbereiche ohne Enddatum (z.B. "Gesundheit", "Finanzen", "Marketing").
4. **`03_Resources/`**: Dein Wissensspeicher. Hier liegen Studien, Artikel, Referenzmaterialien und Zusammenfassungen.
5. **`04_Archive/`**: Abgeschlossene Projekte und inaktive Notizen. Nichts wird gelöscht, alles bleibt durchsuchbar.
6. **`05_System/`**: Das "Gehirn" des OS. Hier liegen deine Ziele, deine Präferenzen und die Anweisungen für die KI.

## Wie du mit der KI arbeitest

### 1. Der Start (System Prompt)
Wenn du einen neuen Chat mit einer KI beginnst (z.B. in ChatGPT, Claude oder Grok), lade die Datei `SYSTEM_PROMPT.md` sowie den Ordner `05_System/Context/` hoch. 
*Hinweis: Wenn du Tools wie Manus, Cursor oder Claude Code nutzt, die direkt auf dein Dateisystem zugreifen, reicht es, sie im Hauptordner zu starten.*

### 2. Manuelle Integration & KI-Speicherung
- **Manuell**: Du kannst jederzeit PDFs, Bilder, Word-Dokumente oder eigene Textdateien in die Ordner (meistens `00_Inbox` oder `03_Resources`) ziehen. Die KI liest sie automatisch mit.
- **KI-Speicherung**: Wenn die KI eine gute Zusammenfassung geschrieben oder ein Problem gelöst hat, weise sie an: *"Speichere das als Markdown-Datei im Projekt X"*. So wächst dein Wissen kontinuierlich.

### 3. Die Workflows nutzen
Das System enthält vordefinierte Workflows in `05_System/Workflows/`. Du kannst die KI einfach triggern:

- **"Lass uns ein Daily Review machen"**: Die KI hilft dir, den Tag zu reflektieren und die Prioritäten für morgen in `TASKS.md` zu schreiben.
- **"Führe eine Weekly Synthesis durch"**: Die KI analysiert deine Woche, erkennt Muster und hilft dir beim Aufräumen.
- **"Sei mein Thinking Partner für Thema X"**: Die KI wechselt in einen Modus, in dem sie dir klärende Fragen stellt, statt dir fertige (und oft flache) Lösungen zu präsentieren.
- **"Process my Inbox"**: Die KI liest alle neuen Dateien in der Inbox und schlägt vor, wo sie einsortiert werden sollen.

## Das "Gehirn" anpassen (`05_System/Context/`)

Damit das System für dich arbeitet, musst du drei Dateien initial ausfüllen:

1. **`ME.md`**: Wer bist du? Wie arbeitest du am besten? Was sind deine Stärken und Schwächen?
2. **`GOALS.md`**: Was sind deine 1-3 großen Ziele für dieses Quartal?
3. **`TASKS.md`**: Was sind deine absoluten Top-Prioritäten für heute/diese Woche? (Maximal 3 aktive Tasks).

## Wissenschaftlicher Hintergrund

Dieses System nutzt drei zentrale Konzepte der Kognitionsforschung:
- **Cognitive Offloading**: Dein Gehirn ist zum Denken da, nicht zum Speichern. Indem du alles in dieses System auslagerst, reduzierst du deinen mentalen Load [3].
- **Networked Thinking**: Durch das Verlinken von Notizen (siehe `Resource_Template.md`) entstehen neue Ideenverbindungen, ähnlich einem Zettelkasten [4].
- **Single Source of Truth**: Statt Wissen über Notion, Apple Notes, E-Mails und ChatGPT-Verläufe zu verstreuen, liegt alles als zukunftssicheres Markdown an einem Ort.

---

## Quellenverzeichnis

[1] Forte, T. (2022). *Building a Second Brain: A Proven Method to Organize Your Digital Life and Unlock Your Creative Potential*. Atria Books.
[2] Mummentum. (2026). *PersonalOS 1:1*. Abgerufen von https://www.mummentum.de/
[3] Risko, E. F., & Gilbert, S. J. (2016). Cognitive Offloading. *Trends in Cognitive Sciences*, 20(9), 676-688.
[4] Ahrens, S. (2017). *How to Take Smart Notes: One Simple Technique to Boost Writing, Learning and Thinking*. CreateSpace Independent Publishing Platform.
[5] Brier, N. (2025). *Claudesidian: Claude Code + Obsidian Starter Kit*. Abgerufen von https://github.com/heyitsnoah/claudesidian
