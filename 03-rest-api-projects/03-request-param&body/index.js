const express = require('express');
const bodyValidator = require('./src/utils/bodyValidator');
const getLocalIP = require('./src/utils/getLocalIP');
const ERROR_MESSAGES = require('./src/constants/errorMessages');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.get('/greet', (req, res) => {
  const name = req.query.name;
  res.json({ message: name ? `Hello, ${name}!` : 'Hello, guest!' });
});

app.post(
  '/greet',
  bodyValidator({
    requiredFields: ['name'],
  }),
  (req, res) => {
    const { name } = req.body;
    res.json({ message: `Hello, ${name}!` });
  }
);


// Global error handler for JSON parse errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    // Try to include requiredFields if set by previous middleware
    return res.status(400).json({
      error: ERROR_MESSAGES.INVALID_REQUEST_BODY,
      requiredFields: res.locals.requiredFields || undefined,
    });
  }
  next(err);
});

app.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIP();
  console.log(`Server running at:`);
  console.log(`-> http://localhost:${PORT}`);
  console.log(`-> http://${localIP}:${PORT} (local network)`);
});
