const express = require('express');
const app = express();
const PORT = 3000;

// Home route
app.get('/', (req, res) => {
  res.send('🏠 Home Page');
});

// About route
app.get('/about', (req, res) => {
  res.send('ℹ️ About Page');
});

// Dynamic route with URL parameter
app.get('/user/:username', (req, res) => {
  const username = req.params.username;
  res.send(`👤 Hello, ${username}`);
});

// Query string example
app.get('/search', (req, res) => {
  const { q } = req.query;
  res.send(`🔍 You searched for: ${q}`);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
