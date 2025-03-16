import React, { useState } from "react";
import { auth } from "../firebase"; // Ensure correct Firebase import
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "./home.css"; // Import the CSS for styling
import myImage from './nammaYatri_logo.svg';
function Home() {
  const [userType, setUserType] = useState("passenger");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLogin, setIsLogin] = useState(false); // Toggle between Sign Up & Login

  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Both fields are required!");
      return;
    }

    setError("");
    setSuccessMessage("");

    try {
      if (isLogin) {
        // LOGIN FLOW
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("User logged in:", userCredential.user);
        setSuccessMessage(`Successfully logged in as a ${userType}`);

        // Redirect based on user type
        window.location.href =
          userType === "driver" ? "/driver-dashboard" : "/rider-dashboard";
      } else {
        // SIGN-UP FLOW
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("User signed up:", userCredential.user);
        setSuccessMessage(`Successfully registered as a ${userType}`);

        // Redirect based on user type
        window.location.href =
          userType === "driver" ? "/driver-dashboard" : "/rider-dashboard";
      }

      setEmail("");
      setPassword("");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="app">
      <div class="image">
      <img src={myImage} alt="example" />

      </div>
     
     
     

      <div className="form-container">
        {/* User Type Selection */}
        <div className="user-type-toggle">
          <button
            onClick={() => handleUserTypeChange("passenger")}
            className={userType === "passenger" ? "active" : ""}
          >
            Passenger
          </button>
          <button
            onClick={() => handleUserTypeChange("driver")}
            className={userType === "driver" ? "active" : ""}
          >
            Driver
          </button>
        </div>

        {/* Toggle between Login & Sign Up */}
        <div className="auth-toggle">
          <button
            onClick={() => setIsLogin(false)}
            className={!isLogin ? "active" : ""}
          >
            Sign Up
          </button>
          <button
            onClick={() => setIsLogin(true)}
            className={isLogin ? "active" : ""}
          >
            Login
          </button>
        </div>

        {/* Form for Sign Up & Login */}
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

          <button type="submit" className="auth-btn">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;