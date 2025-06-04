const http = require('http');

const server = http.createServer((req, res) => {
  const url = req.url;

  res.setHeader('Content-Type', 'text/html');

  if (url === '/') {
    res.statusCode = 200;
    res.end('<h1>Welcome to the Home Page</h1>');
  } else if (url === '/about') {
    res.statusCode = 200;
    res.end('<h1>About Us</h1><p>This is a basic Node.js HTTP server.</p>');
  } else {
    res.statusCode = 404;
    res.end('<h1>404 - Page Not Found</h1>');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
