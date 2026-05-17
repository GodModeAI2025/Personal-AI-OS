import fs from "node:fs/promises";
import path from "node:path";
import { statePath } from "./config.js";
import { pathExists } from "./config.js";
import { ensureIndex } from "./indexer.js";
import { searchIndex } from "./search.js";
import { truncateMiddle } from "./text.js";

export async function generateContext(root, config, options = {}) {
  const profile = String(options.profile || "default").toLowerCase();
  const profileConfig = config.snapshots.profiles[profile] || config.snapshots.profiles.default;
  const maxChars = Number(options.maxChars || profileConfig.maxChars || config.snapshots.defaultMaxChars);
  const query = String(options.query || "").trim();
  const index = await ensureIndex(root, config);
  const searchResults = query
    ? searchIndex(index, query, { limit: Number(options.limit || 8), includeText: true })
    : [];

  const sections = [];
  sections.push(`# Personal-AI-OS Context Snapshot`);
  sections.push(`Generated: ${new Date().toISOString()}`);
  sections.push(`Profile: ${profile}`);
  sections.push("");
  sections.push("Dieser Snapshot ist statisch. Fuer Live-Zugriff nutze den lokalen Memory-Server oder das MCP-Tool.");

  sections.push("\n## Core Context\n");
  for (const relative of config.contextFiles) {
    const absolute = path.join(root, relative);
    if (!(await pathExists(absolute))) continue;
    const text = await fs.readFile(absolute, "utf8");
    sections.push(`### ${relative}\n`);
    sections.push(text.trim());
    sections.push("");
  }

  if (searchResults.length > 0) {
    sections.push("\n## Relevant Search Results\n");
    for (const result of searchResults) {
      const heading = result.heading ? ` > ${result.heading}` : "";
      sections.push(`### ${result.path}:${result.lineStart}${heading}\n`);
      sections.push(result.text.trim());
      sections.push("");
    }
  }

  let snapshot = sections.join("\n");
  snapshot = truncateMiddle(snapshot, maxChars);

  return {
    profile,
    query,
    maxChars,
    chars: snapshot.length,
    generatedAt: new Date().toISOString(),
    text: snapshot
  };
}

export async function writeSnapshot(root, context) {
  const safeProfile = context.profile.replace(/[^a-z0-9_-]/g, "-");
  const snapshotPath = statePath(root, "snapshots", `${safeProfile}.md`);
  await fs.mkdir(path.dirname(snapshotPath), { recursive: true });
  await fs.writeFile(snapshotPath, context.text, "utf8");
  return snapshotPath;
}
