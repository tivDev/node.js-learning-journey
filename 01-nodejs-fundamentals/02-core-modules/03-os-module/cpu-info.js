const os = require('os');

const cpus = os.cpus();
console.log('CPU Info:', cpus);
console.log('Number of Cores:', cpus.length);
