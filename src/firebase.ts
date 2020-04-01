import firebase from "firebase";

export const firebaseConfig = {
    apiKey: "AIzaSyBcdEYtDY5rO8BQBHoYuhXIs4b6GBo3X2c",
    authDomain: "powervote.firebaseapp.com",
    databaseURL: "https://powervote.firebaseio.com",
    projectId: "powervote",
    storageBucket: "powervote.appspot.com",
    messagingSenderId: "472502404600",
    appId: "1:472502404600:web:f1729b183a76ca2148420d"
};



export let Firebase;
export let db: firebase.database.Reference;

export const Initialize = () => {
    Firebase = firebase.initializeApp(firebaseConfig);
    db = firebase.database().ref('suggestions');
}
