// controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../models/authModel');
const { createSession, deleteSession } = require('../models/authSessionModel');
const { tokenBlacklist } = require('../middlewares/authMiddleware');

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser(email, hashedPassword);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Sign-in failed: This email is not registered in our system.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Sign-in failed: Please check your credentials.' });

    const token = generateToken(user);
    
    // Get device info and IP address
    const deviceInfo = req.headers['user-agent'] || 'Unknown device';
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // Calculate expiration time
    const expiresIn = parseInt(process.env.JWT_EXPIRES_IN) || 86400; // default 24 hours
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    
    // Create session record
    await createSession(user.id, deviceInfo, ipAddress, token, expiresAt);
    
    // Optional: Deactivate other sessions (for single device login)
    // await deactivateSessions(user.id, token);
    
    res.status(200).json({ 
      token,
      expiresAt: expiresAt.toISOString()
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

exports.getProfile = (req, res) => {
  // req.user is set by the authMiddleware.verifyToken
  res.json({ user: req.user });
};



exports.logout = async (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(400).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(400).json({ message: 'Malformed token' });

  // Add token to blacklist
  tokenBlacklist.add(token);

  await deleteSession(token);

  res.status(200).json({ message: 'Logged out successfully. Token is now invalid.' });
};
