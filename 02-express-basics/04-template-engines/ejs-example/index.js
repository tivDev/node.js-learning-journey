const express = require('express');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

// Serve static files from 'public' folder
app.use(express.static('public'));

app.get('/', (req, res) => {
  const data = {
    title: 'Welcome to EJS Example',
    message: 'This is rendered dynamically with EJS!'
  };
  res.render('index', data);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
