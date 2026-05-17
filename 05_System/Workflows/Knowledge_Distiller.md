# Workflow: Knowledge Distiller

**Wann nutzen:** Wenn du ein umfangreiches Dokument (z.B. aus `06_Documents/`) in strukturiertes, wiederverwendbares Wissen transformieren möchtest, ohne das Original zu verändern.

## Anweisung an die KI:
Wenn ich dich bitte, ein Dokument zu "destillieren" (z.B. "Destilliere Dokument X"), wechsle in den Knowledge Distiller Modus und befolge diese Schritte:

### 1. Atomare Konzepte extrahieren
- Lies das Quelldokument.
- Identifiziere die Kernkonzepte.
- Beschreibe jedes Konzept **atomar** (eigenständig verständlich, ohne den Rest des Dokuments lesen zu müssen).
- Eliminiere Redundanzen (gleiche Idee = nur ein Konzept).

### 2. Beziehungen kartieren (Knowledge Graph)
- Mache die Beziehungen zwischen den Konzepten explizit.
- Nutze Typen wie: `uses` (nutzt), `enables` (ermöglicht), `based-on` (basiert auf), `tension` (steht im Widerspruch zu).

### 3. Temporale Dimension & Provenance
- **Zeitbezug**: Wann wurde dieses Wissen veröffentlicht? Gilt es nur für einen bestimmten Zeitraum?
- **Provenance**: Wo genau im Originaldokument steht das? Nutze den `Provenance_Standard.md` mit Source-ID, Locator, kurzem Beleg und Ableitungsart.
- **Konfidenz**: Wie sicher bist du dir bei der Extraktion? (High/Medium/Low).

### 4. Output-Format
Erstelle eine neue Datei in `03_Resources/` (oder aktualisiere eine bestehende im Merge-Modus) mit folgendem Format:

```markdown
# [Titel des destillierten Wissens]

**Quelle**: [[Link zum Originaldokument in 06_Documents]]
**Destilliert am**: [Datum]
**Temporaler Kontext**: [Wann wurde das Original veröffentlicht?]

## Quellen
- **S1**: [Titel], [Autor/Organisation], [Datum], `06_Documents/[Pfad]`, Seiten [x-y]

## Concept Map (Übersicht)
- **[Konzept A]** `enables` **[Konzept B]**
- **[Konzept C]** `tension` **[Konzept A]**

## Kernkonzepte

### [Konzept A]
- **Definition**: [1-2 Sätze, eigenständig verständlich]
- **Relevanz**: [Warum ist das wichtig?]
- **Konfidenz**: [High/Medium/Low]
- **Provenance**: [S1, Seite/Abschnitt/Absatz]
- **Beleg**: "[kurzes direktes Zitat oder präziser Block-Verweis]"
- **Ableitung**: [Direkt belegt / Zusammenführung mehrerer Quellen / Eigene Schlussfolgerung]

### [Konzept B]
...
```

*Hinweis: Verändere niemals das Originaldokument in `06_Documents/`.*
