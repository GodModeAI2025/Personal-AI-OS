import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { defaultConfig } from "../lib/config.js";
import { buildIndex, reindex } from "../lib/indexer.js";
import { searchIndex } from "../lib/search.js";
import { generateContext } from "../lib/context.js";
import { looksLikeSecret, remember } from "../lib/remember.js";

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

test("remember gate normalizes, skips duplicates and rejects secrets", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "paios-memory-gate-"));
  await fs.mkdir(path.join(root, "05_System", "Context"), { recursive: true });
  const memoryPath = path.join(root, "05_System", "Context", "MEMORY.md");
  await fs.writeFile(memoryPath, "# Memory\n", "utf8");
  const config = defaultConfig(root);

  const first = await remember(root, config, {
    text: "User prefers\nshort answers.",
    type: "preference",
    confidence: "High"
  });
  assert.equal(first.status, "written");

  const second = await remember(root, config, {
    text: "  user prefers short answers. ",
    type: "fact",
    confidence: "Medium"
  });
  assert.equal(second.status, "duplicate");
  assert.equal(second.sourceId, first.sourceId);

  const memoryText = await fs.readFile(memoryPath, "utf8");
  assert.equal(memoryText.match(/prefers short answers/gi).length, 2);
  assert.match(memoryText, /: User prefers short answers\.\n/);

  await assert.rejects(
    remember(root, config, { text: "Token ghp_abcdefghijklmnopqrstuvwxyz0123456789" }),
    /Secret/
  );
  await assert.rejects(
    remember(root, config, { text: "Key sk-ant-api03-AbC1234567890defGHIjklMNOpqr" }),
    /Secret/
  );

  // Notizen über Key-Formate und kebab-case-Namen sind keine Secrets.
  for (const text of [
    "OpenAI-Keys beginnen mit sk- und Slack-Bot-Tokens mit xoxb-.",
    "Branch sk-refactor-memory-server-write-gate anlegen.",
    "Private Keys (-----BEGIN PRIVATE KEY-----) nie committen."
  ]) {
    assert.equal(looksLikeSecret(text), false, text);
  }
});

test("remember supersedes an outdated entry without deleting it", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "paios-memory-supersede-"));
  await fs.mkdir(path.join(root, "05_System", "Context"), { recursive: true });
  const memoryPath = path.join(root, "05_System", "Context", "MEMORY.md");
  const decisionsPath = path.join(root, "05_System", "Context", "DECISIONS.md");
  await fs.writeFile(memoryPath, "# Memory\n", "utf8");
  await fs.writeFile(decisionsPath, "# Decisions\n", "utf8");
  const config = defaultConfig(root);

  const old = await remember(root, config, {
    text: "User works with Python 3.11.",
    type: "fact",
    confidence: "High",
    sourceId: "memory-test-old"
  });
  assert.equal(old.status, "written");

  await assert.rejects(
    remember(root, config, { text: "User works with Python 3.13.", supersedes: "memory-test-unknown" }),
    /steht in keiner Kontextdatei/
  );

  // Die Korrektur darf den Typ wechseln und landet dann in einer anderen Datei.
  const revision = await remember(root, config, {
    text: "User works with Python 3.13.",
    type: "decision",
    confidence: "High",
    sourceId: "memory-test-new",
    supersedes: "memory-test-old"
  });
  assert.equal(revision.status, "written");
  assert.equal(revision.supersedes, "memory-test-old");
  assert.equal(revision.supersededTarget, "05_System/Context/MEMORY.md");

  const memoryText = await fs.readFile(memoryPath, "utf8");
  assert.match(memoryText, /User works with Python 3\.11\./);
  assert.match(memoryText, /- Status: überholt durch memory-test-new \(\d{4}-\d{2}-\d{2}\)/);
  assert.match(await fs.readFile(decisionsPath, "utf8"), /- Ersetzt: memory-test-old/);

  await assert.rejects(
    remember(root, config, { text: "User works with Python 3.12.", supersedes: "memory-test-old" }),
    /bereits überholt durch memory-test-new/
  );

  // Korrektur innerhalb derselben Datei: Der neue Eintrag darf beim Markieren nicht verloren gehen.
  const sameFile = await remember(root, config, {
    text: "User prefers ripgrep over grep.",
    type: "fact",
    sourceId: "memory-test-tool-old"
  });
  assert.equal(sameFile.status, "written");
  const sameFileRevision = await remember(root, config, {
    text: "User prefers fd over find.",
    type: "fact",
    sourceId: "memory-test-tool-new",
    supersedes: "memory-test-tool-old"
  });
  assert.equal(sameFileRevision.status, "written");
  const afterSameFile = await fs.readFile(memoryPath, "utf8");
  assert.match(afterSameFile, /: User prefers fd over find\./);
  assert.match(afterSameFile, /- Status: überholt durch memory-test-tool-new/);
  assert.match(afterSameFile, /- Ersetzt: memory-test-tool-old/);

  // Ein überholter Eintrag blockiert nicht mehr als Duplikat.
  const again = await remember(root, config, {
    text: "User works with Python 3.11.",
    type: "fact",
    confidence: "Medium"
  });
  assert.equal(again.status, "written");
});
