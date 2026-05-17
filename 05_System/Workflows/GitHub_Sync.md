# Workflow: GitHub Sync

Da das gesamte Personal-AI-OS aus reinen Textdateien und Ordnern besteht, ist GitHub ein guter Mechanismus, um dein Wissen über alle Geräte hinweg zu synchronisieren und zu versionieren. Für echte persönliche Inhalte muss das Ziel-Repository privat sein.

## Warum GitHub?
1. **Versionierung**: Du siehst genau, wann eine KI (oder du selbst) eine Datei geändert hat. Wenn eine KI etwas überschreibt, kannst du es jederzeit rückgängig machen.
2. **Überall verfügbar**: Du kannst dein OS auf dem Laptop, dem Desktop und sogar auf dem Smartphone (z.B. mit der App "Working Copy" für iOS) nutzen.
3. **Privatsphäre**: Nur ein privates Repository ist für echte persönliche Inhalte geeignet. Ein öffentliches Pages-Repository ist nur als Template oder Landingpage geeignet.

## Sicherheitsentscheidung

- **Öffentliches Repo**: Nur Template, README, Landingpage, Platzhalter und allgemeine Workflows.
- **Privates Repo**: Echte Ziele, Aufgaben, Projektdateien, Dokumente, Quellen, Erinnerungen und persönliche Kontextdaten.
- **Nie committen**: Zugangsdaten, API-Keys, Tokens, private PDFs, Kundendaten oder Gesundheits-/Finanzinformationen in ein öffentliches Repo.

## Einmalige Einrichtung

1. **Git initialisieren**:
   Öffne dein Terminal im Ordner `Personal-AI-OS` und tippe:
   ```bash
   git init
   ```

2. **Repository auf GitHub erstellen**:
   Gehe auf GitHub, erstelle ein neues **privates** Repository namens `Personal-AI-OS`.

3. **Verbinden und hochladen**:
   ```bash
   git add .
   git commit -m "Initial commit: Personal-AI-OS Setup"
   git branch -M main
   git remote add origin https://github.com/DEIN_USERNAME/Personal-AI-OS.git
   git push -u origin main
   ```

## Der tägliche Sync-Workflow

Um das System aktuell zu halten, solltest du (oder die KI, wenn sie Terminal-Zugriff hat wie Manus oder Claude Code) regelmäßig synchronisieren.

### Änderungen hochladen (Push)
Am Ende des Tages oder nach einer großen KI-Session:
```bash
git status --short
git add .
git diff --cached
git commit -m "Update: [Kurze Beschreibung, z.B. Daily Review oder neues Projekt]"
git push
```

Wenn `git diff --cached` private Inhalte zeigt, brich ab und verschiebe diese Inhalte in ein privates Repo oder in eine ignorierte lokale Datei.

### Änderungen herunterladen (Pull)
Bevor du an einem anderen Gerät weiterarbeitest:
```bash
git pull
```

## Umgang mit großen Dateien (PDFs, Bilder)
GitHub ist primär für Text (Markdown) gedacht. Wenn du viele große PDFs oder Bilder in `00_Inbox` oder `03_Resources` ablegst, kann das Repository sehr groß werden.

**Lösung**:
Nutze **Git LFS (Large File Storage)** für PDFs und Bilder:
```bash
git lfs install
git lfs track "*.pdf"
git lfs track "*.png"
git lfs track "*.jpg"
git add .gitattributes
```
So bleiben die großen Dateien ausgelagert und dein Text-OS bleibt blitzschnell.

## Öffentliche Template-Repos

Wenn du dieses System öffentlich als Template veröffentlichst, nutze die `.gitignore`-Regeln aus diesem Repository:

- README-Dateien bleiben sichtbar.
- Neue persönliche Inhalte in Inbox, Projekten, Ressourcen, Archiv und Dokumenten werden ignoriert.
- Private Kontext-Ergänzungen gehören in `05_System/Context/private/` oder in Dateien mit `.local.md`.
