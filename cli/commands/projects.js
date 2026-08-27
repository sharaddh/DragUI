import axios from "axios";
import chalk from "chalk";
import ora from "ora";

import { getToken, getRole } from "../utils/auth.js";
import { API_BASE as API } from "../utils/config.js";

function pad(str, len) {
  str = String(str || "");
  return str.length > len ? `${str.slice(0, len - 1)}…` : str.padEnd(len);
}

export default async function projects() {
  const role = getRole() || "user";

  if (role !== "user") {
    console.log(chalk.yellow("You are logged in as an admin."));
    console.log(`Run ${chalk.cyan("dropui login")} with a user account to list your projects.`);
    return;
  }

  const spinner = ora("Fetching your projects...").start();

  try {
    const res = await axios.get(`${API}/projects/list`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    spinner.succeed("Projects loaded");

    const list = res.data.projects || [];

    if (!list.length) {
      console.log(chalk.gray("No projects yet. Create one in the DropUI web app."));
      return;
    }

    console.log("");
    console.log(
      `  ${chalk.bold(pad("NAME", 28))}${chalk.bold(pad("PROJECT ID", 14))}${chalk.bold(pad("STATUS", 12))}${chalk.bold("UPDATED")}`
    );
    console.log(chalk.gray("  " + "-".repeat(66)));

    for (const p of list) {
      const updated = p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "—";
      console.log(
        `  ${pad(p.name, 28)}${chalk.cyan(pad(p.projectId || p._id, 14))}${
          p.isPublished ? chalk.green(pad("published", 12)) : pad("draft", 12)
        }${updated}`
      );
    }

    console.log("");
    console.log(
      chalk.gray(
        `${list.length} project${list.length === 1 ? "" : "s"} · pull any with: ${chalk.cyan("dropui pull <projectId>")}`
      )
    );
  } catch (error) {
    process.exitCode = 1;
    spinner.fail(chalk.red(error.response?.data?.message || error.message));
  }
}
