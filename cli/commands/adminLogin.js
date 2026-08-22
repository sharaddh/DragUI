import inquirer
from "inquirer";

import axios
from "axios";

import {
 saveToken
}
from "../utils/auth.js";

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

 console.log(
  "Logged in as admin"
 );

}
