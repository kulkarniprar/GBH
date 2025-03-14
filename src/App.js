import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/home/home";
import RiderSignUp from "./Components/RiderSignUp";
import DriverSignUp from "./Components/DriverSignUp";
import DriverDashboard from "./pages/DriverDashboard";
import RiderDashboard from "./pages/RiderDashboard";

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
        </Routes>
        </div>
      </Router>
    );
};

export default App;
