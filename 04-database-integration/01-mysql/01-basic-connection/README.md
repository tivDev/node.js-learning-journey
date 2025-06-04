Perfect! Now that you've added **nodemon** to your project, here's the **updated `README.md` description** with nodemon and Express API mentioned:

---

### 📄 Updated `README.md` Description

```markdown
# 🔌 01 - Basic MySQL Connection with Express API

This project demonstrates how to:

- Set up a basic MySQL connection using Node.js and `mysql2`
- Use `dotenv` to manage environment variables
- Build a simple Express server
- Create a test API endpoint to check database connectivity
- Use `nodemon` for automatic server restarts during development

## 📁 Folder Structure

```

01-basic-connection/
├── db/
│   └── connection.js        # MySQL connection using dotenv
├── .env                     # Environment variables
├── index.js                 # Express server with test API
├── package.json             # Project metadata and scripts
└── README.md                # Project documentation

````

## ⚙️ Setup

1. **Install dependencies**:

```bash
npm install
npm install --save-dev nodemon
````

2. **Create a `.env` file**:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=test_db
```

3. **Start the server**:

* For normal run:

  ```bash
  node index.js
  ```
* For development with auto-reload:

  ```bash
  npx nodemon index.js
  ```

## 🔗 Test the API

Open your browser or use Postman:

```
GET http://localhost:3000/api/test
```

### ✅ Success Response:

```json
{
  "message": "✅ Connected to MySQL!",
  "result": 2
}
```

## 📝 Notes

* Make sure MySQL is running.
* The database `test_db` should already exist.
* You can customize SQL queries inside the `/` route to experiment further.

```

