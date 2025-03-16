import React, { useEffect } from 'react';
import './userRidestarted.css';
import { Star } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const RideStatus = () => {
  useEffect(() => {
    // Initialize GraphHopper Map
    const map = L.map('map').setView([12.9237, 77.4997], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Start and End markers
    const startPoint = L.marker([12.9237, 77.4997]).addTo(map)
      .bindPopup('RV College of Engineering');

    const endPoint = L.marker([12.9164, 77.6101]).addTo(map)
      .bindPopup('Vega City Mall');

    // Fetch and Draw GraphHopper Route
    const graphHopperApiKey = 'ac198893-d9a0-4c79-8d7c-7855a4bdd5d6';
    const url = `https://graphhopper.com/api/1/route?point=12.9237,77.4997&point=12.9164,77.6101&vehicle=car&locale=en&key=${graphHopperApiKey}&type=json&points_encoded=false`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.paths && data.paths.length > 0) {
          const points = data.paths[0].points.coordinates.map(coord => [coord[1], coord[0]]);
          L.polyline(points, { color: 'blue', weight: 5 }).addTo(map);
        }
      })
      .catch(error => console.error('Error fetching GraphHopper route:', error));

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="ride-container">
      <div className="app-header">
        <div className="logo">
          <img src="/logo.png" alt="Namma Yatri" className="logo-image" />
        </div>
        <h1 className="ride-started-text">Ride has started!</h1>
      </div>

      <div className="map-container">
        <div id="map" className="map-placeholder"></div>
      </div>

      <div className="ride-info-container">
        <div className="ride-details">
          <h2>Ride Details</h2>
          <div className="route">
            <div className="route-point">
              <div className="route-marker start"></div>
              <div className="route-text">RV College of Engineering</div>
            </div>
            <div className="route-line"></div>
            <div className="route-point">
              <div className="route-marker end"></div>
              <div className="route-text">Vega City Mall</div>
            </div>
          </div>
        </div>

        <div className="divider"></div>

        <div className="driver-details">
          <h2>Driver Details</h2>
          <div className="driver-info">
            <div className="driver-avatar">
              <img src="/api/placeholder/48/48" alt="Driver" className="avatar-image" />
            </div>
            <div className="driver-name">Suman</div>
            <div className="driver-rating">
              <span>4.0</span>
              <Star className="star-icon" size={16} />
            </div>
          </div>

          <div className="eta-container">
            <div className="eta-label">ETA</div>
            <div className="eta-time">35 mins</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideStatus;
