// src/models/permissionModel.js
const db = require('../config/database');

exports.getAllPermissions = async () => {
    const [rows] = await db.query('SELECT * FROM permissions');
    return rows;
};