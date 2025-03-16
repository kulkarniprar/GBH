import React, { useEffect, useState, useRef } from "react";
import { db } from "../Components/firebase"; // Firestore instance
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // Firestore functions
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase Authentication

const GRAPH_HOPPER_API_KEY = "ac198893-d9a0-4c79-8d7c-7855a4bdd5d6"; // Replace with your actual API key

const BaseStationSelection = () => {
  const mapRef = useRef(null);
  const baseStationMarkerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBaseStation, setSelectedBaseStation] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userEmail, setUserEmail] = useState(""); // State to hold user email

  useEffect(() => {
    // Firebase authentication listener
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email); // Set the current signed-in user's email
      } else {
        setUserEmail(""); // Reset email if no user is signed in
      }
    });

    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([12.9716, 77.5946], 12); // Default to Bangalore

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      }).addTo(mapRef.current);

      mapRef.current.on("click", (event) => handleMapClick(event.latlng));
    }
  }, []);

  const handleSearch = async (query) => {
    if (query.length < 3) return;

    const url = `https://graphhopper.com/api/1/geocode?q=${query}&limit=5&key=${GRAPH_HOPPER_API_KEY}` ;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setSearchResults(data.hits || []);
    } catch (error) {
      console.error("GraphHopper Geocoding Error:", error);
    }
  };

  const handleLocationSelect = (location) => {
    const baseStationLocation = {
      name: location.name,
      lat: location.point.lat,
      lng: location.point.lng,
    };

    setSelectedBaseStation(baseStationLocation);
    updateBaseStationMarker(baseStationLocation);
    setSearchResults([]); // Clear search results
  };

  const handleMapClick = (latlng) => {
    const baseStationLocation = { lat: latlng.lat, lng: latlng.lng };
    setSelectedBaseStation(baseStationLocation);
    updateBaseStationMarker(baseStationLocation);
  };

  const updateBaseStationMarker = (location) => {
    if (baseStationMarkerRef.current) {
      baseStationMarkerRef.current.setLatLng([location.lat, location.lng]);
    } else {
      baseStationMarkerRef.current = L.marker([location.lat, location.lng], {
        icon: L.icon({
          iconUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Red_dot.svg",
          iconSize: [32, 32],
        }),
      })
        .addTo(mapRef.current)
        .bindPopup("Base Station")
        .openPopup();

      mapRef.current.setView([location.lat, location.lng], 15); // Zoom into the selected location
    }
  };

  const handleBaseStationSelection = async () => {
    if (selectedBaseStation) {
      setIsProcessing(true);

      // Prepare the base station data to save
      const baseStationData = {
        name: selectedBaseStation.name || "Unnamed Base Station",
        lat: selectedBaseStation.lat,
        lng: selectedBaseStation.lng,
        timestamp: serverTimestamp(),
        email: userEmail, // Attach the current user's email
      };

      try {
        const baseStationRef = await addDoc(collection(db, "BaseStations"), baseStationData);
        console.log("✅ Base station saved to Firestore with ID:", baseStationRef.id);
        setTimeout(() => setIsProcessing(false), 3000); // Stop processing message after 3 seconds
      } catch (error) {
        console.error("❌ Error saving base station:", error);
        alert("Something went wrong while saving the base station.");
        setIsProcessing(false);
      }
    } else {
      alert("Please select a base station.");
    }
  };

  return (
    <div>
      <div style={{ fontSize: "25px", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
        Select Base Station
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Enter Base Station Location..."
          style={{ flex: 1, padding: "10px" }}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearch(e.target.value);
          }}
        />
      </div>

      {searchResults.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {searchResults.map((place, index) => (
            <li
              key={index}
              onClick={() => handleLocationSelect(place)}
              style={{ cursor: "pointer", padding: "5px", borderBottom: "1px solid #ddd" }}
            >
              {place.name}
            </li>
          ))}
        </ul>
      )}

      <div id="map" style={{ width: "60%", height: "700px", marginBottom: "10px",marginLeft:"400px" }}></div>

      <button
        onClick={handleBaseStationSelection}
        style={{
          width: "20%",
          justifyItems:'center',
          marginLeft:'768px',
          padding: "12px",
          backgroundColor: "#28a745",
          color: "white",
          fontSize: "16px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Save Base Station
      </button>

      {isProcessing && (
        <div
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: "#d4edda",
            color: "#155724",
            textAlign: "center",
          }}
        >
          🟢 Saving your base station!
        </div>
      )}
    </div>
  );
};

export default BaseStationSelection;
