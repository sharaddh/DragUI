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

  "http://localhost:5000/api/admin-auth/login",

  {
   email,
   password
  }

 );

 saveToken(
  res.data.token
 );

 console.log(
  "Logged in"
 );

}