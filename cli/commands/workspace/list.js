import axios
from "axios";

import chalk
from "chalk";

import ora
from "ora";

import {
 getToken
}
from "../../utils/auth.js";
import { API_BASE }
from "../../utils/config.js";

export default async function list(){

 const spinner =
  ora(
   "Fetching workspaces..."
  ).start();

 try{

  const token =
   getToken();

  const res =
await axios.get(

    `${API_BASE}/workspaces`,

    {
     headers:{
      Authorization:
       `Bearer ${token}`
     }
    }

   );

  spinner.succeed();

  console.table(
   res.data.workspaces
  );

 }catch(error){

  process.exitCode = 1;

  spinner.fail(
   chalk.red(
    error.message
   )
  );

 }

}
