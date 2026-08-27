import inquirer
from "inquirer";

import axios
from "axios";

import chalk
from "chalk";

import ora
from "ora";

export default async function generate(){

 const spinner =
  ora(
   "Generating..."
  ).start();

 try{

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

    "http://localhost:5000/api/ai/generate",

    {
     prompt
    }

   );

  spinner.succeed();

  console.log(
   res.data
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
