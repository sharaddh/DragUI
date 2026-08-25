// Syntax-checks every CLI source file with node --check.
// Usage: npm run check  (from the cli/ folder)
import { execFileSync } from "child_process";
import path from "path";
import fs from "fs";
import url from "url";

const root = path.dirname(path.dirname(url.fileURLToPath(import.meta.url)));
const targets = ["bin", "commands", "utils"].flatMap((dir) =>
  fs
    .readdirSync(path.join(root, dir))
    .filter((f) => f.endsWith(".js"))
    .map((f) => path.join(root, dir, f))
);

let failed = false;
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
