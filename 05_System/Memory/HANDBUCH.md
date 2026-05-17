# Personal-AI-OS Memory-Handbuch

Stand: 2026-05-17

Dieses Handbuch erklärt, wie du die lokale Memory-Infrastruktur praktisch benutzt. Es ist für den echten Arbeitsstand gedacht, also für eine **private Kopie** dieses Repositories, nicht für das öffentliche Template.

## Was das System leisten soll

Das Personal-AI-OS trennt drei Dinge sauber voneinander:

1. **Quelle der Wahrheit**: Deine Markdown-Dateien im Personal-AI-OS.
2. **Lokaler Zugriff**: Der Memory-Server indiziert diese Dateien und macht sie durchsuchbar.
3. **KI-Anbindung**: KI-Tools greifen entweder live per MCP/API zu oder bekommen aktuelle Snapshots.

Das Ziel ist nicht, dass ChatGPT, Claude, Gemini oder Grok magisch dieselbe interne Erinnerung teilen. Das Ziel ist, dass alle Tools auf dieselbe externe, versionierte Memory-Schicht zugreifen oder daraus regelmäßig aktualisierte Snapshots erhalten.

## Was das System nicht verspricht

- Kein Consumer-KI-Tool wird gezwungen, dauerhaft intern alles zu behalten.
- Tools ohne Live-Schnittstelle bekommen keinen echten Live-Sync, sondern Snapshots.
- Das öffentliche GitHub-Repository darf keine echten persönlichen Inhalte enthalten.
- Der lokale Suchindex ist aktuell lexikalisch, nicht semantisch per Embeddings.
- Der Memory-Server ist macOS-first und nutzt macOS-nahe Funktionen wie rekursives File-Watching und `launchd`.

## Voraussetzungen

- macOS.
- Node.js 20 oder neuer.
- Git.
- Eine private Arbeitskopie für echte persönliche Inhalte.
- Optional: ein KI-Tool mit MCP-Unterstützung oder eine eigene API-/Connector-Schicht.

Prüfen:

```bash
node --version
git --version
```

## Empfohlener Aufbau

```text
Öffentliches Template
  GodModeAI2025/Personal-AI-OS
        |
        | kopieren oder als Vorlage nutzen
        v
Privates Personal-AI-OS Repo
  echte Inhalte in 00_Inbox, 01_Projects, 02_Areas, 03_Resources, 05_System/Context
        |
        v
Lokale Memory-Infrastruktur
  .paios-memory/index.json
  .paios-memory/snapshots/
  .paios-memory/connectors/
        |
        v
KI-Tools
  MCP live, HTTP live, API live oder Snapshot
```

## Erste Einrichtung

### 1. Private Arbeitskopie vorbereiten

Wenn du echte persönliche Daten speichern willst, nutze ein privates Repository oder einen lokalen verschlüsselten Ordner.

```bash
git clone <dein-privates-repo> Personal-AI-OS-private
cd Personal-AI-OS-private
```

Wenn du direkt aus diesem Template startest, kopiere die Struktur zuerst in ein privates Ziel.

### 2. Kernkontext ausfüllen

Bearbeite zuerst diese Dateien:

- `05_System/Context/SOUL.md`
- `05_System/Context/IDENTITY.md`
- `05_System/Context/ME.md`
- `05_System/Context/GOALS.md`
- `05_System/Context/TASKS.md`
- `05_System/Context/STANDARDS.md`
- `05_System/Context/HYGIENE.md`

`MEMORY.md`, `LEARNINGS.md` und `DECISIONS.md` wachsen danach über Zeit.

### 3. Memory-Infrastruktur initialisieren

```bash
node tools/memory-server/bin/paios-memory.js init
```

Das erzeugt:

- `.paios-memory/config.json`
- `.paios-memory/connectors/mcp-client-snippet.json`
- `.paios-memory/snapshots/`

`.paios-memory/` bleibt lokal und ist per `.gitignore` geschützt.

### 4. Index bauen

```bash
node tools/memory-server/bin/paios-memory.js index
```

Erwartete Ausgabe:

```json
{
  "indexPath": ".../.paios-memory/index.json",
  "stats": {
    "fileCount": 27,
    "chunkCount": 167
  },
  "generatedAt": "..."
}
```

Die Zahlen hängen von deiner privaten Kopie ab.

### 5. Suche testen

```bash
node tools/memory-server/bin/paios-memory.js search "aktuelles Ziel"
```

Wenn Treffer erscheinen, ist der lokale Index nutzbar.

### 6. Systemzustand prüfen

```bash
node tools/memory-server/bin/paios-memory.js doctor
```

`doctor` zeigt:

- macOS-Status
- Node-Version
- Vault-Pfad
- ob der Remote auf das öffentliche Template zeigt
- Indexgröße
- HTTP-Adresse
- State-Verzeichnis

## Lokalen HTTP-Server starten

Für lokale Tools, eigene Skripte oder einen API-Bridge-Prozess:

```bash
node tools/memory-server/bin/paios-memory.js serve
```

Standardadresse:

```text
http://127.0.0.1:47777
```

Test:

```bash
curl http://127.0.0.1:47777/health
curl "http://127.0.0.1:47777/search?q=Memory&limit=3"
```

Der Server beobachtet Markdown-Änderungen und baut den Index bei Änderungen neu.

## Dauerhaft als macOS-Dienst starten

Installieren:

```bash
node tools/memory-server/bin/paios-memory.js install-launch-agent
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.personal-ai-os.memory.plist
```

Status prüfen:

```bash
launchctl print gui/$(id -u)/com.personal-ai-os.memory
curl http://127.0.0.1:47777/health
```

Stoppen:

```bash
launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/com.personal-ai-os.memory.plist
```

Logs:

```text
.paios-memory/launchd.out.log
.paios-memory/launchd.err.log
```

## Alltag: Wie du damit arbeitest

### Neue Information aufnehmen

1. Lege Rohmaterial in `00_Inbox/` ab.
2. Lass die KI oder dich selbst triagieren.
3. Verschiebe nutzbare Inhalte in `01_Projects/`, `02_Areas/` oder `03_Resources/`.
4. Schreibe dauerhafte Fakten nur nach `MEMORY.md`, wenn sie belegt, bestätigt oder klar als Hypothese markiert sind.

### Erinnerungen schreiben

Eine bestätigte Präferenz:

```bash
node tools/memory-server/bin/paios-memory.js remember \
  "Nutzer bevorzugt kurze, direkte deutsche Antworten." \
  --type preference \
  --confidence High \
  --source "direktes Nutzerfeedback"
```

Eine Entscheidung:

```bash
node tools/memory-server/bin/paios-memory.js remember \
  "Memory-Server läuft macOS-only und lokal-first." \
  --type decision \
  --confidence High \
  --source "Projektentscheidung 2026-05-17"
```

Wichtig: `remember` ist eine Schreiboperation. Bei unklaren Aussagen zuerst nachfragen.

### Nach Kontext suchen

```bash
node tools/memory-server/bin/paios-memory.js search "Kunde Angebot Deadline"
```

Mit JSON-Ausgabe:

```bash
node tools/memory-server/bin/paios-memory.js search "Kunde Angebot Deadline" --json
```

### Snapshot erzeugen

Für ChatGPT:

```bash
node tools/memory-server/bin/paios-memory.js context --profile chatgpt --write
```

Für Claude:

```bash
node tools/memory-server/bin/paios-memory.js context --profile claude --write
```

Für Gemini:

```bash
node tools/memory-server/bin/paios-memory.js context --profile gemini --write
```

Für Grok:

```bash
node tools/memory-server/bin/paios-memory.js context --profile grok --write
```

Snapshots liegen unter:

```text
.paios-memory/snapshots/
```

## Git-Sync sicher benutzen

Das öffentliche Template blockiert Sync bewusst. Für echte Daten brauchst du eine private Kopie.

Nur ziehen:

```bash
node tools/memory-server/bin/paios-memory.js sync
```

Private Inhalte pushen:

```bash
node tools/memory-server/bin/paios-memory.js sync --push --confirm-private
```

Warum `--confirm-private`? Weil echte Arbeitsdaten durch `.gitignore` im öffentlichen Template geschützt sind. In einer privaten Kopie musst du explizit bestätigen, dass der Remote wirklich privat ist.

## Empfohlene Wochenroutine

1. `00_Inbox/` leeren.
2. Neue Projektinfos in `01_Projects/` einsortieren.
3. Relevante Erkenntnisse in `03_Resources/` destillieren.
4. Nur bestätigte, wiederverwendbare Erkenntnisse in `MEMORY.md` übernehmen.
5. `node tools/memory-server/bin/paios-memory.js index` ausführen.
6. Optional: Snapshots für Tools ohne Live-Zugriff neu erzeugen.
7. Private Kopie committen und pushen.

## Entscheidungsbaum: Live oder Snapshot?

```text
Kann das Tool MCP oder lokale Tools ausführen?
  Ja -> MCP nutzen.
  Nein -> Kann das Tool eine private HTTPS-API aufrufen?
    Ja -> HTTP/API-Bridge nutzen.
    Nein -> Snapshot erzeugen und hochladen/einfügen.
```

## Qualitätsregeln für Memory

Gute Memory-Einträge sind:

- kurz,
- konkret,
- wiederverwendbar,
- mit Quelle oder Beleg versehen,
- als Fakt, Präferenz, Muster, Entscheidung oder Learning markiert.

Schlechte Memory-Einträge sind:

- Tagesrauschen,
- unbestätigte Vermutungen ohne Hypothesenmarkierung,
- lange Chat-Protokolle,
- private Rohdaten ohne Zweck,
- Informationen, die in zwei Minuten neu gefunden werden können.

## Fehlerbehebung

### `listen EPERM` beim Serverstart

In manchen Sandbox-Umgebungen darf Node keinen lokalen Port öffnen. Starte den Server außerhalb der Sandbox oder über `launchd`.

### Keine Suchtreffer

```bash
node tools/memory-server/bin/paios-memory.js index
node tools/memory-server/bin/paios-memory.js search "dein Suchbegriff"
```

Prüfe außerdem, ob deine Dateien in den indizierten Ordnern liegen.

### Snapshots sind veraltet

Snapshots sind statisch. Nach Änderungen neu erzeugen:

```bash
node tools/memory-server/bin/paios-memory.js context --profile chatgpt --write
```

### Git-Sync verweigert Push

Das ist beabsichtigt, wenn der Remote das öffentliche Template ist oder `--confirm-private` fehlt.

Prüfen:

```bash
git remote -v
node tools/memory-server/bin/paios-memory.js doctor
```

### MCP-Client findet den Server nicht

1. `node tools/memory-server/bin/paios-memory.js init` ausführen.
2. `.paios-memory/connectors/mcp-client-snippet.json` öffnen.
3. Den absoluten Pfad in die Konfiguration deines MCP-Clients übernehmen.
4. MCP-Client neu starten.

## Nächste sinnvolle Erweiterungen

- Embedding-Index für semantische Suche.
- Kleine Menüleisten-App für macOS.
- Authentifizierter HTTPS-Bridge-Service für ChatGPT/Gemini/Grok.
- UI für Memory-Review vor `memory_remember`.
- Automatische Daily/Weekly Review Jobs per `launchd`.
