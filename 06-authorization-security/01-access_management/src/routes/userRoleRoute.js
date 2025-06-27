// src/routes/userRoleRoute.js

const express = require('express');
const router = express.Router();
const userRoleController = require('../controllers/userRoleController');
const { verifyToken } = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

router.get('/', verifyToken, authorize('read', 'user_roles'), userRoleController.getAllUserRoles);
router.post('/assign', verifyToken, authorize('create', 'user_roles'), userRoleController.assignRoleToUser);

module.exports = router;