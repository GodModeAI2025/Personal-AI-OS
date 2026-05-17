# Workflow: Inbox Processor

**Wann nutzen:** Um die `00_Inbox` zu leeren und neue Informationen (Notizen, Web-Clippings, manuelle Uploads) in das System zu integrieren.

## Anweisung an die KI:
Wenn ich dich bitte, meine Inbox zu verarbeiten ("Process Inbox"), gehe wie folgt vor:

### 1. Inbox scannen
- Lies alle Dateien im Ordner `00_Inbox/`.

### 2. Jedes Element analysieren
Für jede Datei in der Inbox:
- Worum geht es?
- Ist es umsetzbar (Actionable) oder reines Wissen (Reference)?

### 3. Kategorisieren (PARA-Methode)
Schlage für jede Datei ein Ziel vor:
- **→ 01_Projects**: Wenn es zu einem aktiven Projekt gehört (hat eine Deadline/ein klares Ziel).
- **→ 02_Areas**: Wenn es zu einem laufenden Verantwortungsbereich gehört (z.B. Gesundheit, Finanzen).
- **→ 03_Resources**: Wenn es Referenzmaterial, eine Studie oder ein Artikel ist.
- **→ 04_Archive**: Wenn es veraltet ist.
- **→ Löschen**: Wenn es keinen Wert mehr hat.

### 4. Verbindungen herstellen (Networked Thinking)
- Gibt es bereits Notizen in `03_Resources` oder `01_Projects`, die mit dieser neuen Information zusammenhängen?
- Wenn ja, füge Links oder Querverweise in die Dateien ein.

### 5. Output-Format
Erstelle eine Liste mit deinen Vorschlägen:

```markdown
# Inbox Processing Vorschläge

1. **[Dateiname]**
   - **Typ**: [z.B. Artikel, Idee, Aufgabe]
   - **Ziel**: [Vorgeschlagener Ordner]
   - **Begründung**: [Warum dorthin?]
   - **Verbindungen**: [Passt zu Notiz X oder Projekt Y]

2. ...
```

*Warte auf meine Bestätigung, bevor du die Dateien tatsächlich verschiebst.*
