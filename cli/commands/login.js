import inquirer
from "inquirer";

import axios
from "axios";

import {
 saveToken
}
from "../utils/auth.js";

export default async function login(){

 const {
  accountType
 } = await inquirer.prompt([

  {
   type: "list",
   name: "accountType",
   message: "Login as",
   choices: ["User", "Admin"]
  }

 ]);

 if (accountType === "User") {

  const {
   email,
   password
  } = await inquirer.prompt([

   {
    name:"email",
    message:"Email"
   },

   {
    type:"password",

    name:"password",

    message:"Password"
   }

  ]);

  const res =
  await axios.post(

   "http://localhost:5000/api/auth/login",

   {
    email,
    password
   }

  );

  saveToken(
   res.data.token,
   "user"
  );

 } else {

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

  const res =
  await axios.post(

   "http://localhost:5000/api/admin-auth/login",

   {
    adminId,
    password
   }

  );

  saveToken(
   res.data.token,
   "admin"
  );

 }

 console.log(
  `Logged in as ${accountType.toLowerCase()}`
 );

}
