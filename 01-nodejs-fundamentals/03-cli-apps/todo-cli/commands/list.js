const { loadTodos } = require('../utils/fileManager');

function listTasks() {
  const todos = loadTodos();
  if (!todos.length) return console.log("📭 No tasks found.");
  todos.forEach((todo, i) => {
    const status = todo.done ? "✅" : "❌";
    console.log(`${i + 1}. [${status}] ${todo.task}`);
  });
}

module.exports = listTasks;
