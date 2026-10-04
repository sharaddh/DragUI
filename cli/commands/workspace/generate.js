import inquirer
from "inquirer";

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

export default async function generate(){

 const spinner =
  ora(
   "Generating..."
  ).start();

 try{

  const token =
   getToken();

  if(
   !token
  ){

   process.exitCode = 1;
   spinner.fail(
    chalk.red(
     "Not logged in. Run 'dropui login' first."
    )
   );
   return;

  }

  const {
   prompt
  } = await inquirer.prompt([

   {
    name:"prompt",

    message:
     "Describe component"
   }

  ]);

  const res =
   await axios.post(

    `${API_BASE}/ai/generate`,

    {
     prompt
    },

    {
     headers:{
      Authorization:
       `Bearer ${token}`
     }
    }

   );

  spinner.succeed();

  console.log(
   res.data?.component?.code ?? res.data?.code ?? "(empty response)"
  );

 }catch(error){

  process.exitCode = 1;

  spinner.fail(
   chalk.red(
    error.response?.data?.message || error.message
   )
  );

 }

}