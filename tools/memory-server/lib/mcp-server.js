import readline from "node:readline";
import { ensureIndex, reindex } from "./indexer.js";
import { searchIndex } from "./search.js";
import { generateContext } from "./context.js";
import { remember } from "./remember.js";

const PROTOCOL_VERSION = "2025-11-25";

export async function startMcpServer(root, config) {
  let currentIndex = await ensureIndex(root, config);

  const rl = readline.createInterface({
    input: process.stdin,
    crlfDelay: Infinity
  });

  rl.on("line", async (line) => {
    if (!line.trim()) return;

    let message;
    try {
      message = JSON.parse(line);
    } catch (error) {
      writeError(undefined, -32700, "Parse error", error.message);
      return;
    }

    if (!("id" in message)) return;

    try {
      const result = await handleMcpRequest(root, config, () => currentIndex, async (index) => {
        currentIndex = index;
      }, message);
      writeResult(message.id, result);
    } catch (error) {
      writeError(message.id, -32603, error?.message || String(error));
    }
  });
}

async function handleMcpRequest(root, config, getIndex, setIndex, message) {
  switch (message.method) {
    case "initialize":
      return {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {
          tools: {
            listChanged: false
          }
        },
        serverInfo: {
          name: "personal-ai-os-memory",
          version: "0.1.0"
        }
      };

    case "tools/list":
      return { tools: listTools() };

    case "tools/call":
      return callTool(root, config, getIndex, setIndex, message.params || {});

    default:
      throw new Error(`Unknown method: ${message.method}`);
  }
}

function listTools() {
  return [
    {
      name: "memory_search",
      title: "Search Personal AI OS memory",
      description: "Search the local Personal-AI-OS Markdown memory index.",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string" },
          limit: { type: "integer", minimum: 1, maximum: 20 }
        },
        required: ["query"],
        additionalProperties: false
      },
      annotations: { readOnlyHint: true }
    },
    {
      name: "memory_context",
      title: "Build Personal AI OS context",
      description: "Build a profile-specific context snapshot from core context files and optional search results.",
      inputSchema: {
        type: "object",
        properties: {
          profile: { type: "string", enum: ["default", "chatgpt", "claude", "gemini", "grok"] },
          query: { type: "string" },
          limit: { type: "integer", minimum: 1, maximum: 20 }
        },
        additionalProperties: false
      },
      annotations: { readOnlyHint: true }
    },
    {
      name: "memory_remember",
      title: "Write Personal AI OS memory",
      description: "Append a confirmed fact, preference, pattern, decision or learning to the Personal-AI-OS context files.",
      inputSchema: {
        type: "object",
        properties: {
          text: { type: "string" },
          type: { type: "string", enum: ["fact", "preference", "pattern", "decision", "learning"] },
          confidence: { type: "string" },
          source: { type: "string" },
          evidence: { type: "string" },
          sourceId: { type: "string" }
        },
        required: ["text"],
        additionalProperties: false
      }
    },
    {
      name: "memory_reindex",
      title: "Rebuild Personal AI OS memory index",
      description: "Rebuild the local Personal-AI-OS memory index after file changes.",
      inputSchema: {
        type: "object",
        additionalProperties: false
      }
    },
    {
      name: "memory_status",
      title: "Show Personal AI OS memory status",
      description: "Show index generation time and indexed file/chunk counts.",
      inputSchema: {
        type: "object",
        additionalProperties: false
      },
      annotations: { readOnlyHint: true }
    }
  ];
}

async function callTool(root, config, getIndex, setIndex, params) {
  const name = params.name;
  const args = params.arguments || {};

  if (name === "memory_search") {
    const results = searchIndex(getIndex(), args.query || "", {
      limit: Number(args.limit || 8)
    });
    return toolResult({ query: args.query || "", results });
  }

  if (name === "memory_context") {
    const context = await generateContext(root, config, args);
    return {
      content: [{ type: "text", text: context.text }],
      structuredContent: {
        profile: context.profile,
        query: context.query,
        chars: context.chars,
        generatedAt: context.generatedAt
      }
    };
  }

  if (name === "memory_remember") {
    const result = await remember(root, config, args);
    const { index } = await reindex(root, config);
    await setIndex(index);
    return toolResult(result);
  }

  if (name === "memory_reindex") {
    const { index, indexPath } = await reindex(root, config);
    await setIndex(index);
    return toolResult({ indexPath, stats: index.stats, generatedAt: index.generatedAt });
  }

  if (name === "memory_status") {
    const index = getIndex();
    return toolResult({
      root,
      generatedAt: index.generatedAt,
      stats: index.stats
    });
  }

  throw new Error(`Unknown tool: ${name}`);
}

function toolResult(value) {
  return {
    content: [{ type: "text", text: JSON.stringify(value, null, 2) }],
    structuredContent: value
  };
}

function writeResult(id, result) {
  process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id, result })}\n`);
}

function writeError(id, code, message, data) {
  process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id, error: { code, message, data } })}\n`);
}
