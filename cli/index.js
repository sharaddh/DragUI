#!/usr/bin/env node

import add
from "./commands/add.js";

const command =
 process.argv[2];

const value =
 process.argv[3];

if(
 command === "add"
){

 await add(value);

}