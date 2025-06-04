# 🚀 CRUD Users API with Node.js, Express & MySQL

This project is a simple **RESTful API** built using **Node.js**, **Express**, and **MySQL** to manage user data. The project follows a clean MVC-like structure with controllers, routes, and database configuration separated.

---

## 📦 Installation

1. **Initialize Project**

```bash
npm init -y
```

2. **Install Dependencies**

```bash
npm install express mysql2 dotenv
```

3. **Install Dev Dependencies**

```bash
npm install --save-dev nodemon
```

---

## 🗂️ Project Structure

```
02-crud-users/
├── controllers/
│   └── userController.js     # Logic for user operations
├── db/
│   └── connection.js         # MySQL connection setup
├── routes/
│   └── userRoutes.js         # User-related endpoints
├── .env                      # Environment variables
├── index.js                  # Entry point
├── package.json
├── README.md
```

---

## ⚙️ Environment Setup

Create a `.env` file in the root:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=test_db
```

---

## 🧪 Run the Project

### Start in development mode:

```bash
npx nodemon index.js
```

Or add to `package.json`:

```json
"scripts": {
  "dev": "nodemon index.js"
}
```

Then run:

```bash
npm run dev
```

---

## 🧱 MySQL Table Setup

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE
);
```

---

## 📌 API Endpoints

| Method | Endpoint        | Description    |
| ------ | --------------- | -------------- |
| GET    | /api/users      | Get all users  |
| GET    | /api/users/\:id | Get user by ID |
| POST   | /api/users      | Create a user  |
| PUT    | /api/users/\:id | Update a user  |
| DELETE | /api/users/\:id | Delete a user  |

---

## ✅ Features

* Express-based API
* Modular controller structure
* MySQL database connection
* Environment variable support using `dotenv`
* Automatic server reload using `nodemon`


