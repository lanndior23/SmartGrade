// firebase/config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAgQI72p-Aoj6XZhr2YqjAJwiB7RczgACA",
  authDomain: "smartgrade-5bb32.firebaseapp.com",
  projectId: "smartgrade-5bb32",
  storageBucket: "smartgrade-5bb32.firebasestorage.app",
  messagingSenderId: "1013050339280",
  appId: "1:1013050339280:web:a90b3add06dae5b87ad3d5",
  measurementId: "G-XCPB649ZSP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
