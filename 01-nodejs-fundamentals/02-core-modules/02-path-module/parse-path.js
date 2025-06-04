// parse-path.js

const path = require('path');

const filePath = path.join(__dirname, 'data', 'index.js');
const parsed = path.parse(filePath);

console.log(parsed);

// { root: '/Users/tiv/',
//   dir: '/Users/tiv/data',
//   base: 'index.js',
//   ext: '.js',
//   name: 'index' }
