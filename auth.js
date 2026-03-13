// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ===== LOGIN =====
export async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "index.html";
  } catch (err) {
    alert(err.message);
  }
}

// ===== REGISTER =====
export async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    window.location.href = "index.html";
  } catch (err) {
    alert(err.message);
  }
}

// ===== GOOGLE LOGIN =====
export async function googleLogin() {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    window.location.href = "index.html";
  } catch (err) {
    alert(err.message);
  }
}

// ===== LOGOUT =====
export async function logout() {
  try {
    await auth.signOut();
    window.location.href = "login.html";
  } catch (err) {
    console.log(err);
  }
}
