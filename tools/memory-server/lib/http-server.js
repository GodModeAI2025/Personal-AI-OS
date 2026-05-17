import http from "node:http";
import { URL } from "node:url";
import { ensureIndex, reindex, watchVault } from "./indexer.js";
import { searchIndex } from "./search.js";
import { generateContext } from "./context.js";
import { remember } from "./remember.js";

export async function startHttpServer(root, config, options = {}) {
  let currentIndex = await ensureIndex(root, config);

  const server = http.createServer(async (request, response) => {
    try {
      await handleRequest(root, config, () => currentIndex, async (index) => {
        currentIndex = index;
      }, request, response);
    } catch (error) {
      sendJson(response, 500, {
        error: error?.message || String(error)
      });
    }
  });

  const host = options.host || config.bindHost;
  const port = Number(options.port || config.port);

  await new Promise((resolve, reject) => {
    const onError = (error) => {
      server.off("listening", onListening);
      reject(error);
    };
    const onListening = () => {
      server.off("error", onError);
      resolve();
    };
    server.once("error", onError);
    server.listen(port, host, onListening);
  });

  let stopWatching = null;
  if (options.watch !== false) {
    stopWatching = watchVault(root, config, async () => {
      const { index } = await reindex(root, config);
      currentIndex = index;
      console.error(`[paios-memory] reindexed ${index.stats.fileCount} files / ${index.stats.chunkCount} chunks`);
    });
  }

  console.error(`[paios-memory] listening on http://${host}:${port}`);

  return {
    host,
    port,
    close: async () => {
      if (stopWatching) stopWatching();
      await new Promise((resolve) => server.close(resolve));
    }
  };
}

async function handleRequest(root, config, getIndex, setIndex, request, response) {
  const url = new URL(request.url, `http://${request.headers.host || "127.0.0.1"}`);

  if (request.method === "GET" && url.pathname === "/health") {
    const index = getIndex();
    return sendJson(response, 200, {
      ok: true,
      root,
      generatedAt: index.generatedAt,
      stats: index.stats
    });
  }

  if (request.method === "GET" && url.pathname === "/search") {
    const query = url.searchParams.get("q") || url.searchParams.get("query") || "";
    const limit = Number(url.searchParams.get("limit") || 8);
    const results = searchIndex(getIndex(), query, { limit });
    return sendJson(response, 200, { query, results });
  }

  if (request.method === "GET" && url.pathname === "/context") {
    const context = await generateContext(root, config, {
      profile: url.searchParams.get("profile") || "default",
      query: url.searchParams.get("q") || url.searchParams.get("query") || "",
      limit: Number(url.searchParams.get("limit") || 8)
    });
    response.writeHead(200, { "content-type": "text/markdown; charset=utf-8" });
    response.end(context.text);
    return;
  }

  if (request.method === "POST" && url.pathname === "/remember") {
    const body = await readJsonBody(request);
    const result = await remember(root, config, body);
    const { index } = await reindex(root, config);
    await setIndex(index);
    return sendJson(response, 200, result);
  }

  if (request.method === "POST" && url.pathname === "/reindex") {
    const { index, indexPath } = await reindex(root, config);
    await setIndex(index);
    return sendJson(response, 200, { indexPath, stats: index.stats });
  }

  sendJson(response, 404, { error: "Not found" });
}

async function readJsonBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function sendJson(response, status, value) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  response.end(`${JSON.stringify(value, null, 2)}\n`);
}
