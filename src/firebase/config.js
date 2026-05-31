import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBPaQ9wgAWOZoPbmZH9I4zx8hvDRLRjUaI",
  authDomain: "kitobolami0.firebaseapp.com",
  projectId: "kitobolami0",
  storageBucket: "kitobolami0.firebasestorage.app",
  messagingSenderId: "516038960198",
  appId: "1:516038960198:web:6649cc12829d779b915647",
  measurementId: "G-30SP39P1XG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider("apple.com");
export const analytics = getAnalytics(app);

export default app;
