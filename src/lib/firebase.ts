import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD89_teX1HXlGe1zYvlgb_Yjb-nj9BlAus",
  authDomain: "clever-option-d74w7.firebaseapp.com",
  projectId: "clever-option-d74w7",
  storageBucket: "clever-option-d74w7.firebasestorage.app",
  messagingSenderId: "926454519307",
  appId: "1:926454519307:web:311623f816d2cbe444d90e"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with the specific custom database ID provided in the config
export const db = initializeFirestore(app, {}, "ai-studio-civicpulseai-2719e40b-baee-4bfa-8560-41f91b3644ce");
export const auth = getAuth(app);
