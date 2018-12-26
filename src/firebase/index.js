import firebase from 'firebase/app';
import 'firebase/storage';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAb051XeRbbkOlAsY-S1WVylDdjeiQN9_s",
    authDomain: "autmaster-ocr.firebaseapp.com",
    databaseURL: "https://autmaster-ocr.firebaseio.com",
    projectId: "autmaster-ocr",
    storageBucket: "autmaster-ocr.appspot.com",
    messagingSenderId: "872085108573"
};
firebase.initializeApp(config);

const storage = firebase.storage();

export {
    storage, firebase as default
}