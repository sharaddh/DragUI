import os from "os";
import path from "path";
import fs from "fs-extra";

const AUTH_DIR =
 path.join(
  os.homedir(),
  ".dropui"
 );

const AUTH_FILE =
 path.join(
  AUTH_DIR,
  "auth.json"
 );

export function saveToken(
 token,
 role = "admin"
){

 fs.ensureDirSync(
  AUTH_DIR
 );

 fs.writeFileSync(

  AUTH_FILE,

  JSON.stringify({
   token,
   role
  })

 );
}
export function getToken(){

 if(
  !fs.existsSync(
   AUTH_FILE
  )
 ){

  return null;
 }

 return JSON.parse(

  fs.readFileSync(

   AUTH_FILE,

   "utf8"
  )

 ).token;

}

export function getRole(){

 if(
  !fs.existsSync(
   AUTH_FILE
  )
 ){

  return null;
 }

 return JSON.parse(

  fs.readFileSync(

   AUTH_FILE,

   "utf8"
  )

 ).role || "admin";

}
export function clearToken(){

 if(
  fs.existsSync(
   AUTH_FILE
  )
 ){

  fs.removeSync(
   AUTH_FILE
  );

 }

}
