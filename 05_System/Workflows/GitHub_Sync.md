# Workflow: GitHub Sync

Da das gesamte Personal-AI-OS aus reinen Textdateien und Ordnern besteht, ist GitHub der perfekte Mechanismus, um dein Wissen über alle Geräte hinweg zu synchronisieren und zu versionieren.

## Warum GitHub?
1. **Versionierung**: Du siehst genau, wann eine KI (oder du selbst) eine Datei geändert hat. Wenn eine KI etwas überschreibt, kannst du es jederzeit rückgängig machen.
2. **Überall verfügbar**: Du kannst dein OS auf dem Laptop, dem Desktop und sogar auf dem Smartphone (z.B. mit der App "Working Copy" für iOS) nutzen.
3. **Privatsphäre**: Wenn du ein privates Repository anlegst, gehören die Daten nur dir.

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
git add .
git commit -m "Update: [Kurze Beschreibung, z.B. Daily Review oder neues Projekt]"
git push
```

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
