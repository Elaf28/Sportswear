// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDJ74trq8hTLjpJ98LBgJGCvbRliS_Ue98",
    authDomain: "sportswear-2bd26.firebaseapp.com",
    projectId: "sportswear-2bd26",
    storageBucket: "sportswear-2bd26.appspot.com", 
    messagingSenderId: "914910154183",
    appId: "1:914910154183:web:e572ca2e981131d3cc9de2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
