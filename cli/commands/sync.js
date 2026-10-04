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

  const count =
   res.data?.components?.length ?? 0;

  if (
   !count
  ) {
   console.log(
    chalk.yellow("Registry is empty")
   );
   return;
  }

  console.log(
   `${count} component${count === 1 ? "" : "s"} available in the registry`
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
