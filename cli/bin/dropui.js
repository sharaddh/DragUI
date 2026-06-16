import { Command } from "commander";

import initCommand from "../commands/init.js";
import addCommand from "../commands/add.js";
import searchCommand from "../commands/search.js";
import listCommand
from "../commands/list.js";
import removeCommand
from "../commands/remove.js";
const program = new Command();

program
 .name("dropui")
 .description("DropUI CLI")
 .version("1.0.0");

 program
 .command("list")
 .description(
  "List installed components"
 )
 .action(
  listCommand
 );
program
 .command(
  "remove <component>"
 )
 .action(
  removeCommand
 );
program
 .command("init")
 .description("Initialize DropUI")
 .action(initCommand);

program
 .command("add <component>")
 .description("Install component")
 .action(addCommand);

program
 .command("search <query>")
 .description("Search components")
 .action(searchCommand);

program.parse();