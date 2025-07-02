// src/middlewares/upload.js

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isPrivate = req.body.is_private === '1';
    const targetDir = isPrivate ? '../../uploads/private' : '../../uploads/public';
    const uploadPath = path.join(__dirname, targetDir);

    fs.mkdirSync(uploadPath, { recursive: true }); // ensure the path exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExt);
    cb(null, baseName + '-' + uniqueSuffix + fileExt);
  }
});

const upload = multer({ storage });

module.exports = upload;
