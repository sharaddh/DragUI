#!/usr/bin/env node

import { createRequire } from "module";
import { Command } from "commander";
import chalk from "chalk";

const require = createRequire(import.meta.url);
const pkg = require("../package.json");

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
import workspaceGenerateCommand from "../commands/workspace/generate.js";

const program = new Command();

program
    .name("dropui")
    .description("DropUI CLI")
    .version(pkg.version);

const workspace = program.command("workspace");
workspace
    .command("list")
    .description("List workspaces")
    .action(workspaceListCommand);
workspace
    .command("generate")
    .description("Generate a component from a prompt (admin)")
    .action(workspaceGenerateCommand);

program.command("login").description("Log in as a DropUI user (email + password)").action(loginCommand);
program.command("admin-login").description("Log in as a platform admin (admin ID + password)").action(adminLoginCommand);
program.command("logout").description("Clear stored credentials").action(logoutCommand);
program.command("whoami").description("Show the signed-in account").action(whoamiCommand);
program.command("publish").description("Publish components to the registry (admin)").action(publishCommand);
program.command("sync").description("Fetch the registry index and show its size").action(syncCommand);
program.command("validate").description("Check that required project files exist").action(validateCommand);

program
    .command("list")
    .description("List installed components")
    .action(listCommand);

program
    .command("remove <component>")
    .description("Uninstall a component and drop it from dropui.lock")
    .action(removeCommand);

program
    .command("init")
    .description("Initialize DropUI")
    .action(initCommand);

program
    .command("add <component>")
    .description("Install a component from the registry")
    .action(addCommand);

program
    .command("search <query>")
    .description("Search the component registry")
    .action(searchCommand);

program
    .command("doctor")
    .description("Run environment and connection diagnostics")
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
    .description("Update an installed component to the latest version")
    .action(updateCommand);

program.addHelpText(
    "after",
    `
Examples:
  $ dropui login                 # browser-based sign-in (email, Google, GitHub)
  $ dropui add button            # install the "button" registry component
  $ dropui projects              # list your projects with pull ids
  $ dropui pull c4bdf9a0         # export a project to ./<project-name>/

Run 'dropui <command> --help' for command-specific options.
`
);

// parseAsync so rejected async command handlers surface cleanly instead of
// crashing the process with an unhandled-rejection stack trace.
program.parseAsync().catch((err) => {
  process.exitCode = 1;
  console.error(chalk.red(`\ndropui: ${err?.response?.data?.message || err?.message || err}`));
});
