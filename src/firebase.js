// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import initAppCheck from './AppCheck'; // 🔒 ربط App Check خارجي

// ✅ إعدادات Firebase من .env
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: 'mandm-68b15.firebaseapp.com',
  projectId: 'mandm-68b15',
  storageBucket: 'mandm-68b15.appspot.com',
  messagingSenderId: '318460157679',
  appId: '1:318460157679:web:132771fd94750860fb451a',
};

// 🚀 تهيئة Firebase
const app = initializeApp(firebaseConfig);

// 🔐 تفعيل App Check
initAppCheck(app);

// 🔌 تصدير الخدمات
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
