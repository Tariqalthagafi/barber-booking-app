// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSB6uj2HbpRIB5xhQ-lYMyK618GOKprsw",
  authDomain: "mandm-68b15.firebaseapp.com",
  projectId: "mandm-68b15",
  storageBucket: "mandm-68b15.firebasestorage.app",
  messagingSenderId: "318460157679",
  appId: "1:318460157679:web:132771fd94750860fb451a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// إنشاء اتصال بـ Firestore وتصديره
const db = getFirestore(app);

const auth = getAuth(app);

export { db , auth  };