// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);


// Get current user's profile (requires JWT)
router.get('/me', authMiddleware.verifyToken, authController.getProfile);

// Logout route
router.post('/logout', authMiddleware.verifyToken, authController.logout);


module.exports = router;
