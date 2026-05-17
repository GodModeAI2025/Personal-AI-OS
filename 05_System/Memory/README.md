# Memory-Infrastruktur

Diese Memory-Schicht macht aus dem Markdown-System eine lokal laufende Infrastruktur. Sie ist bewusst **macOS-first** gebaut, weil der Server rekursive Datei-Watcher und `launchd` nutzt.

## Zielbild

```text
Private Personal-AI-OS Kopie
  -> Markdown-Dateien
  -> .paios-memory/index.json
  -> lokaler HTTP-Server auf 127.0.0.1:47777
  -> MCP-Server via stdio
  -> ChatGPT / Claude / Gemini / Grok je nach Tool-Faehigkeit
```

Wichtig: Echte Live-Erinnerung funktioniert nur dort, wo das jeweilige KI-Tool einen Live-Connector, MCP, API-Zugriff oder eine vergleichbare Tool-Schnittstelle ausfuehren kann. Wenn ein Consumer-Tool nur Knowledge-Uploads oder Custom Instructions anbietet, erzeugt die Infrastruktur stattdessen aktuelle Snapshots.

## Komponenten

- `tools/memory-server/`: dependency-freier Node.js Server und CLI.
- `.paios-memory/index.json`: lokaler Suchindex. Wird nicht committet.
- `.paios-memory/snapshots/`: generierte Kontext-Snapshots fuer Tools ohne Live-Zugriff.
- `.paios-memory/connectors/`: lokale MCP-Konfigurationssnippets.
- `05_System/Context/MEMORY.md`: konsolidiertes Langzeitgedaechtnis.
- `05_System/Context/LEARNINGS.md`: Korrekturen und Fehler, die nicht wiederholt werden sollen.
- `05_System/Context/DECISIONS.md`: stabile Entscheidungen.

## Schnellstart

```bash
node tools/memory-server/bin/paios-memory.js init
node tools/memory-server/bin/paios-memory.js index
node tools/memory-server/bin/paios-memory.js search "aktuelles Ziel"
node tools/memory-server/bin/paios-memory.js context --profile chatgpt --write
node tools/memory-server/bin/paios-memory.js serve
```

Der HTTP-Server laeuft lokal auf:

```text
http://127.0.0.1:47777
```

Wichtige Endpunkte:

- `GET /health`
- `GET /search?q=...`
- `GET /context?profile=chatgpt&q=...`
- `POST /remember`
- `POST /reindex`

## MCP-Server

Fuer Tools mit MCP-Unterstuetzung wird kein separater HTTP-Daemon benoetigt. Das Tool startet den Server ueber stdio:

```bash
node tools/memory-server/bin/paios-memory.js mcp
```

Verfuegbare MCP-Tools:

- `memory_search`: lokale Memory-Suche.
- `memory_context`: baut einen kontextoptimierten Snapshot.
- `memory_remember`: schreibt bestaetigte Fakten, Praeferenzen, Muster, Entscheidungen oder Learnings.
- `memory_reindex`: baut den lokalen Index neu.
- `memory_status`: zeigt Index-Status.

Die Implementierung folgt der MCP-Basis als JSON-RPC-Protokoll und der stdio-Transportvorgabe mit newline-delimited Nachrichten:

- https://modelcontextprotocol.io/specification/2025-11-25/basic
- https://modelcontextprotocol.io/specification/2025-11-25/basic/transports
- https://modelcontextprotocol.io/specification/2025-11-25/server/tools

Nach `init` liegt ein MCP-Snippet unter:

```text
.paios-memory/connectors/mcp-client-snippet.json
```

## macOS LaunchAgent

Wenn der HTTP-Server dauerhaft im Hintergrund laufen soll:

```bash
node tools/memory-server/bin/paios-memory.js install-launch-agent
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.personal-ai-os.memory.plist
```

Stoppen:

```bash
launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/com.personal-ai-os.memory.plist
```

Logs liegen in:

```text
.paios-memory/launchd.out.log
.paios-memory/launchd.err.log
```

## Git-Sync

Git-Sync ist absichtlich defensiv. Gegen das oeffentliche Template-Repo verweigert `paios-memory sync` Push/Pull, solange nicht explizit `--allow-public` gesetzt ist. Push mit echten Memory-Inhalten braucht zusaetzlich `--confirm-private` oder `sync.privateRemoteConfirmed=true` in `.paios-memory/config.json`.

```bash
node tools/memory-server/bin/paios-memory.js sync
node tools/memory-server/bin/paios-memory.js sync --push --confirm-private
```

Beim bestaetigten Push nutzt der Sync `git add -f` fuer die Arbeitsordner, weil das oeffentliche Template echte Inhalte standardmaessig ignoriert.

## Tool-Matrix

| Tool | Live-Memory | Empfohlene Nutzung |
| --- | --- | --- |
| Claude Desktop / Claude Code | Ja, wenn MCP konfiguriert ist | MCP-Snippet nutzen |
| Codex / lokale Agenten | Ja, wenn MCP oder Terminal-Zugriff verfuegbar ist | MCP oder CLI nutzen |
| ChatGPT | Nur mit Live-Connector/API; sonst Snapshot | `context --profile chatgpt --write` |
| Gemini | Nur mit Live-Connector/API; sonst Snapshot | `context --profile gemini --write` |
| Grok | Nur mit Live-Connector/API; sonst Snapshot | `context --profile grok --write` |

## Sicherheitsregel

Dieses oeffentliche Repo ist ein Template. Die Memory-Infrastruktur darf private Inhalte indizieren, aber `.paios-memory/` und echte Arbeitsdaten duerfen nicht in dieses oeffentliche Repository gepusht werden.
