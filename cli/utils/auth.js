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
function readAuthFile() {
  if (!fs.existsSync(AUTH_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(AUTH_FILE, "utf8"));
  } catch {
    // Corrupt or half-written auth file - treat as logged out and remove it
    // so the next command starts clean instead of crashing.
    try { fs.removeSync(AUTH_FILE); } catch { /* ignore */ }
    return null;
  }
}

export function getToken(){

 const auth = readAuthFile();
 return auth?.token || null;

}

export function getRole(){

 const auth = readAuthFile();
 return auth?.role || "admin";

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
