// src/models/fileModel.js

const db = require('../config/database');
const createFile = async (userId, fileName, filePath, mimeType, fileType, fileSize, is_private) => {
  const query = `
    INSERT INTO files (file_name, file_path, mime_type, file_type, file_size, is_private, uploaded_by, created_by, modified_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(query, [
    fileName,
    filePath,
    mimeType,
    fileType,
    fileSize,
    is_private,
    userId,
    userId,
    userId
  ]);
  return result.insertId;
};


const getFileByPath = async (filePath="images-1750751960844-406699431.png") => {
  const [rows] = await db.query('SELECT * FROM files WHERE file_path = ?', ["images-1750751960844-406699431.png"]);
  return rows[0];
}

module.exports = {
    createFile,
    getFileByPath
}
