import fs from "node:fs/promises";
import path from "node:path";

const TARGETS = {
  fact: "05_System/Context/MEMORY.md",
  preference: "05_System/Context/MEMORY.md",
  pattern: "05_System/Context/MEMORY.md",
  decision: "05_System/Context/DECISIONS.md",
  learning: "05_System/Context/LEARNINGS.md"
};

export async function remember(root, config, input) {
  const text = String(input.text || "").trim();
  if (!text) throw new Error("remember braucht ein nicht-leeres text-Feld.");

  const type = normalizeType(input.type);
  const target = TARGETS[type];
  const confidence = String(input.confidence || "Hypothesis").trim();
  const source = String(input.source || "paios-memory remember").trim();
  const evidence = String(input.evidence || text).trim();
  const now = new Date().toISOString();
  const sourceId = String(input.sourceId || `memory-${now.slice(0, 10)}-${Date.now()}`).trim();
  const absoluteTarget = path.join(root, target);

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
    target,
    sourceId,
    type,
    confidence
  };
}

function normalizeType(type) {
  const normalized = String(type || "fact").toLowerCase();
  if (TARGETS[normalized]) return normalized;
  return "fact";
}
