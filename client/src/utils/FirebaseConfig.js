import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const API_KEY = process.env.REACT_APP_FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: "AIzaSyCAYPSTWjAuiC4nQUGaM7TTupMCQVieU5k",
  authDomain: "whats-app-clone-1-0.firebaseapp.com",
  projectId: "whats-app-clone-1-0",
  storageBucket: "whats-app-clone-1-0.appspot.com",
  messagingSenderId: "10554949333",
  appId: "1:10554949333:web:5327f429c78fe1fd056c5c",
};

const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
