import axios
from "axios";

import {
 getToken
}
from "../utils/auth.js";

export default async function whoami(){

 const token =
  getToken();

 const res =
 await axios.get(

  "http://localhost:5000/api/admin-auth/profile",

  {
   headers:{
    Authorization:
     `Bearer ${token}`
   }
  }

 );

 console.log(
  res.data.admin
 );

}