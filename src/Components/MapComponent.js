import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const GRAPH_HOPPER_API_KEY = "ac198893-d9a0-4c79-8d7c-7855a4bdd5d6"; // 🔹 Replace with actual API Key

const MapComponent = ({ onLocationSelect }) => {
  const mapRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([12.9716, 77.5946], 12); // Default to Bangalore

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      }).addTo(mapRef.current);
    }
  }, []);

  const handleSearch = async (event) => {
    setQuery(event.target.value);
    if (event.target.value.length < 3) return;

    const url = `https://graphhopper.com/api/1/geocode?q=${event.target.value}&limit=5&key=${GRAPH_HOPPER_API_KEY}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      setSearchResults(data.hits || []);
    } catch (error) {
      console.error("GraphHopper Geocoding Error:", error);
    }
  };

  const handleLocationSelect = (location) => {
    onLocationSelect({
      name: location.name,
      lat: location.point.lat,
      lng: location.point.lng,
    });

    if (mapRef.current) {
      mapRef.current.setView([location.point.lat, location.point.lng], 15);
      L.marker([location.point.lat, location.point.lng]).addTo(mapRef.current)
        .bindPopup(location.name)
        .openPopup();
    }
    setSearchResults([]); // Clear search results after selection
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter destination..."
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        value={query}
        onChange={handleSearch}
      />
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
      <div id="map" style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
};

export default MapComponent;
