// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2kuteEViayoLANLWE7S7usPcc77whoxA",
  authDomain: "fbdemo-f9d5f.firebaseapp.com",
  projectId: "fbdemo-f9d5f",
  storageBucket: "fbdemo-f9d5f.appspot.com",
  messagingSenderId: "487441071572",
  appId: "1:487441071572:web:f5f7e18b1d926b6cb5ea41"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

let currentDeviceToken = null;  // Add this line at the top level

// Request permission to send notifications and retrieve the device token
export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BE-r6mRU4zAHn3fE8iS_HzPf1xvtUGVzFl4PcVoKz0osGG2iffl7QBLpZ-6KeMnd5oayi93m39SNvOunTIQYPbA" // Replace with your public VAPID key from Firebase Console
    });
    if (currentToken) {
      console.log("Current token for client: ", currentToken);
      currentDeviceToken = currentToken;  // Store token in variable
      return currentToken;
      // You can send this token to your server and store it to send notifications later
    } else {
      console.log("No registration token available. Request permission to generate one.");
      return null;
    }
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
    return null;
  }
};

export const getCurrentToken = () => currentDeviceToken;  // Add this export

export const clearDeviceToken = () => {
  const token = currentDeviceToken;
  currentDeviceToken = null;
  return token;
};

// Listen for foreground messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Foreground message received: ", payload);
      resolve(payload);
    });
  });
