// import firebase from 'firebase/app';
import * as firebase from 'firebase';
// import 'firebase/database';
require('firebase/firestore');

const config = {
    apiKey: 'AIzaSyC9U5WiBmQjRkoj8AE1gaWbAF9_MyBut0Y',
    authDomain: 'inkbig-717ee.firebaseapp.com',
    databaseURL: 'https://inkbig-717ee.firebaseio.com',
    projectId: 'inkbig-717ee',
    storageBucket: 'inkbig-717ee.appspot.com',
    messagingSenderId: '562609189529'
};

const fb = firebase.initializeApp(config);
const fbase = firebase.firestore(fb);
// const fbase = createClass(db);
//  var storage = firebase.storage();

export default fbase;
