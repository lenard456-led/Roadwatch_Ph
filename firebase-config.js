const firebaseConfig = {
  apiKey: "AIzaSyCOBox7Nx7MuYM7fjacH3DK5ZP9Xo3Nvws",
  authDomain: "roadwatch-ph.firebaseapp.com",
  projectId: "roadwatch-ph",
  storageBucket: "roadwatch-ph.firebasestorage.app",
  messagingSenderId: "1310446404",
  appId: "1:1310446404:web:e71bf3a28fa14a33d3fd11",
  measurementId: "G-JYGBCD3048"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
