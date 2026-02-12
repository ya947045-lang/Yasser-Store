import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD3fyGHHYOIxSH0T65u78Dt8sFKucQNnLo",
  authDomain: "yasser-2b0e0.firebaseapp.com",
  projectId: "yasser-2b0e0",
  storageBucket: "yasser-2b0e0.firebasestorage.app",
  messagingSenderId: "691686031180",
  appId: "1:691686031180:web:d19fe1835ded8e66a599e9",
  measurementId: "G-3JD8CC5870"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };