const admin = require('../config/firebase-admin');
const firestore = admin.firestore();

/**
 * Create a new ride request
 * Adds to the `Rides` collection in Firestore
 */
exports.createRideRequest = async (userId, pickup, dropoff) => {
  try {
    // Step 1: Fetch rider data from Riders collection (Optional but good UX)
    const riderRef = firestore.collection('Riders').doc(userId);
    const riderSnap = await riderRef.get();

    if (!riderSnap.exists) {
      throw new Error('Rider not found!');
    }

    const riderData = riderSnap.data();

    // Step 2: Create ride data
    const rideRef = firestore.collection('Rides').doc();
    const rideData = {
      RiderName: riderData.name || "Unknown Rider",
      Pickup: pickup,   // Expected format: { lat: number, long: number }
      Drop: dropoff,    // Expected format: { lat: number, long: number }
      Fare: 0,          // Default fare, can be calculated later
      Status: 'pending', // pending, accepted, completed
      DriverName: null,
      Timestamp: admin.firestore.FieldValue.serverTimestamp()
    };

    // Step 3: Save ride
    await rideRef.set(rideData);

    return { id: rideRef.id, ...rideData };

  } catch (error) {
    console.error("❌ Error in createRideRequest:", error);
    throw error;
  }
};

/**
 * Get all rides from `Rides` collection
 */
exports.getAllRides = async () => {
  try {
    const snapshot = await firestore.collection('Rides').get();
    const rides = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return rides;

  } catch (error) {
    console.error("❌ Error in getAllRides:", error);
    throw error;
  }
};

/**
 * Update ride status + assign driver
 * Updates the `Rides` document in Firestore
 */
exports.updateRideStatus = async (rideId, driverId, status) => {
  try {
    const rideRef = firestore.collection('Rides').doc(rideId);

    const driverRef = firestore.collection('Driver').doc(driverId);
    const driverSnap = await driverRef.get();

    if (!driverSnap.exists) {
      throw new Error('Driver not found!');
    }

    const driverData = driverSnap.data();

    // Step 1: Update ride with driver info & new status
    await rideRef.update({
      DriverName: driverData.name || "Unknown Driver",
      Status: status
    });

    return {
      rideId,
      driverId,
      newStatus: status
    };

  } catch (error) {
    console.error("❌ Error in updateRideStatus:", error);
    throw error;
  }
};

/**
 * Complete ride and update driver's earnings
 * Updates Ride status + driver's earnings in `Driver` collection
 */
exports.completeRide = async (rideId, driverId, fareAmount) => {
  try {
    const rideRef = firestore.collection('Rides').doc(rideId);
    const driverRef = firestore.collection('Driver').doc(driverId);

    const rideSnap = await rideRef.get();
    const driverSnap = await driverRef.get();

    if (!rideSnap.exists) {
      throw new Error('Ride not found!');
    }

    if (!driverSnap.exists) {
      throw new Error('Driver not found!');
    }

    const driverData = driverSnap.data();

    // Step 1: Update ride status to completed and set fare
    await rideRef.update({
      Status: 'completed',
      Fare: fareAmount
    });

    // Step 2: Update driver's earnings
    const updatedTotalEarnings = (driverData.TotalEarnings || 0) + fareAmount;
    const updatedDailyEarnings = (driverData.DailyEarnings || 0) + fareAmount;

    await driverRef.update({
      TotalEarnings: updatedTotalEarnings,
      DailyEarnings: updatedDailyEarnings,
      LastRideAmount: fareAmount
    });

    console.log(`✅ Ride ${rideId} completed. Earnings updated for driver ${driverId}`);

    return {
      rideId,
      driverId,
      fareAmount,
      updatedTotalEarnings,
      updatedDailyEarnings
    };

  } catch (error) {
    console.error("🔥 Error in completeRide:", error);
    throw error;
  }
};
