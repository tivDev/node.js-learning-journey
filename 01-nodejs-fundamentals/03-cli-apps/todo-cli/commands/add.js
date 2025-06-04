const { loadTodos, saveTodos } = require('../utils/fileManager');

function addTask(task) {
  const todos = loadTodos();
  todos.push({ task, done: false });
  saveTodos(todos);
  console.log(`✅ Added: "${task}"`);
}

module.exports = addTask;
