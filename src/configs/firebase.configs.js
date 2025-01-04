import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDsIimvxR6u89Gq8itHMICtBHOtGb4EJQU",
  authDomain: "chatapp-a8fdf.firebaseapp.com",
  projectId: "chatapp-a8fdf",
  storageBucket: "chatapp-a8fdf.firebasestorage.app",
  messagingSenderId: "947485171349",
  appId: "1:947485171349:web:5a2516241936c88658859c",
  measurementId: "G-JQT6ZP2J4L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
