import fs
from "fs";

export default function init(){

 fs.writeFileSync(

  "dropui.config.json",

  JSON.stringify({

   componentsDir:
    "src/components"

  })

 );

 console.log(
  "DropUI Initialized"
 );

}