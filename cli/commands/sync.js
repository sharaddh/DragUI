import axios from "axios";
import chalk from "chalk";
import ora from "ora";
import { API_BASE } from "../utils/config.js";

export default async function sync(){

 const spinner =
  ora(
   "Syncing..."
  ).start();

 try{

  const res =
   await axios.get(

    `${API_BASE}/registry`

   );

  spinner.succeed();

  console.log(
   `${res.data.components.length} components synced`
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
