require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');

// Route & logic modules
const socketController = require('./src/controllers/socketController');
const authRoutes = require('./src/routes/authRoutes');
const itemRoutes = require('./src/routes/itemRoute');
const roleRoutes = require('./src/routes/roleRoute');
const userRoleRoutes = require('./src/routes/userRoleRoute');
const permissionRoutes = require('./src/routes/permissionRoute');
const userRoutes = require('./src/routes/userRoute');
const fileRoutes = require('./src/routes/fileRoute');
const network = require('./src/utils/network');
const notFound = require('./src/middlewares/notFound');



const app = express();
const server = http.createServer(app);

// Initialize socket.io with proper CORS config
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Store io instance in app for controller access
app.set('io', io);

// ================================
// Middleware Setup
// ================================

app.use(cors()); // Allow CORS from all origins
app.use(express.json()); // Parse JSON body

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Attach timestamp to requests
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ================================
// Routes
// ================================

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/user-roles', userRoleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);

const testController = require('./src/controllers/testController');
// test route
app.get('/api/test', testController.getAll);

app.get('/', (req, res) => {
  const { headers } = req;
  const userAgent = headers['user-agent'];
  const deviceInfo = `${userAgent} (${network.getLocalIP()})`;
  res.send(`Welcome to JWT Auth API! You are using ${deviceInfo}`);
});



// ================================
// 404 Middleware
// ================================

app.use(notFound);

// ================================
// Initialize Socket
// ================================

socketController.initSocket(io);

// ================================
// Global Error Handler
// ================================
const ERROR_MESSAGES = require('./src/constants/errorMessages');
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: ERROR_MESSAGES.INVALID_REQUEST_BODY,
      requiredFields: res.locals.requiredFields || undefined,
    });
  }
  next(err);
});

// ================================
// Start Server
// ================================

const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  console.log(`🚀 Server is running at:`);
  console.log(`-> http://localhost:${PORT}`);
  console.log(`-> http://${network.getLocalIP()}:${PORT} (accessible over local Wi-Fi)`);


});
