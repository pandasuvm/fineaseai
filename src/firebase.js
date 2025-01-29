// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"; // Add these imports
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBo19DxOfdghHAw317XIfSw-hVS381v4Ns",
  authDomain: "filenest12390.firebaseapp.com",
  projectId: "filenest12390",
  storageBucket: "filenest12390.firebasestorage.app",
  messagingSenderId: "18884551507",
  appId: "1:18884551507:web:af234ad217c106f025f7a6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); // This exports the auth object for authentication
export const db = getFirestore(app); // This exports Firestore DB
export const storage = getStorage(app); // This exports Firebase Storage

// Export the authentication methods for use in other components
export { createUserWithEmailAndPassword, signInWithEmailAndPassword };
