import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";

const Dashboard = () => {
  const navigate = useNavigate();

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
        {/* Navigate to Profile Page */}
      </header>

      <main className="content">
        <h2>📊 Today's Earnings</h2>
        <div className="earnings">
          ₹ 505.87 <span className="wallet-icon">💰</span>
        </div>

        <div className="buttons">
          <button className="go-online">
            <span className="badge">🟢 Section 10</span> Go Online
          </button>
          <button className="go-offline">
            <span className="badge red">🔴 Section 11</span> Go Offline
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
