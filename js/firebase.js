// Firebase independiente del portafolio Marcos Patishtán.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDkcrt5T5T1k1Ssm0WLgP_p1bGz1KJKWEg",
  authDomain: "portafolio-marcos-patishtan.firebaseapp.com",
  projectId: "portafolio-marcos-patishtan",
  storageBucket: "portafolio-marcos-patishtan.firebasestorage.app",
  messagingSenderId: "805072645443",
  appId: "1:805072645443:web:af0a575945af7c189b53f6"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
