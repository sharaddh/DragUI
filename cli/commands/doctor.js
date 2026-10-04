import fs from "fs";

import chalk from "chalk";

import axios from "axios";

import {
 getToken
}
from "../utils/auth.js";
import { API_BASE }

from "../utils/config.js";

export default async function doctor(){

 const checks = [];

 console.log(
  "\nDropUI Doctor\n"
 );

 const files = [
  ["package.json", "package.json"],
  ["dropui.config.json", "config"],
  ["dropui.lock", "lockfile"]
 ];

 for (
  const [file, label]
  of files
 ) {
  const ok =
   fs.existsSync(file);
  checks.push(ok);
  console.log(
   ok
    ? chalk.green(`✓ ${label}`)
    : chalk.red(`✗ ${label}`)
  );
 }

 const token =
  getToken();

 if (
  !token
 ) {
  checks.push(false);
  console.log(
   chalk.red(
    "✗ auth token (run 'dropui login')"
   )
  );
 } else {

  try {

   await axios.get(
    `${API_BASE}/cli/me`,
    {
     headers:{
      Authorization:
       `Bearer ${token}`
     }
    }
   );

   checks.push(true);
   console.log(
    chalk.green(
     "✓ auth token"
    )
   );

  } catch (error) {

   checks.push(false);
   console.log(
    chalk.red(
     `✗ auth token (${error.response?.data?.message || error.code || error.message})`
    )
   );

  }

 }

 try {

  await axios.get(
   `${API_BASE}/registry`,
   { timeout: 5000 }
  );

  checks.push(true);
  console.log(
   chalk.green(
    `✓ API reachable (${API_BASE})`
   )
  );

 } catch (error) {

  checks.push(false);
  console.log(
   chalk.red(
    `✗ API unreachable (${error.code || error.message})`
   )
  );

 }

 if (
  checks.some(ok => !ok)
 ) {
  process.exitCode = 1;
 }

}