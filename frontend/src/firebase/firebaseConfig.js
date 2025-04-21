import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyACRrFBgVMBFmuEq6hrfvhPmedAmdGz8CU",
  authDomain: "mern-book-ed810.firebaseapp.com",
  projectId: "mern-book-ed810",
  storageBucket: "mern-book-ed810.firebasestorage.app",
  messagingSenderId: "827040606336",
  appId: "1:827040606336:web:f70c82fd2bdee586851e65",
  measurementId: "G-FMSW3W29VW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);


export default app;
