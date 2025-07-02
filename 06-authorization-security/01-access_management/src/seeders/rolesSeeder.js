// src/seeders/roleSeeder.js

const db = require('../config/database');

module.exports.seedRoles = async (systemUserId) => {
  const roles = [
    { name: 'Super Admin', description: 'Has full access to all system features' },
    { name: 'Admin', description: 'Can manage most system features' },
    { name: 'Editor', description: 'Can create and edit content' },
    { name: 'Viewer', description: 'Can view content only' },
    { name: 'Guest', description: 'Limited access to view public content' }
  ];

  console.log('Seeding roles...');
  
  try {
    for (const role of roles) {
      const [existing] = await db.query('SELECT id FROM roles WHERE name = ?', [role.name]);
      
      if (existing.length === 0) {
        await db.query(
          'INSERT INTO roles (name, description, created_by, modified_by) VALUES (?, ?, ?, ?)',
          [role.name, role.description, systemUserId, systemUserId]
        );
        console.log(`Created role: ${role.name}`);
      }
    }
    
    console.log('Roles seeded successfully');
  } catch (error) {
    console.error('Error seeding roles:', error);
    throw error;
  }
};