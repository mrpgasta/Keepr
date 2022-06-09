// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFEIHL_fxFBP__K53zX9xSIKHsZgGrf5s",
  authDomain: "password-keeper-bac27.firebaseapp.com",
  projectId: "password-keeper-bac27",
  storageBucket: "password-keeper-bac27.appspot.com",
  messagingSenderId: "829315432814",
  appId: "1:829315432814:web:1a0f6ccd371eb8a040017f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);