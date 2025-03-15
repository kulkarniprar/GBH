const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const admin = require("firebase-admin");

// Initialize Express App
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

// Initialize Firebase Admin SDK
const serviceAccount = require("./firebase-service-account.json"); // Make sure this file is in your project root

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gbhack-70f04.firebaseio.com", // Replace with your Firestore URL
});

const db = admin.firestore();

// WebSocket Events
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Handle ride request
  socket.on("userRequestRide", async (data) => {
    console.log("Ride Requested:", data);

    // Store ride request in Firestore
    const rideRef = db.collection("rideRequests").doc();
    await rideRef.set({
      userId: data.userId,
      pickup: data.pickup,
      dropoff: data.dropoff,
      status: "pending",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Notify all drivers
    io.emit("driverReceiveRequest", { id: rideRef.id, ...data });
  });

  // Handle driver accepting ride
  socket.on("driverAcceptRide", async (data) => {
    console.log("Ride Accepted by Driver:", data);

    // Update ride request status in Firestore
    const rideRef = db.collection("rideRequests").doc(data.rideId);
    await rideRef.update({
      driverId: data.driverId,
      status: "accepted",
    });

    // Notify user
    io.emit("rideConfirmed", data);
  });

  // Handle driver location updates
  socket.on("driverLocationUpdate", async (data) => {
    console.log("Driver Location Update:", data);

    // Update driver location in Firestore
    const driverRef = db.collection("drivers").doc(data.driverId);
    await driverRef.update({
      location: new admin.firestore.GeoPoint(data.latitude, data.longitude),
    });

    // Send location updates to user
    io.emit("userReceiveDriverLocation", data);
  });

  // Handle ride completion
  socket.on("rideCompleted", async (data) => {
    console.log("Ride Completed:", data);

    // Update ride status in Firestore
    const rideRef = db.collection("rideRequests").doc(data.rideId);
    await rideRef.update({
      status: "completed",
    });

    // Update leaderboard
    io.emit("updateLeaderboard", data);
  });

  // Handle chat messages
  socket.on("sendMessage", async (data) => {
    console.log("Chat Message:", data);

    // Store message in Firestore
    const chatRef = db.collection("messages").doc();
    await chatRef.set({
      sender: data.sender,
      receiver: data.receiver,
      message: data.message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Broadcast message
    io.emit("receiveMessage", data);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
server.listen(5000, () => console.log("Server running on port 5000"));
