# DropUI CLI

Developer tool for authenticating with DropUI, pulling your visual projects
down as code, and working with the component registry.

## Setup

```bash
cd cli
npm install
npm link          # makes `dropui` available globally
```

## Commands

### Account

| Command | Description |
| --- | --- |
| `dropui login` | Sign in via browser - email/password, Google, or GitHub |
| `dropui admin-login` | Terminal sign-in for platform admins |
| `dropui whoami` | Show the signed-in account and role |
| `dropui logout` | Clear stored credentials |

### Projects

| Command | Description |
| --- | --- |
| `dropui projects` | List your projects with their pull ids |
| `dropui pull <projectId> [-d dir]` | Export a project (`design.json`, `index.html`, `Component.jsx`, `README.md`). `Component.jsx` is only written when the design has renderable nodes, and `-d` selects the output folder |

### Components (registry)

| Command | Description |
| --- | --- |
| `dropui init` | Create `dropui.config.json` in the current project |
| `dropui search <query>` | Search the component registry |
| `dropui add <component>` | Install a component into `componentsDir` |
| `dropui list` | List locally installed components |
| `dropui update <component>` | Update an installed component to the latest version |
| `dropui remove <component>` | Uninstall a component |
| `dropui publish` | Publish a directory of `.jsx` files to the registry (admin) |
| `dropui sync` | Fetch the registry index and show its size |
| `dropui validate` | Check that required project files exist |
| `dropui doctor` | Run environment and connection diagnostics |
| `dropui workspace list` | List your workspaces |
| `dropui workspace generate` | Generate a component from a prompt (admin) |

Credentials are stored in `~/.dropui/auth.json`. Installed components and their
files are recorded in `dropui.lock` inside the project.

## Environment Overrides

By default the CLI talks to `http://localhost:5000/api` and opens
`http://localhost:5173`. Point it elsewhere with `DROPUI_API_URL`, which is
honored by every networked command:

```bash
DROPUI_API_URL=https://api.example.com/api
DROPUI_CLIENT_URL=https://app.example.com
```

## Development

```bash
npm run check     # node --check every source file (recursive)
node bin/dropui.js --help
```