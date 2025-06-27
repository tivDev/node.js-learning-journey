// index.js
const express = require('express');
const db = require('./src/config/database');

const app = express();
const PORT = 3000;

app.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    res.json({
      message: '✅ Connected to MySQL!',
      result: rows[0].result
    });
  } catch (err) {
    res.status(500).json({
      message: '❌ Connection failed',
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
