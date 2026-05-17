# Technische Referenz: Memory-Server

Stand: 2026-05-17

Diese Referenz beschreibt CLI, Konfiguration, Index, HTTP-API, MCP-Tools, Git-Sync und Betriebsmodell des Personal-AI-OS Memory-Servers.

## Speicherorte

| Pfad | Zweck | Git |
| --- | --- | --- |
| `tools/memory-server/` | Server, CLI, Tests | versioniert |
| `05_System/Memory/` | Nutzungsdokumentation | versioniert |
| `.paios-memory/config.json` | lokale Konfiguration | ignoriert |
| `.paios-memory/index.json` | lokaler Index | ignoriert |
| `.paios-memory/snapshots/` | exportierte Snapshots | ignoriert |
| `.paios-memory/connectors/` | lokale Connector-Snippets | ignoriert |
| `.paios-memory/*.log` | lokale Logs | ignoriert |

## CLI

Alle Befehle werden aus dem Repository-Root ausgeführt:

```bash
node tools/memory-server/bin/paios-memory.js <command>
```

### `init`

Erzeugt lokale Runtime-Dateien.

```bash
node tools/memory-server/bin/paios-memory.js init
```

Schreibt:

- `.paios-memory/config.json`
- `.paios-memory/connectors/mcp-client-snippet.json`

### `doctor`

Diagnose:

```bash
node tools/memory-server/bin/paios-memory.js doctor
```

Ausgabe enthält:

- macOS-Status,
- Node-Version,
- Vault-Pfad,
- Public-Template-Remote,
- Indexgröße,
- HTTP-Adresse,
- State-Pfad.

### `index`

Baut den Index neu:

```bash
node tools/memory-server/bin/paios-memory.js index
```

### `search`

Sucht im Index:

```bash
node tools/memory-server/bin/paios-memory.js search "Suchbegriff"
node tools/memory-server/bin/paios-memory.js search "Suchbegriff" --limit 10
node tools/memory-server/bin/paios-memory.js search "Suchbegriff" --json
```

### `context`

Erzeugt einen Kontext-Snapshot:

```bash
node tools/memory-server/bin/paios-memory.js context --profile chatgpt
node tools/memory-server/bin/paios-memory.js context --profile claude --query "Projekt X"
node tools/memory-server/bin/paios-memory.js context --profile grok --write
```

Profile:

- `default`
- `chatgpt`
- `claude`
- `gemini`
- `grok`

### `remember`

Schreibt einen Memory-Eintrag:

```bash
node tools/memory-server/bin/paios-memory.js remember "Text" \
  --type fact \
  --confidence Medium \
  --source "Quelle" \
  --evidence "Beleg"
```

Typen:

- `fact`
- `preference`
- `pattern`
- `decision`
- `learning`

Ziel-Dateien:

| Type | Ziel |
| --- | --- |
| `fact` | `05_System/Context/MEMORY.md` |
| `preference` | `05_System/Context/MEMORY.md` |
| `pattern` | `05_System/Context/MEMORY.md` |
| `decision` | `05_System/Context/DECISIONS.md` |
| `learning` | `05_System/Context/LEARNINGS.md` |

### `serve`

Startet den lokalen HTTP-Server:

```bash
node tools/memory-server/bin/paios-memory.js serve
node tools/memory-server/bin/paios-memory.js serve --port 47778
```

Standard:

```text
127.0.0.1:47777
```

### `mcp`

Startet den MCP-Server über stdio:

```bash
node tools/memory-server/bin/paios-memory.js mcp
```

### `sync`

Git-Sync:

```bash
node tools/memory-server/bin/paios-memory.js sync
node tools/memory-server/bin/paios-memory.js sync --push --confirm-private
```

Public-Template-Remote wird standardmäßig blockiert.

### `install-launch-agent`

Erzeugt einen macOS LaunchAgent:

```bash
node tools/memory-server/bin/paios-memory.js install-launch-agent
```

Starten:

```bash
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.personal-ai-os.memory.plist
```

## Konfiguration

Standard-Konfiguration:

```json
{
  "schemaVersion": 1,
  "stateDir": ".paios-memory",
  "port": 47777,
  "bindHost": "127.0.0.1",
  "includeDirs": [
    "00_Inbox",
    "01_Projects",
    "02_Areas",
    "03_Resources",
    "04_Archive",
    "05_System/Context",
    "05_System/Templates",
    "05_System/Workflows"
  ],
  "maxFileBytes": 1048576,
  "chunkMaxChars": 2800,
  "chunkOverlapChars": 300,
  "sync": {
    "enabled": false,
    "pullBeforeIndex": true,
    "pushAfterRemember": false,
    "refusePublicRemote": true,
    "privateRemoteConfirmed": false
  }
}
```

Wichtige Felder:

- `includeDirs`: Ordner, die indiziert werden.
- `contextFiles`: Dateien, die immer in Snapshots erscheinen.
- `maxFileBytes`: Maximalgröße pro Markdown-Datei.
- `chunkMaxChars`: maximale Chunk-Länge.
- `chunkOverlapChars`: Überlappung bei langen Sektionen.
- `snapshots.profiles`: Größenlimits pro Tool.
- `sync.privateRemoteConfirmed`: dauerhafte Bestätigung, dass der Remote privat ist.

## Indexmodell

Der Index ist eine JSON-Datei:

```text
.paios-memory/index.json
```

Index-Eintrag:

```json
{
  "id": "a94464e31adc9f55",
  "path": "05_System/Context/MEMORY.md",
  "title": "Memory",
  "heading": "Fakten",
  "lineStart": 1,
  "lineEnd": 10,
  "text": "...",
  "tokens": ["memory", "fakten"],
  "modifiedAt": "2026-05-17T19:18:35.321Z",
  "fileHash": "..."
}
```

Chunking:

- Markdown wird an Überschriften der Ebenen `#`, `##`, `###` geschnitten.
- Lange Sektionen werden in überlappende Chunks geteilt.
- Line-Nummern bleiben erhalten, damit Treffer rückverfolgbar sind.

Scoring:

- exakte Phrasen in Text, Heading oder Titel zählen stärker,
- Treffer im Titel und Heading zählen stärker als normale Texttreffer,
- höhere Term-Abdeckung erhöht den Score,
- Ergebnisliste wird nach Score und Pfad sortiert.

## HTTP-API

Server starten:

```bash
node tools/memory-server/bin/paios-memory.js serve
```

### `GET /health`

```bash
curl http://127.0.0.1:47777/health
```

Antwort:

```json
{
  "ok": true,
  "root": "/path/to/Personal-AI-OS",
  "generatedAt": "2026-05-17T19:18:35.321Z",
  "stats": {
    "fileCount": 27,
    "chunkCount": 167
  }
}
```

### `GET /search`

```bash
curl "http://127.0.0.1:47777/search?q=Memory&limit=3"
```

Query-Parameter:

- `q` oder `query`: Suchbegriff.
- `limit`: Anzahl Treffer.

### `GET /context`

```bash
curl "http://127.0.0.1:47777/context?profile=chatgpt&q=Projekt"
```

Query-Parameter:

- `profile`: `default`, `chatgpt`, `claude`, `gemini`, `grok`.
- `q` oder `query`: optionaler Suchbegriff.
- `limit`: Anzahl relevanter Treffer.

Antwort ist Markdown.

### `POST /remember`

```bash
curl -X POST http://127.0.0.1:47777/remember \
  -H "content-type: application/json" \
  -d '{
    "text": "Nutzer bevorzugt direkte Antworten.",
    "type": "preference",
    "confidence": "High",
    "source": "direktes Nutzerfeedback",
    "evidence": "Nutzer bat wiederholt um knappe Antworten."
  }'
```

Schreibt in `MEMORY.md`, `DECISIONS.md` oder `LEARNINGS.md` und reindiziert danach.

### `POST /reindex`

```bash
curl -X POST http://127.0.0.1:47777/reindex
```

Baut den Index neu.

## MCP-Server

Transport:

- JSON-RPC 2.0
- stdio
- newline-delimited JSON

Start:

```bash
node tools/memory-server/bin/paios-memory.js mcp
```

### Initialisierung

Request:

```json
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}
```

Response:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-11-25",
    "capabilities": {
      "tools": {
        "listChanged": false
      }
    },
    "serverInfo": {
      "name": "personal-ai-os-memory",
      "version": "0.1.0"
    }
  }
}
```

### Tools

#### `memory_search`

Input:

```json
{
  "query": "aktuelles Ziel",
  "limit": 5
}
```

#### `memory_context`

Input:

```json
{
  "profile": "claude",
  "query": "Projekt X",
  "limit": 8
}
```

#### `memory_remember`

Input:

```json
{
  "text": "Nutzer bevorzugt lokale, private Memory-Infrastruktur.",
  "type": "preference",
  "confidence": "High",
  "source": "direktes Nutzerfeedback",
  "evidence": "Nutzer bat um macOS-only lokalen Server."
}
```

#### `memory_reindex`

Input:

```json
{}
```

#### `memory_status`

Input:

```json
{}
```

## Security-Modell

Der Server ist lokal gebunden:

```text
127.0.0.1
```

Das schützt gegen direkte externe Zugriffe. Sobald du eine HTTPS-Bridge baust, brauchst du zusätzlich:

- Authentifizierung,
- TLS,
- Rate-Limits,
- Logging,
- getrennte Leserechte und Schreibrechte,
- Bestätigung vor `remember`,
- keine öffentlichen Snapshots.

## Git-Sync-Logik

Der Sync blockiert das öffentliche Template:

```text
github.com/GodModeAI2025/Personal-AI-OS
```

Push mit privaten Inhalten erfordert:

```bash
--confirm-private
```

oder:

```json
{
  "sync": {
    "privateRemoteConfirmed": true
  }
}
```

Beim Push nutzt der Sync:

```bash
git add -f 05_System/Context 00_Inbox 01_Projects 02_Areas 03_Resources 04_Archive
```

Grund: Das öffentliche Template ignoriert echte Arbeitsdaten per `.gitignore`; private Kopien müssen diese Inhalte bewusst versionieren können.

## Tests

```bash
cd tools/memory-server
npm test
```

Der Test prüft:

- Markdown-Indexierung,
- Suche,
- Kontext-Snapshot,
- `remember`.

## Bekannte Grenzen

- Keine semantischen Embeddings.
- Keine Authentifizierung im lokalen HTTP-Server.
- Kein Windows/Linux-Daemon.
- Keine automatische Cloud-Synchronisierung in Consumer-Tools ohne Live-Schnittstelle.
- Kein UI für Memory-Review.

## Erweiterungspunkte

- `lib/search.js`: Scoring oder Embedding-Suche.
- `lib/context.js`: Snapshot-Profile.
- `lib/mcp-server.js`: weitere MCP-Tools.
- `lib/http-server.js`: zusätzliche API-Endpunkte.
- `lib/git-sync.js`: Team- oder Multi-Remote-Sync.
