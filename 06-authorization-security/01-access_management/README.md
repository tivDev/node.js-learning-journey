# Access Management System

A secure Node.js/Express API with JWT authentication, MySQL storage, and role-based access control.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Database](#database)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Security Notes](#security-notes)

## Features
- ✅ User registration with password hashing
- ✅ JWT token authentication
- ✅ Role-based access control (Admin/User)
- ✅ Protected routes with middleware
- ✅ Auto-created admin user on startup
- ✅ User profile management
- ✅ Token expiration handling

## Tech Stack
- **Backend**: Node.js, Express
- **Database**: MySQL
- **Security**: bcryptjs, JWT
- **Environment**: dotenv
- **Dev Tools**: nodemon
- **Real-time Communication**: Socket.io
- **Dev Tools**: nodemon 
  

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` file:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=jwt_auth_db

JWT_SECRET=your_strong_secret_here
JWT_EXPIRES_IN=1h
```

> Generate a strong JWT secret:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### 3. Initialize Database
```bash
npm run migrate     # Create tables
npm run seed        # Seed default data
npm run setpermissions  # Configure permissions
```

### 4. Start Server
```bash
npm run dev
```
Server runs at `http://localhost:3000`

## Database Schema
**Tables**:
- `users` - User accounts
- `roles` - User roles (admin/user)
- `auth_sessions` - Authentication sessions for users
- `permissions` - System permissions 
- `user_role` - System user roles 
- `role_permissions` - Role-permission mapping 
- `activity_logs` - Store all user activity
- `notifications` - Notification records for users
- `user_notifications` - User notification records
- `items` - Items in the system

Default data created on startup:
- System Manger: `system_manager@example.com` / `system123`
- Roles: `system manger`, `admin`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/auth/me` | Get current user profile |
| POST | `/api/auth/logout` | Invalidate token |


## Usage

### Testing with Postman
1. Create environment variable `auth_token`
2. Add this to Login request's **Tests** tab:
```javascript
if (pm.response.code === 200) {
    pm.environment.set("auth_token", pm.response.json().token);
}
```
3. For protected routes, add header:
   - `Authorization: Bearer {{auth_token}}`
   
### Run with Live Server to Test Client Integration

To run `index.html` with Live Server, ensure you have the Live Server extension installed in your code editor (e.g., Visual Studio Code). Follow these steps:

1. Open `index.html` in your editor.
2. Right-click on the `index.html` file in the editor.
3. Select **Open with Live Server** from the context menu.

This will open `index.html` in your default web browser and automatically reload the page when changes are made.

Alternatively, you can use the command palette:
- Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) to open the command palette.
- Type **Live Server: Open with Live Server** and press `Enter`.

This is helpful for testing the client-side integration with the API endpoints.

## Security Notes
- 🔒 Always use HTTPS in production
- 🚫 Never commit `.env` to version control
- ⏳ Tokens expire based on `JWT_EXPIRES_IN` (default: 1 hour)
- ♻️ Implement server-side token blacklist for logout if needed

---

> Default admin credentials are for development only - change in production!


