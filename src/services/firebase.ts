import { initializeApp } from 'firebase/app';

import {
    getAuth,
} from 'firebase/auth';

import {
    getFirestore,
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyC94Pj4hebn-wCUxWP5BxSa-8gTzLXsXd8',
    authDomain: 'chat-with-buddy-20311.firebaseapp.com',
    projectId: 'chat-with-buddy-20311',
    storageBucket: 'chat-with-buddy-20311.firebasestorage.app',
    messagingSenderId: '526096036250',
    appId: '1:526096036250:web:ab29d7bab7416f044eca23',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

import { getStorage } from 'firebase/storage';

export const storage = getStorage(app);