// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAh9ltpG1kW8jVRdy_s0BQI6PQgjV5tmwo",
  authDomain: "sihp-52bee.firebaseapp.com",
  projectId: "sihp-52bee",
  storageBucket: "sihp-52bee.appspot.com",
  messagingSenderId: "778374913561",
  appId: "1:778374913561:web:4f1c71b842c9ea36c85488",
  measurementId: "G-J8CFLJYML0",
  databaseURL: "https://sihp-52bee-default-rtdb.firebaseio.com", // Add the databaseURL for Realtime Database
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app); // Initialize the database

export { database };
