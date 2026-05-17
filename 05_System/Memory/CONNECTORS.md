# KI-Connector-Guide

Stand: 2026-05-17

Dieses Dokument erklärt, wie ChatGPT, Claude, Gemini, Grok, Codex und lokale Agenten mit dem Personal-AI-OS Memory-Server verbunden werden können.

## Grundprinzip

Es gibt drei Integrationsstufen:

| Stufe | Bedeutung | Geeignet für |
| --- | --- | --- |
| Live per MCP | Das KI-Tool startet den Memory-Server als Tool-Prozess und ruft `memory_search`, `memory_context` oder `memory_remember` auf. | Claude Desktop, Claude Code, Codex, lokale Agenten |
| Live per HTTP/API | Eine private API oder ein Gateway ruft `127.0.0.1:47777` oder einen geschützten Remote-Bridge-Service auf. | Custom Apps, GPT Actions, eigene Agenten |
| Snapshot | Ein Markdown-Kontext wird exportiert und manuell hochgeladen oder eingefügt. | Tools ohne Live-Schnittstelle |

Wenn ein Tool keinen Live-Zugriff erlaubt, ist Snapshot die korrekte Lösung. Das ist kein Fehler der Memory-Infrastruktur.

## Claude mit MCP

### 1. Snippet erzeugen

```bash
node tools/memory-server/bin/paios-memory.js init
```

Danach liegt diese Datei vor:

```text
.paios-memory/connectors/mcp-client-snippet.json
```

Beispiel:

```json
{
  "mcpServers": {
    "personal-ai-os-memory": {
      "command": "/absolute/path/to/node",
      "args": [
        "/absolute/path/to/tools/memory-server/bin/paios-memory.js",
        "mcp",
        "--root",
        "/absolute/path/to/Personal-AI-OS"
      ]
    }
  }
}
```

### 2. In MCP-Client übernehmen

Übernimm den Block in die MCP-Konfiguration deines Clients. Bei Desktop-Apps liegt diese Konfiguration oft in einem app-spezifischen Ordner unter `~/Library/Application Support/`.

### 3. Client neu starten

Nach dem Neustart sollten diese Tools sichtbar sein:

- `memory_search`
- `memory_context`
- `memory_remember`
- `memory_reindex`
- `memory_status`

### 4. Testprompt

```text
Nutze memory_status und sage mir, wie viele Dateien und Chunks mein Personal-AI-OS aktuell indexiert.
```

Wenn das funktioniert, ist Live-Memory aktiv.

## Codex und lokale Agenten

Lokale Agenten können direkt CLI, HTTP oder MCP nutzen.

CLI:

```bash
node tools/memory-server/bin/paios-memory.js search "Projekt Priorität"
```

HTTP:

```bash
node tools/memory-server/bin/paios-memory.js serve
curl "http://127.0.0.1:47777/search?q=Projekt%20Priorität"
```

MCP:

```bash
node tools/memory-server/bin/paios-memory.js mcp
```

Für Codex-ähnliche Agenten ist MCP meist die sauberste Lösung, weil das Tool selbst entscheiden kann, wann Suche, Kontext oder Schreiben nötig ist.

## ChatGPT

OpenAI bezeichnet frühere "Connectors" inzwischen als Apps. Offizielle ChatGPT Apps können externe Tools und Daten anbinden; Custom Apps können über MCP gebaut werden. Custom GPTs können außerdem Knowledge-Dateien und Actions nutzen.

Wichtige Konsequenz:

- Ein normaler Custom GPT mit hochgeladenem Knowledge ist ein Snapshot.
- Echte Live-Anbindung braucht eine App/Custom App, eine Action oder eine andere genehmigte Live-Schnittstelle.
- ChatGPT kann deinen lokalen `127.0.0.1` Server aus der Cloud nicht direkt erreichen.

Offizielle OpenAI-Dokumentation:

- https://help.openai.com/en/articles/11487775/
- https://help.openai.com/en/articles/9442513-gpt-actions-domain-settings-chatgpt-enterprise
- https://platform.openai.com/docs/actions/introduction/what-is-a-gpt

### Snapshot-Variante

```bash
node tools/memory-server/bin/paios-memory.js context --profile chatgpt --write
```

Dann die Datei aus `.paios-memory/snapshots/chatgpt.md` im Custom GPT Knowledge-Bereich hochladen oder in Instructions einfügen.

Vorteil:

- einfach,
- sicher,
- keine öffentliche API nötig.

Nachteil:

- nicht live,
- nach Änderungen neu exportieren.

### Live-Variante über GPT Action oder Custom App

Für echten Live-Zugriff brauchst du eine HTTPS-erreichbare, private und authentifizierte Bridge. Diese Bridge kann intern den lokalen Memory-Server ansprechen oder in einer privaten Serverumgebung denselben Index anbieten.

Minimaler Ablauf:

1. Memory-Server lokal oder privat starten.
2. Private HTTPS-Bridge mit Authentifizierung bereitstellen.
3. Nur notwendige Endpunkte freigeben: Suche, Kontext, optional Schreiben.
4. In ChatGPT Action oder Custom App einbinden.
5. Schreiboperationen nur mit expliziter Bestätigung erlauben.

Beispielhafte Action-Endpunkte:

```yaml
openapi: 3.1.0
info:
  title: Personal-AI-OS Memory
  version: 0.1.0
servers:
  - url: https://memory.example.com
paths:
  /search:
    get:
      operationId: searchMemory
      parameters:
        - name: q
          in: query
          required: true
          schema:
            type: string
        - name: limit
          in: query
          required: false
          schema:
            type: integer
      responses:
        "200":
          description: Search results
  /context:
    get:
      operationId: buildContext
      parameters:
        - name: profile
          in: query
          required: false
          schema:
            type: string
        - name: q
          in: query
          required: false
          schema:
            type: string
      responses:
        "200":
          description: Markdown context
```

Schreiboperationen wie `/remember` sollten erst später und nur mit starker Authentifizierung aktiviert werden.

## Gemini

Wenn Gemini in deinem Setup Live-Tools, Extensions, API-Tools oder eine eigene App-Schicht nutzen kann, verwende eine private HTTP/API-Bridge.

Wenn nicht, nutze Snapshots:

```bash
node tools/memory-server/bin/paios-memory.js context --profile gemini --write
```

Dann den Inhalt aus `.paios-memory/snapshots/gemini.md` im Gem oder Projektkontext hinterlegen.

## Grok

Wenn Grok keinen Live-Connector oder keine private API-Anbindung für deinen Workspace bietet, nutze Custom Instructions oder Projektwissen als Snapshot.

```bash
node tools/memory-server/bin/paios-memory.js context --profile grok --write
```

Für knappe Custom Instructions ist das Grok-Profil bewusst kleiner als Claude oder Default.

## Manus

Manus kann als Projekt-Snapshot oder, falls Terminal-/Dateizugriff vorhanden ist, direkt mit der CLI arbeiten.

Snapshot:

```bash
node tools/memory-server/bin/paios-memory.js context --profile default --write
```

Live über CLI:

```bash
node tools/memory-server/bin/paios-memory.js search "aktueller Engpass"
node tools/memory-server/bin/paios-memory.js remember "..." --type learning
```

## Sicherheitsregeln für alle Connectoren

- Keine echte Memory-Bridge ohne Authentifizierung ins Internet stellen.
- `memory_remember` nie ohne explizite Nutzerbestätigung automatisch aufrufen.
- Schreibzugriff getrennt von Suchzugriff behandeln.
- Keine `.paios-memory/` Dateien in öffentliche Repos pushen.
- Vor jeder Live-Integration prüfen, welche Daten das jeweilige Tool sehen darf.
- Snapshots regelmäßig erneuern und alte Snapshots löschen, wenn sie private Inhalte enthalten.

## Empfohlene Praxis

| Situation | Empfehlung |
| --- | --- |
| Lokale Entwicklung | MCP oder CLI |
| Claude Desktop/Code | MCP |
| ChatGPT ohne Custom App | Snapshot |
| ChatGPT mit Custom App/API | Private HTTPS-Bridge |
| Gemini/Grok ohne Live-Tools | Snapshot |
| Produktiver Dauerbetrieb | `launchd` + private Git-Kopie + regelmäßige Snapshots |

## Testprompts

Für MCP:

```text
Nutze memory_search für "meine aktuellen Ziele" und fasse die drei relevantesten Treffer zusammen.
```

Für Snapshot-Tools:

```text
Nutze den hochgeladenen Personal-AI-OS Snapshot als primären Kontext. Wenn etwas fehlt, sag explizit, welche Datei oder welchen Abschnitt ich aktualisieren soll.
```

Für Schreibzugriff:

```text
Wenn du eine dauerhafte Erinnerung speichern willst, formuliere zuerst den Memory-Eintrag und frage mich nach Bestätigung. Erst danach darfst du memory_remember nutzen.
```
