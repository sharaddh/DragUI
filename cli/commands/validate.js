import fs from "fs";

import chalk from "chalk";

export default function validate(){

 const required = [

  "dropui.config.json",

  "package.json"

 ];

 const errors = [];

 required.forEach(
  file=>{

   if(
    !fs.existsSync(
     file
    )
   ){

    errors.push(
     file
    );

   }

  }
 );

 if(
  errors.length
 ){

  console.log(
   "Missing:"
  );

  errors.forEach(
   file=>{

    console.log(
     chalk.red(
      `✗ ${file}`
     )
    );

   }
  );

  process.exit(1);

 }

 console.log(
  "Valid"
 );

}