const { loadTodos, saveTodos } = require('../utils/fileManager');

function markDone(index) {
  const todos = loadTodos();
  if (index < 1 || index > todos.length) {
    return console.log("⚠️ Invalid task number.");
  }
  todos[index - 1].done = true;
  saveTodos(todos);
  console.log(`🎉 Marked as done: "${todos[index - 1].task}"`);
}

module.exports = markDone;
