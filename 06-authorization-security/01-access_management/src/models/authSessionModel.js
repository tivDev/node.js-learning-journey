// models/authSessionModel.js
const db = require('../config/database');

exports.createSession = async (userId, deviceInfo, ipAddress, token, expiresAt) => {
  const [result] = await db.query(
    'INSERT INTO auth_sessions (user_id, device_info, ip_address, token, expires_at, created_by, modified_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [userId, deviceInfo, ipAddress, token, expiresAt, userId, userId]
  );
  return result.insertId;
};

exports.deactivateSessions = async (userId, excludeToken = null) => {
  let query = 'UPDATE auth_sessions SET is_active = FALSE WHERE user_id = ?';
  const params = [userId];
  
  if (excludeToken) {
    query += ' AND token != ?';
    params.push(excludeToken);
  }
  
  await db.query(query, params);
};

exports.deleteSession = async (token) => {
  await db.query('DELETE FROM auth_sessions WHERE token = ?', [token]);
};