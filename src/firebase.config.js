import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: 'AIzaSyD7nG30I3QjcKZ2id4MsQoGJ8pkWOfaQbg',
  authDomain: 'house-market-9fee7.firebaseapp.com',
  projectId: 'house-market-9fee7',
  storageBucket: 'house-market-9fee7.appspot.com',
  messagingSenderId: '489424537686',
  appId: '1:489424537686:web:7222654ebaceb4c11393f7',
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
