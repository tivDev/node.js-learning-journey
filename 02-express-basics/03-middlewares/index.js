const express = require('express');
const app = express();
const PORT = 3000;

// Simple middleware that logs request info
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Call next middleware or route handler
});

// Middleware to add a timestamp to the request
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Route handler
app.get('/', (req, res) => {
  res.send(`Hello! Request received at: ${req.requestTime}`);
});

// Middleware to handle 404 errors
app.use((req, res) => {
  res.status(404).send('404: Page not found');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
