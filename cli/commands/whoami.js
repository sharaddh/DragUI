import axios
from "axios";

import chalk
from "chalk";

import ora
from "ora";

import {
 getToken,
 getRole
}
from "../utils/auth.js";
import { API_BASE }
from "../utils/config.js";

export default async function whoami(){

 const role =
  getRole() || "admin";

 const spinner =
  ora(
   "Fetching profile..."
  ).start();

 try{

  const token =
   getToken();

  const url =
   role === "user"
    ? `${API_BASE}/auth/profile`
    : `${API_BASE}/admin-auth/profile`;

  const res =
  await axios.get(

   url,

   {
    headers:{
     Authorization:
      `Bearer ${token}`
    }
   }

  );

  spinner.succeed();

  console.log(
   role === "user" ? res.data.user : res.data.admin
  );

 }catch(error){

  spinner.fail(
   chalk.red(
    error.response?.data?.message || error.message
   )
  );

 }

}
