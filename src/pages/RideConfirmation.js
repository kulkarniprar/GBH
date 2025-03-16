import React, { useEffect } from 'react';
import './userRideConfirm.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import myImage from "./nammaYatrilogo.svg"

const RideConfirmation = () => {
  useEffect(() => {
    // Initialize map
    const map = L.map('map').setView([12.9237, 77.4997], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Start and End markers
    L.marker([12.9237, 77.4997]).addTo(map)
      .bindPopup('Cubbon Park');

    L.marker([12.9164, 77.6101]).addTo(map)
      .bindPopup('Lalbagh Botanical Garden');

    // Fetch and draw GraphHopper Route
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
    <div className="namma-yatri-container">
      <div className="logo-section">
        <div className="logo-container">
          <div className="logo"></div>
          <div class="image">
                <img src={myImage} alt="example" />
          
                </div>
               
        </div>
      </div>

      <div className="main-content">
        <div className="confirmation-header">
          <h1 className="confirmation-heading">Your Ride has been confirmed!</h1>
        </div>
        
        <div className="map-container">
          <div id="map" className="map-placeholder"></div>
          <div className="price-tag">₹ 289</div>
        </div>
        
        <div className="details-container">
          <div className="ride-details">
            <h2 className="details-heading">Ride Details</h2>
            <div className="route-info">
              <div className="route-point">
                <div className="route-marker start"></div>
                <div className="route-name">Cubbon Park</div>
              </div>
              <div className="route-line"></div>
              <div className="route-point">
                <div className="route-marker end"></div>
                <div className="route-name">Lalbagh Botanical Garden</div>
              </div>
            </div>
            <button className="cancel-button">Cancel</button>
          </div>
          
          <div className="vertical-divider"></div>
          
          <div className="driver-details">
            <h2 className="details-heading">Driver Details</h2>
            <div className="driver-info">
              <div className="driver-avatar">
                <div className="avatar-placeholder"></div>
              </div>
              <div className="driver-name-rating">
                <div className="driver-name">Suman</div>
                <div className="driver-rating">
                  4.0 <span className="star">★</span>
                </div>
              </div>
            </div>
            
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideConfirmation;
