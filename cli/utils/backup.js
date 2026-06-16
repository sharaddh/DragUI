import fs from "fs";
import path from "path";

export default function backupFile(
 filePath
){

 if(
  !fs.existsSync(
   filePath
  )
 ){

  return;
 }

 const backupDir =
  ".dropui/backups";

 if(
  !fs.existsSync(
   backupDir
  )
 ){

  fs.mkdirSync(
   backupDir,
   { recursive:true }
  );

 }

 const fileName =
  path.basename(
   filePath
  );

 fs.copyFileSync(

  filePath,

  `${backupDir}/${fileName}.bak`

 );

}