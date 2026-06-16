import fs from "fs";

export default function doctor(){

 console.log(
  "\nDropUI Doctor\n"
 );

 console.log(

  fs.existsSync(
   "package.json"
  )

   ? "✓ package.json"
   : "✗ package.json"

 );

 console.log(

  fs.existsSync(
   "dropui.config.json"
  )

   ? "✓ config"
   : "✗ config"

 );

 console.log(

  fs.existsSync(
   "dropui.lock"
  )

   ? "✓ lockfile"
   : "✗ lockfile"

 );

}