import fs from "fs";

import chalk from "chalk";

const LOCKFILE =
 "dropui.lock";

function normalizeEntry(
 name,
 entry
){

 // Legacy lockfiles stored a bare version string with a flat <name>.jsx file.
 if (
  typeof entry === "string" ||
  entry === null ||
  entry === undefined
 ) {
  return {
   version: typeof entry === "string" ? entry : null,
   files: [`${name}.jsx`]
  };
 }

 return {
  version: entry.version ?? null,
  files: entry.files?.length ? entry.files : [`${name}.jsx`]
 };

}

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

 try {

  const data = JSON.parse(

   fs.readFileSync(
    LOCKFILE,
    "utf8"
   )

  );

  return {
   ...data,
   components: Object.fromEntries(
    Object.entries(data?.components ?? {}).map(([name, entry]) => [
     name,
     normalizeEntry(name, entry)
    ])
   )
  };

 } catch {

  // Corrupt or half-written lockfile - fall back to an empty one instead of
  // crashing on a raw SyntaxError.
  console.error(chalk.yellow("dropui.lock is corrupt - starting a new one"));
  return {
   components:{}
  };

 }

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
 { version, files = [] } = {}
){

 const lock =
  readLockfile();

 lock.components[
  name
 ] = {
  version,
  files
 };

 saveLockfile(
  lock
 );

}