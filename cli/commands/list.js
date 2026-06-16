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

 Object.entries(
  lock.components
 ).forEach(

 ([name,version])=>{

  console.log(
   `${name} (${version})`
  );

 }

 );

}