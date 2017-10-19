import React, { Component } from 'react';
import fbase from '../../firebase';
import Tick from '../../assets/icons/tick.svg';

import styles from './ImageAdmin.scss';

export default class ImageAdmin extends Component {
	state = {
		profile: {},
		loggedIn: false,
		isAdding: false,
		isEditing: false,
		isUpdated: false,
		isError: false
	};

	componentWillMount() {
  }

	componentDidMount() {
		this.getImage();
	}

	componentWillUnmount() {
	}
	// Note: `user` comes from the URL, courtesy of our router
	// { action, blogId }
	render() {
    const {
			imageId = (this.props.location.state && this.props.location.state.imageId) || 'milfordSound',
		} = this.props;
		const {
			imageData,
			isError,
			isUpdated,
			} = this.state;

		// console.log('state is', this.state);
		// console.log('props is', this.props);
		console.log(imageId);
		return (
			<div className={`${styles.ImageAdmin} ${styles.wrap} ${isUpdated ? styles.isUpdated : ''}`}>
				<div className={`${styles.column} `}>
				{isError && <h3>ERROR</h3>}
					<div className={`${styles.notice}`}>
					<h3>
					<div
						className={styles.theTick}
						dangerouslySetInnerHTML={{ __html: Tick }}
					/>
						UPDATED</h3>
					</div>
				<h1>
					{imageData && imageData.name}
				</h1>
				<h4>ID: {imageId}</h4>
				<section>
					<div className={styles.contentItem}>
						<h4>Name</h4>
						<input
							type="text"
							name="name"
							value={imageData && imageData.name}
							ref={(iName) => { this.textInput = iName; }}
							onChange={this.handleInputChange}
						/>
					</div>
					<div className={styles.contentItem}>
						<h4>Updated</h4>
						<span>
							{imageData && imageData.modifiedDate.toString()}
						</span>
					</div>
				</section>
				<button
					onClick={() => this.saveImage()} // eslint-disable-line
				>
					Save
				</button>
				</div>
			</div>
		);
	}
	// FUCNTIONS
	getImage() {
		const {
			imageId = (this.props.location.state && this.props.location.state.imageId) || 'milfordSound',
		} = this.props;
		console.log('image id in props is', imageId);
		const imageRef = fbase.collection('images').doc(imageId);
		imageRef.get().then((doc) => {
			if (doc.exists) {
				console.log('Document data:', doc.data());
				this.setState({
					imageData: doc.data()
				});
			} else {
				console.log('No such document!');
			}
		}).catch((error) => {
			console.log('Error getting document:', error);
		});
	}

	handleInputChange = (event) => {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		const tempImageData = { ...this.state.imageData };
		tempImageData[name] = value;
		this.setState({
			imageData: tempImageData
		});
		setTimeout(() => {
			this.saveImage();
		}, 1000);
	}

	saveImage() {
		const currentDateTime = new Date();
		const {
			imageId = (this.props.location.state && this.props.location.state.imageId) || 'milfordSound',
		} = this.props;
		const { imageData } = this.state;
		console.log('imageData', imageData);
			fbase.collection('images').doc(imageId).update({
				name: imageData.name,
				modifiedDate: currentDateTime
		}) // , { merge: true }
		.then(() => {
			console.log('Document successfully written!');
			this.setState({
				isUpdated: true,
				isError: false
			});
			setTimeout(() => {
				this.setState({
					isUpdated: false,
				});
			}, 2000);
		})
		.catch(((error) => {
			console.error('Error writing document: ', error);
			this.setState({
				isUpdated: false,
				isError: true
			});
		}));
	}
}
/*
		this.setState({
			[name]: value
		});
*/
