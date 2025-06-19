// utils/seedDefaultUser.js

const bcrypt = require('bcryptjs');
const { findUserByEmail, createUser } = require('../models/User');

async function seedDefaultUser() {
  try {
    const email = 'admin@example.com';
    const password = 'password';

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
    //   console.log('Default admin user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await createUser(email, hashedPassword);

    console.log(`Default admin user created successfully with ID: ${userId}`);
  } catch (err) {
    console.error('Error creating default user:', err);
  }
}

module.exports = seedDefaultUser;
