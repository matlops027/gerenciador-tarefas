import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAZUOLAZfPeX6Iqezs0RFl1bbLKriVBSog",
    authDomain: "gerenciador-tarefas-cef18.firebaseapp.com",
    projectId: "gerenciador-tarefas-cef18",
    storageBucket: "gerenciador-tarefas-cef18.appspot.com",
    messagingSenderId: "841679251432",
    appId: "1:841679251432:web:ff68aee30f6125cb59e65d",
    measurementId: "G-LXB03Z424E"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export { db, auth };
  