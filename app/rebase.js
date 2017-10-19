import Rebase from 're-base';
import firebase from 'firebase/app';
import 'firebase/database';

const app = firebase.initializeApp({
    apiKey: 'AIzaSyC9U5WiBmQjRkoj8AE1gaWbAF9_MyBut0Y',
    authDomain: 'inkbig-717ee.firebaseapp.com',
    databaseURL: 'https://inkbig-717ee.firebaseio.com',
    projectId: 'inkbig-717ee',
    storageBucket: 'inkbig-717ee.appspot.com',
    messagingSenderId: '562609189529'
});

const db = firebase.database(app);
const base = Rebase.createClass(db);

export default base;
