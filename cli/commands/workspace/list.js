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

export default async function list(){

 const spinner =
  ora(
   "Fetching workspaces..."
  ).start();

 try{

  const token =
   getToken();

  const res =
  await axios.get(

   "http://localhost:5000/api/workspaces",

   {
    headers:{
     Authorization:
      `Bearer ${token}`
    }
   }

  );

  spinner.succeed();

  console.table(
   res.data.workspaces
  );

 }catch(error){

  spinner.fail(
   chalk.red(
    error.message
   )
  );

 }

}
