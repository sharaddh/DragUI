import chalk from "chalk";

import {
 readLockfile
}
from "../utils/lockfile.js";

export default function list(){

 const lock =
  readLockfile();

 console.log(
  "\nInstalled Components\n"
 );

 const entries =
  Object.entries(
   lock.components
  );

 if (
  !entries.length
 ) {
  console.log(
   chalk.gray(
    "No components installed yet. Try 'dropui add <component>'."
   )
  );
  return;
 }

 entries.forEach(

 ([name,entry])=>{

  console.log(
   `${name} (${entry.version ?? "unknown"})`
  );

 }

 );

}