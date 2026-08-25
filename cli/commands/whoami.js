import axios from "axios";

import chalk from "chalk";

import ora from "ora";

import { getToken } from "../utils/auth.js";
import { API_BASE } from "../utils/config.js";

export default async function whoami() {
  const spinner = ora("Fetching profile...").start();

  try {
    const token = getToken();

    if (!token) {
      spinner.fail(chalk.red("Not logged in. Run 'dropui login' first."));
      return;
    }

    const res = await axios.get(`${API_BASE}/cli/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    spinner.succeed();

    const { role, user, admin } = res.data;

    if (role === "admin") {
      console.log(`  ${chalk.bold("Role:")}   admin`);
      console.log(`  ${chalk.bold("ID:")}     ${admin?.adminId || "unknown"}`);
    } else {
      console.log(`  ${chalk.bold("Role:")}   user`);
      console.log(`  ${chalk.bold("Email:")}  ${user?.email || "unknown"}`);
      if (user?.username) {
        console.log(`  ${chalk.bold("Name:")}   ${user.username}`);
      }
    }
  } catch (error) {
    spinner.fail(
      chalk.red(error.response?.data?.message || error.message)
    );
  }
}
