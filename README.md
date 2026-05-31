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

```
DragUI
├─ admin
│  ├─ .env
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ README.md
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ components
│  │  │  ├─ AdminDashboard.css
│  │  │  ├─ AdminDashboard.jsx
│  │  │  ├─ AdminLogin.css
│  │  │  ├─ AdminLogin.jsx
│  │  │  ├─ ComponentBuilder.css
│  │  │  └─ ComponentBuilder.jsx
│  │  ├─ index.css
│  │  └─ main.jsx
│  └─ vite.config.js
├─ ADMIN_SETUP.md
├─ Client
│  ├─ .env
│  ├─ dist
│  │  ├─ assets
│  │  │  ├─ index-DJvNIQua.css
│  │  │  └─ index-ekN-yH-o.js
│  │  ├─ favicon.svg
│  │  ├─ icons.svg
│  │  └─ index.html
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ src
│  │  ├─ api
│  │  │  ├─ auth.js
│  │  │  ├─ component.js
│  │  │  ├─ index.jsx
│  │  │  └─ Project.js
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  └─ vite.svg
│  │  ├─ components
│  │  │  ├─ Background.jsx
│  │  │  ├─ Canvas.jsx
│  │  │  ├─ Navbar.jsx
│  │  │  ├─ PropertiesPanel.jsx
│  │  │  ├─ PropertiesPanelAdvanced.jsx
│  │  │  ├─ Renderer.jsx
│  │  │  ├─ save.jsx
│  │  │  ├─ SaveButton.jsx
│  │  │  ├─ Shortcuts.jsx
│  │  │  ├─ Sidebar.jsx
│  │  │  └─ TreeView.jsx
│  │  ├─ context
│  │  │  └─ authContext.jsx
│  │  ├─ DropUi
│  │  │  ├─ components
│  │  │  │  ├─ Button
│  │  │  │  │  ├─ Button.jsx
│  │  │  │  │  └─ config.js
│  │  │  │  ├─ container
│  │  │  │  │  ├─ config.js
│  │  │  │  │  └─ Container.jsx
│  │  │  │  └─ Sidebar
│  │  │  │     ├─ config.js
│  │  │  │     └─ Sidebar.jsx
│  │  │  └─ index.js
│  │  ├─ GeneratedUI.jsx
│  │  ├─ hooks
│  │  │  └─ useRegistry.js
│  │  ├─ index.css
│  │  ├─ main.jsx
│  │  ├─ middleware
│  │  │  └─ ProtectedRoute.jsx
│  │  ├─ pages
│  │  │  ├─ Admin.jsx
│  │  │  ├─ AuthSuccess.jsx
│  │  │  ├─ Builder.jsx
│  │  │  ├─ CliLogin.jsx
│  │  │  ├─ Dashboard.jsx
│  │  │  └─ Login.jsx
│  │  ├─ store
│  │  │  └─ useBuilderStore.js
│  │  └─ utils
│  │     ├─ cssProps.js
│  │     ├─ helpers.js
│  │     └─ registry.js
│  └─ vite.config.js
├─ DragUi-cli
│  ├─ bin
│  │  └─ index.js
│  ├─ commands
│  │  ├─ login.js
│  │  ├─ logout.js
│  │  ├─ pull.js
│  │  └─ whoami.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ src
│  │  └─ pages
│  │     └─ clilogin.jsx
│  └─ utils
│     ├─ api.js
│     ├─ config.js
│     ├─ detect.js
│     └─ logger.js
├─ PROJECT_BLUEPRINT.md
├─ README.md
├─ server
│  ├─ .env
│  ├─ config
│  │  └─ Passport.js
│  ├─ middleware
│  │  ├─ adminAuth.js
│  │  ├─ auth.middleware.js
│  │  └─ upload.js
│  ├─ models
│  │  ├─ Admin.js
│  │  ├─ components.js
│  │  ├─ Project.js
│  │  └─ user.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ routes
│  │  ├─ admin.js
│  │  ├─ adminAuth.js
│  │  ├─ authRoutes.js
│  │  ├─ components.js
│  │  └─ projectRoutes.js
│  ├─ server.js
│  ├─ templates
│  │  └─ frontend
│  │     ├─ dsf
│  │     │  └─ WhatsApp Image 2026-05-30 at 3.53.14 PM.jpeg
│  │     ├─ lolo
│  │     │  └─ me.png
│  │     └─ Sharad
│  │        └─ me.png
│  └─ utils
│     └─ generateCode.js
├─ temp-generated.jsx
└─ templates
   ├─ backend
   └─ frontend

```
```
DragUI
├─ admin
│  ├─ .env
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ README.md
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ components
│  │  │  ├─ AdminDashboard.css
│  │  │  ├─ AdminDashboard.jsx
│  │  │  ├─ AdminLogin.css
│  │  │  ├─ AdminLogin.jsx
│  │  │  ├─ ComponentBuilder.css
│  │  │  └─ ComponentBuilder.jsx
│  │  ├─ index.css
│  │  └─ main.jsx
│  └─ vite.config.js
├─ ADMIN_SETUP.md
├─ Client
│  ├─ .env
│  ├─ dist
│  │  ├─ assets
│  │  │  ├─ index-DJvNIQua.css
│  │  │  └─ index-ekN-yH-o.js
│  │  ├─ favicon.svg
│  │  ├─ icons.svg
│  │  └─ index.html
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ src
│  │  ├─ api
│  │  │  ├─ auth.js
│  │  │  ├─ component.js
│  │  │  ├─ index.jsx
│  │  │  └─ Project.js
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  └─ vite.svg
│  │  ├─ components
│  │  │  ├─ Background.jsx
│  │  │  ├─ Canvas.jsx
│  │  │  ├─ Navbar.jsx
│  │  │  ├─ PropertiesPanel.jsx
│  │  │  ├─ PropertiesPanelAdvanced.jsx
│  │  │  ├─ Renderer.jsx
│  │  │  ├─ save.jsx
│  │  │  ├─ SaveButton.jsx
│  │  │  ├─ Shortcuts.jsx
│  │  │  ├─ Sidebar.jsx
│  │  │  └─ TreeView.jsx
│  │  ├─ context
│  │  │  └─ authContext.jsx
│  │  ├─ DropUi
│  │  │  ├─ components
│  │  │  │  ├─ Button
│  │  │  │  │  ├─ Button.jsx
│  │  │  │  │  └─ config.js
│  │  │  │  ├─ container
│  │  │  │  │  ├─ config.js
│  │  │  │  │  └─ Container.jsx
│  │  │  │  └─ Sidebar
│  │  │  │     ├─ config.js
│  │  │  │     └─ Sidebar.jsx
│  │  │  └─ index.js
│  │  ├─ GeneratedUI.jsx
│  │  ├─ hooks
│  │  │  └─ useRegistry.js
│  │  ├─ index.css
│  │  ├─ main.jsx
│  │  ├─ middleware
│  │  │  └─ ProtectedRoute.jsx
│  │  ├─ pages
│  │  │  ├─ Admin.jsx
│  │  │  ├─ AuthSuccess.jsx
│  │  │  ├─ Builder.jsx
│  │  │  ├─ CliLogin.jsx
│  │  │  ├─ Dashboard.jsx
│  │  │  └─ Login.jsx
│  │  ├─ store
│  │  │  └─ useBuilderStore.js
│  │  └─ utils
│  │     ├─ cssProps.js
│  │     ├─ helpers.js
│  │     └─ registry.js
│  └─ vite.config.js
├─ DragUi-cli
│  ├─ bin
│  │  └─ index.js
│  ├─ commands
│  │  ├─ login.js
│  │  ├─ logout.js
│  │  ├─ pull.js
│  │  └─ whoami.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ src
│  │  └─ pages
│  │     └─ clilogin.jsx
│  └─ utils
│     ├─ api.js
│     ├─ config.js
│     ├─ detect.js
│     └─ logger.js
├─ PROJECT_BLUEPRINT.md
├─ README.md
├─ server
│  ├─ .env
│  ├─ config
│  │  └─ Passport.js
│  ├─ middleware
│  │  ├─ adminAuth.js
│  │  ├─ auth.middleware.js
│  │  └─ upload.js
│  ├─ models
│  │  ├─ Admin.js
│  │  ├─ components.js
│  │  ├─ Project.js
│  │  └─ user.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ routes
│  │  ├─ admin.js
│  │  ├─ adminAuth.js
│  │  ├─ authRoutes.js
│  │  ├─ components.js
│  │  └─ projectRoutes.js
│  ├─ server.js
│  ├─ templates
│  │  └─ frontend
│  │     ├─ dsf
│  │     │  └─ WhatsApp Image 2026-05-30 at 3.53.14 PM.jpeg
│  │     ├─ lolo
│  │     │  └─ me.png
│  │     └─ Sharad
│  │        └─ me.png
│  └─ utils
│     └─ generateCode.js
├─ temp-generated.jsx
└─ templates
   ├─ backend
   └─ frontend

```