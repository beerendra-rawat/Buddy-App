// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC94Pj4hebn-wCUxWP5BxSa-8gTzLXsXd8",
    authDomain: "chat-with-buddy-20311.firebaseapp.com",
    projectId: "chat-with-buddy-20311",
    storageBucket: "chat-with-buddy-20311.firebasestorage.app",
    messagingSenderId: "526096036250",
    appId: "1:526096036250:web:ab29d7bab7416f044eca23",
    measurementId: "G-K18DFEN0X1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);