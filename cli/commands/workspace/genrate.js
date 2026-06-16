import inquirer
from "inquirer";

import axios
from "axios";

export default async function generate(){

 const {
  prompt
 } = await inquirer.prompt([

  {
   name:"prompt",

   message:
    "Describe component"
  }

 ]);

 const res =
  await axios.post(

   "http://localhost:5000/api/ai/generate",

   {
    prompt
   }

  );

 console.log(
  res.data
 );

}