import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SocketContext } from "../SocketContext"; // Assuming you've set this up
import "./style.css";

const DriverDashboard = () => {
  const navigate = useNavigate();
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
  };

  return (
    <div className="dashboard">
      <header className="header">
        <div className="logo">🚖 Namma Yatri</div>

        <div className="profile-icon" onClick={() => navigate("/profile")}>👤</div>

        <nav>
          <Link to="/leaderboard">🏆 Leaderboard</Link>
          <a href="#">🎁 Rewards</a>
          <a href="#">🆘 Help</a>
        </nav>
      </header>

      <main className="content">
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
    </div>
  );
};

export default DriverDashboard;
