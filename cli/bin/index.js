#!/usr/bin/env node

import login from "../commands/login.js";
import pull from "../commands/pull.js";
import logout from "../commands/logout.js";
import whoami from "../commands/whoami.js";

const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case "login":
    login();
    break;

  case "pull":
    pull(arg);
    break;

  case "logout":
    logout();
    break;

  case "whoami":
    whoami();
    break;

  default:
    console.log(`
DropUI CLI

Commands:
  dropui login
  dropui pull <projectId>
  dropui logout
  dropui whoami
`);
}