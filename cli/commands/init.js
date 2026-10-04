import chalk from "chalk";

import {
 saveConfig
}
from "../utils/config.js";

export default async function init() {

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