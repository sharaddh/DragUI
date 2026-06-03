import fs from "fs";
import path from "path";

export const createThumbnail =
async (
 component
) => {

 const dir =
   path.join(
     process.cwd(),
     "thumbnails"
   );

 if(
   !fs.existsSync(dir)
 ){
   fs.mkdirSync(dir);
 }

 const output =
   path.join(
     dir,
     `${component.slug}.png`
   );

 return output;
};