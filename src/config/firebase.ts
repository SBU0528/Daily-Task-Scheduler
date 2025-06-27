import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyDrCPNk9NcPtDaVtogDg3C_vNT84prfk5U",
  authDomain: "daily-task-scheduler-b1943.firebaseapp.com",
  projectId: "daily-task-scheduler-b1943",
  storageBucket: "daily-task-scheduler-b1943.appspot.com",
  messagingSenderId: "1056285349774",
  appId: "1:1056285349774:web" // Replace with your actual App ID if it differs
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;