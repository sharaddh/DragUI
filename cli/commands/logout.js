import chalk from "chalk";

import {
 getToken,
 clearToken
}
from "../utils/auth.js";

export default async function logout(){

 const token =
  getToken();

 if(
  !token
 ){

  console.log(
   chalk.yellow(
    "Not logged in"
   )
  );

  return;

 }

 clearToken();

 console.log(
  chalk.green(
   "Logged out"
  )
 );

}
