const { loadTodos, saveTodos } = require('../utils/fileManager');

function removeTask(index) {
  const todos = loadTodos();
  if (index < 1 || index > todos.length) {
    return console.log("⚠️ Invalid task number.");
  }
  const removed = todos.splice(index - 1, 1);
  saveTodos(todos);
  console.log(`🗑️ Removed: "${removed[0].task}"`);
}

module.exports = removeTask;
