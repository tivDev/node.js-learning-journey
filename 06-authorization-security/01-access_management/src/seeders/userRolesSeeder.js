const db = require('../config/database');

module.exports.seedUserRoles = async () => {
  console.log('Seeding user roles...');
  
  try {
    // Get users and roles
    const [users] = await db.query('SELECT id, email FROM users');
    const [roles] = await db.query('SELECT id, name FROM roles');
    
    // Find system user (should be first)
    const systemUser = users.find(u => u.email === 'system_manager@example.com');
    
    // Assign roles
    const assignments = [
      { userEmail: 'system_manager@example.com', roleName: 'Super Admin' },
      { userEmail: 'admin@example.com', roleName: 'Super Admin' },
      { userEmail: 'editor@example.com', roleName: 'Editor' },
      { userEmail: 'viewer@example.com', roleName: 'Viewer' },
      { userEmail: 'guest@example.com', roleName: 'Guest' }
    ];
    
    for (const assignment of assignments) {
      const user = users.find(u => u.email === assignment.userEmail);
      const role = roles.find(r => r.name === assignment.roleName);
      
      if (user && role) {
        const [existing] = await db.query(
          'SELECT user_id FROM user_roles WHERE user_id = ? AND role_id = ?',
          [user.id, role.id]
        );
        
        if (existing.length === 0) {
          await db.query(
            'INSERT INTO user_roles (user_id, role_id, created_by, modified_by) VALUES (?, ?, ?, ?)',
            [user.id, role.id, systemUser.id, systemUser.id]
          );
          console.log(`Assigned ${role.name} to ${assignment.userEmail}`);
        }
      }
    }
    
    console.log('User roles seeded successfully');
  } catch (error) {
    console.error('Error seeding user roles:', error);
    throw error;
  }
};