import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../Components/firebase";
import { collection, query, onSnapshot, orderBy, limit } from "firebase/firestore";
import "./style.css";
import myImage from "./nammaYatrilogo.svg";


const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedBase, setSelectedBase] = useState("");
  const [rideRequest, setRideRequest] = useState(null);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  //const navigate = useNavigate();


  useEffect(() => {
    // Listen for the latest ride request in Firestore, ordering by timestamp
    const q = query(collection(db, "RideRequest"), orderBy("Timestamp", "desc"), limit(1));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          setRideRequest(doc.data());
          setIsNotificationVisible(true);

          // Hide notification after 5 seconds
          setTimeout(() => {
            setIsNotificationVisible(false);
          }, 5000);
        });
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const handleRideConfirmation = () => {
    alert("Ride confirmed!");
    //setIsNotificationVisible(false);
    navigate("/user-ride-confirm");
  };

  const handleRideRejection = () => {
    alert("Ride rejected");
    //setIsNotificationVisible(false);
  };

  return (
    <div className="dashboard">
      {/* HEADER */}
      <header className="header">
        <div className="logo"></div>
        <nav>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/profile">Profile</Link>
        </nav>
        <div className="image">
          <img src={myImage} alt="example" />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="content">
        <h2>Today's Earnings</h2>
        <div className="earnings">₹ 505.87</div>

        <div className="buttons">
          <button className="go-online">Go Online</button>
          <button className="go-offline">Go Offline</button>
          <button className="heatmap-button" onClick={() => navigate("/heatmaps")}>
            High Demand Zones
          </button>
          <button className="bs" onClick={() => navigate("/basestation")}>
            Select base location
          </button>
        </div>
      </main>

      {/* Notification Popup */}
      {isNotificationVisible && rideRequest && (
        <div className="notificationpopup">
          <h3>New Ride Request</h3>
          <p><strong>Rider:</strong> {rideRequest.Name}</p>
          <p><strong>Pickup:</strong> {rideRequest.StartLocation.name}</p>
          <p><strong>Dropoff:</strong> {rideRequest.Destination.name}</p>
          <p><strong>Contact:</strong> {rideRequest.Contact}</p>
          <button onClick={handleRideConfirmation} className="confirm-btn">
            Confirm Ride
          </button>
          <button onClick={handleRideRejection} className="reject-btn">
            Reject ride
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
