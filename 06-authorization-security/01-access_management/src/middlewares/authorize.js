// src/middlewares/authorize.js

const { hasPermission } = require('../utils/checkPermissions');

module.exports = (action, targetTable) => {
  return async (req, res, next) => {
    const userId = req.user.id;

    try {
      const allowed = await hasPermission(userId, action, targetTable);
      if (!allowed) {
        return res.status(403).json({ message: `Permission Error: You are not allowed to ${action} on the "${targetTable}" table.` });
      }
      next();
    } catch (err) {
      console.error('Authorization error:', err);
      res.status(500).json({ message: 'Internal Server Error. Please try again later.' });
    }
  };
};
