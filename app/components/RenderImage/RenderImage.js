import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import domtoimage from 'dom-to-image';
import * as firebase from 'firebase';
import fbase from '../../firebase';
import {
	DisplayImage
	} from '../../components';

import styles from './RenderImage.scss';
import Tick from '../../assets/icons/tick.svg';
import Loading from '../../assets/icons/loading.svg';

require('firebase/firestore'); // loads the storage part

export default class RenderImage extends Component {
	state = {
		isLoading: true,
		hasLoaded: false,
		isRendering: false,
		hasRendered: false,
		isSaving: false,
		hasSaved: false,
		theHue: 10,
		theId: this.makeId(),
		showDetail: false,
		size: this.props.mode,
		svgArributes: {
			version: '1.1',
			xmlns: 'http://www.w3.org/2000/svg',
			'xmlns:xlink': 'http://www.w3.org/1999/xlink',
			x: '0',
			y: '0',
			viewBox: '0, 0, 3000, 3000',
			width: '100%',
			height: '100%',
			preserveAspectRatio: 'xMidYMid slice',
		}

	};

	componentWillMount() {
  }

	componentDidMount() {
		const { doRender, doSave } = this.props;
		this.toggleLoading();
		if (doRender) {
			this.doRender(doSave);
		}
	}

	componentDidUpdate() {
		const { doRender, doSave } = this.props;
		// this.toggleLoading();
		if (doRender) {
			console.log('did update. Do save? ', doSave);
		// this.doRender(doSave);
		}
	}

	makeId() { // eslint-disable-line
		let text = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (let i = 0; i < 5; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}

	render() {
		const {
			isLoading,
			isRendering,
			isSaving,
			hasSaved,
			hasRendered,
			showRendered,
			renderUrl,
			theId = this.makeId(),
			size,
			} = this.state;
    const {
			doSave = false,
			doRender = false,
			displayMode = 'max',
			file = 'montenegro',
			aspect = 'portrait',
			swatchName,
		} = this.props;

		return (

			<div
				className={`${styles.RenderImage} 
					${styles[displayMode]} 
					${isLoading ? styles.isLoading : ''} 
					${isRendering ? styles.isRendering : ''} 
					${isSaving ? styles.isSaving : ''}`}
				id={`renderImage${theId}_${file}`}
			>
				<div className={`${styles.row} ${styles.infoRow}`}>
					<div className={styles.column}>
						<h4>Size</h4>
						<span>{size}</span>
					</div>
					<div className={styles.column}>
						<h4>Aspect</h4>
						<span>{aspect}</span>
					</div>
					<div className={styles.column}>
						<h4>Swatch</h4>
						<span>{swatchName}</span>
					</div>
					<div className={styles.column}>
						<h4>Rendered</h4>
						<div>{isRendering ?
							<div
								className={styles.theLoading}
								dangerouslySetInnerHTML={{ __html: Loading }}
							/>
							: ''}
							<div>{!isRendering && hasRendered &&
								<div
									className={styles.theTick}
									dangerouslySetInnerHTML={{ __html: Tick }}
								/>
							}
							</div>
						</div>
					</div>
					<div className={styles.column}>
						<h4>Saved</h4>
						<div>{isSaving ?
							<div
								className={styles.theLoading}
								dangerouslySetInnerHTML={{ __html: Loading }}
							/>
							: ''}
						{!isSaving && hasSaved &&
							<div
								className={styles.theTick}
								dangerouslySetInnerHTML={{ __html: Tick }}
							/>
						}
						</div>
					</div>
					<div className={styles.column}>
						<h4>Detail</h4>
						{this.props.file &&
							<button onClick={() => this.toggleDetail()} >{this.state.showDetail ? 'Hide' : 'Show'}</button>
						}
					</div>
				</div>
				<div className={`${styles.detailRow} ${styles.row} ${this.state.showDetail ? styles.visible : styles.invisible}`}>
					<div className={styles.column}>
						<p>Mode: {this.props.mode}</p>
						<p>Do Render: {doRender ? 'Yes' : 'No'}</p>
						<p>Do Save: {doSave ? 'Yes' : 'No'}</p>
						<p>Rendering: {isRendering ? 'Yes' : ''}</p>
						<p>Has Rendered: {hasRendered ? 'Yes' : ''}</p>
						<p>Saving: {isSaving ? 'Yes' : ''}</p>
						<p>Has Saved: {hasSaved ? 'Yes' : ''}
							{hasSaved &&
								<div
									className={styles.theTick}
									dangerouslySetInnerHTML={{ __html: Tick }}
								/>
							}
						</p>
					</div>
					<div className={styles.column}>
							{this.props.file &&
								<button onClick={() => this.doRender()} >Render Image</button>
							}
							{this.props.file &&
								<button onClick={() => this.doRender(true)} >Render and save Image</button>
							}
							{this.props.file &&
								<button onClick={() => this.doSave()} >Save Image</button>
							}
					</div>
				</div>
				<div className={`${styles.detailRow} ${styles.row} ${showRendered ? styles.isvisible : ''} ${this.state.showDetail ? styles.visible : styles.invisible}`}>
					<div className={styles.column}>
						<span className={styles.cropSource}>
							<DisplayImage
								{...this.props}
								svgAttributes={this.state.svgAttributes}
								// aspect={this.props.aspect}
								// mode={'large'}
								divId={this.state.theId}
							/>
							</span>
					</div>
					<div className={styles.column}>
						<div>
						<div key={`renderWrap${theId}`} className={`${styles.renderImg}`}>
							{isRendering &&
								<div className={styles.placeholder}>
									<div
										className={styles.theLoading}
										dangerouslySetInnerHTML={{ __html: Loading }}
									/>
									<span>Rendering...</span>
								</div>
							}
							{!hasSaved && isSaving &&
								<div className={`${styles.placeholder} ${styles.saving}`}>
									<div
										className={styles.theLoading}
										dangerouslySetInnerHTML={{ __html: Loading }}
									/>
									<span>Saving....</span>
								</div>
							}
						<div className={styles.cropper}>
							<div id={`target${theId}`} />
								{renderUrl &&
									<div>
										<Link
											target="blank"
											to={renderUrl}
											className={styles.link}
										>
											Link
										</Link>
									</div>
								}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
	// FUCNTIONS
	doRender(doSave) {
		const { theId } = this.state;
		const theSource = document.getElementById(theId);
		const theTarget = document.getElementById(`target${theId}`);
		this.setState({
			isRendering: true,
			hasRendered: true, // for completeness
		});
		domtoimage.toJpeg(theSource, { quality: 1 })
		.then((dataUrl) => {
			const img = new Image();
			img.src = dataUrl;
			const innerContent = theTarget.innerHTML;
			const innerContentExists = innerContent.length;
			if (innerContentExists > 0) {
				theTarget.replaceChild(img, theTarget.children[0]);
			} else {
				theTarget.appendChild(img);
			}
			this.setState({
				hasRendered: true,
				isRendering: false,
			});
			if (doSave) {
				this.doSave(dataUrl);
			}
		})
		.catch((error) => {
			console.error('oops, something went wrong!', error);
		});
	}
	doSave(dataUrl) {
		console.log('this will save the image', this.state);
		const { file, aspect, swatchName, hasFrame, hasBackground } = this.props;
		const { size } = this.state;
		console.log(fbase.collection('renders'));
		const fStorage = firebase.storage();
		const storageLocation = `renders/${file}_${swatchName}_${aspect}_${size}${hasFrame ? '_Frame' : ''}${hasBackground ? '_Background' : ''}.jpg`;
		const storageRef = fStorage.ref().child(storageLocation);
		this.setState({
			isSaving: true,
		});
		storageRef.putString(dataUrl, 'data_url').then((snapshot) => {
			console.log('Uploaded a blob or file!', snapshot);
			this.setState({
				storageLocation,
				renderUrl: snapshot.downloadURL,
				isSaving: false,
				hasSaved: true,
			});
			console.log('about to doSaveRender(snapshot, size, null)', snapshot, size, null);
			this.doSaveRender(snapshot, size, null);
		});
	}
	toggleLoading() {
		this.setState({
			isLoading: !this.state.isLoading
		});
	}
	toggleDetail() {
		this.setState({
			showDetail: !this.state.showDetail
		});
	}

	doSaveRender(snapshot, size, hex) {
		console.log('saving the render details:', snapshot, size, hex);
		const currentDateTime = new Date();
			const {
				aspect,
				file,
				mode,
				swatchName,
				hasFrame,
				hasBackground,
				imageColorArray
			} = this.props;
		const renderObj = {};
		renderObj.aspect = aspect;
		renderObj.mode = mode;
		renderObj.imageId = file;
		renderObj.slug = file;
		renderObj.hasFrame = hasFrame;
		renderObj.imageColorArray = imageColorArray;
		renderObj.swatchName = swatchName;
		renderObj.hasBackground = hasBackground;
		renderObj.downloadURL = snapshot.downloadURL;
		renderObj.fullPath = snapshot.metadata && snapshot.metadata.fullPath;
		renderObj.modifiedDate = currentDateTime;
		console.log('renderObj is', renderObj, 'file is', file);
			if (file) {
				fbase.collection('renders').add({
					hex: hex || 'none',
					slug: file,
					modifiedDate: currentDateTime,
					[mode]: renderObj
				})
			.then((renderRef) => {
				console.log('render successfully added to db, with reference of: ', renderRef);
				this.setState({
					isError: false
				});
			})
			.catch(((error) => {
				console.error('Error writing render: ', error);
				this.setState({
					isError: true
				});
			}));
		}
	}
}


/*
				const renderLocationSmall = `renders/${this.state.image}_small.jpg`;
				const storageRefSmall = fStorage.ref().child(renderLocationSmall);
				storageRefSmall.putString(dataUrl, 'data_url').then((snapshot) => {
					console.log('Uploaded a blob or file!');
					console.log(snapshot);
					this.setState({
						renderLocationSmall,
						renderUrlSmall: snapshot.downloadURL,
						savingSmall: false,
						savedSmall: true,
					});
				});
*/
