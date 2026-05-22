# DropUI Architecture Overview

This document describes the current codebase architecture and how the repository is organized today.

## Current Workspace Layout

```text
DropUI/
├── Client/         # User-facing visual builder app
├── admin/          # Admin dashboard and registry UI
├── server/         # Backend API, auth, and project routes
├── DragUi-cli/     # CLI tool for login and pull workflows
├── templates/      # Frontend and backend templates
├── PROJECT_BLUEPRINT.md # Architecture overview
└── README.md       # Project summary and startup guide
```

## 1️⃣ Client App

### Purpose

The `Client` app is the main builder experience for users. It hosts the UI where users can log in, manage projects, and work with the visual builder.

### Key Tech

- React 19
- Vite
- Tailwind CSS 4
- React Router
- Zustand
- Axios
- @dnd-kit for drag-and-drop

### What exists today

- login and authentication flows
- a builder interface
- CLI login page support
- project management pages

## 2️⃣ Admin Dashboard

### Purpose

The `admin` app is used by administrators to manage registry data, components, and admin sessions.

### Key Tech

- React 18
- Vite
- Axios

### What exists today

- admin login screen
- admin dashboard UI
- component creation and listing
- admin token handling in localStorage

## 3️⃣ Backend Server

### Purpose

The `server` app provides backend services for auth, admin APIs, public components, and project data.

### Key Tech

- Express 5
- MongoDB / Mongoose
- JWT for token issuing
- Passport.js for OAuth
- express-session
- CORS
- Multer for uploads

### Main routes

- `/api/auth` — auth routes for email, Google, and GitHub
- `/api/project` — project-related APIs
- `/api/admin-auth` — admin authentication
- `/api/admin` — admin-only APIs
- `/api/component` — component registry APIs

## 4️⃣ CLI Tool

### Purpose

The `DragUi-cli` package supports developer interactions outside the browser.

### Current features

- browser-based login flow with localhost callback
- token capture and storage
- project pull workflow
- user identity inspection

### Commands

- `dropui login`
- `dropui pull <projectId>`
- `dropui logout`
- `dropui whoami`

## 5️⃣ Template Storage

### Purpose

The `templates/` directory stores reusable frontend and backend template files that can be used for project generation.

### Current layout

```text
templates/
├── frontend/
└── backend/
```

## Notes on Current Architecture

This blueprint intentionally reflects the workspace as it exists today. It avoids speculative features and instead focuses on the implemented structure, tools, and current repo layout.

If you want, I can also update the blueprint with precise route-level and component-level mappings from `server/routes/`, `Client/src/`, and `admin/src/`.
