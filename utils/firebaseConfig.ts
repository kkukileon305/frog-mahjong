// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnpmMSU1wFfp7p-F-ycK3M0a0HhbKyyPU",
  authDomain: "frog-f72a1.firebaseapp.com",
  projectId: "frog-f72a1",
  storageBucket: "frog-f72a1.firebasestorage.app",
  messagingSenderId: "197309547466",
  appId: "1:197309547466:web:cb4f49370fd261b5b8c533",
  measurementId: "G-XT4Y1VV05G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const messaging =
  typeof window !== "undefined" ? getMessaging(app) : null;
