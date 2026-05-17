# Provenance Standard

**Ziel:** Jede dauerhafte Erkenntnis muss später überprüfbar sein. Eine Aussage ohne Quelle, Locator und Konfidenz darf nicht als gesichertes Wissen in `03_Resources/` oder `MEMORY.md` landen.

## Source Registry

Jede Ressourcen-Datei enthält oben eine Quellenliste:

```markdown
## Quellen
- **S1**: [Titel], [Autor/Organisation], [Datum], [URL oder Pfad], abgerufen am [YYYY-MM-DD]
- **S2**: [Dateiname], `06_Documents/[Pfad]`, Seite [x-y]
```

## Provenance pro Erkenntnis

Jede Erkenntnis nutzt dieses Mindestformat:

```markdown
- **Konfidenz**: High | Medium | Low
- **Provenance**: S1, Abschnitt/Überschrift/Seite/Absatz
- **Beleg**: "[kurzes direktes Zitat oder präziser Block-Verweis]"
- **Ableitung**: Direkt belegt | Zusammenführung mehrerer Quellen | Eigene Schlussfolgerung
```

## Qualitätsregeln

- **High**: Quelle ist primär oder sehr nah am Original; Locator ist exakt.
- **Medium**: Quelle ist plausibel, aber sekundär oder Locator ist nur abschnittsgenau.
- **Low**: Quelle ist unsicher, veraltet, indirekt oder die Aussage ist hauptsächlich Interpretation.
- **Needs verification**: Wenn kein genauer Locator verfügbar ist, wird die Erkenntnis nicht in `MEMORY.md` übernommen.
- **Keine stillen Wahrheiten**: Zusammenfassungen und Schlussfolgerungen müssen als Ableitung markiert werden.

## Locator-Regeln nach Quelle

- **PDF/Buch**: Seite, Kapitel/Abschnitt und kurzer Beleg.
- **Webseite**: URL, Abrufdatum, Überschrift/Abschnitt und kurzer Beleg.
- **Video/Audio**: URL, Zeitstempel und kurzer Beleg.
- **Eigene Notiz**: Dateipfad, Überschrift und Datum.
- **KI-Chat**: Nur als Gesprächsnotiz speichern, nicht als Faktenquelle, außer die Primärquelle ist separat verlinkt.

## Memory-Regel

`MEMORY.md` darf nur Erkenntnisse übernehmen, die mindestens `Medium` sind oder explizit als Hypothese markiert werden.
