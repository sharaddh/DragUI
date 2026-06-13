import fs from "fs";

export function detectProjectType() {
  if (!fs.existsSync("package.json")) return "unknown";

  const pkg = JSON.parse(fs.readFileSync("package.json"));

  if (pkg.dependencies?.react) return "frontend";
  if (pkg.dependencies?.express) return "backend";

  return "unknown";
}