// sync-vs-async.js

const fs = require('fs');

// Synchronous
const data = fs.readFileSync('sample.txt', 'utf8');
console.log('Sync read:', data);

// Asynchronous
fs.readFile('sample.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log('Async read:', data);
});

console.log('This logs before async read finishes.');
