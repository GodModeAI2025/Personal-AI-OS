# Personal-AI-OS Memory Server

macOS-first local Memory server for Personal-AI-OS.

It provides:

- Markdown indexing for the Personal-AI-OS folder.
- Local lexical search without external dependencies.
- HTTP API on `127.0.0.1`.
- MCP stdio tools for live agent access.
- Context snapshot export for tools without live access.
- Defensive Git sync for private repositories.

## Commands

```bash
node tools/memory-server/bin/paios-memory.js init
node tools/memory-server/bin/paios-memory.js doctor
node tools/memory-server/bin/paios-memory.js index
node tools/memory-server/bin/paios-memory.js search "query"
node tools/memory-server/bin/paios-memory.js context --profile claude --query "query"
node tools/memory-server/bin/paios-memory.js remember "User prefers concise German answers" --type preference --confidence High
node tools/memory-server/bin/paios-memory.js serve
node tools/memory-server/bin/paios-memory.js mcp
node tools/memory-server/bin/paios-memory.js sync --push --confirm-private
```

Runtime data is written to `.paios-memory/` and should stay private.

Full German documentation:

- `../../05_System/Memory/HANDBUCH.md`
- `../../05_System/Memory/CONNECTORS.md`
- `../../05_System/Memory/TECHNICAL_REFERENCE.md`
