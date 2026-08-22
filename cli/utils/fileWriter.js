import fs from "fs-extra";
import path from "path";

export default async function writeFiles(

 files,
 componentsDir

){

 const root =
  path.resolve(
   componentsDir
  );

 for (
  const file
  of files
 ){

  const target =
   path.resolve(
    componentsDir,
    file.path
   );

  if(
   target !== root &&
   !target.startsWith(
    root + path.sep
   )
  ){

   throw new Error(
    `Refusing to write outside components directory: ${file.path}`
   );

  }

  await fs.ensureDir(
   path.dirname(
    target
   )
  );

  await fs.writeFile(
   target,
   file.content
  );

 }

}
