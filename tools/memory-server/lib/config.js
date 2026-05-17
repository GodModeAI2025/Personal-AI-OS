import fs from "node:fs/promises";
import path from "node:path";

export const STATE_DIR = ".paios-memory";
export const DEFAULT_PORT = 47777;

export const DEFAULT_INCLUDE_DIRS = [
  "00_Inbox",
  "01_Projects",
  "02_Areas",
  "03_Resources",
  "04_Archive",
  "05_System/Context",
  "05_System/Templates",
  "05_System/Workflows"
];

export const DEFAULT_CONTEXT_FILES = [
  "SYSTEM_PROMPT.md",
  "05_System/Context/SOUL.md",
  "05_System/Context/IDENTITY.md",
  "05_System/Context/ME.md",
  "05_System/Context/GOALS.md",
  "05_System/Context/TASKS.md",
  "05_System/Context/MEMORY.md",
  "05_System/Context/LEARNINGS.md",
  "05_System/Context/STANDARDS.md",
  "05_System/Context/HYGIENE.md"
];

export function isMacOS() {
  return process.platform === "darwin";
}

export async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function resolveVaultRoot(cwd) {
  let current = path.resolve(cwd);

  while (true) {
    const hasPrompt = await pathExists(path.join(current, "SYSTEM_PROMPT.md"));
    const hasContext = await pathExists(path.join(current, "05_System", "Context"));
    if (hasPrompt && hasContext) return current;

    const parent = path.dirname(current);
    if (parent === current) return path.resolve(cwd);
    current = parent;
  }
}

export function statePath(root, ...parts) {
  return path.join(root, STATE_DIR, ...parts);
}

export function defaultConfig(root) {
  return {
    schemaVersion: 1,
    vaultRoot: root,
    stateDir: STATE_DIR,
    port: DEFAULT_PORT,
    bindHost: "127.0.0.1",
    includeDirs: DEFAULT_INCLUDE_DIRS,
    contextFiles: DEFAULT_CONTEXT_FILES,
    maxFileBytes: 1024 * 1024,
    chunkMaxChars: 2800,
    chunkOverlapChars: 300,
    snapshots: {
      defaultMaxChars: 60000,
      profiles: {
        chatgpt: { maxChars: 50000 },
        claude: { maxChars: 120000 },
        gemini: { maxChars: 70000 },
        grok: { maxChars: 30000 },
        default: { maxChars: 60000 }
      }
    },
    sync: {
      enabled: false,
      pullBeforeIndex: true,
      pushAfterRemember: false,
      refusePublicRemote: true,
      privateRemoteConfirmed: false
    }
  };
}

export async function ensureStateDir(root) {
  await fs.mkdir(statePath(root), { recursive: true });
  await fs.mkdir(statePath(root, "snapshots"), { recursive: true });
  await fs.mkdir(statePath(root, "connectors"), { recursive: true });
}

export async function loadConfig(root) {
  const defaults = defaultConfig(root);
  const configPath = statePath(root, "config.json");

  if (!(await pathExists(configPath))) {
    return defaults;
  }

  const raw = await fs.readFile(configPath, "utf8");
  const local = JSON.parse(raw);

  return {
    ...defaults,
    ...local,
    snapshots: {
      ...defaults.snapshots,
      ...(local.snapshots || {}),
      profiles: {
        ...defaults.snapshots.profiles,
        ...(local.snapshots?.profiles || {})
      }
    },
    sync: {
      ...defaults.sync,
      ...(local.sync || {})
    }
  };
}

export async function writeDefaultConfig(root) {
  await ensureStateDir(root);
  const configPath = statePath(root, "config.json");
  if (await pathExists(configPath)) return configPath;

  await fs.writeFile(
    configPath,
    `${JSON.stringify(defaultConfig(root), null, 2)}\n`,
    "utf8"
  );

  return configPath;
}
