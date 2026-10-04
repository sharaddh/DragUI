import fs from "fs";

import chalk from "chalk";

import inquirer
from "inquirer";

import {
 saveConfig
}
from "../utils/config.js";

export default async function init() {

 if (
  fs.existsSync("dropui.config.json")
 ) {

  const { overwrite } =
   await inquirer.prompt([

    {
     type:"confirm",
     name:"overwrite",
     message:"dropui.config.json already exists. Overwrite it?",
     default:false
    }

   ]);

  if (
   !overwrite
  ) {
   console.log(
    chalk.yellow("Aborted - dropui.config.json left unchanged")
   );
   return;
  }

 }

 const config = {

  componentsDir:
   "src/components"

 };

 saveConfig(
  config
 );

 console.log(
  chalk.green(
   "✓ DropUI initialized"
  )
 );

}