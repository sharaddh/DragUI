#!/usr/bin/env node

import add
from "./commands/add.js";

import init
from "./commands/init.js";

import update
from "./commands/update.js";

const command =
 process.argv[2];

const value =
 process.argv[3];

switch(command){

 case "init":

  init();

 break;

 case "add":

  await add(value);

 break;

 case "update":

  await update(value);

 break;

}