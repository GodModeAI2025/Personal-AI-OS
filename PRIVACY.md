# Privacy Model

Dieses Repository ist als öffentliches Template gedacht. Es enthält Struktur, Workflows und Platzhalter, aber keine echten persönlichen Daten.

## Grundregel

Echte persönliche Inhalte gehören nicht in ein öffentliches Pages-Repository. Dazu zählen insbesondere:

- ausgefüllte Werte, Ziele, Identitäts- und Aufgabenprofile
- private Projekte, Kunden-, Gesundheits-, Finanz- oder Familieninformationen
- PDFs, Bilder, Mitschriften und exportierte Dokumente
- API-Schlüssel, Zugangsdaten, Tokens oder interne Links

## Empfohlene Nutzung

1. Nutze dieses Repo als Template oder Referenz.
2. Erstelle für deinen echten Arbeitsstand ein privates Repository oder einen lokalen verschlüsselten Ordner.
3. Kopiere die Struktur dorthin.
4. Fülle erst dort `05_System/Context/*.md`, Projekte, Ressourcen und Dokumente mit echten Inhalten.

## Git-Schutz in diesem Template

Die `.gitignore` ignoriert neue Inhalte in typischen Arbeitsordnern wie `00_Inbox/`, `01_Projects/`, `03_Resources/` und `06_Documents/`, lässt aber die README-Dateien als Template sichtbar.

Die Kontextdateien unter `05_System/Context/` bleiben als Platzhalter versioniert. Für private Ergänzungen nutze:

- `05_System/Context/private/`
- Dateien mit Endung `.local.md`
- Dateien mit Endung `_private.md`

## Vor jedem Commit

Prüfe:

```bash
git status --short
git diff --cached
```

Wenn private Inhalte auftauchen: nicht committen. Verschiebe sie in ein privates Repo oder in eine ignorierte lokale Datei.
