
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD4IZf6zzdiVNUg1Pa5AQY9-tYrwAr5zWM",
  authDomain: "ecommerce-5464d.firebaseapp.com",
  projectId: "ecommerce-5464d",
  storageBucket: "ecommerce-5464d.appspot.com",
  messagingSenderId: "452953764668",
  appId: "1:452953764668:web:e8aebaf6ee71adbae02439",
  measurementId: "G-NS9V73M9ZF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);