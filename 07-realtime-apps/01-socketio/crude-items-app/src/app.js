const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const sequelize = require('./config/database');
const itemRoutes = require('./routes/itemRoutes');
const socketController = require('./controllers/socketController');
const { errorResponse } = require('./utils/responseHandler');
const network = require('./utils/network');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Store io instance in app for controller access
app.set('io', io);

// Initialize socket
socketController.initSocket(io);

// Routes
app.use('/api/items', itemRoutes);

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  errorResponse(res, 500, 'Internal server error', err);
});

// Test database connection and sync models
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    return sequelize.sync({ force: false });
  })
  .then(() => {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      const localIP = network.getLocalIP();
      console.log(`Server is running at:`);
      console.log(`-> http://localhost:${PORT}`);
      console.log(`-> http://${localIP}:${PORT} (accessible over local Wi-Fi)`);;

    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });