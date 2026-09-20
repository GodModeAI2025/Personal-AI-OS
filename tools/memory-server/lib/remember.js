import fs from "node:fs/promises";
import path from "node:path";
import { compactWhitespace } from "./text.js";

const TARGETS = {
  fact: "05_System/Context/MEMORY.md",
  preference: "05_System/Context/MEMORY.md",
  pattern: "05_System/Context/MEMORY.md",
  decision: "05_System/Context/DECISIONS.md",
  learning: "05_System/Context/LEARNINGS.md"
};

// Markierung für überholte Einträge. Der alte Eintrag bleibt in der Datei stehen.
const SUPERSEDED_LABEL = "Status: überholt durch";

// Schreib-Gate: Muster, die typischerweise auf Zugangsdaten hindeuten.
// Solche Werte gehören nie in Kontextdateien, die als Snapshot an KI-Tools gehen.
// Bewusst eng gefasst, damit Notizen über Keys (z. B. "Keys beginnen mit sk-") oder
// kebab-case-Namen wie "sk-learn-pipeline-..." nicht fälschlich blockiert werden.
const SECRET_PATTERNS = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]{0,300}?[A-Za-z0-9+/]{40,}/,
  /\bsk-(?:ant-|proj-)?(?=[A-Za-z0-9_-]*\d)(?=[A-Za-z0-9_-]*[A-Z])[A-Za-z0-9_-]{20,}/,
  /\bgh[pousr]_[A-Za-z0-9]{30,}/,
  /\bgithub_pat_[A-Za-z0-9_]{30,}/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bxox[abprs]-\d{6,}-[A-Za-z0-9-]{10,}/,
  /\bAIza[0-9A-Za-z_-]{35}\b/
];

export async function remember(root, config, input) {
  // Einzeilig normalisieren, damit Zeilenumbrüche das Listenformat nicht aufbrechen.
  const text = compactWhitespace(input.text);
  if (!text) throw new Error("remember braucht ein nicht-leeres text-Feld.");

  const type = normalizeType(input.type);
  const target = TARGETS[type];
  const confidence = compactWhitespace(input.confidence) || "Hypothesis";
  const source = compactWhitespace(input.source) || "paios-memory remember";
  const evidence = compactWhitespace(input.evidence) || text;
  const now = new Date().toISOString();
  const sourceId = compactWhitespace(input.sourceId) || `memory-${now.slice(0, 10)}-${Date.now()}`;
  const supersedes = compactWhitespace(input.supersedes);
  const absoluteTarget = path.join(root, target);

  if ([text, evidence, source].some(looksLikeSecret)) {
    throw new Error("remember abgelehnt: Eintrag enthält vermutlich ein Secret (API-Key, Token oder Private Key).");
  }

  // Ein Eintrag kann sich nicht selbst ersetzen, und zwei Einträge mit derselben
  // Source-ID machen jeden Verweis mehrdeutig. Beides vor dem Schreiben abfangen.
  if (supersedes && supersedes === sourceId) {
    throw new Error(`remember abgelehnt: ${sourceId} kann sich nicht selbst ersetzen.`);
  }

  // Korrektur statt Löschung: Der überholte Eintrag bleibt stehen und bekommt einen Verweis.
  // Deshalb muss die Source-ID vor dem Schreiben auflösbar sein.
  const outdated = supersedes ? await locateBySourceId(root, supersedes) : null;
  if (supersedes && !outdated) {
    throw new Error(`remember abgelehnt: Source-ID ${supersedes} steht in keiner Kontextdatei.`);
  }
  if (outdated?.entry.supersededBy) {
    throw new Error(`remember abgelehnt: Eintrag ${supersedes} ist bereits überholt durch ${outdated.entry.supersededBy}. Ersetze den aktuellen Eintrag.`);
  }
  if (supersedes && await locateBySourceId(root, sourceId)) {
    throw new Error(`remember abgelehnt: Source-ID ${sourceId} ist bereits vergeben. Der Verweis auf die Korrektur wäre mehrdeutig.`);
  }

  const existing = findEntry(await readIfExists(absoluteTarget), text);
  if (existing) {
    // Es entsteht kein neuer Eintrag, die Korrektur darf aber nicht stillschweigend
    // ausfallen: Der überholte Eintrag wird auf den vorhandenen Eintrag verwiesen.
    // Sonst bliebe genau der Widerspruch stehen, den supersedes auflösen soll.
    if (outdated && existing.sourceId && existing.sourceId !== supersedes) {
      await markSuperseded(outdated.absolute, supersedes, existing.sourceId, now.slice(0, 10));
    }
    return {
      status: "duplicate",
      target,
      sourceId: existing.sourceId,
      type,
      confidence,
      ...(outdated && existing.sourceId && existing.sourceId !== supersedes
        ? { supersedes, supersededTarget: outdated.target }
        : {})
    };
  }

  const entry = [
    "",
    `- **${now.slice(0, 10)}** (${type}, ${confidence}): ${text}`,
    `  - Source-ID: ${sourceId}`,
    `  - Locator: ${source}`,
    `  - Beleg: ${evidence}`,
    ...(supersedes ? [`  - Ersetzt: ${supersedes}`] : []),
    ""
  ].join("\n");

  // Erst der neue Eintrag, dann die Markierung: Ein Verweis zeigt nie auf einen fehlenden Eintrag.
  await fs.appendFile(absoluteTarget, entry, "utf8");

  if (outdated) {
    await markSuperseded(outdated.absolute, supersedes, sourceId, now.slice(0, 10));
  }

  return {
    status: "written",
    target,
    sourceId,
    type,
    confidence,
    ...(supersedes ? { supersedes, supersededTarget: outdated.target } : {})
  };
}

export function looksLikeSecret(value) {
  return SECRET_PATTERNS.some((pattern) => pattern.test(String(value || "")));
}

// Zerlegt eine Kontextdatei in Einträge: Kopfzeile plus die eingerückten Detailzeilen darunter.
function parseEntries(content) {
  const lines = content.split("\n");
  const entries = [];

  for (let index = 0; index < lines.length; index += 1) {
    if (!lines[index].startsWith("- **")) continue;

    let end = index;
    while (end + 1 < lines.length && /^\s+- /.test(lines[end + 1])) end += 1;

    const details = lines.slice(index + 1, end + 1);
    const sourceMatch = details.find((line) => /^\s+- Source-ID: /.test(line));
    const supersededMatch = details.find((line) => new RegExp(`^\\s+- ${SUPERSEDED_LABEL} `).test(line));

    entries.push({
      head: compactWhitespace(lines[index]).toLowerCase(),
      end,
      sourceId: sourceMatch ? sourceMatch.replace(/^\s+- Source-ID: /, "").trim() : null,
      supersededBy: supersededMatch ? supersededMatch.replace(new RegExp(`^\\s+- ${SUPERSEDED_LABEL} `), "").replace(/\s*\(.*\)\s*$/, "").trim() : null
    });

    index = end;
  }

  return { lines, entries };
}

// Sucht einen noch gültigen Eintrag mit demselben Text (unabhängig von Datum, Typ und Konfidenz).
// Überholte Einträge zählen nicht, damit eine zurückgenommene Aussage erneut belegt werden kann.
function findEntry(content, text) {
  const needle = `): ${text}`.toLowerCase();
  const { entries } = parseEntries(content);
  return entries.find((entry) => !entry.supersededBy && entry.head.endsWith(needle)) || null;
}

// Sucht die Source-ID in allen Zieldateien, weil eine Korrektur den Typ wechseln darf.
async function locateBySourceId(root, sourceId) {
  for (const target of [...new Set(Object.values(TARGETS))]) {
    const absolute = path.join(root, target);
    const { entries } = parseEntries(await readIfExists(absolute));
    const entry = entries.find((candidate) => candidate.sourceId === sourceId);
    if (entry) return { target, absolute, entry };
  }

  return null;
}

// Markiert den überholten Eintrag, löscht ihn aber nicht: Die Korrektur bleibt nachvollziehbar.
// Die Datei wird dafür neu gelesen, weil der neue Eintrag in derselben Datei stehen kann.
async function markSuperseded(absolute, supersededId, sourceId, date) {
  const { lines, entries } = parseEntries(await readIfExists(absolute));
  const entry = entries.find((candidate) => candidate.sourceId === supersededId);
  if (!entry) throw new Error(`remember: Eintrag ${supersededId} konnte nicht markiert werden.`);
  lines.splice(entry.end + 1, 0, `  - ${SUPERSEDED_LABEL} ${sourceId} (${date})`);
  await fs.writeFile(absolute, lines.join("\n"), "utf8");
}

async function readIfExists(file) {
  try {
    return await fs.readFile(file, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return "";
    throw error;
  }
}

function normalizeType(type) {
  const normalized = String(type || "fact").toLowerCase();
  if (TARGETS[normalized]) return normalized;
  return "fact";
}
