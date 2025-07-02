// src/migrations/0001-initial-tables.js

const db = require('../config/database');

module.exports.up = async () => {
  console.log('Creating tables...');
  
  await db.query(`
    CREATE TABLE users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      created_by INT,
      modified_by INT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      modified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id),
      FOREIGN KEY (modified_by) REFERENCES users(id)
    );
  `);

  await db.query(`
    CREATE TABLE roles (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      created_by INT,
      modified_by INT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      modified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id),
      FOREIGN KEY (modified_by) REFERENCES users(id)
    );
  `);

  await db.query(`
    CREATE TABLE permissions (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      created_by INT,
      modified_by INT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      modified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (name),
      FOREIGN KEY (created_by) REFERENCES users(id),
      FOREIGN KEY (modified_by) REFERENCES users(id)
    );
  `);

  await db.query(`
    CREATE TABLE user_roles (
      user_id INT,
      role_id INT,
      created_by INT,
      modified_by INT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      modified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, role_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (role_id) REFERENCES roles(id),
      FOREIGN KEY (created_by) REFERENCES users(id),
      FOREIGN KEY (modified_by) REFERENCES users(id)
    );
  `);

  await db.query(`
    CREATE TABLE role_permissions (
      role_id INT,
      permission_id INT,
      target_table VARCHAR(100) NOT NULL,
      created_by INT,
      modified_by INT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      modified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (role_id, permission_id, target_table),
      FOREIGN KEY (role_id) REFERENCES roles(id),
      FOREIGN KEY (permission_id) REFERENCES permissions(id),
      FOREIGN KEY (created_by) REFERENCES users(id),
      FOREIGN KEY (modified_by) REFERENCES users(id)
    );
  `);

  await db.query(`
    CREATE TABLE items (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      created_by INT,
      modified_by INT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      modified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id),
      FOREIGN KEY (modified_by) REFERENCES users(id)
    );
  `);

  await db.query(`
    CREATE TABLE auth_sessions (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      device_id VARCHAR(100),
      device_info VARCHAR(255),
      ip_address VARCHAR(45),
      token VARCHAR(255) UNIQUE NOT NULL,
      confirmed BOOLEAN DEFAULT FALSE,
      is_active BOOLEAN DEFAULT TRUE,
      created_by INT,
      modified_by INT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      modified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_seen DATETIME,
      expires_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (created_by) REFERENCES users(id),
      FOREIGN KEY (modified_by) REFERENCES users(id)
    );
  `);

  await db.query(`
    CREATE TABLE notifications (
      id INT PRIMARY KEY AUTO_INCREMENT,
      type VARCHAR(50) NOT NULL,
      title VARCHAR(255),
      message TEXT NOT NULL,
      created_by INT,
      modified_by INT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      modified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id),
      FOREIGN KEY (modified_by) REFERENCES users(id)
    );
  `);

  await db.query(`
    CREATE TABLE user_notifications (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      notification_id INT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      read_at DATETIME,
      created_by INT,
      modified_by INT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      modified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (notification_id) REFERENCES notifications(id),
      FOREIGN KEY (created_by) REFERENCES users(id),
      FOREIGN KEY (modified_by) REFERENCES users(id)
    );
  `);

  await db.query(`
    CREATE TABLE files (
      id INT PRIMARY KEY AUTO_INCREMENT,
      file_name VARCHAR(255) NOT NULL,
      file_path TEXT NOT NULL,
      mime_type VARCHAR(100),
      file_type ENUM('image', 'document', 'audio', 'video', 'other') DEFAULT 'other',
      file_size BIGINT,
      is_private BOOLEAN DEFAULT FALSE,
      uploaded_by INT,
      related_table VARCHAR(100),
      related_id INT,
      created_by INT,
      modified_by INT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      modified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (uploaded_by) REFERENCES users(id),
      FOREIGN KEY (created_by) REFERENCES users(id),
      FOREIGN KEY (modified_by) REFERENCES users(id)
    );
  `);

  await db.query(`
    CREATE TABLE activity_logs (
      id INT PRIMARY KEY AUTO_INCREMENT,
      table_name VARCHAR(100) NOT NULL,
      record_id INT NOT NULL,
      action ENUM('create', 'update', 'delete') NOT NULL,
      old_data JSON,
      new_data JSON,
      user_id INT,
      created_by INT,
      modified_by INT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      modified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (created_by) REFERENCES users(id),
      FOREIGN KEY (modified_by) REFERENCES users(id)
    );
  `);

  console.log('Tables created successfully');
};

module.exports.down = async () => {
  console.log('Dropping tables...');
  
  // Drop tables in reverse order to handle foreign key constraints
  const tables = [
    'activity_logs',
    'files',
    'user_notifications',
    'notifications',
    'auth_sessions',
    'items',
    'role_permissions',
    'user_roles',
    'permissions',
    'roles',
    'users'
  ];

  for (const table of tables) {
    await db.query(`DROP TABLE IF EXISTS ${table};`);
  }

  console.log('Tables dropped successfully');
};