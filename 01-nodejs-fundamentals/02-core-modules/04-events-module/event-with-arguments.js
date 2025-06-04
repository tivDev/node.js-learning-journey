const EventEmitter = require('events');

const emitter = new EventEmitter();

emitter.on('greet', (name, age) => {
  console.log(`Hello ${name}, you are ${age} years old!`);
});

emitter.emit('greet', 'Tiv', 25);
