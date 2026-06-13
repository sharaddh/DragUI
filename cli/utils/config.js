import fs
from "fs";

export function getDropUIConfig(){

 const path =
  "./dropui.config.json";

 if(
  !fs.existsSync(path)
 ){

  throw new Error(
   "Run dropui init"
  );

 }

 return JSON.parse(

  fs.readFileSync(
   path,
   "utf8"
  )

 );

}