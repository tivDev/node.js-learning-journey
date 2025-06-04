const add = require('./commands/add');
const list = require('./commands/list');
const remove = require('./commands/remove');
const done = require('./commands/done');

const [command, ...args] = process.argv.slice(2);

switch (command) {
  case 'add':
    add(args.join(' '));
    break;
  case 'list':
    list();
    break;
  case 'remove':
    remove(parseInt(args[0]));
    break;
  case 'done':
    done(parseInt(args[0]));
    break;
  default:
    console.log(`❓ Unknown command: "${command}"`);
    console.log(`Usage:
    node index.js add "Buy milk"
    node index.js list
    node index.js done 1
    node index.js remove 1`);
}
