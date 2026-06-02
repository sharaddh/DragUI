# DropUI

DropUI is a modular full-stack visual app builder that enables teams to design, manage, and generate React-based applications through a drag-and-drop builder, an admin registry dashboard, a shared backend API, and a developer CLI.

---

## 🚀 Overview

DropUI is designed for production-ready development workflows with separate apps for:

- **Client**: Visual builder and page editor
- **Admin**: Registry, component management, and administration
- **Server**: REST API, authentication, project storage, and code generation
- **CLI**: Developer tools for authentication and pulling generated projects
- **Templates**: Scaffolding assets for frontend and backend generation

This repository is intended as a complete end-to-end platform for building and exporting React applications from a low-code/no-code interface.

---

## 📁 Repository Structure

```text
DragUI/
├── Client/           # Builder frontend for end users
├── admin/            # Admin dashboard for registry and component management
├── server/           # Backend API, auth, storage, and generation services
├── DragUi-cli/       # CLI tool for authentication and project pull operations
├── templates/        # Frontend/backend scaffolding templates
├── ADMIN_SETUP.md    # Admin onboarding and setup notes
├── PROJECT_BLUEPRINT.md # Architecture and design documentation
└── README.md         # This file
```

---

## 🌟 Core Features

- Visual drag-and-drop UI builder
- Component registry and reusable component authoring
- Authentication for users and admin access
- Persistent project storage and versioned components
- CLI support for login, pull, and developer workflows
- Template-driven app generation for frontend and backend
- Extensible architecture for production deployments

---

## 🧩 Application Breakdown

### Client

**Purpose:** End-user builder application.

**Capabilities:**

- Sign in and manage sessions
- Build UI using drag-and-drop components
- Configure component properties and layout
- Preview generated UI in real time
- Save projects and component tree data

**Tech stack:**

- React 19
- Vite
- Tailwind CSS 4
- React Router
- Zustand
- Axios
- DnD Kit

### Admin

**Purpose:** Registry and admin management.

**Capabilities:**

- Admin login / protected routes
- Component and registry management
- Create and manage reusable component definitions
- Monitor project and user activity

**Tech stack:**

- React 18
- Vite
- Axios

### Server

**Purpose:** Backend API and generation engine.

**Capabilities:**

- Authentication and authorization
- Project CRUD endpoints
- Component registry API
- Code generation and template orchestration
- File upload handling and asset storage

**Tech stack:**

- Node.js
- Express 5
- MongoDB / Mongoose
- JWT
- Passport.js
- express-session
- Multer

### CLI

**Purpose:** Developer tooling and project synchronization.

**Capabilities:**

- `dropui login`
- `dropui pull <projectId>`
- `dropui logout`
- `dropui whoami`

**Implementation:**

- Node.js
- Local callback server
- Browser-based OAuth/auth flow
- Local config token storage

### Templates

**Purpose:** Static scaffolding assets for generated applications.

**Contents:**

- Frontend templates
- Backend templates
- Project generation resources

---

## ✅ Requirements

- Node.js 18+ installed
- npm 10+ installed
- MongoDB instance available locally or remotely
- Git for source control and CLI workflow

---

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd DragUI
```

### 2. Install dependencies for each app

```bash
cd server
npm install

cd ../Client
npm install

cd ../admin
npm install

cd ../DragUi-cli
npm install
```

### 3. Configure environment variables

Create `.env` files for each application as needed.

Recommended locations:

- `server/.env`
- `Client/.env`
- `admin/.env`

> The repo does not include committed secret values. Add your own API URLs, MongoDB connection strings, JWT secrets, and OAuth keys.

---

## 🚀 Run Locally

### Start the server

```bash
cd server
npm run dev
```

### Start the client builder

```bash
cd Client
npm run dev
```

### Start the admin dashboard

```bash
cd admin
npm run dev
```

### Use the CLI

```bash
cd DragUi-cli
npm link

dropui login
dropui whoami
dropui pull <projectId>
```

---

## 🧪 Production Build

### Build Client

```bash
cd Client
npm run build
```

### Build Admin

```bash
cd admin
npm run build
```

### Server Production

```bash
cd server
npm install --production
node server.js
```

### CLI Packaging

The CLI is designed to be installed globally or linked locally using `npm link`.

---

## 📦 Deployment Recommendations

- Host the server on a managed Node.js platform or container service
- Use MongoDB Atlas or a managed MongoDB cluster
- Deploy `Client` and `admin` as static Vite builds behind a CDN
- Secure API endpoints with HTTPS and JWT validation
- Configure environment variables securely in production
- Enable CORS only for trusted frontend origins

---

## 🔧 Folder Summary

### `Client/`

- `src/App.jsx` – main builder entry
- `src/components/` – builder UI components
- `src/api/` – API integration
- `src/pages/` – route pages
- `src/utils/` – helper functions and registry

### `admin/`

- `src/App.jsx` – admin app entry
- `src/components/` – admin UI screens and forms

### `server/`

- `server.js` – Express entrypoint
- `routes/` – API route definitions
- `controllers/` – request handling logic
- `models/` – MongoDB schemas
- `services/` – business logic and generation utilities
- `middleware/` – auth, upload, and error handling

### `DragUi-cli/`

- `bin/index.js` – CLI bootstrap
- `commands/` – command implementations
- `utils/` – shared helpers and auth flow

### `templates/`

- `backend/` – backend scaffolding templates
- `frontend/` – frontend scaffolding templates

---

## 📌 Notes

- See `PROJECT_BLUEPRINT.md` for full architectural details.
- Use `ADMIN_SETUP.md` for admin onboarding and registry instructions.
- `temp-generated.jsx` contains temporary generated UI output.

---

## 🤝 Contributing

If you want to contribute:

1. Fork the repository
2. Create a feature branch
3. Open a pull request with a clear description

---

## 📄 License

This project includes a `LICENCE` file in the repository root. Review it for license terms.
