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

// Schreib-Gate: Muster, die typischerweise auf Zugangsdaten hindeuten.
// Solche Werte gehören nie in Kontextdateien, die als Snapshot an KI-Tools gehen.
const SECRET_PATTERNS = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\bsk-(?:ant-|proj-)?[A-Za-z0-9_-]{20,}/,
  /\bgh[pousr]_[A-Za-z0-9]{30,}/,
  /\bgithub_pat_[A-Za-z0-9_]{30,}/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bxox[abprs]-[A-Za-z0-9-]{10,}/,
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
  const absoluteTarget = path.join(root, target);

  if ([text, evidence, source].some(looksLikeSecret)) {
    throw new Error("remember abgelehnt: Eintrag enthält vermutlich ein Secret (API-Key, Token oder Private Key).");
  }

  const existing = await readIfExists(absoluteTarget);
  if (containsEntry(existing, text)) {
    return {
      status: "duplicate",
      target,
      type,
      confidence
    };
  }

  const entry = [
    "",
    `- **${now.slice(0, 10)}** (${type}, ${confidence}): ${text}`,
    `  - Source-ID: ${sourceId}`,
    `  - Locator: ${source}`,
    `  - Beleg: ${evidence}`,
    ""
  ].join("\n");

  await fs.appendFile(absoluteTarget, entry, "utf8");

  return {
    status: "written",
    target,
    sourceId,
    type,
    confidence
  };
}

export function looksLikeSecret(value) {
  return SECRET_PATTERNS.some((pattern) => pattern.test(String(value || "")));
}

// Prüft, ob derselbe Eintragstext (unabhängig von Datum, Typ und Konfidenz) schon existiert.
function containsEntry(content, text) {
  const needle = `): ${text}`.toLowerCase();
  return content
    .split("\n")
    .some((line) => line.startsWith("- **") && compactWhitespace(line).toLowerCase().endsWith(needle));
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
