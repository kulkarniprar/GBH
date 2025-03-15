import React, { useState } from "react";

const RideRequest = ({ userLocation, destination }) => {
  const [rideStatus, setRideStatus] = useState("idle");

  const handleRequestRide = () => {
    if (!destination) {
      alert("Please select a destination first.");
      return;
    }

    setRideStatus("searching");

    // Simulating ride confirmation
    setTimeout(() => {
      setRideStatus("accepted");
    }, 3000);
  };

  return (
    <div>
      <h2>Ride Request</h2>
      <p><strong>From:</strong> {userLocation?.lat}, {userLocation?.lng}</p>
      <p><strong>To:</strong> {destination?.name} ({destination?.lat}, {destination?.lng})</p>

      {rideStatus === "idle" && (
        <button onClick={handleRequestRide} style={{ padding: "10px", backgroundColor: "green", color: "white" }}>
          Request Ride
        </button>
      )}

      {rideStatus === "searching" && <p>Searching for a ride...</p>}
      {rideStatus === "accepted" && <p>🚖 Ride confirmed! Your driver is on the way.</p>}
    </div>
  );
};

export default RideRequest;
