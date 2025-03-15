import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { getFirestore, doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";

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

        // 🔹 Since document ID is NOT the email, we need to find the correct ID
        const driversCollection = collection(db, "Driver");
        const q = query(driversCollection, where("Email", "==", driverEmail));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError(`Driver not found (email: ${driverEmail})`);
          setLoading(false);
          return;
        }

        // 🔹 Get the first matching document
        const driverDoc = querySnapshot.docs[0];
        const data = driverDoc.data();

        // 🔹 Handle Location correctly
        const location = data.Location
          ? { lat: data.Location._lat || data.Location.latitude, lng: data.Location._long || data.Location.longitude }
          : null;

        console.log("Fetched data:", data);
        setDriverData({ ...data, Location: location });
      } catch (err) {
        console.error("Error fetching driver details:", err);
        setError("Error fetching driver details: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverDetails();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="profile">
      <h2>Driver Profile</h2>
      <p><strong>Name:</strong> {driverData?.Name}</p>
      <p><strong>Email:</strong> {driverData?.Email}</p>
      <p><strong>Phone:</strong> {driverData?.Phone}</p>
      <p><strong>Status:</strong> {driverData?.Status}</p>
      {driverData?.Location && (
        <p><strong>Location:</strong> {driverData.Location.lat}, {driverData.Location.lng}</p>
      )}
    </div>
  );
};

export default Profile;
