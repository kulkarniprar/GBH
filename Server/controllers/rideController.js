const rideService = require('../services/rideService');

/**
 * Create a new ride request (HTTP POST route)
 * @route POST /rides/create
 */
exports.createRideRequest = async (req, res) => {
  try {
    const { userId, pickup, dropoff } = req.body;

    const ride = await rideService.createRideRequest(userId, pickup, dropoff);

    res.status(201).json({ success: true, ride });

    // Optional: Emit event to notify drivers if you are using Socket.IO
    // io.emit('newRideRequest', ride);
  } catch (error) {
    console.error("🔥 Error in createRideRequest:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all rides (HTTP GET route)
 * @route GET /rides/all
 */
exports.getAllRides = async (req, res) => {
  try {
    const rides = await rideService.getAllRides();

    res.status(200).json({ success: true, rides });
  } catch (error) {
    console.error("🔥 Error in getAllRides:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Complete a ride and update driver earnings (HTTP POST route)
 * @route POST /rides/complete
 */
exports.completeRide = async (req, res) => {
  try {
    const { rideId, driverId, fareAmount } = req.body;

    if (!rideId || !driverId || fareAmount === undefined) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    // Call rideService to handle earnings update
    const result = await rideService.completeRide(rideId, driverId, fareAmount);

    // Optional: Emit earnings update via Socket.IO if you have a socket reference
    // io.emit('earningsUpdated', { driverId, updatedTotalEarnings: result.updatedTotalEarnings });

    res.status(200).json({
      success: true,
      message: `Ride ${rideId} completed, earnings updated.`,
      data: result
    });
  } catch (error) {
    console.error('🔥 Error in completeRide controller:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

