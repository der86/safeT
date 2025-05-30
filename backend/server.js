require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const deviceRoutes = require('./routes/device.routes');
const locationRoutes = require('./routes/location.routes');
const contactRoutes = require('./routes/contact.routes');
const alertRoutes = require('./routes/alert.routes');
const settingsRoutes = require('./routes/settings.routes');

// Import socket handlers
const socketHandler = require('./socket/socketHandler');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || '*',
    methods: ['GET', 'POST']
  }
});

// Connect to MongoDB
mongoose.connect("mongodb+srv://safeT:Billion$@safet.mtmxu37.mongodb.net/?retryWrites=true&w=majority&appName=safeT", {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/contacts', require('./routes/contact.routes'));


// Root route
app.get('/', (req, res) => {
  res.send('Safety Tracker API is running');
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  socketHandler(io, socket);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});