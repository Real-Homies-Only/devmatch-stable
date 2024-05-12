import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDf-9fwzZ7ktKdAn1y399edEu-lp7CpYtQ",
  authDomain: "my-devmatch-dev.firebaseapp.com",
  projectId: "my-devmatch-dev",
  storageBucket: "my-devmatch-dev.appspot.com",
  messagingSenderId: "592400601091",
  appId: "1:592400601091:web:cb919309773a60dc403e36",
  measurementId: "G-N2SWD01X3C"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
