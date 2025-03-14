import React, { useState, useEffect } from "react";
import "./leader.css";
import { FaMedal } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";

const calculateXP = (driver) => {
    console.log("Driver Raw Data:", driver);
  
    const getNumber = (value) => (!isNaN(parseFloat(value)) ? parseFloat(value) : 0);
  
    const totalRides = getNumber(driver["Total Rides Completed"]);
    const earnings = getNumber(driver["Earnings (USD)"]);
    const acceptanceRate = getNumber(driver["Ride Acceptance Rate (%)"]);
    const completionRate = getNumber(driver["Ride Completion Rate (%)"]);
    const onTimeRate = getNumber(driver["On-time Pickup Rate (%)"]);
    const peakHours = getNumber(driver["Peak Hours Participation (%)"]);
    const efficiency = getNumber(driver["Distance Efficiency (Earnings per Mile)"]);
    const pickupTime = getNumber(driver["Average Pickup Time (minutes)"]);
    const complaintFree = getNumber(driver["Complaint-Free Rides (%)"]);
  
    console.log(`Driver XP Debug: ID=${driver["Driver ID"]}, Total Rides=${totalRides}, Earnings=${earnings}`);
  
    return (
      totalRides * 5 +  
      earnings * 0.05 +  
      acceptanceRate * 2 + 
      completionRate * 3 + 
      onTimeRate * 1.5 + 
      peakHours * 2 + 
      efficiency * 10 +  
      (100 - pickupTime) * 5 +  
      complaintFree * 4
    );
};

const DriverLeaderboard = ({ data }) => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    console.log("CSV Data:", data);
    if (data && data.length > 0) {
      const processedData = data.map(driver => {
        const xp = calculateXP(driver);
        console.log(`Driver ${driver["Driver ID"]} XP:`, xp);
        return { ...driver, xp };
      });
  
      const sortedData = processedData.sort((a, b) => b.xp - a.xp).slice(0, 15);
      setLeaderboard(sortedData);
    }
  }, [data]);

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">🏆 Driver Leaderboard</h2>
      <div className="leaderboard-grid">
        {leaderboard.map((driver, index) => (
          <div key={driver.Driver_ID} className={`leaderboard-card ${index < 3 ? "top-rank" : ""}`}>
            <div className="rank-badge">
              {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
            </div>
            <BsPersonCircle className="driver-icon" />
            <div className="driver-info">
              <p className="driver-id">{driver.Driver_ID}</p>
              <p className="xp-points">⭐ {driver.xp.toFixed(0)} XP</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverLeaderboard;


/*import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import DriverLeaderboard from "./Components/leader/leader";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/synthetic_driver_data.csv");
      const reader = await response.text();
      
      Papa.parse(reader, {
        header: true,
        dynamicTyping: true, // Convert numbers properly
        complete: (results) => {
          setData(results.data);
        },
      });
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      
      <DriverLeaderboard data={data} />
    </div>
  );
}

export default App;*/
