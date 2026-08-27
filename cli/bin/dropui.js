#!/usr/bin/env node

import { Command } from "commander";

import initCommand from "../commands/init.js";
import addCommand from "../commands/add.js";
import searchCommand from "../commands/search.js";
import listCommand from "../commands/list.js";
import removeCommand from "../commands/remove.js";
import updateCommand from "../commands/update.js";
import loginCommand from "../commands/login.js";
import adminLoginCommand from "../commands/adminLogin.js";
import logoutCommand from "../commands/logout.js";
import doctorCommand from "../commands/doctor.js";
import whoamiCommand from "../commands/whoami.js";
import pullCommand from "../commands/pull.js";
import projectsCommand from "../commands/projects.js";
import publishCommand from "../commands/publish.js";
import syncCommand from "../commands/sync.js";
import validateCommand from "../commands/validate.js";
import workspaceListCommand from "../commands/workspace/list.js";

const program = new Command();

program
    .name("dropui")
    .description("DropUI CLI")
    .version("1.0.0");

const workspace = program.command("workspace");
workspace
    .command("list")
    .description("List workspaces")
    .action(workspaceListCommand);

program.command("login").description("Log in as a DropUI user (email + password)").action(loginCommand);
program.command("admin-login").description("Log in as a platform admin (admin ID + password)").action(adminLoginCommand);
program.command("logout").action(logoutCommand);
program.command("whoami").action(whoamiCommand);
program.command("publish").description("Publish components to the registry").action(publishCommand);
program.command("sync").action(syncCommand);
program.command("validate").action(validateCommand);

program
    .command("list")
    .description(
        "List installed components"
    )
    .action(listCommand);

program
    .command("remove <component>")
    .action(removeCommand);

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

program
    .command("doctor")
    .action(doctorCommand);

program
    .command("pull <projectId>")
    .description("Pull a project design")
    .option("-d, --dir <path>", "Output directory (defaults to ./<project-name>)")
    .action(pullCommand);

program
    .command("projects")
    .description("List your projects with their pull ids")
    .action(projectsCommand);

program
    .command("update <component>")
    .action(updateCommand);

program.addHelpText(
    "after",
    `
Examples:
  $ dropui login                 # browser-based sign-in (email, Google, GitHub)
  $ dropui projects              # list your projects with pull ids
  $ dropui pull c4bdf9a0         # export a project to ./<project-name>/
  $ dropui pull c4bdf9a0 -d out  # export into a custom folder
`
);

// parseAsync so rejected async command handlers surface cleanly instead of
// crashing the process with an unhandled-rejection stack trace.
program.parseAsync().catch((err) => {
  process.exitCode = 1;
});
