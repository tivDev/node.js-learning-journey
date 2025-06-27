// src/models/roleModel.js

const db = require('../config/database');

exports.getAllRoles = async () => {
    const [rows] = await db.query('SELECT * FROM roles');
    return rows;
};

exports.getById = async (id) => {
    const [rows] = await db.query('SELECT * FROM roles WHERE id = ?', [id]);
    return rows[0];
}

exports.createRole = async ({ name, description, created_by }) => {
    const [result] = await db.query('INSERT INTO roles (name, description, created_by, modified_by, created_at, modified_at) VALUES (?, ?, ?, ?, NOW(), NOW())', [name, description, created_by, created_by]);
    return result.insertId;
};

exports.updateRole = async (id, { name, description, modified_by }) => {
    const [result] = await db.query('UPDATE roles SET name = ?, description = ?, modified_by = ?, modified_at = NOW() WHERE id = ?', [name, description, modified_by, id]);
    return result.affectedRows > 0;
};

exports.deleteRole = async (id) => {
    const [result] = await db.query('DELETE FROM roles WHERE id = ?', [id]);
    return result.affectedRows > 0;
};