import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { defaultConfig } from "../lib/config.js";
import { buildIndex, reindex } from "../lib/indexer.js";
import { searchIndex } from "../lib/search.js";
import { generateContext } from "../lib/context.js";
import { remember } from "../lib/remember.js";

test("indexes markdown, searches, builds context and writes memory", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "paios-memory-"));
  await fs.mkdir(path.join(root, "05_System", "Context"), { recursive: true });
  await fs.mkdir(path.join(root, "01_Projects"), { recursive: true });

  await fs.writeFile(path.join(root, "SYSTEM_PROMPT.md"), "# System\nRead memory.", "utf8");
  await fs.writeFile(path.join(root, "05_System", "Context", "MEMORY.md"), "# Memory\n", "utf8");
  await fs.writeFile(path.join(root, "05_System", "Context", "SOUL.md"), "# Soul\nValues.", "utf8");
  await fs.writeFile(path.join(root, "01_Projects", "Alpha.md"), "# Alpha Project\nThe launch plan depends on Zeitgeist research.", "utf8");

  const config = defaultConfig(root);
  const index = await buildIndex(root, config);
  assert.equal(index.stats.fileCount, 3);

  const results = searchIndex(index, "Zeitgeist launch", { limit: 5 });
  assert.equal(results.length, 1);
  assert.equal(results[0].path, "01_Projects/Alpha.md");

  await reindex(root, config);
  const context = await generateContext(root, config, { profile: "chatgpt", query: "Zeitgeist" });
  assert.match(context.text, /Alpha Project/);

  const memory = await remember(root, config, {
    text: "User prefers local-first memory infrastructure.",
    type: "preference",
    confidence: "High",
    source: "test"
  });
  assert.equal(memory.target, "05_System/Context/MEMORY.md");

  const memoryText = await fs.readFile(path.join(root, "05_System", "Context", "MEMORY.md"), "utf8");
  assert.match(memoryText, /local-first memory infrastructure/);
});
