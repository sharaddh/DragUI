# Admin System Setup & Usage Guide

## Overview

I've created a complete admin authentication system with component management for your DragUI project. Here's what has been built:

### What's Included

1. **Backend (Node/Express)**
   - Admin model with password hashing using bcryptjs
   - JWT-based authentication
   - Protected API routes
   - Component creation, retrieval, and deletion endpoints

2. **Frontend (React)**
   - Admin login/registration interface
   - Admin dashboard with component management
   - Form for creating new components
   - Component listing and deletion
   - Token-based authentication

---

## Quick Start

### Step 1: Backend Setup

```bash
cd server
npm install
# bcryptjs is already in package.json
```

Make sure your `.env` file has:
```
MONGO_URI=mongodb://localhost:27017/dragui
JWT_SECRET=your_secret_key_here
PORT=5000
```

Start the server:
```bash
node server.js
```

### Step 2: Admin Frontend Setup

```bash
cd admin
npm install
npm run dev
```

The admin dashboard will open at `http://localhost:3001`

---

## Usage Flow

### 1. Register Admin Account

- Go to `http://localhost:3001`
- Click "Register" (or toggle from login)
- Enter:
  - **Admin ID**: Your unique admin identifier (e.g., "admin1")
  - **Email**: Admin email (optional)
  - **Password**: Strong password
- Click "Register"

### 2. Login

- Use your Admin ID and Password
- Token is stored in localStorage
- You're now on the Admin Dashboard

### 3. Create Components

On the dashboard left side:
1. Fill in component details:
   - **Component Name**: e.g., "CustomButton"
   - **Type**: e.g., "button", "card", "form"
   - **Category**: e.g., "UI", "Layout", "Input"
   - **Props** (optional): Comma-separated, e.g., "color,size,disabled"
   - **Files**: Upload component files (optional)

2. Click "Create Component"

### 4. Manage Components

- View all created components on the right side
- See component details (name, type, category, props, file count)
- Delete components with the "Delete" button

---

## API Endpoints

### Authentication Endpoints

**Register Admin**
```
POST /api/admin-auth/register
Content-Type: application/json

{
  "adminId": "admin1",
  "password": "password123",
  "email": "admin@example.com"
}

Response:
{
  "message": "Admin registered successfully",
  "token": "jwt_token_here",
  "admin": {
    "adminId": "admin1",
    "email": "admin@example.com"
  }
}
```

**Login**
```
POST /api/admin-auth/login
Content-Type: application/json

{
  "adminId": "admin1",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "admin": {
    "adminId": "admin1",
    "email": "admin@example.com"
  }
}
```

**Get Profile** (Protected)
```
GET /api/admin-auth/profile
Authorization: Bearer jwt_token_here

Response: Admin object (without password)
```

### Component Management Endpoints

**Create Component** (Protected)
```
POST /api/admin/component
Authorization: Bearer jwt_token_here
Content-Type: multipart/form-data

Form fields:
- name: string (required)
- type: string (required)
- category: string (required)
- props: string (optional, comma-separated)
- files: file[] (optional)

Response:
{
  "message": "Component created successfully",
  "component": {
    "_id": "...",
    "name": "CustomButton",
    "type": "button",
    "category": "UI",
    "props": ["color", "size"],
    "files": ["file1.jsx"],
    "path": "button/CustomButton",
    "createdAt": "2024-..."
  }
}
```

**Get All Components** (Protected)
```
GET /api/admin/components
Authorization: Bearer jwt_token_here

Response: Array of component objects
```

**Delete Component** (Protected)
```
DELETE /api/admin/component/:id
Authorization: Bearer jwt_token_here

Response:
{
  "message": "Component deleted",
  "component": { ... }
}
```

---

## File Structure

```
DragUI/
├── admin/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminLogin.jsx          # Login/Register form
│   │   │   ├── AdminLogin.css
│   │   │   ├── AdminDashboard.jsx      # Main dashboard
│   │   │   └── AdminDashboard.css
│   │   ├── App.jsx                     # Main app component
│   │   ├── App.css
│   │   ├── main.jsx                    # React entry point
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── .env
│   ├── .gitignore
│   └── README.md
│
├── server/
│   ├── models/
│   │   ├── Admin.js                    # New admin model
│   │   ├── user.js                     # Existing user model
│   │   ├── Project.js
│   │   └── components.js
│   ├── middleware/
│   │   ├── adminAuth.js                # New admin auth middleware
│   │   ├── auth.middleware.js          # Existing auth
│   │   └── upload.js
│   ├── routes/
│   │   ├── adminAuth.js                # New admin auth routes
│   │   ├── admin.js                    # Updated with auth
│   │   ├── authRoutes.js
│   │   └── components.js
│   ├── server.js                       # Updated with admin routes
│   ├── package.json
│   └── .env
```

---

## Security Features

✅ **Password Hashing**: Passwords are hashed with bcryptjs before storing  
✅ **JWT Tokens**: Secure token-based authentication  
✅ **Protected Routes**: All admin endpoints require valid authentication  
✅ **Token Expiration**: Tokens expire after 7 days  
✅ **Input Validation**: Required fields are validated  

---

## Customization

### Change Port
Edit `admin/vite.config.js`:
```js
server: {
  port: 3002  // Change port here
}
```

### Change JWT Secret
In your `.env`:
```
JWT_SECRET=your_very_strong_secret_key
```

### Change Token Expiration
Edit `server/routes/adminAuth.js`:
```js
const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
  expiresIn: "7d"  // Change this
});
```

---

## Troubleshooting

**"No token provided"**
- Make sure you're logged in
- Check if token is in localStorage

**"Invalid admin ID or password"**
- Check credentials are correct
- Make sure admin was registered first

**"Component not created"**
- Fill in all required fields (name, type, category)
- Check network connection to server

**CORS errors**
- Make sure server is running on port 5000
- Check CORS is enabled in server.js

---

## Next Steps

You can now:
1. ✅ Register admin accounts
2. ✅ Login securely
3. ✅ Create components with details
4. ✅ Manage component library
5. 🔄 Connect to user interface for component display

To integrate these components into your UI builder, you can fetch them from `/api/admin/components` endpoint.

---

## Support

For issues or questions about the admin system, check:
- Server logs in terminal
- Browser console for frontend errors
- Network tab in DevTools for API issues
