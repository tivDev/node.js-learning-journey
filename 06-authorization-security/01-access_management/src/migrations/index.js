const { up } = require('./0001-initial-tables');

const runMigrations = async () => {
  try {
    console.log('Running migrations...');
    await up();
    console.log('Migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();