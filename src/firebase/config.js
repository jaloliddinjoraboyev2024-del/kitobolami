import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBWIM0wDQC_fxCybadsHbLI4yFTKfhTKFg",
  authDomain: "braingame-dafdb.firebaseapp.com",
  projectId: "braingame-dafdb",
  storageBucket: "braingame-dafdb.firebasestorage.app",
  messagingSenderId: "480426581716",
  appId: "1:480426581716:web:fdfb0fa32e18faf7642541",
  measurementId: "G-32RH0X97JP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider("apple.com");
export const analytics = getAnalytics(app);

export default app;
