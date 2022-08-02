import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "claimsgiftsv5.firebaseapp.com",
  projectId: "claimsgiftsv5",
  storageBucket: "claimsgiftsv5.appspot.com",
  messagingSenderId: "412926164740",
  appId: "1:412926164740:web:4553ff6592a04261c09a51"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth();

