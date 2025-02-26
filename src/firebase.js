import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCzvbbPQ_Ohn4DqgN0PVOAjtFNO6-pKK-w",
    authDomain: "soen-341-2c6ec.firebaseapp.com",
    projectId: "soen-341-2c6ec",
    storageBucket: "soen-341-2c6ec.firebasestorage.app",
    messagingSenderId: "431920145168",
    appId: "1:431920145168:web:a6ac5e4aedc4e819133b95",
    measurementId: "G-KF5P9S74JJ"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

export { auth, provider };
export default db;