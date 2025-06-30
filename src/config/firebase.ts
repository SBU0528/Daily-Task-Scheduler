import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
let getFunctions: any;
if (typeof window !== 'undefined') {
  // Only import getFunctions in the browser
  getFunctions = require('firebase/functions').getFunctions;
}

const firebaseConfig = {
  apiKey: "AIzaSyDrCPNk9NcPtDaVtogDg3C_vNT84prfk5U",
  authDomain: "daily-task-scheduler-b1943.firebaseapp.com",
  projectId: "daily-task-scheduler-b1943",
  storageBucket: "daily-task-scheduler-b1943.appspot.com", // <-- fixed here
  messagingSenderId: "1056285349774",
  appId: "1:1056285349774:web:05d010aeca74fb6f2336df",
  measurementId: "G-GMFSWJFPY4"
};

const app = initializeApp(firebaseConfig);

export const functions = typeof window !== 'undefined' && getFunctions ? getFunctions(app) : undefined;

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const googleProvider = new GoogleAuthProvider();

export default app;


