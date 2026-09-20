import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import firebaseConfig from '../../../firebase-applet-config.json';

let auth: Auth | null = null;
let googleAuthProvider: GoogleAuthProvider | null = null;

try {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  googleAuthProvider = new GoogleAuthProvider();
} catch (err) {
  console.warn("Firebase client init fallback:", err);
}

export { auth, googleAuthProvider };
