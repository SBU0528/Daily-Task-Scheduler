import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// ✅ Full and correct Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDrCPNk9NcPtDaVtogDg3C_vNT84prfk5U",
  authDomain: "daily-task-scheduler-b1943.firebaseapp.com",
  projectId: "daily-task-scheduler-b1943",
  storageBucket: "daily-task-scheduler-b1943.appspot.com",
  messagingSenderId: "1056285349774",
  appId: "1:1056285349774:web:5c8a4e96fd2d92f881d6f1" // ✅ This is the full App ID from Firebase Console
};

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// ✅ Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;
