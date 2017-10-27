import React, { Component } from 'react';
import fbase from '../../firebase';
import Tick from '../../assets/icons/tick.svg';

import styles from './ImageAdmin.scss';

export default class ImageAdmin extends Component {
	state = {
		profile: {},
		loggedIn: false,
		filesArray: [],
		currentRendersArray: [],
		isAdding: false,
		isEditing: false,
		isUpdated: false,
		isError: false,
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
			isAdding,
			filesArray,
			currentRendersArray,
			} = this.state;

		// console.log('state is', this.state);
		// console.log('props is', this.props);
		console.log(imageId);
		return (
			<div className={`${styles.ImageAdmin} ${styles.wrap} ${isUpdated ? styles.isUpdated : ''}`}>
				<div className={styles.row}>
					<div className={`${styles.column} `}>
					{isError &&
						<div className={`${styles.message} ${styles.error}`}>
								Error: {this.state.error}
						</div>
					}
					{isAdding &&
						<div className={`${styles.message}`}>
							<div
								className={styles.theTick}
								dangerouslySetInnerHTML={{ __html: Tick }}
							/>
								Adding
						</div>
					}
					{isUpdated &&
						<div className={`${styles.message} ${styles.success}`}>
							<div
								className={styles.theTick}
								dangerouslySetInnerHTML={{ __html: Tick }}
							/>
								UPDATED
						</div>
					}
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
							<h4>Slug</h4>
							<input
								type="text"
								name="slug"
								value={imageData && imageData.image}
								ref={(iImage) => { this.textInput = iImage; }}
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
					<section>
					<h3>Adjustments</h3>
						<div className={styles.contentItem}>
							<h4>TranslateX</h4>
							<span>
								{imageData && imageData.theTranslateX}
							</span>
						</div>
						<div className={styles.contentItem}>
							<h4>TranslateY</h4>
							<span>
								{imageData && imageData.theTranslateY}
							</span>
						</div>
						<div className={styles.contentItem}>
							<h4>Scale</h4>
							<span>
								{imageData && imageData.theScale}
							</span>
						</div>
						<div className={styles.contentItem}>
							<h4>Aspect</h4>
							<span>
								{imageData && imageData.aspect}
							</span>
						</div>
						<div className={styles.contentItem}>
							<h4>hasBackground</h4>
							<span>
								{imageData && imageData.hasBackground}
							</span>
						</div>
					</section>
					<button
						onClick={() => this.saveImage()} // eslint-disable-line
					>
						Save
					</button>
					</div>
					<div className={styles.column}>
					<h3>Current Renders</h3>
					{currentRendersArray &&
						currentRendersArray.map((render) => {
							return (
								<div
									key={`imageRef${render}`}
									className={`${styles.listItem} ${styles.row}`}
									// onClick={() => this.toggleIncludeRender(file.id)}
									role="presentation"
								>
									<div className={styles.column}>
										{render}
									</div>
								</div>
							);
						})
					}
					<h3>Available renders</h3>
					{filesArray &&
						filesArray.map((file) => {
							// console.log('file is', file);
							// const { currentRendersArray } = this.state;
							console.log('does it include? ', currentRendersArray.includes(file.id));
							return (
								<div
									key={`imageRef${file.id}`}
									className={`${styles.listItem} ${styles.row} ${currentRendersArray.includes(file.id) ? styles.isActive : ''}`}
									onClick={() => this.toggleIncludeRender(file.id)}
									role="presentation"
								>
									<div className={styles.column}>
										{file.data && file.data.slug}
										{file.data && file.data.thumbnail && file.data.thumbnail.aspect &&
											<span> : {file.data.thumbnail.aspect}</span>
										}
									</div>
									<div className={styles.column}>
										{file.data && file.data.thumbnail &&
											<img src={file.data.thumbnail.downloadURL} alt="" className={styles.thumbnail} />
										}
									</div>
									<div className={styles.column}>{file.data && file.data.name}</div>
									<div className={styles.column}>{file.data && file.data.images && 'yes'}</div>
									<div className={styles.column}>{file.id}</div>
									<div className={styles.column}>
										{file.data && file.data.modifiedDate.toString()}
									</div>
								</div>
							);
						})
					}
					</div>
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
				this.getAvailableFiles(doc.data().image); // image = imageid!
				this.getImageRenders(imageId);
			} else {
				console.log('No such document!');
			}
		}).catch((error) => {
			console.log('Error getting document:', error);
		});
	}

	getAvailableFiles(imageId) {
		console.log('the image id is: ', imageId);
		const filesRef = fbase.collection('renders').where('slug', '==', imageId);
		const filesArray = [];
		filesRef.get().then((querySnapshot) => {
			console.log('querySnapshot', querySnapshot);
			querySnapshot.forEach((doc) => {
				const tempThing = {};
				tempThing.id = doc.id;
				tempThing.data = doc.data();
				filesArray.push(tempThing);
			});
			this.setState({
				filesArray
			});
		})
		.catch((error) => {
			console.log('Error getting documents: ', error);
		});
	}

	getImageRenders(imageId) {
		const rendersRef = fbase.collection('images').doc(imageId).collection('renders');
		const currentRendersArray = [];
		rendersRef.get().then((querySnapshot) => {
			console.log('currentRendersArray querySnapshot', querySnapshot, imageId, '6BdyvanYXJum2kxzuXiV');
			querySnapshot.forEach((doc) => {
				console.log(doc);
				const tempThing = {};
				tempThing.renderId = doc.id;
				currentRendersArray.push(doc.id);
			});
			this.setState({
				currentRendersArray
			});
		})
		.catch((error) => {
			console.log('Error getting documents: ', error);
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

	toggleIncludeRender(renderId) {
		console.log('this will toggle render id:', renderId);
//		const currentDateTime = new Date();
		const { currentRendersArray } = this.state;
		const {
			imageId = (this.props.location.state && this.props.location.state.imageId) || 'milfordSound',
		} = this.props;
		const renderObj = { renderId, test: 'bbb' };
		const imageRef = fbase.collection('images').doc(imageId).collection('renders').doc(renderId);
		console.log('exists: ', imageRef);
		this.setState({
			isAdding: true,
		});
		if (currentRendersArray.includes(renderId)) {
			console.log('THIS DOES NOTHING');
			const currentRendersArrayTemp = currentRendersArray.slice();
			const index = currentRendersArrayTemp.findIndex((o) => {
				return o === renderId;
			});
			if (index !== -1) {
				currentRendersArrayTemp.splice(index, 1);
			}
			imageRef.delete().then(() => {
					this.setState({
						isUpdated: true,
						isAdding: false,
						currentRendersArray: currentRendersArrayTemp,
					});
					setTimeout(() => {
						this.setState({
							isUpdated: false,
						});
					}, 2000);
			}).catch((error) => {
				console.error('Error removing document: ', error);
					this.setState({
						isAdding: false,
						isError: true
					});
			});
		} else {
			imageRef.set(renderObj, { merge: true })
			// fbase.collection('renders').doc(renderId).coll
			// ection('images').add(imgObj) // , { merge: true })
			.then((doc) => {
				const currentRendersArrayTemp = currentRendersArray.slice();
				console.log('success: ', doc);
				// console.log('DOC: => ', doc.data());
				currentRendersArrayTemp.push(renderId);
				this.setState({
					isUpdated: true,
					isAdding: false,
					currentRendersArray: currentRendersArrayTemp,
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
					isAdding: false,
					isError: true
				});
			}));
		}
	}
}
/*
		this.setState({
			[name]: value
		});
*/
