Here’s your `README.md` for the `04-http-server/` folder:

---

### 📄 `README.md`

```markdown
# 🌐 Basic HTTP Server in Node.js

This is a simple HTTP server built using Node.js's core `http` module — no frameworks, no dependencies.

## 📁 Folder Structure

```

04-http-server/
└── basic-http-server.js

````

## 🚀 Features

- Handles basic routing:
  - `/` → Home page
  - `/about` → About page
  - All other paths → 404 Not Found
- Returns HTML responses
- Uses only built-in Node.js modules

## 📦 Technologies Used

- Node.js (Core `http` module)

## ▶️ How to Run

1. Open your terminal and navigate to the project folder:

   ```bash
   cd 04-http-server
````

2. Run the server:

   ```bash
   node basic-http-server.js
   ```

3. Open your browser and try:

   * [http://localhost:3000/](http://localhost:3000/) → Home page
   * [http://localhost:3000/about](http://localhost:3000/about) → About page
   * [http://localhost:3000/xyz](http://localhost:3000/xyz) → 404 page

## 🧠 What You'll Learn

* How to create an HTTP server using Node.js
* How to handle different routes manually
* How to send HTML content from a Node.js server

## 💡 Next Steps

* Serve static HTML files
* Build a basic REST API
* Add Express.js for cleaner routing

---


