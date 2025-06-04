const EventEmitter = require('events');

const emitter = new EventEmitter();

// Register a listener
emitter.on('start', () => {
  console.log('Start event triggered!');
});

// Emit the event
emitter.emit('start');
