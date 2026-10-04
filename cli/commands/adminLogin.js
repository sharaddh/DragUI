import inquirer
from "inquirer";

import axios
from "axios";

import chalk
from "chalk";

import {
 saveToken
}
from "../utils/auth.js";
import { API_BASE }
from "../utils/config.js";

export default async function adminLogin(){

 const {
  adminId,
  password
 } = await inquirer.prompt([

  {
   name:"adminId",
   message:"Admin ID"
  },

  {
   type:"password",

   name:"password",

   message:"Password"
  }

 ]);

 try {

  const res =
  await axios.post(

   `${API_BASE}/admin-auth/login`,

   {
    adminId,
    password
   }

  );

  saveToken(
   res.data.token,
   "admin"
  );

  // Confirm the token actually authenticates
  let adminLabel = "admin";
  try {
   const profile =
    await axios.get(
     `${API_BASE}/admin-auth/profile`,
     {
      headers:{
       Authorization:
        `Bearer ${res.data.token}`
      }
     }
    );
   adminLabel =
    profile.data.admin?.adminId || "admin";
  } catch {
   // keep generic label
  }

  console.log(
   `Logged in as ${adminLabel} (admin)`
  );

 } catch (error) {

  process.exitCode = 1;
  console.error(
   chalk.red(
    error.response?.data?.message || error.message
   )
  );

 }

}
