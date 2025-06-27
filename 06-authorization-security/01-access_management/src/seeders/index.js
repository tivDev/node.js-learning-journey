const { seedUsers } = require('./usersSeeder');
const { seedRoles } = require('./rolesSeeder');
const { seedPermissions } = require('./permissionsSeeder');
const { seedUserRoles } = require('./userRolesSeeder');
const { seedRolePermissions } = require('./rolePermissionsSeeder');
const { seedItems } = require('./itemsSeeder');

const runSeeders = async () => {
  try {
    console.log('Starting database seeding...');
    
    // First seed system user and get the ID
    const systemUserId = await seedUsers();
    
    // Then seed other tables
    await seedRoles(systemUserId);
    await seedPermissions(systemUserId);
    await seedUserRoles();
    await seedRolePermissions();
    await seedItems();
    
    console.log('All seeders completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

runSeeders();