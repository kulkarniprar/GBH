import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { db } from "../Components/firebase"; // Firestore instance
import { collection, addDoc, serverTimestamp, onSnapshot, doc } from "firebase/firestore"; // Firestore functions
import myImage from './nammaYatri_logo.svg'

const GRAPH_HOPPER_API_KEY = "ac198893-d9a0-4c79-8d7c-7855a4bdd5d6"; // Replace with actual API Key
// Function to calculate distance using the Haversine formula (in kilometers)
const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const toRadians = (degrees) => degrees * (Math.PI / 180);

  lat1 = toRadians(lat1);
  lon1 = toRadians(lon1);
  lat2 = toRadians(lat2);
  lon2 = toRadians(lon2);

  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;

  const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
};

// Function to calculate fare based on distance
const calculateFare = (distanceKm) => {
  const baseFare = 18; // Base fare per kilometer
  const demandSupplyRatio = 1893 / 1800; // Example constant demand-supply ratio
  const trafficFactor = 1.2; // Example traffic factor, could be dynamically computed

  // Calculate fare
  let fare = baseFare * distanceKm * demandSupplyRatio * trafficFactor;

  // Cap the fare at 2.5x the base fare
  fare = Math.min(fare, baseFare * distanceKm * 2.5);

  return fare;
};




const MapComponent = ({ onLocationSelect }) => {
  const mapRef = useRef(null);
  const startMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const navigate = useNavigate(); // FIXED: Added missing navigate function

  const [startQuery, setStartQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ results: [], isStart: true });

  const [startLocation, setStartLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [rideConfirmed, setRideConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rideStatus, setRideStatus] = useState("");
  const [fare, setFare] = useState(null); // State to hold calculated fare

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([12.9716, 77.5946], 12); // Default to Bangalore

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      }).addTo(mapRef.current);

      mapRef.current.on("click", (event) => handleMapClick(event.latlng));
    }
  }, []);

  const handleSearch = async (query, isStart) => {
    if (!query || query.length < 3) return; // FIXED: Prevent undefined errors

    const url = `https://graphhopper.com/api/1/geocode?q=${query}&limit=5&key=${GRAPH_HOPPER_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      setSearchResults({ results: data.hits || [], isStart }); // FIXED: Ensuring data is always an array
    } catch (error) {
      console.error("GraphHopper Geocoding Error:", error);
      setSearchResults({ results: [], isStart });
    }
  };

  const handleLocationSelect = (location, isStart) => {
    const newLocation = {
      name: location.name,
      lat: location.point.lat,
      lng: location.point.lng,
    };

    if (isStart) {
      setStartLocation(newLocation);
      setStartQuery(location.name);
      updateMarker(startMarkerRef, newLocation, "Start Location", "blue");
    } else {
      setDestination(newLocation);
      setDestinationQuery(location.name);
      updateMarker(destinationMarkerRef, newLocation, "Destination", "red");
      fetchRoute(startLocation, newLocation);
    }

    setSearchResults({ results: [], isStart });
  };

  const handleMapClick = (latlng) => {
    const newLocation = { lat: latlng.lat, lng: latlng.lng };

    if (!startLocation) {
      setStartLocation(newLocation);
      updateMarker(startMarkerRef, newLocation, "Start Location", "blue");
    } else {
      setDestination(newLocation);
      updateMarker(destinationMarkerRef, newLocation, "Destination", "red");
      fetchRoute(startLocation, newLocation);
    }
  };

  const updateMarker = (markerRef, location, title, color) => {
    if (markerRef.current) {
      markerRef.current.setLatLng([location.lat, location.lng]);
    } else {
      markerRef.current = L.marker([location.lat, location.lng], {
        icon: L.icon({
          iconUrl: `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
          iconSize: [32, 32],
        }),
      })
        .addTo(mapRef.current)
        .bindPopup(title);
    }
    markerRef.current.openPopup();
    mapRef.current.setView([location.lat, location.lng], 15);
  };

  const fetchRoute = async (start, end) => {
    if (!start || !end) return;
  
    const url = `https://graphhopper.com/api/1/route?point=${start.lat},${start.lng}&point=${end.lat},${end.lng}&vehicle=car&key=${GRAPH_HOPPER_API_KEY}&instructions=false&points_encoded=false`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (routeLayerRef.current) {
        mapRef.current.removeLayer(routeLayerRef.current);
      }
  
      const routeCoords = data.paths[0].points.coordinates.map(([lng, lat]) => [lat, lng]);
      routeLayerRef.current = L.polyline(routeCoords, { color: "blue", weight: 4 }).addTo(mapRef.current);
  
      // Calculate distance and fare
      const distanceKm = haversine(start.lat, start.lng, end.lat, end.lng);
      setFare(calculateFare(distanceKm)); // Update the fare state
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };
  

  const handleRideBooking = async () => {
    if (startLocation && destination) {
      const riderId = "qwer23"; // You can replace this with dynamic user ID (e.g., from auth context)
      const riderName = "Rider2"; // Replace with dynamic user name
      const riderEmail = "rider2@gmail.com"; // Replace with dynamic user email
      const riderContact = "000000000"; // Replace with dynamic contact number

      const rideData = {
        Contact: riderContact,
        Email: riderEmail,
        Name: riderName,
        Timestamp: serverTimestamp(),
        riderId: riderId,
        StartLocation: {
          name: startLocation.name || "Start Location",
          lat: startLocation.lat,
          lng: startLocation.lng,
        },
        Destination: {
          name: destination.name || "Destination",
          lat: destination.lat,
          lng: destination.lng,
        },
      };

      try {
        const rideRef = await addDoc(collection(db, "RideRequest"), rideData);
        console.log("✅ Ride request saved to Firestore with ID:", rideRef.id);
        setRideConfirmed(true);
        setTimeout(() => setRideConfirmed(false), 3000);
      } catch (error) {
        console.error("❌ Error saving ride request:", error);
        alert("Something went wrong while saving the ride request.");
        setIsProcessing(false);
      }
    } else {
      alert("Please select both start and destination locations.");
    }
  };

  const listenForStatusChange = (rideId) => {
    const rideRef = doc(db, "RideRequest", rideId);

    // Listen for ride status changes
    onSnapshot(rideRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const status = docSnapshot.data().status;
        setRideStatus(status); // Update ride status in the state

        // If the status changes, show it in a pop-up
        alert(`🚗 Ride Status: ${status}`);
      }
    });
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", fontSize: "2rem" }}>Hello Rider!</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Enter Start Location..."
          style={{ flex: 1, padding: "10px", width: "50%" }}
          value={startQuery}
          onChange={(e) => {
            setStartQuery(e.target.value);
            handleSearch(e.target.value, true);
          }}
        />
        <input
          type="text"
          placeholder="Enter Destination..."
          style={{ flex: 1, padding: "10px" }}
          value={destinationQuery}
          onChange={(e) => {
            setDestinationQuery(e.target.value);
            handleSearch(e.target.value, false);
          }}
        />
      </div>

      {searchResults.results.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {searchResults.results.map((place, index) => (
            <li
              key={index}
              onClick={() => handleLocationSelect(place, searchResults.isStart)}
              style={{ cursor: "pointer", padding: "5px", borderBottom: "1px solid #ddd", margin: "10px" }}
            >
              {place.name}
            </li>
          ))}
        </ul>
      )}

      <div id="map" style={{ width: "80%", height: "400px", margin: "20px auto", border: "2px solid #000" }}></div>

      {fare && (
        <div style={{ marginTop: "10px", padding: "10px", textAlign: "center", fontSize:"25px" }}>
          <strong>Expected Fare: ₹{fare.toFixed(2)}</strong>
        </div>
      )}

      <button
        style={{
          display: "block",
          width: "50%",
          margin: "20px auto",
          padding: "14px",
          backgroundColor: "#28a745",
          color: "white",
          fontSize: "25px",
          border: "none",
          cursor: "pointer",
          marginTop:"50px",
          fontWeight:"bold"
        }}
        onClick={() => {
          navigate("/user-ride-confirm"); // FIXED: navigate function now defined
        }}
      >
        Book Ride
      </button>

      {rideConfirmed && (
        <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#d4edda", color: "#155724", textAlign: "center" }}>
          ✅ Ride Confirmed! Your driver is on the way.
        </div>
      )}

      {isProcessing && <div style={{ marginTop: "10px", textAlign: "center", color: "green" }}>🟢 Your ride is being processed!</div>}
      {rideConfirmed && <div style={{ marginTop: "10px", textAlign: "center", color: "green" }}>✅ Ride Confirmed! Your driver is on the way.</div>}
    </div>
  );
};

export default MapComponent;