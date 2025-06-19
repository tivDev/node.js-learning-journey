Here’s an updated README snippet with the new info about seeding a default user at startup, plus everything you need to get going — ready to share with your developers or collaborators:

````markdown
# JWT Authentication API

A simple Node.js/Express API implementing JWT-based authentication with MySQL, bcrypt, and token verification middleware.

---

## Features

- User registration with hashed passwords
- User login returning a JWT token
- Protected routes requiring JWT authentication
- User profile retrieval from token
- Logout mechanism (invalidate token on server side or client side)
- **Auto-creation of a default admin user on server start** (`admin@example.com` / `password`)

---

## Technologies Used

- Node.js
- Express
- MySQL
- bcryptjs
- jsonwebtoken
- dotenv
- nodemon (dev)

---

## Installation and Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Setup environment variables:**

   Create a `.env` file in the root folder with the following:

   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=your_database_name

   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=1h
   ```

   > Tip: Generate a strong JWT secret with:
   >
   > ```bash
   > node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   > ```

3. **Start the server:**

   ```bash
   npm run dev
   ```

   The API will run on [http://localhost:3000](http://localhost:3000).

   > On startup, the server will check if a user with email `admin@example.com` exists, and create it with password `password` if not.

---

## API Endpoints

* `POST /api/auth/register` - Register a new user
* `POST /api/auth/login` - Login and receive a JWT token
* `GET /api/auth/protected` - Protected route (requires JWT)
* `GET /api/auth/me` - Get current logged-in user profile (requires JWT)
* `POST /api/auth/logout` - Logout user (invalidate token if implemented)

---

## Using Postman with Automatic JWT Token Handling

To streamline your API testing in Postman, follow these steps to automatically store and send your JWT token:

### Step 1: Create Environment Variable

* In Postman, click the **Environment** dropdown (top-right).
* Choose **Manage Environments**.
* Create a new environment (e.g., `Development`).
* Add a variable named `auth_token` with empty values.

### Step 2: Capture Token After Login

* Open your **Login** request.
* In the **Tests** tab, add:

  ```javascript
  if (pm.response.code === 200) {
      let jsonResponse = pm.response.json();
      pm.environment.set("auth_token", jsonResponse.token);
  }
  ```

### Step 3: Use Token in Protected Requests

* For any protected request:

  * Add header:

    * Key: `Authorization`
    * Value: `Bearer {{auth_token}}`

### Step 4: Test Flow

* Select your environment.
* Send login request.
* Use protected routes with the saved token automatically.

---

## Notes

* Tokens expire based on `JWT_EXPIRES_IN` (default 1 hour).
* Logout endpoint implementation can be done server-side by blacklisting tokens or client-side by removing tokens.
* The default user created on startup is:

  * Email: `admin@example.com`
  * Password: `password`
* Remember to secure your `.env` file and never commit it to version control.

---

## Developer Notes

* Ensure your MySQL database is running and accessible with the credentials in `.env`.
* Before starting the server, run any migrations or create the required `users` table with columns `id`, `email` (unique), and `password`.
* The app seeds a default admin user if it does not exist on server start to help with initial testing.
* You can modify the default user credentials in the `utils/seedDefaultUser.js` file if needed.
* For production, update the JWT secret and consider implementing proper token invalidation for logout.

---

