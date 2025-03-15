import React, { useState, useEffect, useContext } from "react";
import { auth, db } from "../Components/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { SocketContext } from '../App';

import React, { useState } from "react";
import MapComponent from "../Components/MapComponent";
import RideRequest from "../Components/RideRequest";

function RiderDashboard() {
  const [riderData, setRiderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const navigate = useNavigate();

  const socket = useContext(SocketContext); // ✅ Access socket here

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("✅ Logged-in user email:", user.email);
        fetchRiderDetails(user.email);
      } else {
        console.warn("⚠ User not logged in. Redirecting to login...");
        navigate("/rider-login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchRiderDetails = async (email) => {
    try {
      console.log("🔍 Searching for rider with email:", email);
      const ridersRef = collection(db, "Rider");
      const q = query(ridersRef, where("Email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const rider = querySnapshot.docs[0].data();
        console.log("✅ Rider found:", rider);
        setRiderData(rider);
      } else {
        console.error("❌ No rider found with this email.");
        setRiderData(null);
      }
    } catch (error) {
      console.error("🔥 Error fetching rider details:", error);
    } finally {
      setLoading(false);
    }
  };


function RiderDashboard() {
  const [destination, setDestination] = useState(null);
  const userLocation = { lat: 12.9716, lng: 77.5946 }; // Default user location

  const handleRequestRide = () => {
    if (!pickup || !dropoff) {
      alert("Please enter both pickup and dropoff locations.");
      return;
    }

    const rideRequestData = {
      userId: riderData?.Email, // Replace with real userId if available
      pickup: pickup,
      dropoff: dropoff
    };

    console.log("🚀 Sending ride request:", rideRequestData);
    socket.emit("userRequestRide", rideRequestData);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("rideConfirmed", (data) => {
      console.log("✅ Ride confirmed:", data);
      alert(`Your ride is confirmed by driver ${data.driverId}`);
    });

    socket.on("userReceiveDriverLocation", (data) => {
      console.log("📍 Driver location:", data);
      // Add map updates or other UI handling here
    });

    return () => {
      socket.off("rideConfirmed");
      socket.off("userReceiveDriverLocation");
    };
  }, [socket]);

  return (
    <div>
      <h1>Welcome, Rider!</h1>
      {loading ? (
        <p>Loading...</p>
      ) : riderData ? (
        <div>
          <p><strong>Name:</strong> {riderData.Name}</p>
          <p><strong>Email:</strong> {riderData.Email}</p>
          <p><strong>Contact:</strong> {riderData.Contact}</p>
        </div>
      ) : (
        <p>❌ Rider not found.</p>
      )}

      {/* Ride Request Form */}
      <div style={{ marginTop: "20px" }}>
        <h2>Request a Ride</h2>
        <input
          type="text"
          placeholder="Enter Pickup Location"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Enter Dropoff Location"
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
        />
        <br />
        <button onClick={handleRequestRide}>Request Ride</button>
      </div>
      <MapComponent onLocationSelect={setDestination} />
      <RideRequest userLocation={userLocation} destination={destination} />
    </div>
  );
}
}
export default RiderDashboard;
