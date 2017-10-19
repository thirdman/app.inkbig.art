import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import {
	Edit,
	Home,
	ImageAdmin
	} from '../components';
import styles from './App.scss';
import fbase from '../firebase';

export default class App extends Component {
	componentDidMount() {
		const imagesRef = fbase.collection('images');
		imagesRef.get().then((querySnapshot) => {
			const newArray = [];
			querySnapshot.forEach((doc) => {
				console.log(doc.id, ' => ', doc.data());
				newArray[doc.id] = doc.data();
			});
			this.setState({
				images: querySnapshot
			});
		console.log('querySnapshot', querySnapshot);
		console.log('newArray', newArray);
		});
	}
	render () {
		return (
			<div className={styles.App}>
				<div className={styles.header}>
					<div className={styles.headerItem}>
						<img src="../assets/imgs/logo.png" height="32" alt="" />
					</div>
					<Link to={'/'} className={styles.headerItem}>Home</Link>
					<Link to={'/edit'} className={styles.headerItem}>Edit</Link>
					<Link to={'/image/admin'} className={styles.headerItem}>Img Admin</Link>
				</div>
				<Route
					exact
					path={'/'}
					component={Home}
				/>
				<Route
					path={'/edit'}
					component={Edit}
				/>
				<Route
					exact
					path={'/image/admin'}
					component={ImageAdmin}
				/>
			</div>
		);
	}
}

// import * as firebase from 'firebase';
// const firebase = require("firebase");
// Required for side-effects
// require('firebase/firestore');

// import base from '../rebase';
// console.log('base is: ', base);

/*
firebase.initializeApp({
    apiKey: 'AIzaSyC9U5WiBmQjRkoj8AE1gaWbAF9_MyBut0Y',
    authDomain: 'inkbig-717ee.firebaseapp.com',
    databaseURL: 'https://inkbig-717ee.firebaseio.com',
    projectId: 'inkbig-717ee',
    storageBucket: 'inkbig-717ee.appspot.com',
    messagingSenderId: '562609189529'
});
*/

// Initialize Cloud Firestore through Firebase
// const db = firebase.firestore();
