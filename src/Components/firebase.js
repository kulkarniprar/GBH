import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5Aof7TfdxfK7zfYnc91mNKk3B88YRE40",
  authDomain: "gbhack-70f04.firebaseapp.com",
  projectId: "gbhack-70f04",
  storageBucket: "gbhack-70f04.firebasestorage.app",
  messagingSenderId: "460109800878",
  appId: "1:460109800878:web:d6a81210485ad12664943f",
  measurementId: "G-4CTNFQ68C6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);
