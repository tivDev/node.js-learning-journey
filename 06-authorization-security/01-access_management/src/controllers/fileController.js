// src/controllers/fileController.js

const fileModel = require('../models/fileModel');
const path = require('path');


exports.uploadFile = async (req, res) => {
  const userId = req.user.id;
  const file = req.file;
  const is_private = req.body.is_private || 0;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const fileName = file.originalname;
    const mimeType = file.mimetype;
    const ext = path.extname(file.originalname).toLowerCase();
    const fileSize = file.size;

    // Determine file type
    let fileType = 'other';
    if (mimeType.startsWith('image/')) fileType = 'image';
    else if (mimeType.startsWith('video/')) fileType = 'video';
    else if (mimeType.startsWith('audio/')) fileType = 'audio';
    else if (mimeType === 'application/pdf' || ext === '.docx' || ext === '.txt') fileType = 'document';

    // Virtual file path without file type folder
    const basePath = is_private ? 'files/private' : 'files';
    const filePath = path.join(basePath, file.filename).replace(/\\/g, '/');

    const fileId = await fileModel.createFile(userId, fileName, filePath, mimeType, fileType, fileSize, is_private);
    res.status(201).json({ message: 'File uploaded successfully', fileId });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ message: 'Error uploading file', error: err.message });
  }
};


exports.getFileByPath = async (req, res) => {
  const filePath = req.params.filePath; // Assuming file path is passed as a URL parameter
  console.log('filePath: ', filePath);

  try {
    const file = await fileModel.getFileByPath(filePath);
    console.log('file: ', file);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.status(200).json(file);
  } catch (err) {
    console.error('Error retrieving file:', err);
    res.status(500).json({ message: 'Error retrieving file', error: err.message });
  }
}

