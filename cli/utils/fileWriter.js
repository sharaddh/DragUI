import fs
from "fs";

export function writeFiles(

 files,

 targetDir

){

 files.forEach(
  file=>{

   fs.writeFileSync(

    `${targetDir}/${file.path}`,

    file.content

   );

  }
 );

}