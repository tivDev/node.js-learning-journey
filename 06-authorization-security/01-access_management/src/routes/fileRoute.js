// src/routes/fileRoute.js

const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const upload = require('../middlewares/upload');
const { verifyToken } = require('../middlewares/authMiddleware');

// Add authentication
// endpoint to test: 'http://localhost:3000/api/files/upload'
router.post('/upload', verifyToken, upload.single('file'), fileController.uploadFile);
// get file by path
// endpoint to test: 'http://localhost:3000/api/files/:filePath'
router.get('/:filePath', verifyToken, fileController.getFileByPath);

module.exports = router;

