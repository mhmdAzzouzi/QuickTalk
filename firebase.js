import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXGbgQYR3veaB7Z3qv3klLtisTygq2nmc",
  authDomain: "whatsapp-v2-5a28a.firebaseapp.com",
  projectId: "whatsapp-v2-5a28a",
  storageBucket: "whatsapp-v2-5a28a.appspot.com",
  messagingSenderId: "896606322515",
  appId: "1:896606322515:web:af36ebe9ae65bb031caba6",
  measurementId: "G-SXN3EYDNCK",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

  const db = app.firestore();
  const auth = app.auth();

  const provider = new firebase.auth.GoogleAuthProvider()
    
  export {db , auth , provider};