Here’s your `README.md` file for the `todo-cli/` project, explaining how the CLI app works and how to use it:

---

### 📄 `README.md`

```markdown
# 📝 TODO CLI App (Node.js)

A simple command-line TODO app built using core Node.js — no external libraries.

## 📁 Folder Structure

```

todo-cli/
├── data/
│   └── todos.json         # Stores tasks in JSON format
├── index.js               # Entry point of the app
├── commands/              # Contains command logic
│   ├── add.js
│   ├── list.js
│   ├── remove.js
│   └── done.js
├── utils/
│   └── fileManager.js     # Handles reading/writing the file
└── README.md

````

## 🧩 Features

- ✅ Add a task
- 📋 List all tasks
- 🗑️ Remove a task
- ✔️ Mark a task as done

## 🚀 How to Run

### Add a Task
```bash
node index.js add "Buy groceries"
````

### List All Tasks

```bash
node index.js list
```

### Mark a Task as Done

```bash
node index.js done 1
```

### Remove a Task

```bash
node index.js remove 1
```

## 📦 Tech Stack

* Node.js (no third-party packages)
* JSON file as a simple database
* Command-line interface

## 💡 Future Enhancements

* Use external libraries like `chalk`, `yargs`, or `inquirer`
* Add due dates or priorities
* Export/Import task list
* Save tasks per user

---