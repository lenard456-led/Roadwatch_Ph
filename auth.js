// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Protect page (redirect to login if not logged in)
onAuthStateChanged(auth, (user) => {
  if (!user && window.location.pathname.endsWith("index.html")) {
    window.location.href = "login.html";
  }
});

// Login with email/password
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => window.location.href = "index.html")
    .catch(err => alert(err.message));
}

// Register new user
function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => window.location.href = "index.html")
    .catch(err => alert(err.message));
}

// Google login
function googleLogin() {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then(() => window.location.href = "index.html")
    .catch(err => alert(err.message));
}

// Logout
function logout() {
  signOut(auth)
    .then(() => window.location.href = "login.html")
    .catch(err => alert(err.message));
}

// Make functions global for HTML onclick
window.login = login;
window.register = register;
window.googleLogin = googleLogin;
window.logout = logout;
