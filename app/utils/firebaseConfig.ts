import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDj0xL1a8RXco1VtJc6HhNKiSAnAKPLwrA",
  authDomain: "devmatch-af82d.firebaseapp.com",
  projectId: "devmatch-af82d",
  storageBucket: "devmatch-af82d.appspot.com",
  messagingSenderId: "684945932752",
  appId: "1:684945932752:web:b312aead93ca295976b9d5",
  measurementId: "G-LC1H34VJCH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
