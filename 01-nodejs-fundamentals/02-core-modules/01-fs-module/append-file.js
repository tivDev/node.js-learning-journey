// append-file.js

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'output.txt');

const moreData = '\nThis line is appended to the file.';

fs.appendFile(filePath, moreData, 'utf8', (err) => {
  if (err) {
    console.error('Error appending file:', err);
    return;
  }
  console.log('File has been updated.');
});
