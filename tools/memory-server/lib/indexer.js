import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { ensureStateDir, statePath } from "./config.js";
import { listMarkdownFiles, readJson, readTextFile, writeJson } from "./files.js";
import { tokenize } from "./text.js";

export async function buildIndex(root, config) {
  const files = await listMarkdownFiles(root, config);
  const chunks = [];

  for (const file of files) {
    const text = await readTextFile(file.absolute);
    const fileHash = sha256(text);
    const title = extractTitle(text) || path.basename(file.relative);

    for (const chunk of chunkMarkdown(text, config)) {
      const hashInput = `${file.relative}:${chunk.lineStart}:${chunk.heading}:${chunk.text}`;
      chunks.push({
        id: sha256(hashInput).slice(0, 16),
        path: file.relative,
        title,
        heading: chunk.heading,
        lineStart: chunk.lineStart,
        lineEnd: chunk.lineEnd,
        text: chunk.text,
        tokens: tokenize(`${title} ${chunk.heading} ${chunk.text}`),
        modifiedAt: file.modifiedAt,
        fileHash
      });
    }
  }

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    root,
    stats: {
      fileCount: files.length,
      chunkCount: chunks.length
    },
    chunks
  };
}

export async function saveIndex(root, index) {
  await ensureStateDir(root);
  const indexPath = statePath(root, "index.json");
  await writeJson(indexPath, index);
  return indexPath;
}

export async function loadIndex(root) {
  return readJson(statePath(root, "index.json"));
}

export async function ensureIndex(root, config) {
  try {
    return await loadIndex(root);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    const index = await buildIndex(root, config);
    await saveIndex(root, index);
    return index;
  }
}

export async function reindex(root, config) {
  const index = await buildIndex(root, config);
  const indexPath = await saveIndex(root, index);
  return { index, indexPath };
}

export function watchVault(root, config, onChange) {
  let timer = null;
  const watcher = fs.watch(root, { recursive: true }, (_event, fileName) => {
    const relative = String(fileName || "");
    if (!relative) return;
    if (shouldIgnoreWatchEvent(relative)) return;

    clearTimeout(timer);
    timer = setTimeout(() => {
      onChange(relative).catch((error) => {
        console.error(error?.stack || error?.message || String(error));
      });
    }, 350);
  });

  return () => {
    clearTimeout(timer);
    watcher.close();
  };
}

function shouldIgnoreWatchEvent(relative) {
  const normalized = relative.split(path.sep).join("/");
  if (normalized.startsWith(".git/")) return true;
  if (normalized.startsWith(".paios-memory/")) return true;
  if (normalized.includes("/node_modules/")) return true;
  if (!normalized.endsWith(".md") && !normalized.endsWith(".markdown")) return true;
  return false;
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function extractTitle(text) {
  const match = String(text).match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "";
}

export function chunkMarkdown(text, config = {}) {
  const maxChars = config.chunkMaxChars || 2800;
  const overlapChars = config.chunkOverlapChars || 300;
  const lines = String(text || "").split(/\r?\n/);
  const sections = [];
  let current = { heading: "", lineStart: 1, lines: [] };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const headingMatch = /^(#{1,3})\s+(.+?)\s*$/.exec(line);

    if (headingMatch && current.lines.length > 0) {
      sections.push({
        heading: current.heading,
        lineStart: current.lineStart,
        lines: current.lines
      });
      current = {
        heading: headingMatch[2].trim(),
        lineStart: index + 1,
        lines: [line]
      };
      continue;
    }

    if (headingMatch && !current.heading) {
      current.heading = headingMatch[2].trim();
    }

    current.lines.push(line);
  }

  if (current.lines.length > 0) sections.push(current);

  const chunks = [];
  for (const section of sections) {
    const sectionText = section.lines.join("\n").trim();
    if (!sectionText) continue;

    if (sectionText.length <= maxChars) {
      chunks.push({
        heading: section.heading,
        lineStart: section.lineStart,
        lineEnd: section.lineStart + section.lines.length - 1,
        text: sectionText
      });
      continue;
    }

    let offset = 0;
    while (offset < sectionText.length) {
      const slice = sectionText.slice(offset, offset + maxChars);
      const lineStart = section.lineStart + countNewlines(sectionText.slice(0, offset));
      const lineEnd = lineStart + countNewlines(slice);
      chunks.push({
        heading: section.heading,
        lineStart,
        lineEnd,
        text: slice.trim()
      });
      offset += Math.max(1, maxChars - overlapChars);
    }
  }

  return chunks;
}

function countNewlines(text) {
  return (text.match(/\n/g) || []).length;
}
