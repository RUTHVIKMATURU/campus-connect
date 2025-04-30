import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyBx0GRlEq9bLG2fRE0dPrj1Qh64uFwlczE",
  authDomain: "campusconnect-1-e8516.firebaseapp.com",
  projectId: "campusconnect-1-e8516",
  storageBucket: "campusconnect-1-e8516.firebasestorage.app",
  messagingSenderId: "244658562441",
  appId: "1:244658562441:web:5a9eca3ae1988724d96d58",
  measurementId: "G-GC1VZS58G7"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, db, storage, analytics };
