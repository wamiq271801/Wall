
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQ-wEyPrBEa9Mbr64JbsPJIJCGytrn62Y",
  authDomain: "web-template-3.firebaseapp.com",
  projectId: "web-template-3",
  storageBucket: "web-template-3.firebasestorage.app",
  messagingSenderId: "111963124891",
  appId: "1:111963124891:web:db61a87c2aa49343c2823e",
  measurementId: "G-ZGG9XXRSSK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
