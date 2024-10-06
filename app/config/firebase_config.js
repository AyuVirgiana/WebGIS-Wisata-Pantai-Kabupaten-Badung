// lib/firebase.ts
import { getApps, initializeApp } from 'firebase/app';
import { getAuth,GoogleAuthProvider  } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBwSSUEsBuBVFUNZpdrcTo7Nb9hNeePyUU",
  authDomain: "webgis-wisata-pantai.firebaseapp.com",
  projectId: "webgis-wisata-pantai",
  storageBucket: "webgis-wisata-pantai.appspot.com",
  messagingSenderId: "690376212893",
  appId: "1:690376212893:web:b1724bae951932d697ef74",
  measurementId: "G-5030MJGDVF"
};

  if (!getApps().length) {
    initializeApp(firebaseConfig);
}

export const auth = getAuth();
export const database = getDatabase();
export const firestore = getFirestore();
export const provider = new GoogleAuthProvider();
