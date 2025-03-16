const rideSocket = require('./rideSocket');
// You can add more sockets for maps, leaderboard, etc.

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Ride socket events
    rideSocket(io, socket);

    // Add additional socket handlers here if needed...

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};
