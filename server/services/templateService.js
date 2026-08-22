import fs from "fs-extra";
import path from "path";
import slugify from "slugify";

const TEMPLATES_ROOT = path.join(process.cwd(), "templates");

export const saveTemplate = async (componentData) => {
  // 1. Grab the actual fields coming from the React frontend
  const name = componentData.name || "Untitled";
  const code = componentData.code || "";

  // 2. Prefer the caller's already-slugified slug and type; fall back safely
  const type = componentData.type || componentData.category || "components";

  // Strict slugify strips path characters - a raw client name can never
  // produce "../" segments here
  const slug =
    componentData.slug ||
    slugify(name, { lower: true, strict: true }) ||
    "untitled";

  // 3. Build the path and verify it stays inside templates/
  const dir = path.join(
    TEMPLATES_ROOT,
    type,
    slug
  );

  const resolved = path.resolve(dir);
  if (!resolved.startsWith(TEMPLATES_ROOT + path.sep)) {
    throw new Error("Invalid template path");
  }

  await fs.ensureDir(resolved);

  // 4. Save the file using a sanitized component name
  const safeFileName = `${path.parse(name).name.replace(/[^\w.-]+/g, "_") || "Component"}.jsx`;
  const filePath = path.join(resolved, safeFileName);

  await fs.writeFile(
    filePath,
    code
  );

  return {
    path: `${type}/${slug}`,
    filePath
  };
};
