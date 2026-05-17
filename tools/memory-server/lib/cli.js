import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ensureStateDir, isMacOS, loadConfig, resolveVaultRoot, statePath, writeDefaultConfig } from "./config.js";
import { reindex, ensureIndex } from "./indexer.js";
import { searchIndex, formatSearchResults } from "./search.js";
import { generateContext, writeSnapshot } from "./context.js";
import { remember } from "./remember.js";
import { startHttpServer } from "./http-server.js";
import { startMcpServer } from "./mcp-server.js";
import { remoteLooksPublicTemplate, syncGit } from "./git-sync.js";
import { writeLaunchAgent } from "./launchd.js";

export async function main(argv, env) {
  const args = parseArgs(argv);
  const command = args._[0] || "help";
  const root = path.resolve(args.root || await resolveVaultRoot(env.cwd));
  const config = await loadConfig(root);

  if (command === "help" || args.help) {
    printHelp();
    return;
  }

  if (command === "init") {
    const configPath = await writeDefaultConfig(root);
    await writeConnectorSnippets(root);
    console.log(`Config: ${configPath}`);
    console.log(`Connectors: ${statePath(root, "connectors")}`);
    return;
  }

  if (command === "doctor") {
    await doctor(root, config);
    return;
  }

  if (command === "index") {
    await ensureStateDir(root);
    const { index, indexPath } = await reindex(root, config);
    console.log(JSON.stringify({ indexPath, stats: index.stats, generatedAt: index.generatedAt }, null, 2));
    return;
  }

  if (command === "search") {
    const query = args._.slice(1).join(" ") || args.query || args.q || "";
    const index = await ensureIndex(root, config);
    const results = searchIndex(index, query, { limit: Number(args.limit || 8), includeText: !!args.text });
    if (args.json) console.log(JSON.stringify({ query, results }, null, 2));
    else console.log(formatSearchResults(results));
    return;
  }

  if (command === "context") {
    const context = await generateContext(root, config, {
      profile: args.profile || args._[1] || "default",
      query: args.query || args.q || "",
      limit: Number(args.limit || 8),
      maxChars: args.maxChars ? Number(args.maxChars) : undefined
    });
    if (args.write) {
      const snapshotPath = await writeSnapshot(root, context);
      console.log(snapshotPath);
    } else {
      console.log(context.text);
    }
    return;
  }

  if (command === "remember") {
    const text = args.text || args._.slice(1).join(" ");
    const result = await remember(root, config, {
      text,
      type: args.type,
      confidence: args.confidence,
      source: args.source,
      evidence: args.evidence,
      sourceId: args.sourceId
    });
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (command === "serve") {
    if (!isMacOS()) throw new Error("Der Watch-Server ist macOS-only, weil er rekursives fs.watch nutzt.");
    await startHttpServer(root, config, {
      host: args.host || config.bindHost,
      port: Number(args.port || config.port),
      watch: args.watch !== false
    });
    return;
  }

  if (command === "mcp") {
    await startMcpServer(root, config);
    return;
  }

  if (command === "sync") {
    const result = syncGit(root, {
      pull: args.pull !== false,
      push: !!args.push,
      message: args.message,
      refusePublicRemote: !args.allowPublic,
      privateRemoteConfirmed: !!args.confirmPrivate || !!config.sync.privateRemoteConfirmed
    });
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (command === "install-launch-agent") {
    if (!isMacOS()) throw new Error("LaunchAgent-Installation ist macOS-only.");
    await ensureStateDir(root);
    const cliPath = fileURLToPath(new URL("../bin/paios-memory.js", import.meta.url));
    const plistPath = await writeLaunchAgent({
      nodePath: process.execPath,
      cliPath,
      root,
      port: Number(args.port || config.port)
    });
    console.log(plistPath);
    console.log("Starten: launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.personal-ai-os.memory.plist");
    return;
  }

  throw new Error(`Unbekannter Befehl: ${command}`);
}

function parseArgs(argv) {
  const result = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) {
      result._.push(arg);
      continue;
    }

    const rawKey = arg.slice(2);
    const [key, inlineValue] = rawKey.split("=", 2);
    if (key.startsWith("no-")) {
      result[toCamel(key.slice(3))] = false;
      continue;
    }
    if (inlineValue !== undefined) {
      result[toCamel(key)] = inlineValue;
      continue;
    }
    const next = argv[index + 1];
    if (next && !next.startsWith("--")) {
      result[toCamel(key)] = next;
      index += 1;
    } else {
      result[toCamel(key)] = true;
    }
  }
  return result;
}

function toCamel(key) {
  return key.replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
}

async function doctor(root, config) {
  const index = await ensureIndex(root, config);
  const checks = [
    ["macOS", isMacOS() ? "ok" : "fail"],
    ["Node", process.versions.node],
    ["Vault", root],
    ["Public Template Remote", remoteLooksPublicTemplate(root) ? "yes" : "no"],
    ["Index", `${index.stats.fileCount} files / ${index.stats.chunkCount} chunks`],
    ["HTTP", `http://${config.bindHost}:${config.port}`],
    ["State", statePath(root)]
  ];

  for (const [name, value] of checks) {
    console.log(`${name}: ${value}`);
  }
}

async function writeConnectorSnippets(root) {
  await ensureStateDir(root);
  const cliPath = fileURLToPath(new URL("../bin/paios-memory.js", import.meta.url));
  const snippet = {
    mcpServers: {
      "personal-ai-os-memory": {
        command: process.execPath,
        args: [cliPath, "mcp", "--root", root]
      }
    }
  };

  await fs.writeFile(
    statePath(root, "connectors", "mcp-client-snippet.json"),
    `${JSON.stringify(snippet, null, 2)}\n`,
    "utf8"
  );
}

function printHelp() {
  console.log(`Personal-AI-OS Memory Server

Usage:
  paios-memory init
  paios-memory doctor
  paios-memory index
  paios-memory search "query" [--limit 8] [--json]
  paios-memory context --profile chatgpt|claude|gemini|grok [--query "..."] [--write]
  paios-memory remember "text" [--type fact|preference|pattern|decision|learning] [--confidence Medium]
  paios-memory serve [--port 47777]
  paios-memory mcp
  paios-memory sync [--push --confirm-private] [--allow-public]
  paios-memory install-launch-agent
`);
}
