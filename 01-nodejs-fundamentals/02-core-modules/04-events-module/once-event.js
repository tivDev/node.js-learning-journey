const EventEmitter = require('events');

const emitter = new EventEmitter();

emitter.once('init', () => {
  console.log('Init event will run only once');
});

emitter.emit('init');
emitter.emit('init'); // won't be handled
