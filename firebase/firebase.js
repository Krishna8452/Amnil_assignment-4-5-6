// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebase = require('firebase')
const firebaseConfig = {
  apiKey: "AIzaSyD4IZf6zzdiVNUg1Pa5AQY9-tYrwAr5zWM",
  authDomain: "ecommerce-5464d.firebaseapp.com",
  projectId: "ecommerce-5464d",
  storageBucket: "ecommerce-5464d.appspot.com",
  messagingSenderId: "452953764668",
  appId: "1:452953764668:web:e8aebaf6ee71adbae02439",
  measurementId: "G-NS9V73M9ZF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
module.exports = {app}