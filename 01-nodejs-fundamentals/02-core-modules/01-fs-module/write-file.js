// write-file.js

const fs = require('fs');
const path = require('path');

const content = 'Hello, this is written using fs.writeFile!';

const filePath = path.join(__dirname, 'data', 'output.txt');

fs.writeFile(filePath, content, 'utf8', (err) => {
  if (err) {
    console.error('Error writing file:', err);
    return;
  }
  console.log('File written successfully. Checking "data" directory.');
});

