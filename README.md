# Personal-AI-OS

Ein toolunabhängiges, Markdown-basiertes Personal Operating System. Es dient als zentraler Wissensspeicher und als "Arbeitsgedächtnis" für dich und deine KI-Agenten (Manus, OpenAI/ChatGPT, Gemini, Anthropic/Claude, Grok).

Dieses System basiert auf den neuesten Erkenntnissen des Personal Knowledge Managements (PKM), der Kognitionsforschung (Cognitive Offloading) und der PARA-Methode [1] [2]. Es integriert zudem fortschrittliche Konzepte wie **Block-Level Provenance**, **Triage-Filter** und **Memory-Schichten**, inspiriert von Andrej Karpathy, dem Obsilo-Framework und OpenClaw [5] [6] [7].

## Warum dieses System?

Herkömmliche KI-Chats starten immer bei null. Sie kennen deine Projekte, deine Ziele und deine Arbeitsweise nicht. Dieses Personal-AI-OS löst das Problem, indem es eine **permanente Kontext-Schicht** einzieht. 

Egal welche KI du nutzt: Du richtest sie *einmalig* so ein, dass sie dauerhaft auf diesen Ordner zugreift. Sie weiß dann in jedem neuen Chat sofort, wer du bist, woran du arbeitest und wie sie dir helfen kann.

## Die Architektur (PARA + Documents)

Das System ist in sechs Hauptbereiche unterteilt:

1. **`00_Inbox/`**: Der temporäre Sammelpunkt. Hier landen schnelle Notizen, Web-Clippings oder Bilder. Die KI hilft dir später beim Sortieren.
2. **`01_Projects/`**: Aktive Initiativen mit einem klaren Ziel und einer Deadline (z.B. "Website Relaunch").
3. **`02_Areas/`**: Laufende Verantwortungsbereiche ohne Enddatum (z.B. "Gesundheit", "Finanzen", "Marketing").
4. **`03_Resources/`**: Dein Wissensspeicher. Hier liegen destillierte Wissensgraphen, Artikel und Zusammenfassungen.
5. **`04_Archive/`**: Abgeschlossene Projekte und inaktive Notizen. Nichts wird gelöscht, alles bleibt durchsuchbar.
6. **`06_Documents/`**: **READ-ONLY**. Manuell eingepflegtes Spezialwissen (PDFs, Bücher, Studien). Die KI darf hier lesen, aber niemals schreiben.

## Das "Gehirn" anpassen (`05_System/Context/`)

Damit das System für dich arbeitet, musst du diese Dateien initial ausfüllen:

1. **`SOUL.md`**: Deine unveränderlichen Werte, dein Purpose und deine roten Linien. Der Kompass für alle KI-Entscheidungen.
2. **`IDENTITY.md`**: Dein aktuelles Kapitel, deine Stärken, Engpässe und deine Arbeitsweise.
3. **`GOALS.md`**: Was sind deine 1-3 großen Ziele für dieses Quartal?
4. **`TASKS.md`**: Was sind deine absoluten Top-Prioritäten für heute/diese Woche? (Active Memory)

Die Dateien `MEMORY.md` (Langzeitgedächtnis) und `LEARNINGS.md` (Fehler-Log) werden von der KI über die Zeit selbstständig gepflegt.

## KI-Systeme permanent installieren

Im Ordner `05_System/Agents/` findest du detaillierte Schritt-für-Schritt-Anleitungen, wie du das Personal-AI-OS dauerhaft in deiner bevorzugten KI installierst:

- **Manus**: Über die "Projects" Funktion (siehe `Manus_Setup.md`)
- **ChatGPT**: Über einen "Custom GPT" (siehe `ChatGPT_Setup.md`)
- **Claude**: Über "Claude Projects" (siehe `Claude_Setup.md`)
- **Gemini**: Über "Gemini Gems" (siehe `Gemini_Setup.md`)
- **Grok**: Über "Custom Instructions" (siehe `Grok_Setup.md`)

## Die Workflows nutzen
Das System enthält vordefinierte Workflows in `05_System/Workflows/`. Du kannst die KI einfach triggern:

- **"Triage"**: Bevor eine neue Quelle ins System kommt, prüft die KI sie auf Relevanz, Redundanz und Diversität (Schutz vor Vault Bloat).
- **"Destilliere Dokument X"**: Die KI nutzt den Knowledge Distiller, um ein Dokument aus `06_Documents` in einen strukturierten Wissensgraphen in `03_Resources` zu verwandeln.
- **"Lass uns ein Daily Review machen"**: Die KI hilft dir, den Tag zu reflektieren und die Prioritäten für morgen in `TASKS.md` zu schreiben.
- **"Führe eine Weekly Synthesis durch"**: Die KI analysiert deine Woche, erkennt Muster, räumt auf und verschiebt Erkenntnisse ins Langzeitgedächtnis (`MEMORY.md`).
- **"Sei mein Thinking Partner für Thema X"**: Die KI wechselt in einen Modus, in dem sie dir klärende Fragen stellt, statt dir fertige (und oft flache) Lösungen zu präsentieren.

## Wissenschaftlicher Hintergrund

Dieses System nutzt zentrale Konzepte der Kognitionsforschung und des modernen Wissensmanagements:
- **Cognitive Offloading**: Dein Gehirn ist zum Denken da, nicht zum Speichern. Indem du alles in dieses System auslagerst, reduzierst du deinen mentalen Load [3].
- **Block-Level Provenance**: Jede Erkenntnis im System verlinkt exakt auf den Original-Absatz der Quelle. Das verhindert, dass Zusammenfassungsfehler über die Zeit zur "Wahrheit" werden [6].
- **Memory-Schichten**: Trennung zwischen flüchtigem Active Memory (`TASKS.md`) und konsolidiertem Langzeitgedächtnis (`MEMORY.md`), inspiriert von OpenClaw [7].
- **Dialog statt Summary**: Quellen werden nicht einfach blind zusammengefasst, sondern im Dialog mit der KI auf deine spezifischen Projekte hin extrahiert [6].

---

## Quellenverzeichnis

[1] Forte, T. (2022). *Building a Second Brain: A Proven Method to Organize Your Digital Life and Unlock Your Creative Potential*. Atria Books.
[2] Mummentum. (2026). *PersonalOS 1:1*. Abgerufen von https://www.mummentum.de/
[3] Risko, E. F., & Gilbert, S. J. (2016). Cognitive Offloading. *Trends in Cognitive Sciences*, 20(9), 676-688.
[4] Ahrens, S. (2017). *How to Take Smart Notes: One Simple Technique to Boost Writing, Learning and Thinking*. CreateSpace Independent Publishing Platform.
[5] Brier, N. (2025). *Claudesidian: Claude Code + Obsidian Starter Kit*. Abgerufen von https://github.com/heyitsnoah/claudesidian
[6] Obsilo Framework. (2026). *Block-Level Provenance and Triage Systems*.
[7] OpenClaw. (2026). *Memory Systems and Agent Architecture*. Abgerufen von https://github.com/openclaw/openclaw
