import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBlSHIONgFGU5dFYFUnRmVBSzF-1biYhfc",
  authDomain: "shazzy-s-project.firebaseapp.com",
  projectId: "shazzy-s-project",
  storageBucket: "shazzy-s-project.firebasestorage.app",
  messagingSenderId: "772033817507",
  appId: "1:772033817507:web:45ff1506636f8507d24816",
  measurementId: "G-L1MXPSQ69L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
