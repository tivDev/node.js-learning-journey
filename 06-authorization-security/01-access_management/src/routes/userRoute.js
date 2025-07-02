// src/routes/userRoute.js

const express = require('express');
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

const router = express.Router();

// Get all users
router.get('/', verifyToken, authorize('read', 'users'), userController.getAllUsers);
router.get('/:id', verifyToken, authorize('read', 'users'), userController.getUserById);
router.post('/create', verifyToken, authorize('create', 'users'), userController.createUser);
router.put('/update/:id', verifyToken, authorize('update', 'users'), userController.updateUser);
router.put('/inactivate/:id', verifyToken, authorize('update', 'users'), userController.inactivateUser);
router.delete('/delete/:id', verifyToken, authorize('delete', 'users'), userController.deleteUser);

module.exports = router;
