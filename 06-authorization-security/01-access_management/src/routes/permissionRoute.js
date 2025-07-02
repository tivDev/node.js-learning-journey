// src/routes/permissionRoute.js
const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');
const { verifyToken } = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

router.get('/', verifyToken, authorize('read', 'permissions'), permissionController.getAllPermissions);
router.get('/:id', verifyToken, authorize('read', 'permissions'), permissionController.getPermissionById);
router.post('/create', verifyToken, authorize('create', 'permissions'), permissionController.createPermission);

module.exports = router;