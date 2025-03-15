const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const socketHandlers = require('./sockets/socketHandlers'); // <-- Handle all sockets inside here

// Express App Setup
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Health Check Route
app.get('/', (req, res) => res.send('Backend Server is running 🚀'));

// API Routes (Optional REST APIs)
app.use('/api/rides', require('./routes/rideRoutes'));
app.use('/api/drivers', require('./routes/driverRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Initialize Socket.IO & handlers
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
socketHandlers(io); // <-- This wires your WebSocket events!

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
