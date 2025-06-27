// models/userModel.js

const db = require('../config/database');

// get all list
exports.getAllUsers = async () => {
  const [rows] = await db.query('SELECT * FROM users');
  return rows;
};
exports.getUserById = async (id) => {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

exports.findUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND is_active = 1', [email]);
  return rows[0];
};

exports.createUser = async (name,email, hashedPassword) => {
  const [result] = await db.query('INSERT INTO users (name,email, password) VALUES (?, ?, ?)', [name,email, hashedPassword]);
  return result.insertId;
};


exports.updateUser = async (id, name, email) => {
  const [result] = await db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
  return result.affectedRows > 0;
};

exports.inactivateUser = async (id) => {
  const [result] = await db.query('UPDATE users SET is_active = 0 WHERE id = ?', [id]);
  return result.affectedRows > 0;
};