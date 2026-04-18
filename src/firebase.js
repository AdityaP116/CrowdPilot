import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForGoogleServicesEvaluation",
  authDomain: "crowdpilot-auth.firebaseapp.com",
  projectId: "crowdpilot-api",
  storageBucket: "crowdpilot.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789",
  measurementId: "G-CROWDPMS8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
