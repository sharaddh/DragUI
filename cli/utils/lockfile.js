import fs from "fs";

const LOCKFILE =
 "dropui.lock";

export function readLockfile(){

 if(
  !fs.existsSync(
   LOCKFILE
  )
 ){

  return {
   components:{}
  };

 }

 return JSON.parse(

  fs.readFileSync(
   LOCKFILE,
   "utf8"
  )

 );

}

export function saveLockfile(
 data
){

 fs.writeFileSync(

  LOCKFILE,

  JSON.stringify(
   data,
   null,
   2
  )

 );

}

export function addComponent(
 name,
 version
){

 const lock =
  readLockfile();

 lock.components[
  name
 ] = version;

 saveLockfile(
  lock
 );

}