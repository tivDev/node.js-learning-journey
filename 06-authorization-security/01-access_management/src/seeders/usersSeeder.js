// src/seeders/usersSeeder.js

const db = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports.seedUsers = async () => {
  const users = [
    { name: 'System Manager', email: 'system_manager@example.com', password: 'system123' },
    { name: 'Administrator', email: 'admin@example.com', password: 'admin123' },
    { name: 'Editor', email: 'editor@example.com', password: 'editor123' },
    { name: 'Viewer', email: 'viewer@example.com', password: 'viewer123' },
    { name: 'Guest', email: 'guest@example.com', password: 'guest123' },
  ];

  console.log('Seeding users...');
  
  try {
    // First create system user (needed for created_by references)
    const systemUser = users[0];
    const hashedSystemPw = await bcrypt.hash(systemUser.password, 10);
    await db.query(
      'INSERT INTO users (name, email, password, created_by, modified_by) VALUES (?, ?, ?, 1, 1)',
      [systemUser.name, systemUser.email, hashedSystemPw]
    );

    // Get system user ID
    const [systemUserRow] = await db.query('SELECT id FROM users WHERE email = ?', [systemUser.email]);
    const systemUserId = systemUserRow[0].id;

    // Update system user to reference itself
    await db.query('UPDATE users SET created_by = ?, modified_by = ? WHERE id = ?', 
      [systemUserId, systemUserId, systemUserId]);

    // Create other users
    for (const user of users.slice(1)) {
      const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [user.email]);
      
      if (existing.length === 0) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await db.query(
          'INSERT INTO users (name, email, password, created_by, modified_by) VALUES (?, ?, ?, ?, ?)',
          [user.name, user.email, hashedPassword, systemUserId, systemUserId]
        );
        console.log(`Created user: ${user.name}`);
      }
    }
    
    console.log('Users seeded successfully');
    return systemUserId;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};