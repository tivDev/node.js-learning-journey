// models/authModel.js

const db = require('../config/database');

exports.findUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND is_active = 1', [email]);
  return rows[0];
};

exports.createUser = async (name,email, hashedPassword) => {
  const [result] = await db.query('INSERT INTO users (name,email, password) VALUES (?, ?, ?)', [name,email, hashedPassword]);
  return result.insertId;
};
