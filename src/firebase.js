import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  onSnapshot,
  enableNetwork,
  disableNetwork
} from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBx0GRlEq9bLG2fRE0dPrj1Qh64uFwlczE",
  authDomain: "campusconnect-1-e8516.firebaseapp.com",
  projectId: "campusconnect-1-e8516",
  storageBucket: "campusconnect-1-e8516.firebasestorage.app",
  messagingSenderId: "244658562441",
  appId: "1:244658562441:web:5a9eca3ae1988724d96d58",
  measurementId: "G-GC1VZS58G7"
};

// Initialize Firebase with error handling
let app;
let auth;
let db;
let storage;
let analytics;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  console.log("Firebase app initialized successfully");

  // Initialize services with error handling
  try {
    auth = getAuth(app);
    console.log("Firebase Auth initialized successfully");
  } catch (authError) {
    console.error("Error initializing Firebase Auth:", authError);
  }

  try {
    db = getFirestore(app);
    console.log("Firebase Firestore initialized successfully");
  } catch (dbError) {
    console.error("Error initializing Firebase Firestore:", dbError);
  }

  try {
    storage = getStorage(app);
    console.log("Firebase Storage initialized successfully");
  } catch (storageError) {
    console.error("Error initializing Firebase Storage:", storageError);
  }

  // Initialize analytics only in browser environment
  if (typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app);
      console.log("Firebase Analytics initialized successfully");
    } catch (analyticsError) {
      console.error("Error initializing Firebase Analytics:", analyticsError);
    }
  }
} catch (error) {
  console.error("Error initializing Firebase app:", error);
}

// Function to check Firestore connection
export const checkFirestoreConnection = async () => {
  return new Promise((resolve) => {
    // First check if db is initialized
    if (!db) {
      console.error("Firestore connection check failed: db is not initialized");
      resolve({ connected: false, error: "Firestore not initialized" });
      return;
    }

    try {
      // Use onSnapshot instead of getDocs as it might have different permissions
      const testCollection = collection(db, 'messages');
      console.log("Attempting to connect to Firestore 'messages' collection");

      // Set up a temporary listener that we'll immediately unsubscribe from
      const unsubscribe = onSnapshot(
        testCollection,
        (snapshot) => {
          // Successfully connected
          console.log("Firestore connection successful, received snapshot with", snapshot.docs.length, "documents");
          unsubscribe();
          resolve({ connected: true });
        },
        (error) => {
          console.error("Firestore connection check failed:", error.code, error.message);

          // Provide more detailed error information
          let errorInfo = {
            code: error.code,
            message: error.message
          };

          resolve({ connected: false, error: errorInfo });
        }
      );

      // Set a timeout in case the onSnapshot never resolves
      setTimeout(() => {
        console.warn("Firestore connection check timed out after 5 seconds");
        unsubscribe();
        resolve({ connected: false, error: "Connection timeout" });
      }, 5000);
    } catch (error) {
      console.error("Firestore connection setup failed:", error);
      resolve({ connected: false, error: error.message || "Unknown error" });
    }
  });
};

// Function to check network status and toggle Firestore network
export const toggleFirestoreNetwork = async (enable = true) => {
  if (!db) return { success: false, error: "Firestore not initialized" };

  try {
    if (enable) {
      await enableNetwork(db);
      console.log("Firestore network enabled");
    } else {
      await disableNetwork(db);
      console.log("Firestore network disabled");
    }
    return { success: true };
  } catch (error) {
    console.error(`Error ${enable ? 'enabling' : 'disabling'} Firestore network:`, error);
    return { success: false, error: error.message || "Unknown error" };
  }
};

export { auth, db, storage, analytics };
