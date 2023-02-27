import firebase from "firebase/app";
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAijWCZN8p6Uszc9QtnvfTMppLA_M8ex94",
    authDomain: "boardapp-18769.firebaseapp.com",
    projectId: "boardapp-18769",
    storageBucket: "boardapp-18769.appspot.com",
    messagingSenderId: "798319054279",
    appId: "1:798319054279:web:c4e1d9dd2a45e0dec79de2",
    measurementId: "G-Q1T1K7B0KS"
  };
  
  // Initialize Firebase
  // if (firebase.apps.length) {
  //   firebase.initializeApp(firebaseConfig);
  // //  }


  // export default firebase;
  export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();