import fs from "fs-extra";
import path from "path";

export const saveTemplate =
  async ({
    type,
    slug,
    code
  }) => {
    const dir = path.join(
      process.cwd(),
      "templates",
      type,
      slug
    );

    await fs.ensureDir(dir);

    const filePath =
      path.join(
        dir,
        `${slug}.jsx`
      );

    await fs.writeFile(
      filePath,
      code
    );

    return {
      path:
        `${type}/${slug}`,

      filePath
    };
  };