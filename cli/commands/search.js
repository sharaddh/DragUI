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

  const results =
   result?.results ?? [];

  if (
   !results.length
  ) {
   console.log(
    chalk.gray(
     `No components match "${query}"`
    )
   );
   return;
  }

  console.log(
   chalk.cyan(
    "\nComponents\n"
   )
  );

  results.forEach(
   component => {

    const version =
     component.version ? `@${component.version}` : "";

    const description =
     component.description
      ? ` - ${component.description}`
      : "";

    console.log(
     `• ${component.name}${version}${description}`
    );

   }
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
