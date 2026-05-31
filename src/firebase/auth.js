import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  updateProfile,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
} from "firebase/auth";
import { auth, googleProvider, appleProvider } from "./config";

// ─── Email/Password Login ─────────────────────────────────────────────────────
export async function loginWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

// ─── Email/Password Signup ────────────────────────────────────────────────────
export async function signupWithEmail(fullName, email, password) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName: fullName });
  await sendEmailVerification(result.user);
  return result.user;
}

// ─── Google Login ─────────────────────────────────────────────────────────────
export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

// ─── Apple Login ──────────────────────────────────────────────────────────────
export async function loginWithApple() {
  const result = await signInWithPopup(auth, appleProvider);
  return result.user;
}

// ─── Password Reset ───────────────────────────────────────────────────────────
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────
export async function logout() {
  await signOut(auth);
}

// ─── Current User ─────────────────────────────────────────────────────────────
export function getCurrentUser() {
  return auth.currentUser;
}
