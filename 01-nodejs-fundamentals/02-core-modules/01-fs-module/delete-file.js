// delete-file.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'output.txt');

fs.unlink(filePath, (err) => {
  if (err) {
    console.error('Error deleting file:', err);
    return;
  }
  console.log('File deleted successfully.');
});

