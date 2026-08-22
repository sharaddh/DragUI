import axios from "axios";
import chalk from "chalk";
import ora from "ora";

export default async function sync(){

 const spinner =
  ora(
   "Syncing..."
  ).start();

 try{

  const res =
   await axios.get(

    "http://localhost:5000/api/registry"

   );

  spinner.succeed();

  console.log(
   `${res.data.components.length} components synced`
  );

 }catch(error){

  spinner.fail(
   chalk.red(
    error.message
   )
  );

 }

}
