const db = require('../config/database');

module.exports.seedItems = async () => {
  const items = [
    { title: 'Laptop', description: 'High-performance business laptop' },
    { title: 'Printer', description: 'All-in-one laser printer' },
    { title: 'Monitor', description: '27-inch 4K display' },
    { title: 'Keyboard', description: 'Mechanical gaming keyboard' },
  ];

  console.log('Seeding items...');
  
  try {
    // Get admin user (for created_by)
    const [adminUser] = await db.query('SELECT id FROM users WHERE email = ?', ['admin@example.com']);
    
    if (!adminUser || adminUser.length === 0) {
      throw new Error('Admin user not found');
    }

    for (const item of items) {
      const [existing] = await db.query('SELECT id FROM items WHERE title = ?', [item.title]);
      
      if (existing.length === 0) {
        await db.query(
          'INSERT INTO items (title, description, created_by, modified_by) VALUES (?, ?, ?, ?)',
          [item.title, item.description, adminUser[0].id, adminUser[0].id]
        );
        console.log(`Created item: ${item.title}`);
      }
    }
    
    console.log('Items seeded successfully');
  } catch (error) {
    console.error('Error seeding items:', error);
    throw error;
  }
};