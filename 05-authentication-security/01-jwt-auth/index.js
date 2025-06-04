require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const seedDefaultUser = require('./utils/seedDefaultUser');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Home Route
app.get('/', (req, res) => {
  res.send('Welcome to JWT Auth API!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);

  // Seed the default user after server starts
  await seedDefaultUser();
});
