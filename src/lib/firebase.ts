import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyAPjIgfkFt72hTC4WK6D7j9DlBiB9z6_i4",
  authDomain: "ultrabustickets.firebaseapp.com",
  projectId: "ultrabustickets",
  storageBucket: "ultrabustickets.firebasestorage.app",
  messagingSenderId: "838898059331",
  appId: "1:838898059331:web:d0b2c5f5c1d5fe69916cf6",
  measurementId: "G-DX2VDMCY6X"
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);

// Створення екземплярів сервісів
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;