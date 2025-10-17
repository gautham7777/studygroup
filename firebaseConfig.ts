import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Configuration from the user's Firebase project.
const firebaseConfig = {
  apiKey: "AIzaSyCa3i-X1qYRcCMN5Hfn-XW-75YsEkdJ_xw",
  authDomain: "student-ad4c5.firebaseapp.com",
  databaseURL: "https://student-ad4c5-default-rtdb.firebaseio.com",
  projectId: "student-ad4c5",
  storageBucket: "student-ad4c5.appspot.com",
  messagingSenderId: "882579023460",
  appId: "1:882579023460:web:84e439cdd34e7159f7a171",
  measurementId: "G-XEYZK3XMHJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service, explicitly passing the URL
export const database = getDatabase(app, firebaseConfig.databaseURL);