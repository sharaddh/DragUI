import fs from "fs-extra";
import path from "path";

export default async function writeFiles(

 files,
 componentsDir

){

 for (
  const file
  of files
 ){

  const target =
   path.join(

    componentsDir,

    file.path

   );

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