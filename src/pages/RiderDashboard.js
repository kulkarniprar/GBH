import React, { useState, useEffect } from "react";
import { auth, db } from "../Components/firebase"; // Import Firebase Auth & Firestore
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function RiderDashboard() {
  const [riderData, setRiderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("✅ Logged-in user email:", user.email); // Debugging log
        fetchRiderDetails(user.email);
      } else {
        console.warn("⚠ User not logged in. Redirecting to login...");
        navigate("/rider-login"); // Redirect if not logged in
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchRiderDetails = async (email) => {
    try {
      console.log("🔍 Searching for rider with email:", email); // Debugging log
      const ridersRef = collection(db, "Rider"); // Collection name
      const q = query(ridersRef, where("Email", "==", email)); // Ensure field name matches Firestore
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const rider = querySnapshot.docs[0].data();
        console.log("✅ Rider found:", rider); // Debugging log
        setRiderData(rider);
      } else {
        console.error("❌ No rider found with this email.");
        setRiderData(null);
      }
    } catch (error) {
      console.error("🔥 Error fetching rider details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Welcome, Rider!</h1>
      {loading ? (
        <p>Loading...</p>
      ) : riderData ? (
        <div>
          <p><strong>Name:</strong> {riderData.Name}</p>
          <p><strong>Email:</strong> {riderData.Email}</p>
          <p><strong>Contact:</strong> {riderData.Contact}</p>
        </div>
      ) : (
        <p>❌ Rider not found.</p>
      )}
    </div>
  );
}

export default RiderDashboard;
