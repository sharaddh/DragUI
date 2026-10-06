// Syntax-checks every server source file with node --check.
// Usage: npm run check  (from the server/ folder)
import { execFileSync } from "child_process";
import path from "path";
import fs from "fs";
import url from "url";

const root = path.dirname(path.dirname(url.fileURLToPath(import.meta.url)));

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === "node_modules") return [];
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith(".js") ? [full] : [];
  });
}

const targets = walk(root);

let failed = false;
if (!targets.length) {
  console.error("No server source files found to check");
  process.exit(1);
}

for (const file of targets) {
  try {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
    console.log(`ok   ${path.relative(root, file)}`);
  } catch (err) {
    failed = true;
    console.error(`FAIL ${path.relative(root, file)}\n${err.stderr}`);
  }
}

process.exit(failed ? 1 : 0);