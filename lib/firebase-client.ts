import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from the user's input
const firebaseConfig = {
  apiKey: "AIzaSyCIx27-0F89uCJOzHe7dJB0uMFKchOhbzc",
  authDomain: "influencer-awards-engine-ia-e.firebaseapp.com",
  projectId: "influencer-awards-engine-ia-e",
  storageBucket: "influencer-awards-engine-ia-e.firebasestorage.app",
  messagingSenderId: "689874545450",
  appId: "1:689874545450:web:b2b2331f61b4728d064c53",
  measurementId: "G-E99HD725G8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { app, db };