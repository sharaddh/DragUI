# DropUI

DropUI is a full-stack visual app builder that combines a React-based builder UI, an admin dashboard, a shared backend service, a CLI generation tool, and template-driven code storage.

## Current Architecture

```text
DropUI/
├── Client/         # User-facing builder frontend application
├── admin/          # Admin dashboard and registry interface
├── server/         # Backend API, auth engine, and project routes
├── DragUi-cli/     # CLI tool for login, pull, and project generation
├── templates/      # File-based frontend/backend template storage
├── PROJECT_BLUEPRINT.md # Architecture and system overview
└── README.md       # Project overview and startup instructions
```

## Apps and Responsibilities

### Client

The main builder frontend where users can:

- sign in and manage sessions
- access the visual project builder
- work with components and page structure
- open the CLI login flow

Tech stack:

- React 19
- Vite
- Tailwind CSS 4
- React Router
- Zustand
- Axios
- DnD Kit

### Admin

The admin interface manages the registry and admin operations.

Current features include:

- admin login
- protected admin dashboard
- component creation and management

Tech stack:

- React 18
- Vite
- Axios

### Server

The shared backend provides authentication, admin APIs, project endpoints, and registry routes.

Current stack:

- Node.js
- Express 5
- MongoDB / Mongoose
- JWT
- Passport.js for OAuth
- express-session
- Multer

### CLI

The CLI tool enables developer workflows with local authentication and project pull generation.

Current commands:

- `dropui login`
- `dropui pull <projectId>`
- `dropui logout`
- `dropui whoami`

CLI implementation uses:

- Node.js
- local callback server
- browser open flow
- token storage via config helpers

### Templates

The `templates/` folder contains file-based code templates for frontend and backend assets. These templates are intended for project generation and code scaffolding.

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- MongoDB running locally

### Run the backend server

```bash
cd server
npm install
node server.js
```

### Run the client builder

```bash
cd Client
npm install
npm run dev
```

### Run the admin dashboard

```bash
cd admin
npm install
npm run dev
```

### Use the CLI

```bash
cd DragUi-cli
npm install
npm link

dropui login
dropui whoami
dropui pull <projectId>
```

## Notes

- The current project architecture is based on the workspace folders and package configurations present in this repository.
- For a full architectural overview, see `PROJECT_BLUEPRINT.md`.
