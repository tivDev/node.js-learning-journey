
# 📡 Express Local IP Server – Request Body Handling Example

A simple and robust Express.js server designed to demonstrate handling request bodies (e.g., POST requests with JSON, form data, or file uploads). The server dynamically displays the local IP address and is accessible across your local Wi-Fi network.

---

## ✨ Features

* ✅ **Request Body Parsing**
  Supports both JSON and `multipart/form-data` using custom middleware.

* 🔐 **Request Validation**
  Validates required fields in incoming POST requests.

* 📁 **File Uploads**
  Handles file uploads efficiently using [Multer](https://github.com/expressjs/multer).

* 🌐 **Local Network Access**
  Displays your machine’s local IP address and enables access from other devices on the same network.

* 🔄 **Hot Reloading**
  Uses `nodemon` for automatic server restarts on file changes during development.

---

## ⚙️ Installation & Usage

1. **Install Dependencies**

   ```bash
   npm install express multer nodemon
   ```

2. **Run the Server**

   ```bash
   npm run dev
   ```


