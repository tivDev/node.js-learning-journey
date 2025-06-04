// controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../models/User');
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
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

exports.protectedRoute = (req, res) => {
  res.json({ message: 'Protected data accessed!', user: req.user });
};

exports.getProfile = (req, res) => {
  // req.user is set by the authMiddleware.verifyToken
  res.json({ user: req.user });
};



exports.logout = (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(400).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(400).json({ message: 'Malformed token' });

  // Add token to blacklist
  tokenBlacklist.add(token);

  res.status(200).json({ message: 'Logged out successfully. Token is now invalid.' });
};