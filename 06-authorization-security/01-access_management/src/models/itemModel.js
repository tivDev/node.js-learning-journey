// src/models/itemModel.js

const db = require('../config/database');

exports.getAllItems = async () => {
    const [rows] = await db.query('SELECT * FROM items');
    return rows;
};

exports.getByCreatedBy = async (created_by) => {
    const [rows] = await db.query('SELECT * FROM items WHERE created_by = ?', [created_by]);
    return rows;
};
exports.createItem = async ({ name, description, created_by }) => {
    const [result] = await db.query('INSERT INTO items (title, description, created_by, modified_by, created_at, modified_at) VALUES (?, ?, ?, ?, NOW(), NOW())', [name, description, created_by, created_by]);
    return result.insertId;
};

exports.updateItem = async (id, { title, description, modified_by }) => {
   const [result] = await db.query('UPDATE items SET title = ?, description = ?, modified_by = ? WHERE id = ?', [title, description, modified_by, id]);
    return result;
}

