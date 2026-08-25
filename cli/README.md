# DropUI CLI

Developer tool for authenticating with DropUI and pulling your visual
projects down as code.

## Setup

```bash
cd cli
npm install
npm link          # makes `dropui` available globally
```

## Commands

| Command | Description |
| --- | --- |
| `dropui login` | Sign in via browser - email/password, Google, or GitHub |
| `dropui admin-login` | Terminal sign-in for platform admins |
| `dropui whoami` | Show the signed-in account and role |
| `dropui projects` | List your projects with their pull ids |
| `dropui pull <projectId> [-d dir]` | Export a project (`design.json`, `index.html`, `Component.jsx`, `README.md`) |
| `dropui logout` | Clear stored credentials |

Credentials are stored in `~/.dropui/auth.json`.

## Environment Overrides

By default the CLI talks to `http://localhost:5000/api` and opens
`http://localhost:5173`. Point it elsewhere with:

```bash
DROPUI_API_URL=https://api.example.com/api
DROPUI_CLIENT_URL=https://app.example.com
```

## Development

```bash
npm run check     # node --check every source file
node bin/dropui.js --help
```
