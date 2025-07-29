// js/auth.js
import { auth, db } from "../firebase/config.js";
import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  doc, getDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMsg.textContent = "";

  const email = loginForm.email.value.trim();
  const password = loginForm.password.value.trim();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      errorMsg.textContent = "No user record found.";
      return;
    }

    const userData = userSnap.data();

    if (userData.role !== "admin") {
      errorMsg.textContent = "Access denied. Admins only.";
      return;
    }

    window.location.href = "admin.html";
  } catch (err) {
    errorMsg.textContent = "Login failed: " + err.message;
  }
});
