const os = require('os');

console.log('Total Memory (MB):', (os.totalmem() / 1024 / 1024).toFixed(2));
console.log('Free Memory (MB):', (os.freemem() / 1024 / 1024).toFixed(2));
