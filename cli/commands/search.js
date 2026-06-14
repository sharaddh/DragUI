import chalk from "chalk";

import {
 searchComponents
}
from "../services/registry.js";

export default async function search(
 query
) {

 const result =
  await searchComponents(
   query
  );

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

}