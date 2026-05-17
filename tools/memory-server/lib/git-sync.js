import { spawnSync } from "node:child_process";

export function git(args, options = {}) {
  const result = spawnSync("git", args, {
    cwd: options.cwd,
    encoding: "utf8"
  });

  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || result.stdout.trim() || `git ${args.join(" ")} failed`);
  }

  return result.stdout.trim();
}

export function remoteLooksPublicTemplate(root) {
  try {
    const remote = git(["remote", "get-url", "origin"], { cwd: root });
    return /github\.com[:/]GodModeAI2025\/Personal-AI-OS(?:\.git)?$/i.test(remote);
  } catch {
    return false;
  }
}

export function syncGit(root, options = {}) {
  const publicTemplate = remoteLooksPublicTemplate(root);
  if (publicTemplate && options.refusePublicRemote !== false) {
    throw new Error("Git-Sync verweigert Push/Pull gegen das oeffentliche Template-Repo. Nutze eine private Kopie oder --allow-public.");
  }

  if (options.push && !options.privateRemoteConfirmed) {
    throw new Error("Push mit privaten Memory-Inhalten braucht --confirm-private oder sync.privateRemoteConfirmed=true in .paios-memory/config.json.");
  }

  const steps = [];
  if (options.pull !== false) {
    steps.push({ command: "pull", output: git(["pull", "--ff-only"], { cwd: root }) });
  }

  if (options.push) {
    const status = git(["status", "--short"], { cwd: root });
    if (status) {
      git(["add", "-f", "05_System/Context", "00_Inbox", "01_Projects", "02_Areas", "03_Resources", "04_Archive"], { cwd: root });
      git(["commit", "-m", options.message || "Update Personal-AI-OS memory"], { cwd: root });
    }
    steps.push({ command: "push", output: git(["push"], { cwd: root }) });
  }

  return {
    publicTemplate,
    steps
  };
}
