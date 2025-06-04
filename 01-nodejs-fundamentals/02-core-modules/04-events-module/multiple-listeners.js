const EventEmitter = require('events');

const emitter = new EventEmitter();

emitter.on('alarm', () => console.log('Listener 1: Alarm ringing!'));
emitter.on('alarm', () => console.log('Listener 2: Wake up!'));

emitter.emit('alarm');
