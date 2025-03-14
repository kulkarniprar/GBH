import React, { useState } from 'react';
import { auth } from '../firebase'; // Ensure the correct Firebase import
import { createUserWithEmailAndPassword } from "firebase/auth";
import './home.css'; // Import the CSS for styling

function Home() {
  const [userType, setUserType] = useState('passenger');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Both fields are required!');
      return;
    }

    setError('');
    setSuccessMessage('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User signed up:", userCredential.user);

      setSuccessMessage(`Successfully registered as a ${userType}`);
      setEmail('');
      setPassword('');

      // Redirect user based on type (Modify accordingly)
      if (userType === 'driver') {
        window.location.href = "/driver-dashboard"; // Placeholder redirection
      } else {
        window.location.href = "/rider-dashboard";
      }
    } catch (error) {
      setError(error.message); // Show Firebase error message
    }
  };

  return (
    <div className="app">
      <header className="header">
        <img src="https://i.pinimg.com/474x/c7/7b/7e/c77b7e3dde82fcad8f685d1bb1c75321.jpg" alt="Namma Yatri Logo" className="logo" />
      </header>

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
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;
