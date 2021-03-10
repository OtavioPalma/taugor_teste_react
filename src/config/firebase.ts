import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAl1aO7tkbBDgCOK1AGx0XGTmPEVQspjrE',
  authDomain: 'taugor-react-app.firebaseapp.com',
  projectId: 'taugor-react-app',
  storageBucket: 'taugor-react-app.appspot.com',
  messagingSenderId: '427492510140',
  appId: '1:427492510140:web:3a7d6f6f669b12809c03b9',
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
