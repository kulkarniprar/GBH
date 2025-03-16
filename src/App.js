import React, { createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/home/home";
import RiderSignUp from "./Components/RiderSignUp";
import DriverSignUp from "./Components/DriverSignUp";
import DriverDashboard from "./pages/DriverDashboard";
import RiderDashboard from "./pages/RiderDashboard";
import Leader from "./Components/leader/leader";
<<<<<<< HEAD
import RideConfirmation from "./pages/RideConfirmation"
import BaseStationSelection from "./pages/BaseStation";
import Profile from "./pages/Profile";


import Heatmap from "./pages/heatmaps";  // ✅ Ensure correct path
=======
import Profile from "./Components/Profile";
import io from "socket.io-client";
import { SocketProvider } from "./context/socketContext";
// Create Context to share socket instance
export const SocketContext = createContext();

// Initialize socket instance
const socket = io('http://localhost:5000');


>>>>>>> a7156d944328adc55497bfdf7d12a49cd04a6106

const App = () => {
  return (
    <SocketContext.Provider value={socket}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rider-signup" element={<RiderSignUp />} />
          <Route path="/driver-signup" element={<DriverSignUp />} />
          <Route path="/rider-dashboard" element={<RiderDashboard />} />
          <Route path="/driver-dashboard" element={<DriverDashboard />} />
          <Route path="/leaderboard" element={<Leader />} />
          <Route path="/user-ride-confirm" element={<RideConfirmation />} />
          <Route path="/basestation" element={<BaseStationSelection />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/heatmaps" element={<Heatmap />} />  {/* ✅ Heatmap Route */}
        </Routes>
<<<<<<< HEAD
      </div>
    </Router>
=======
      </Router>
    </SocketContext.Provider>
>>>>>>> a7156d944328adc55497bfdf7d12a49cd04a6106
  );
};

export default App;
