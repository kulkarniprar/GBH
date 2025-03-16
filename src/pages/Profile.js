import React, { useEffect, useState } from "react";
import { auth } from "../Components/firebase";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const Profile = () => {
  const [driverData, setDriverData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const db = getFirestore();
        const user = auth.currentUser;

        if (!user) {
          setError("No user logged in");
          setLoading(false);
          return;
        }

        const driverEmail = user.email.toLowerCase();
        console.log("Fetching driver details for:", driverEmail);

        const driversCollection = collection(db, "Driver");
        const q = query(driversCollection, where("Email", "==", driverEmail));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError(`Driver not found (email: ${driverEmail})`);
          setLoading(false);
          return;
        }

        const driverDoc = querySnapshot.docs[0];
        const data = driverDoc.data();

        // Remove BaseStation to prevent error
        const { BaseStation, ...filteredData } = data;

        console.log("Fetched data:", filteredData);
        setDriverData(filteredData);
      } catch (err) {
        console.error("Error fetching driver details:", err);
        setError("Error fetching driver details: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverDetails();
  }, []);

  if (loading) return <p style={{ textAlign: "center", fontSize: "18px", color: "black" }}>Loading...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red", fontSize: "18px" }}>{error}</p>;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh",fontSize:"20px", backgroundColor: "rgba(107, 101, 101, 0.1)" }}>
      <div style={{ backgroundColor: "black", padding: "20px", borderRadius: "10px",backgroundcolor: "black", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", textAlign: "center", width: "350px",height:"400px",width:"400px" }}>
        <h2 style={{ marginBottom: "20px", color: "white" }}>Driver Profile</h2>
        <p style={{color :" #d4a93d"}}><strong>Name:</strong> {driverData?.Name}</p>
        <p style={{color :" #d4a93d"}}><strong>Email:</strong> {driverData?.Email}</p>
        <p style={{color :" #d4a93d"}}><strong>Phone:</strong> {driverData?.Phone}</p>
        <p style={{color :" #d4a93d"}}><strong>Status:</strong> {driverData?.Status}</p>
        <p style={{color :" #d4a93d",fontSize:'35px'}}><strong>Total Earnings: ₹</strong> {driverData?.TotalEarnings}</p>
      </div>
    </div>
  );
};

export default Profile;
