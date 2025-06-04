// read-file.js

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'sample.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log('File contents:\n', data);
});
