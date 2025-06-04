````markdown
# Express Local IP Server

This project sets up a simple Express.js server that displays the local IP address dynamically and is accessible over local Wi-Fi.

---

## 🚀 Features

- Displays local IP address using Node's `os` module
- Auto-restart server on file changes using `nodemon`
- Accessible from other devices on the same network

---

## 🛠️ Setup Instructions

### 1. Clone or Create Project Folder
```bash
mkdir my-express-app
cd my-express-app
````

### 2. Initialize the Project

```bash
npm init -y
```

### 3. Install Dependencies

```bash
npm install express
```

### 4. Install Dev Dependency (nodemon)

```bash
npm install --save-dev nodemon
```

---

## 🔄 Add Scripts in `package.json`

Update the `"scripts"` section to:

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

---

## 🏃‍♂️ Run the Server

To start the server with auto-reload using `nodemon`:

```bash
npm run dev
```

Expected output:

```
Server is running at:
-> http://localhost:3000
-> http://192.168.x.x:3000 (accessible over local Wi-Fi)
```

---

## 📡 Access from Other Devices

Make sure your device is connected to the same local Wi-Fi network. Then open the local IP address shown in the terminal (e.g., `http://192.168.1.100:3000`) on another device’s browser.

---
