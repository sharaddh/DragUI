import axios
from "axios";

import {
 getToken
}
from "../../utils/auth.js";

export default async function list(){

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

 console.table(
  res.data.workspaces
 );

}