import ora from "ora";

import {
 getConfig
}
from "../utils/config.js";

import {
 getToken
}
from "../utils/auth.js";

import axios from "axios";

export default async function publish(){

 const spinner =
  ora(
   "Publishing..."
  ).start();

 try{

  const token =
   getToken();

  const config =
   getConfig();

  const res =
   await axios.post(

    "http://localhost:5000/api/cli/publish",

    config,

    {
     headers:{
      Authorization:
       `Bearer ${token}`
     }
    }

   );

  spinner.succeed(
   "Published"
  );

 }catch(error){

  spinner.fail(
   error.message
  );

 }

}