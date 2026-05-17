import fs from "node:fs/promises";
import path from "node:path";

const EXCLUDED_DIR_NAMES = new Set([
  ".git",
  ".paios-memory",
  ".obsidian",
  "node_modules",
  ".DS_Store"
]);

const MARKDOWN_EXTENSIONS = new Set([".md", ".markdown"]);

export function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

export function relativePath(root, filePath) {
  return toPosix(path.relative(root, filePath));
}

export async function listMarkdownFiles(root, config) {
  const files = [];

  for (const includeDir of config.includeDirs) {
    const absolute = path.join(root, includeDir);
    await walk(absolute, root, config, files);
  }

  return files.sort((a, b) => a.relative.localeCompare(b.relative));
}

async function walk(dir, root, config, files) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }

  for (const entry of entries) {
    if (EXCLUDED_DIR_NAMES.has(entry.name)) continue;
    const absolute = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await walk(absolute, root, config, files);
      continue;
    }

    if (!entry.isFile()) continue;
    const extension = path.extname(entry.name).toLowerCase();
    if (!MARKDOWN_EXTENSIONS.has(extension)) continue;

    const stat = await fs.stat(absolute);
    if (stat.size > config.maxFileBytes) continue;

    files.push({
      absolute,
      relative: relativePath(root, absolute),
      size: stat.size,
      modifiedAt: stat.mtime.toISOString()
    });
  }
}

export async function readTextFile(filePath) {
  return fs.readFile(filePath, "utf8");
}

export async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}
