import path from "path";

import fs from "fs-extra";

import ora from "ora";

import chalk from "chalk";

import {
 getConfig
}
from "../utils/config.js";

import {
 getToken
}
from "../utils/auth.js";

import axios from "axios";

const API_BASE =
 process.env.DROPUI_API ||
 "http://localhost:5000/api";

function collectJsxFiles(
 dir,
 root,
 out = []
){

 for (
  const entry
  of fs.readdirSync(
   dir,
   {
    withFileTypes:true
   }
  )
 ){

  const full =
   path.join(
    dir,
    entry.name
   );

  if(
   entry.isDirectory()
  ){

   collectJsxFiles(
    full,
    root,
    out
   );

  }else if(
   entry.isFile() &&
   entry.name.endsWith(
    ".jsx"
   )
  ){

   out.push({
    absolute:
     full,

    relative:
     path
      .relative(
       root,
       full
      )
      .split(path.sep)
      .join("/")
   });

  }

 }

 return out;

}

export default async function publish(){

 const spinner =
  ora(
   "Publishing..."
  ).start();

 try{

  const token =
   getToken();

  const config =
   getConfig();

  const pkg =
   JSON.parse(
    fs.readFileSync(
     "package.json",
     "utf8"
    )
   );

  const jsxFiles =
   collectJsxFiles(
    config.componentsDir,
    path.resolve(
     config.componentsDir
    )
   );

  if(
   !jsxFiles.length
  ){

   throw new Error(
    `No .jsx files found in ${config.componentsDir}`
   );

  }

  const files =
   jsxFiles.map(
    file=>({

     path:
      file.relative,

     content:
      fs.readFileSync(
       file.absolute,
       "utf8"
      )

    })
   );

  const payload = {
   name:
    pkg.name,
   type:
    "frontend",
   category:
    "UI",
   description:
    "",
   code:
    files[0].content,
   files
  };

  await axios.post(

   `${API_BASE}/cli/publish`,

   payload,

   {
    headers:{
     Authorization:
      `Bearer ${token}`
    }
   }

  );

  spinner.succeed(
   `Published ${files.length} component file(s)`
  );

 }catch(error){

  spinner.fail(
   chalk.red(
    error.message
   )
  );

 }

}
