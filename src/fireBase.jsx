// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore/lite';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Initialize Firebase

  const cfg = {
    apiKey: "AIzaSyDUO-8AWqilJri3D7NNqX5Gp7IXu8uESe8",
    authDomain: "taskmap-dbac1.firebaseapp.com",
    projectId: "taskmap-dbac1",
    storageBucket: "taskmap-dbac1.firebasestorage.app",
    messagingSenderId: "131912244683",
    appId: "1:131912244683:web:f96c8683f863e8c640ea4e",
    measurementId: "G-D5DETHPK72"
  };

  const app = initializeApp(cfg);
  const db = getFirestore(app);
  const auth = getAuth(app);

export { db, auth }