# Personal-AI-OS

Ein macOS-first, Markdown-basiertes Personal Operating System mit lokaler Memory-Infrastruktur. Es dient als zentraler Wissensspeicher und als "Arbeitsgedächtnis" für dich und deine KI-Agenten (Manus, OpenAI/ChatGPT, Gemini, Anthropic/Claude, Grok).

Dieses System orientiert sich an Personal Knowledge Management (PKM), Kognitionsforschung (Cognitive Offloading) und der PARA-Methode [1] [2]. Es integriert zudem **Block-Level Provenance**, **Triage-Filter**, **Memory-Schichten** und einen lokalen **Memory-Server** für Suche, Kontext-Snapshots und MCP-Zugriff.

## Warum dieses System?

Herkömmliche KI-Chats starten immer bei null. Sie kennen deine Projekte, deine Ziele und deine Arbeitsweise nicht. Dieses Personal-AI-OS löst das Problem, indem es eine **wiederverwendbare Kontext-Schicht** einzieht.

Je nach Tool passiert das entweder über direkten Zugriff auf diesen Ordner, über den lokalen Memory-Server/MCP oder über regelmäßig aktualisierte Knowledge-Snapshots. Die wichtige Entscheidung: Dein Kontext liegt nicht verstreut in einzelnen Chats, sondern in einer versionierten, wiederverwendbaren Markdown-Struktur.

> **Privacy-Hinweis:** Dieses öffentliche Repository ist ein Template. Echte persönliche Inhalte gehören in ein privates Repo oder einen lokalen verschlüsselten Ordner. Details stehen in `PRIVACY.md`.

## Die Architektur (PARA + Documents)

Das System ist in sieben Bereiche unterteilt:

1. **`00_Inbox/`**: Der temporäre Sammelpunkt. Hier landen schnelle Notizen, Web-Clippings oder Bilder. Die KI hilft dir später beim Sortieren.
2. **`01_Projects/`**: Aktive Initiativen mit einem klaren Ziel und einer Deadline (z.B. "Website Relaunch").
3. **`02_Areas/`**: Laufende Verantwortungsbereiche ohne Enddatum (z.B. "Gesundheit", "Finanzen", "Marketing").
4. **`03_Resources/`**: Dein Wissensspeicher. Hier liegen destillierte Wissensgraphen, Artikel und Zusammenfassungen.
5. **`04_Archive/`**: Abgeschlossene Projekte und inaktive Notizen. Nichts wird gelöscht, alles bleibt durchsuchbar.
6. **`05_System/`**: Systemkontext, Workflows, Templates und Agent-Setup-Anleitungen.
7. **`06_Documents/`**: **READ-ONLY**. Manuell eingepflegtes Spezialwissen (PDFs, Bücher, Studien). Die KI darf hier lesen, aber niemals schreiben.

## Lokale Memory-Infrastruktur

Der Ordner `tools/memory-server/` enthält eine dependency-freie Node.js CLI für macOS:

- lokaler Markdown-Index in `.paios-memory/index.json`,
- HTTP-Server auf `127.0.0.1:47777`,
- MCP-stdio-Server für Tools mit Live-Toolzugriff,
- Snapshot-Export für ChatGPT, Claude, Gemini und Grok,
- defensiver Git-Sync für private Repositories.

Schnellstart:

```bash
node tools/memory-server/bin/paios-memory.js init
node tools/memory-server/bin/paios-memory.js index
node tools/memory-server/bin/paios-memory.js search "aktuelles Ziel"
node tools/memory-server/bin/paios-memory.js context --profile chatgpt --write
node tools/memory-server/bin/paios-memory.js serve
```

Details stehen in `05_System/Memory/README.md`.

## Das "Gehirn" anpassen (`05_System/Context/`)

Damit das System für dich arbeitet, musst du diese Dateien initial ausfüllen:

1. **`SOUL.md`**: Deine unveränderlichen Werte, dein Purpose und deine roten Linien. Der Kompass für alle KI-Entscheidungen.
2. **`IDENTITY.md`**: Dein aktuelles Kapitel, deine Stärken, Engpässe und deine Entwicklungsrichtung.
3. **`ME.md`**: Deine stabileren Arbeitspräferenzen, Prinzipien und dein Tool-Setup.
4. **`GOALS.md`**: Was sind deine 1-3 großen Ziele für dieses Quartal?
5. **`TASKS.md`**: Was sind deine absoluten Top-Prioritäten für heute/diese Woche? (Active Memory)

Die Dateien `MEMORY.md` (Langzeitgedächtnis) und `LEARNINGS.md` (Fehler-Log) werden von der KI über die Zeit selbstständig gepflegt.

## KI-Systeme installieren

Im Ordner `05_System/Agents/` findest du Schritt-für-Schritt-Anleitungen, wie du das Personal-AI-OS in deiner bevorzugten KI nutzt. Wichtig: Bei Tools ohne echten Dateisystem-, MCP- oder API-Zugriff musst du Kontextdateien manuell aktualisieren oder neu hochladen.

- **Manus**: Über die "Projects" Funktion (siehe `Manus_Setup.md`)
- **ChatGPT**: Über einen "Custom GPT" (siehe `ChatGPT_Setup.md`)
- **Claude**: Über "Claude Projects" (siehe `Claude_Setup.md`)
- **Gemini**: Über "Gemini Gems" (siehe `Gemini_Setup.md`)
- **Grok**: Über "Custom Instructions" (siehe `Grok_Setup.md`)

## Public Template vs. privater Arbeitsstand

Dieses Repo ist öffentlich sichtbar und eignet sich als Template, Landingpage und Referenzimplementierung. Für den echten Einsatz solltest du:

1. ein privates Repo erstellen,
2. diese Struktur dorthin kopieren,
3. erst dort persönliche Inhalte eintragen,
4. `.paios-memory/` lokal lassen,
5. vor jedem Push prüfen, ob keine privaten Daten versehentlich öffentlich werden.

## Die Workflows nutzen
Das System enthält vordefinierte Workflows in `05_System/Workflows/`. Du kannst die KI einfach triggern:

- **"Triage"**: Bevor eine neue Quelle ins System kommt, prüft die KI sie auf Relevanz, Redundanz und Diversität (Schutz vor Vault Bloat).
- **"Destilliere Dokument X"**: Die KI nutzt den Knowledge Distiller, um ein Dokument aus `06_Documents` in einen strukturierten Wissensgraphen in `03_Resources` zu verwandeln.
- **"Belege diese Erkenntnis"**: Die KI nutzt den Provenance Standard, damit dauerhaftes Wissen mit Source-ID, Locator, kurzem Beleg und Konfidenz gespeichert wird.
- **"Lass uns ein Daily Review machen"**: Die KI hilft dir, den Tag zu reflektieren und die Prioritäten für morgen in `TASKS.md` zu schreiben.
- **"Führe eine Weekly Synthesis durch"**: Die KI analysiert deine Woche, erkennt Muster, räumt auf und verschiebt Erkenntnisse ins Langzeitgedächtnis (`MEMORY.md`).
- **"Sei mein Thinking Partner für Thema X"**: Die KI wechselt in einen Modus, in dem sie dir klärende Fragen stellt, statt dir fertige (und oft flache) Lösungen zu präsentieren.

## Wissenschaftlicher Hintergrund

Dieses System nutzt zentrale Konzepte der Kognitionsforschung und des modernen Wissensmanagements:
- **Cognitive Offloading**: Dein Gehirn ist zum Denken da, nicht zum Speichern. Indem du alles in dieses System auslagerst, reduzierst du deinen mentalen Load [3].
- **Block-Level Provenance**: Jede Erkenntnis im System bekommt Source-ID, Locator, kurzen Beleg, Konfidenz und Ableitungsart. Das verhindert, dass Zusammenfassungsfehler über die Zeit zur "Wahrheit" werden [6].
- **Memory-Schichten**: Trennung zwischen flüchtigem Active Memory (`TASKS.md`) und konsolidiertem Langzeitgedächtnis (`MEMORY.md`), inspiriert von OpenClaw [7].
- **Memory-Server**: Lokaler macOS-Daemon, der Markdown indiziert, Live-Suche anbietet und MCP-Tools bereitstellt.
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

## Lizenz

MIT. Siehe `LICENSE`.
