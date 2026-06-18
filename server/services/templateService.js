import fs from "fs-extra";
import path from "path";

export const saveTemplate = async (componentData) => {
  // 1. Grab the actual fields coming from the React frontend
  const name = componentData.name || "Untitled";
  const code = componentData.code || "";
  
  // 2. Create fallbacks for type and slug so path.join NEVER gets undefined
  const type = componentData.category || "components"; // Default to a 'components' folder
  const slug = name.toLowerCase().replace(/\s+/g, '-'); // e.g. "My Button" -> "my-button"

  // 3. Safely build the path
  const dir = path.join(
    process.cwd(),
    "templates",
    type,
    slug
  );

  await fs.ensureDir(dir);

  // 4. Save the file using the actual component name
  const filePath = path.join(
    dir,
    `${name}.jsx`
  );

  await fs.writeFile(
    filePath,
    code
  );

  return {
    path: `${type}/${slug}`,
    filePath
  };
};