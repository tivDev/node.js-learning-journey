// src/routes/roleRoute.js

const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { verifyToken } = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

router.get('/', verifyToken, authorize('read', 'roles'), roleController.getAllRoles);
router.get('/:id', verifyToken, authorize('read', 'roles'), roleController.getRoleById);
router.post('/create', verifyToken, authorize('create', 'roles'), roleController.createRole);
router.put('/update/:id', verifyToken, authorize('update', 'roles'), roleController.updateRole);
router.delete('/delete/:id', verifyToken, authorize('delete', 'roles'), roleController.deleteRole);

// Additional routes for role management
router.get('/roles-permissions/list', verifyToken, authorize('read', 'roles'), roleController.getRolesPermissions);
router.get('/users-roles-permissions/list', verifyToken, authorize('read', 'roles'), roleController.getUsersRolesPermissions);

module.exports = router;

