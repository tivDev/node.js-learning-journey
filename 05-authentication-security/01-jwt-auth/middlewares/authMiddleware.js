const jwt = require('jsonwebtoken');

// Token blacklist in-memory (for demonstration only)
const tokenBlacklist = new Set();

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Malformed token' });

  // Check if token is blacklisted
  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ message: '❌ Token has been logged out' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: '❌ Invalid or expired token.' });

    req.user = decoded; // Attach decoded user info to req.user
    next();
  });
};

// Export blacklist to be used in controller
exports.tokenBlacklist = tokenBlacklist;
