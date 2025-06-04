// basename-extname.js

const path = require('path');

const file = path.join(__dirname, 'data', 'report.pdf');

console.log('Base name:', path.basename(file)); // report.pdf
console.log('Ext name:', path.extname(file));   // .pdf

