// src/models/permissionModel.js
const db = require('../config/database');
exports.getAllUserRoles = async () => {
    const [rows] = await db.query('SELECT ur.role_id, r.name AS role_name, u.name AS user_name, u.email, ur.modified_by, ur.created_at FROM user_roles ur JOIN roles r ON ur.role_id = r.id JOIN users u ON ur.user_id = u.id;');
    return rows;
};

