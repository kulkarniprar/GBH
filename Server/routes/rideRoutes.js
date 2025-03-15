const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');

// API route to request a ride
router.post('/request', rideController.createRideRequest);

// API route to list all rides (optional)
router.get('/', rideController.getAllRides);

module.exports = router;
