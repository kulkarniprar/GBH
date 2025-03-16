import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Import Firestore instance
import { collection, getDocs } from "firebase/firestore";
import "./leader.css";
import { BsPersonCircle } from "react-icons/bs";

const calculateXP = (driver) => {
  const totalEarnings = driver.TotalEarnings || 0;
  const dailyEarnings = driver.DailyEarning || 0;
  const lastRideAmount = driver.LastRideAmount || 0;
  const isOnline = driver.IsOnline === "true" ? 10 : 0; // Bonus for online drivers

  return (
    (totalEarnings / 10) +   // 1 XP per ₹10 earned (Total Earnings)
    (dailyEarnings / 5) +    // 2 XP per ₹10 earned (Daily Earnings)
    (lastRideAmount / 2) +   // 5 XP per ₹10 earned (Last Ride Amount)
    isOnline                 // Online Status Bonus
  );
};

const DriverLeaderboard = () => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Driver"));
        const driverData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          xp: calculateXP(doc.data())
        }));

        const sortedDrivers = driverData.sort((a, b) => b.xp - a.xp).slice(0, 10);
        setDrivers(sortedDrivers);
      } catch (error) {
        console.error("Error fetching drivers: ", error);
      }
    };

    fetchDrivers();
  }, []);

  const handleCardClick = (driver, index) => {
    if (index < 3) {
      setSelectedDriver(driver);
    }
  };

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">🏆 Driver Leaderboard</h2>
      <div className="leaderboard-grid">
        {drivers.map((driver, index) => (
          <div
            key={driver.id}
            className={`leaderboard-card ${index < 3 ? "top-rank" : ""}`}
            onClick={() => handleCardClick(driver, index)}
          >
            <div className="rank-badge">
              {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
            </div>
            <BsPersonCircle className="driver-icon" />
            <div className="driver-info">
              <p className="driver-name">{driver.Name}</p>
              <p className="xp-points">⭐ {Math.round(driver.xp)} XP</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Top 3 Drivers */}
      {selectedDriver && (
        <div className="modal-overlay" onClick={() => setSelectedDriver(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>🎉 Congratulations {selectedDriver.Name}! 🎉</h2>
            <p>You are among the *top {drivers.findIndex(d => d.id === selectedDriver.id) + 1} drivers*!</p>
            <p>🏆 *Your Reward:* ₹500 Bonus + Priority Rides 🚗</p>
            <p>Keep up the great work and continue driving to earn more rewards! 🚀</p>
            <button className="close-btn" onClick={() => setSelectedDriver(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverLeaderboard;