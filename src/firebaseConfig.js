// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDP5cY3vHzLBXv3lNx1QfXJ0nXGJidO64g",
  authDomain: "life-rhythm-bd91d.firebaseapp.com",
  projectId: "life-rhythm-bd91d",
  storageBucket: "life-rhythm-bd91d.firebasestorage.app",
  messagingSenderId: "320404958954",
  appId: "1:320404958954:web:ebbe311f9e8277292d7193",
  measurementId: "G-P5BPLCB888"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);
export const projectId = firebaseConfig.projectId;