const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const admin = require('firebase-admin');
const socketHandlers = require('./sockets/socketHandlers'); // <-- Handles all sockets
const { db } = require('./config/firebase-admin');
// 🔥 Initialize Firebase Admin SDK
const serviceAccount = require('./config/firebase-service-account.json'); // <-- Keep your JSON here (not in src!)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project-id.firebaseio.com', // Optional if you're using Firestore
});

// 🔥 Firestore DB instance
const db = admin.firestore();

// Express App Setup
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Health Check Route
app.get('/', (req, res) => res.send('Backend Server is running 🚀'));

// Optional REST API Routes
app.use('/api/rides', require('./routes/rideRoutes')(db));
app.use('/api/drivers', require('./routes/driverRoutes')(db));
app.use('/api/chat', require('./routes/chatRoutes')(db));

// Initialize Socket.IO & handlers
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Pass both io & db to socketHandlers if needed
socketHandlers(io, db); // <-- This wires your WebSocket events!

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
