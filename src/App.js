import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/home/home";
import RiderSignUp from "./Components/RiderSignUp";
import DriverSignUp from "./Components/DriverSignUp";
import DriverDashboard from "./pages/DriverDashboard";
import RiderDashboard from "./pages/RiderDashboard";
<<<<<<< HEAD
import Leader from "./Components/leader/leader"
import Profile from "./Components/Profile";
=======
import Leader from "./Components/leader/leader";
import RideRequest from "./Components/RideRequest"
>>>>>>> 5c0eb06ea5dd00b214a362d67ef6054fa9c0a0c4

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rider-signup" element={<RiderSignUp />} />
          <Route path="/driver-signup" element={<DriverSignUp />} />
          <Route path="/rider-dashboard" element={<RiderDashboard />} />
          <Route path="/driver-dashboard" element={<DriverDashboard />} />
          <Route path="/leaderboard" element={<Leader />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        </div>
      </Router>
    );
};

export default App;
