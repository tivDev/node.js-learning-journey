const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

myEmitter.on('launch', () => {
  console.log('Launch sequence initiated...');
});

myEmitter.emit('launch');
