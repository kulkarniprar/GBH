const rideService = require('../services/rideService');

module.exports = (io, socket) => {

  // Handle ride request via socket
  socket.on('userRequestRide', async (data) => {
    try {
      const { userId, pickup, dropoff } = data;
      const ride = await rideService.createRideRequest(userId, pickup, dropoff);

      // Broadcast to all drivers
      io.emit('driverReceiveRequest', ride);
    } catch (error) {
      console.error("userRequestRide error:", error);
      socket.emit('error', { message: 'Failed to create ride request' });
    }
  });

  // Handle driver accepting ride
  socket.on('driverAcceptRide', async (data) => {
    try {
      const { rideId, driverId } = data;
      const updatedRide = await rideService.updateRideStatus(rideId, driverId, 'accepted');

      // Notify the specific user
      io.emit('rideConfirmed', updatedRide);
    } catch (error) {
      console.error("driverAcceptRide error:", error);
      socket.emit('error', { message: 'Failed to accept ride' });
    }
  });

  // More socket events can go here...
};
