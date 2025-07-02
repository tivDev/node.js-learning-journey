const db = require('../config/database');
require('dotenv').config();

const dbName = process.env.DB_NAME;
const systemUserId = 1; // Adjust or fetch dynamically if needed

module.exports.seedRolePermissions = async () => {
  console.log('🔁 Seeding role permissions...\n');

  try {
    const values = [];

    // Get all table names from current DB
    const [tables] = await db.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = ?`,
      [dbName]
    );
    const tableNames = tables
      .map(row => row.table_name)
      .filter(name => name !== 'migrations' && !name.startsWith('auth_'));

    const [roles] = await db.query('SELECT id, name FROM roles');
    const [permissions] = await db.query('SELECT id, name FROM permissions');

    const permissionMap = {};
    for (const p of permissions) {
      permissionMap[`${p.name}`] = p.id;
    }

    for (const role of roles) {
      for (const tableName of tableNames) {
        if (role.id === 1) {
          // Role 1: Full access to all tables
          for (const permission of permissions) {
            values.push([
              role.id,
              permission.id,
              tableName,
              systemUserId,
              systemUserId,
            ]);
          }
        } 
        else if (role.id === 2 && ['users', 'roles', 'items', 'notifications'].includes(tableName)) {
          // Role 2: Full access to specific tables
          for (const permission of permissions) {
            values.push([
              role.id,
              permission.id,
              tableName,
              systemUserId,
              systemUserId,
            ]);
          }
        } 
        else if (role.id === 3 && tableName === 'items') {
          // Role 3: Read & Update only on 'items'
          ['read', 'update'].forEach(action => {
            if (permissionMap[action]) {
              values.push([
                role.id,
                permissionMap[action],
                tableName,
                systemUserId,
                systemUserId,
              ]);
            }
          });
        } 
        else if (role.id === 4 && tableName === 'items') {
          // Role 4: Read only on 'items'
          if (permissionMap['read']) {
            values.push([
              role.id,
              permissionMap['read'],
              tableName,
              systemUserId,
              systemUserId,
            ]);
          }
        }
        // Other roles (id > 4) won't get any permissions by default
        // Add additional conditions here if needed
      }
    }

    if (values.length > 0) {
      await db.query(
        `INSERT IGNORE INTO role_permissions 
        (role_id, permission_id, target_table, created_by, modified_by) 
        VALUES ?`,
        [values]
      );
      console.log(`✅ Inserted ${values.length} role_permission records.`);
    } else {
      console.log('⚠️  No values to insert.');
    }

    console.log('\n✅ Role permissions seeding complete.');
  } catch (error) {
    console.error('\n❌ Error seeding role permissions:', error.message);
    throw error;
  }
};