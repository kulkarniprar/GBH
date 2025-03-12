import React, { useState } from 'react';
import './App.css'; // Assuming you will add some CSS for styles.

function App() {
  const [userType, setUserType] = useState('passenger'); // To toggle between passenger and driver
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ username, password, userType });
    // Further logic for signup process goes here.
  };

  return (
    <div className="app">
      <div className="header">
        <img src="https://i.pinimg.com/474x/c7/7b/7e/c77b7e3dde82fcad8f685d1bb1c75321.jpg" alt="Namma Yatri Logo" className="logo" />
      </div>
      <div className="form-container">
        <div className="user-type-toggle">
          <button
            onClick={() => handleUserTypeChange('passenger')}
            className={userType === 'passenger' ? 'active' : ''}
          >
            Passenger
          </button>
          <button
            onClick={() => handleUserTypeChange('driver')}
            className={userType === 'driver' ? 'active' : ''}
          >
            Driver
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;