import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <header className="header">
        <div className="logo">namma yatri</div>
        <nav>
          <Link to="/leaderboard">Leaderboard</Link>
          <a href="#">Rewards</a>
          <a href="#">Help</a>
        </nav>
        <div className="profile-icon">🟡</div>
      </header>

      <main className="content">
        <h2>Today's earnings</h2>
        <div className="earnings">
          ₹ 505.87 <span className="wallet-icon">💰</span>
        </div>

        <div className="buttons">
          <button className="go-online">
            <span className="badge">Section 10</span> Go Online
          </button>
          <button className="go-offline">
            <span className="badge red">Section 11</span> Go Offline
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;