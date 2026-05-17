import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export function launchAgentPlist({ nodePath, cliPath, root, port }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.personal-ai-os.memory</string>
  <key>ProgramArguments</key>
  <array>
    <string>${escapeXml(nodePath)}</string>
    <string>${escapeXml(cliPath)}</string>
    <string>serve</string>
    <string>--root</string>
    <string>${escapeXml(root)}</string>
    <string>--port</string>
    <string>${escapeXml(String(port))}</string>
  </array>
  <key>WorkingDirectory</key>
  <string>${escapeXml(root)}</string>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>${escapeXml(path.join(root, ".paios-memory", "launchd.out.log"))}</string>
  <key>StandardErrorPath</key>
  <string>${escapeXml(path.join(root, ".paios-memory", "launchd.err.log"))}</string>
</dict>
</plist>
`;
}

export async function writeLaunchAgent({ nodePath, cliPath, root, port }) {
  const agentsDir = path.join(os.homedir(), "Library", "LaunchAgents");
  await fs.mkdir(agentsDir, { recursive: true });
  const plistPath = path.join(agentsDir, "com.personal-ai-os.memory.plist");
  await fs.writeFile(plistPath, launchAgentPlist({ nodePath, cliPath, root, port }), "utf8");
  return plistPath;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
