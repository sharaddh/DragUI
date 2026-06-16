import fs from "fs";

const AUTH_FILE =
 ".dropui/auth.json";

export function saveToken(
 token
){

 fs.mkdirSync(
  ".dropui",
  {
   recursive:true
  }
 );

 fs.writeFileSync(

  AUTH_FILE,

  JSON.stringify({
   token
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