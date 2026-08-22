import chalk from "chalk";

import ora from "ora";

import {
 searchComponents
}
from "../services/registry.js";

export default async function search(
 query
) {

 const spinner =
  ora(
   "Searching..."
  ).start();

 try{

  const result =
   await searchComponents(
    query
   );

  spinner.succeed();

  console.log(
   chalk.cyan(
    "\nComponents\n"
   )
  );

  result.results.forEach(
   component => {

    console.log(
     `• ${component.name}`
    );

   }
  );

 }catch(error){

  spinner.fail(
   chalk.red(
    error.message
   )
  );

 }

}
