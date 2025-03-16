// /Server/config/firebase-admin.js
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json'); // Keep it in /config folder

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://gbhack-70f04.firebaseio.com' // Optional if you're only using Firestore
});

// Export Firebase services
const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
