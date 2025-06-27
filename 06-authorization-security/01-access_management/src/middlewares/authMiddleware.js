const jwt = require('jsonwebtoken');
const { successResponse, errorResponse } = require('../utils/responseHandler');


// In-memory blacklist (for demonstration purposes only)
const tokenBlacklist = new Set();

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized: Please sign in.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Please sign in.' });
  }

  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ message: 'Unauthorized: You\'ve been logged out.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Session expired. Please sign in.' });
    }

    req.user = decoded;
    next();
  });
};

exports.tokenBlacklist = tokenBlacklist;
