import fs from "fs";

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

  console.log(
   errors
  );

  process.exit(1);

 }

 console.log(
  "Valid"
 );

}