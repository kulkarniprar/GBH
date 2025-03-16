<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../Components/firebase";
import { collection, query, onSnapshot, orderBy, limit } from "firebase/firestore";
=======
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SocketContext } from "../SocketContext"; // Assuming you've set this up
>>>>>>> a7156d944328adc55497bfdf7d12a49cd04a6106
import "./style.css";
import myImage from "./nammaYatrilogo.svg";


const DriverDashboard = () => {
  const navigate = useNavigate();
<<<<<<< HEAD
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
=======
  const socket = useContext(SocketContext);

  const [onlineStatus, setOnlineStatus] = useState(false);
  const [currentRide, setCurrentRide] = useState(null);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    if (!socket) return;

    socket.on("rideRequest", (rideDetails) => {
      console.log("🚗 Incoming Ride Request:", rideDetails);
      setCurrentRide(rideDetails);
    });

    socket.on("earningsUpdated", (data) => {
      console.log("💰 Earnings updated:", data);
      setEarnings(data.TotalEarnings);
    });

    return () => {
      socket.off("rideRequest");
      socket.off("earningsUpdated");
    };
  }, [socket]);

  const handleGoOnline = () => {
    socket.emit("goOnline", { driverId: "Driver2" });
    setOnlineStatus(true);
    console.log("🟢 Driver is online!");
  };

  const handleGoOffline = () => {
    socket.emit("goOffline", { driverId: "Driver2" });
    setOnlineStatus(false);
    console.log("🔴 Driver is offline!");
  };

  const handleAcceptRide = () => {
    if (currentRide) {
      socket.emit("acceptRide", { driverId: "Driver2", rideId: currentRide.rideId });
      console.log("✅ Ride accepted!");
    }
  };

  const handleCompleteRide = () => {
    if (currentRide) {
      const fareAmount = currentRide.fare;
      socket.emit("rideCompleted", { rideId: currentRide.rideId, driverId: "Driver2", fareAmount });
      console.log("🏁 Ride completed!");
      setCurrentRide(null);
    }
>>>>>>> a7156d944328adc55497bfdf7d12a49cd04a6106
  };

  return (
    <div className="dashboard">
      {/* HEADER */}
      <header className="header">
<<<<<<< HEAD
        <div className="logo"></div>
=======
        <div className="logo">🚖 Namma Yatri</div>

        <div className="profile-icon" onClick={() => navigate("/profile")}>👤</div>
>>>>>>> a7156d944328adc55497bfdf7d12a49cd04a6106
        <nav>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/profile">Profile</Link>
        </nav>
<<<<<<< HEAD
        <div className="image">
          <img src={myImage} alt="example" />
        </div>
=======
>>>>>>> a7156d944328adc55497bfdf7d12a49cd04a6106
      </header>

      {/* MAIN CONTENT */}
      <main className="content">
<<<<<<< HEAD
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
=======
        <h2>📊 Today's Earnings</h2>
        <div className="earnings">
          ₹ {earnings.toFixed(2)} <span className="wallet-icon">💰</span>
        </div>

        <div className="buttons">
          {!onlineStatus ? (
            <button className="go-online" onClick={handleGoOnline}>
              <span className="badge">🟢 Online</span> Go Online
            </button>
          ) : (
            <button className="go-offline" onClick={handleGoOffline}>
              <span className="badge red">🔴 Offline</span> Go Offline
            </button>
          )}
>>>>>>> a7156d944328adc55497bfdf7d12a49cd04a6106
        </div>

        {currentRide && (
          <div className="ride-request">
            <h3>🚕 New Ride Request</h3>
            <p><strong>Pickup:</strong> {currentRide.pickupLocation}</p>
            <p><strong>Dropoff:</strong> {currentRide.dropoffLocation}</p>
            <p><strong>Fare:</strong> ₹{currentRide.fare}</p>

            <div className="ride-buttons">
              <button onClick={handleAcceptRide}>Accept Ride</button>
              <button onClick={() => setCurrentRide(null)}>Reject Ride</button>
            </div>

            <button className="complete-ride-btn" onClick={handleCompleteRide}>
              Complete Ride
            </button>
          </div>
        )}
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

export default DriverDashboard;
