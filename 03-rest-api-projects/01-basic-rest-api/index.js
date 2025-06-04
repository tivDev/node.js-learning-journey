const express = require('express');
const app = express();
const PORT = 3000;

// Get the local IP address dynamically
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIP();
  console.log(`Server is running at:`);
  console.log(`-> http://localhost:${PORT}`);
  console.log(`-> http://${localIP}:${PORT} (accessible over local Wi-Fi)`);
});
