import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD3fyGHHYOIxSH0T65u78Dt8sFKucQNnLo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "yasser-2b0e0.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "yasser-2b0e0",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "yasser-2b0e0.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "691686031180",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:691686031180:web:d19fe1835ded8e66a599e9",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-3JD8CC5870"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
