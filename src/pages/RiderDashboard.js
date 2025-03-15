import React, { useState } from "react";
import MapComponent from "../Components/MapComponent";
import RideRequest from "../Components/RideRequest";

function RiderDashboard() {
  const [destination, setDestination] = useState(null);
  const userLocation = { lat: 12.9716, lng: 77.5946 }; // Default user location

  return (
    <div>
      <h1>Welcome, Rider!</h1>
      <MapComponent onLocationSelect={setDestination} />
      <RideRequest userLocation={userLocation} destination={destination} />
    </div>
  );
}

export default RiderDashboard;
