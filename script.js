// ===== Firebase & Auth =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

// Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Login function
async function login(email, password){
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Logged in:", userCredential.user);
  } catch(error){
    console.error(error);
  }
}

// Protect page
onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "login.html";
});

// Logout function
async function logout() {
  await signOut(auth);
  window.location.href = "login.html";
}

// ===== Sidebar =====
function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.style.left = menu.style.left === "0px" ? "-220px" : "0px";
}

// ===== Sections =====
function showPage(page) {
  document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
  document.getElementById(page).classList.add("active");
  toggleMenu();
  if (page === "submit") setTimeout(loadMap, 300);
}

// ===== Map & Reports =====
let map, marker, lat = 0, lng = 0;
const API_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

function loadMap() {
  if (map) return;

  map = L.map("reportMap").setView([14.5995, 120.9842], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);

  map.on("click", e => {
    lat = e.latlng.lat;
    lng = e.latlng.lng;
    if (marker) map.removeLayer(marker);
    marker = L.marker([lat, lng]).addTo(map);
    document.getElementById("selectedLocation").innerText =
      `Selected: ${lat.toFixed(5)} , ${lng.toFixed(5)}`;
  });

  loadReports();
}

async function detectLocation() {
  if (!navigator.geolocation) return alert("Geolocation not supported");
  navigator.geolocation.getCurrentPosition(async pos => {
    lat = pos.coords.latitude;
    lng = pos.coords.longitude;
    map.setView([lat, lng], 16);
    if (marker) map.removeLayer(marker);
    marker = L.marker([lat, lng]).addTo(map);

    document.getElementById("selectedLocation").innerText =
      `Selected: ${lat.toFixed(5)} , ${lng.toFixed(5)}`;

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      document.getElementById("locationText").value = data.address?.road || data.display_name || "";
    } catch(e) { console.log("Reverse geocoding failed", e); }
  });
}

async function loadReports() {
  try {
    const res = await fetch(API_URL);
    const reports = await res.json();
    reports.forEach(r => {
      if (!r.lat || !r.lng) return;
      L.marker([parseFloat(r.lat), parseFloat(r.lng)])
        .addTo(map)
        .bindPopup(`<b>${r.issue}</b><br>${r.location}<br>Status: ${r.status || "Pending"}`);
    });
  } catch(e) { console.log("Error loading reports", e); }
}

// ===== Form =====
function submitReport() {
  if (lat === 0 && !document.getElementById("locationText").value.trim())
    return alert("Please select location or type the road name");

  const tracking = "RW" + Date.now();
  const formData = new FormData();
  ["lastname","firstname","mi","email","phone","location","issue"].forEach(id =>
    formData.append(id, document.getElementById(id).value)
  );
  formData.append("lat", lat || "");
  formData.append("lng", lng || "");
  if (document.getElementById("photo").files[0])
    formData.append("photo", document.getElementById("photo").files[0]);

  fetch(API_URL, { method:"POST", body: formData })
    .then(res => res.json())
    .then(res => {
      document.getElementById("trackInfo").innerText = "Tracking Number: " + tracking;
      document.getElementById("popup").classList.add("show");
    })
    .catch(err => { console.error(err); alert("Submission failed."); });
}

function closePopup() { document.getElementById("popup").classList.remove("show"); showPage("home"); resetForm(); }
function newReport() { document.getElementById("popup").classList.remove("show"); resetForm(); showPage("submit"); }
function resetForm() {
  document.querySelectorAll("#submit input,#submit textarea").forEach(i => i.value="");
  document.getElementById("selectedLocation").innerText = "No location selected";
  lat=0; lng=0;
  if (marker) map.removeLayer(marker);
  document.getElementById("photoPreview").style.display="none";
}

// ===== Photo Preview =====
document.addEventListener("DOMContentLoaded", () => {
  const photoInput = document.getElementById("photo");
  const preview = document.getElementById("photoPreview");
  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => { preview.src = e.target.result; preview.style.display="block"; };
    reader.readAsDataURL(file);
  });
});

// ===== Hero Carousel =====
let currentSlide = 0;
const slides = document.querySelectorAll(".carousel-slide");
function nextSlide() {
  slides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add("active");
}
setInterval(nextSlide, 5000);


