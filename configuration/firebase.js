import firebase from 'firebase'
const firebaseConfig = {
    apiKey: "AIzaSyAsp9dI-nMnmLPIGr2Mb8I_idTe8464LV0",
    authDomain: "bind-tect.firebaseapp.com",
    databaseURL: "https://bind-tect.firebaseio.com",
    projectId: "bind-tect",
    storageBucket: "bind-tect.appspot.com",
    messagingSenderId: "280046605663",
    appId: "1:280046605663:web:1b05372563d28f8fd692ea"
};

const Firebase = firebase.initializeApp(firebaseConfig)
const firebaseFirestore = Firebase.firestore()

export default firebaseFirestore