import React, { Component } from 'react';
import * as firebase from 'firebase';
import domtoimage from 'dom-to-image';
import { Link } from 'react-router-dom';
import { ChromePicker, BlockPicker, SliderPicker, SketchPicker } from 'react-color';
import Toggle from 'react-toggle';
import Slider, { Range } from 'rc-slider';
import 'react-toggle/style.css';
import '../../assets/scss/rcSlider.css';
// import '../../assets/scss/toggle.css';
import fbase from '../../firebase';

// import Dispimport variables from '../../assets/scss/variables.scss';
import Tick from '../../assets/icons/tick.svg';
import Loading from '../../assets/icons/loading.svg';
import {
	// DisplayColor,
	DisplayImage
	} from '../../components';
import styles from './Edit.scss';

const imageSizes = [
	'Thumbnail',
	'Small',
	'Medium',
	'Large',
	'Print'
];

export default class Edit extends Component {
/*
	static propTypes = {
		file
  };
*/
	state = {
		profile: {},
		loggedIn: false,
		isAdding: false,
		isEditing: false,
		image: (this.props.location.state && this.props.location.state.image) || 'montenegro',
		imageSaved: false,
		aspect: 'portrait',
		hasFrame: false,
		hasHighlight: false,
		hasBackground: false,
		// isPreview: true,
		isPortrait: true,
		showSources: false,
		showRendered: true,
		showColorEdit: false,
		Adjustments: false,
		imageLevels: [10, 16, 37, 61, 79],
		colorsArray: [],
		theScale: 1,
		theTranslateX: 0,
		theTranslateY: 0,
	};

	componentWillMount() {
  }

	componentDidMount() {
		this.getColors();
	}

	componentWillUnmount() {
	}
	// Note: `user` comes from the URL, courtesy of our router
	// { action, blogId }
	render() {
    const {
			file,
		} = this.props;
		const {
			aspect,
			colorSaved = false,
			hasMenu,
			isPortrait,
			image,
			imageSaved,
			colorObj = this.props.location.state && this.props.location.state.colorObj,
			colorsArray,
			// isPreview,
			hasHighlight = false,
			hasFrame = false,
			hasBackground,
			theScale,
			theTranslateX,
			theTranslateY,
			theHue = (this.props.location.state &&
				this.props.location.state.colorObj.hsl.h) || 187.82608695652172,
			theSaturation = (this.props.location.state &&
				this.props.location.state.colorObj.hsl.s) || 0.5,
			theLightness = (this.props.location.state &&
				this.props.location.state.colorObj.hsl.l) || 0.5,
			isRendering,
			imageLevels,
			} = this.state;

		// console.log('state is', this.state);
		// console.log('props is', this.props);
		console.log('edit file (to be depricated)', file);
		if (!firebase.apps.length) {
			// firebase.initializeApp();
		} else {
			// console.log('FOREBASE:', firebase.apps);
			// const fStorage = firebase.storage();
			// console.log(fStorage);
		}
		return (
			<div className={`${styles.Edit} ${styles.wrap} ${hasMenu ? styles.hasMenu : ''}`}>
				<div className={`${styles.column} `}>
					<div className={styles.row}>
						{this.state.image &&
							<button onClick={() => this.doRenderImages()} >Generate Images</button>
						}
						{this.state.image &&
							<button onClick={() => this.doSaveImage()} >Save Image</button>
						}
						{this.state.image &&
							<button onClick={() => this.doSaveRenders()} >Save All renders async</button>
						}
						{this.state.image &&
							<button onClick={() => this.doRenderThumbnail()} >Render THumbnail only</button>
						}
						{imageSaved && 'Image saved!'}
						{colorSaved && 'Color saved!'}
					</div>
					<div className={styles.titleBlock}>
						<h4>Preview SVG</h4>
					</div>
					<div className={styles.previewImageWrap}>
						<DisplayImage
							file={image}
							aspect={aspect}
							mode={'preview'}
							hasHighlight={hasHighlight}
							hasFrame={hasFrame}
							hasBackground={hasBackground}
							imageLevels={imageLevels}
							hue={theHue}
							saturation={theSaturation}
							lightness={theLightness}
							scale={theScale}
							translateX={theTranslateX}
							translateY={theTranslateY}
						/>
					{this.state.previewImage}
					</div>
					<div className={styles.titleBlock}>
						<h4>Sources</h4>
						<button onClick={() => this.toggleViewSources()} >{this.state.showSources ? 'hide sources' : 'show sources'}</button>
					</div>
					<div className={`${styles.sourceImageWrap} ${this.state.showSources ? styles.visible : ''}`}>
						<div className={`${styles.sourceImage} ${styles.th}`}>
							<DisplayImage
								file={image}
								aspect={aspect}
								mode={'thumbnail'}
								hasHighlight={hasHighlight}
								hasFrame={hasFrame}
								hasBackground={hasBackground}
								hue={theHue}
								saturation={theSaturation}
								lightness={theLightness}
							/>
						</div>
						<div className={`${styles.sourceImage} ${styles.small}`}>
							<DisplayImage
								file={image}
								aspect={aspect}
								mode={'small'}
								hasHighlight={hasHighlight}
								hasFrame={hasFrame}
								hasBackground={hasBackground}
								hue={theHue}
								saturation={theSaturation}
								lightness={theLightness}
							/>
						</div>
						<div className={`${styles.sourceImage} ${styles.medium}`}>
							<DisplayImage
								file={image}
								aspect={aspect}
								mode={'medium'}
								hasHighlight={hasHighlight}
								hasFrame={hasFrame}
								hasBackground={hasBackground}
								hue={theHue}
								saturation={theSaturation}
								lightness={theLightness}
							/>
						</div>
						<div className={`${styles.sourceImage} ${styles.large}`}>
							<DisplayImage
								file={image}
								aspect={aspect}
								mode={'large'}
								hasHighlight={hasHighlight}
								hasFrame={hasFrame}
								hasBackground={hasBackground}
								hue={theHue}
								saturation={theSaturation}
								lightness={theLightness}
							/>
						</div>
						<div className={`${styles.sourceImage} ${styles.print}`}>
							<DisplayImage
								file={image}
								aspect={aspect}
								mode={'print'}
								hasHighlight={hasHighlight}
								hasFrame={hasFrame}
								hasBackground={hasBackground}
								hue={theHue}
								saturation={theSaturation}
								lightness={theLightness}
							/>
						</div>
					</div>
					<div className={styles.titleBlock}>
						<h4>Rendered Images</h4>
						<button onClick={() => this.toggleViewRendered()} >{this.state.showRendered ? 'hide renders' : 'show renders'}</button>
					</div>
					<div className={`${styles.renderImageWrap} ${this.state.showRendered ? styles.visible : ''} ${isRendering ? styles.loading : ''}`}>
					{
						imageSizes.map((size) => {
							// const renderDoneState = `done${size}`;
							// const renderSavedState = `saved${size}`;
							return (
								<div key={`renderWrap${size}`} className={`${styles.renderImage} ${styles[size]}`}>
									<h4>{size}</h4>
									<div
										className={styles.theTick}
										dangerouslySetInnerHTML={{ __html: Tick }}
									/>
									{this.state[`doing${size}`] &&
										<div className={styles.placeholder}>
											<div
												className={styles.theLoading}
												dangerouslySetInnerHTML={{ __html: Loading }}
											/>
											Rendering...
										</div>
									}
									<div id={`newImg${size}`} />
									{!this.state[`saved${size}`] && this.state[`saving${size}`] &&
										<div className={styles.saving}>
										<div
											className={styles.theLoading}
											dangerouslySetInnerHTML={{ __html: Loading }}
										/>
										saving....
										</div>
									}
									{this.state[`renderUrl${size}`] &&
										<div>
											<Link
												target="blank"
												to={this.state[`renderUrl${size}`]}
												className={styles.link}
											>
												Link
											</Link>
										</div>
									}
								</div>
							);
						})
					}
					</div>
				</div>
				<div className={`${styles.column} `}>
					<div className={styles.titleBlock}>
						<h3>Settings</h3>
					</div>
					<div className={`${styles.formItem} ${this.state.hasBackground ? styles.isActive : ''}`}>
						<h5>hasBackground: <span>{this.state.hasBackground ? 'yes' : 'no'}</span></h5>
						<div className={styles.switchWrap}>
							<Toggle
								className={styles.theToggle}
								id="hasBckgroundToggle"
								defaultChecked={this.state.hasBackground}
								onChange={this.toggleBackground}
							/>
							<label htmlFor="hasBckgroundToggle">Add a background</label>
						</div>
					</div>
					<div className={`${styles.formItem} ${this.state.hasFrame ? styles.isActive : ''}`}>
						<h5>Has Frame: <span>{this.state.hasFrame ? 'yes' : 'no'}</span></h5>
						<div className={styles.switchWrap}>
							<Toggle
								className={styles.theToggle}
								id="hasFrameToggle"
								defaultChecked={this.state.hasFrame}
								onChange={this.toggleFrame}
							/>
							<label htmlFor="hasFrameToggle">Add a frame</label>
						</div>
					</div>
					<div className={`${styles.formItem} ${isPortrait ? styles.isActive : ''}`}>
						<h5>Aspect: {this.state.isPortrait ? 'Portrait' : 'Landscape'}</h5>
						<div className={styles.buttonGroup}>
							<div
								className={`${styles.btn} ${styles.portrait} ${aspect === 'portrait' ? styles.selected : ''}`}
								onClick={() => this.setAspect('portrait')}
								role="presentation"
							>
								portrait
							</div>
							<div
								className={`${styles.btn} ${styles.landscape} ${aspect === 'landscape' ? styles.selected : ''}`}
								onClick={() => this.setAspect('landscape')}
								role="presentation"
							>
								Landscape
							</div>
							<div
								className={`${styles.btn} ${styles.square} ${aspect === 'square' ? styles.selected : ''}`}
								onClick={() => this.setAspect('square')}
								role="presentation"
							>
								Square
							</div>
							<div
								className={`${styles.btn} ${styles.circle} ${aspect === 'circle' ? styles.selected : ''}`}
								onClick={() => this.setAspect('circle')}
								role="presentation"
							>
								Circle
							</div>
						</div>
					</div>

					<div className={styles.titleBlock}>
						<h3>Adjustments</h3>
						<button onClick={() => this.toggleViewAdjustments()} >{this.state.showAdjustments ? 'hide adjustments' : 'show adjustments'}</button>
					</div>
					<div className={`${styles.adjustmentsWrap} ${this.state.showAdjustments ? styles.visible : ''}`}>
						<div className={`${styles.formItem}`}>
							<h5>Scale: {theScale}</h5>
							<Slider
								step={0.1}
								min={0}
								max={2}
								defaultValue={theScale}
								onChange={this.onSliderChange}
							/>
						</div>
						<div className={`${styles.formItem}`}>
							<h5>TranslateX: {theTranslateX}</h5>
							<Slider
								step={1}
								min={-50}
								max={50}
								defaultValue={theTranslateX}
								onChange={this.onTranslateXChange}
							/>
						</div>
						<div className={`${styles.formItem}`}>
							<h5>TranslateY: {theTranslateY}</h5>
							<Slider
								step={1}
								min={-50}
								max={50}
								defaultValue={theTranslateY}
								onChange={this.onTranslateYChange}
							/>
						</div>
					</div>
					<div style={{ display: 'none' }}>
						<button onClick={() => this.loadImage('montenegro', 'portrait')} >montenegro</button>
						<button onClick={() => this.loadImage('auckland', 'landscape')} >auckland</button>
						<button onClick={() => this.loadImage('sydney', 'portrait')} >sydney</button>
						<button onClick={() => this.loadImage('fiordland_falls', 'portrait')} >fiordland_falls</button>
						<button onClick={() => this.loadImage('teanau', 'portrait')} >te anau</button>
						<button onClick={() => this.loadImage('dune')} >Dune</button>
						<button onClick={() => this.loadImage('doubtful')} >doubtful</button>
						<button onClick={() => this.loadImage('cottage_shore')} >cottage (shore)</button>
						<button onClick={() => this.loadImage('cottage_mountains')} >cottage (mountains)</button>
						<button onClick={() => this.loadImage('cave')} >cave</button>
						<button onClick={() => this.loadImage('cathedral')} >cathedral cove</button>
						<button onClick={() => this.loadImage('moeraki')} >Moeraki</button>
						<button onClick={() => this.loadImage('hillsTriptych1')} >hillsTriptych1</button>
						<button onClick={() => this.loadImage('hillsTriptych2')} >hillsTriptych2</button>
						<button onClick={() => this.loadImage('hillsTriptych3')} >hillsTriptych3</button>
						<button onClick={() => this.loadImage('Port')} >Port</button>
					</div>
					<div className={styles.titleBlock}>
						<h3>Color</h3>
						<button onClick={() => this.toggleColorEdit()} >{this.state.showColorEdit ? 'hide edit' : 'show edit'}</button>
					</div>
					<section className={styles.alt}>
						<div className={styles.formItem}>
							<div className={styles.row}>
							<div className={styles.swatchWrap}>
								<h5>Darkest <span>{imageLevels[0]}</span></h5>
								<div className={styles.swatch}>
									<div
										className={styles.color}
											style={{ backgroundColor: `hsla(${colorObj.hsl.h}, ${colorObj.hsl.s * 100}%, ${imageLevels[0]}%, 1)` }}
									/>
								</div>
							</div>
							<div className={styles.swatchWrap}>
								<h5>Darker <span>{imageLevels[1]}</span></h5>
								<div className={styles.swatch}>
									<div
										className={styles.color}
											style={{ backgroundColor: `hsla(${colorObj.hsl.h}, ${colorObj.hsl.s * 100}%, ${imageLevels[1]}%, 1)` }}
									/>
								</div>
							</div>
							<div className={styles.swatchWrap}>
								<h5>Primary <span>{imageLevels[2]}</span></h5>
								<div className={styles.swatch}>
									<div
										className={styles.color}
											style={{ backgroundColor: `hsla(${colorObj.hsl.h}, ${colorObj.hsl.s * 100}%, ${imageLevels[2]}%, 1)` }}
									/>
								</div>
							</div>
							<div className={styles.swatchWrap}>
								<h5>Lighter <span>{imageLevels[3]}</span></h5>
								<div className={styles.swatch}>
									<div
										className={styles.color}
											style={{ backgroundColor: `hsla(${colorObj.hsl.h}, ${colorObj.hsl.s * 100}%, ${imageLevels[3]}%, 1)` }}
									/>
								</div>
							</div>
							<div className={styles.swatchWrap}>
								<h5>Lightest <span>{imageLevels[4]}</span></h5>
								<div className={styles.swatch}>
									<div
										className={styles.color}
											style={{ backgroundColor: `hsla(${colorObj.hsl.h}, ${colorObj.hsl.s * 100}%, ${imageLevels[4]}%, 1)` }}
									/>
								</div>
							</div>
							</div>
						</div>
						<div className={styles.formItem}>
							<h5>Levels</h5>
							<Range
								value={this.state.imageLevels}
								min={0}
								max={100}
								pushable={2}
								onChange={(values) => { this.onChangeHues(values); }}
							/>
						</div>
						<div className={`${styles.colorEditWrap} ${this.state.showColorEdit ? styles.visible : ''}`}>
							<div className={styles.formItem}>
								<SliderPicker
									color={colorObj && colorObj.hsl}
									onChange={(color) => { this.setColor(color); }}
								/>
							</div>
							<div className={styles.row}>
								<div className={styles.column}>
									<SketchPicker
										color={colorObj && colorObj.hsl}
										onChange={(color) => { this.setColor(color); }}
									/>
								</div>
								<div className={styles.column}>
									<ChromePicker
										color={colorObj && colorObj.hsl}
										onChange={(color) => { this.setColor(color); }}
									/>
								</div>
								<div className={styles.column}>
									<BlockPicker
										color={colorObj && colorObj.hsl}
										onChange={(color) => { this.setColor(color); }}
									/>
								</div>
							</div>
							<button
								className={styles.button}
								onClick={() => this.doSaveColor()}
							>
								save color
							</button>
						</div>
					</section>
					<div className={styles.formitem}>
					<h3>Existing Colors</h3>
						{colorsArray && colorsArray.map((color) => {
							return (
								<div
									key={`img${color.id}`}
									className={styles.colorCard}
									role="presentation"
									// onClick={() => this.doRouteImageEdit('/image/admin', img.id)}
									// eslint-disable-line
								>
									<div className={styles.swatch} onClick={() => this.loadColor(color.id)} role="presentation">
										<div
											className={styles.color}
												style={{ backgroundColor: `hsla(${color.data.colorObj.hsl.h}, ${color.data.colorObj.hsl.s * 100}%, ${color.data.colorObj.hsl.l * 100}%, 1)` }}
										/>
									</div>
									<button
										onClick={() => this.loadColor(color.id)} // eslint-disable-line
										// style={{ background: 'red' }}
									>
										use this color
									</button>
									<button
										onClick={() => this.updateColor(color.id)} // eslint-disable-line
									>
										Overwrite
									</button>
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
	getColors() {
		const colorsRef = fbase.collection('colors');
		const colorsArray = [];
		colorsRef.get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				// console.log(doc.id, ' => ', doc.data());
				// imagesArray[doc.id] = doc.data();
				const tempThing = {};
				tempThing.id = doc.id;
				tempThing.data = doc.data();
				colorsArray.push(tempThing);
			});
			this.setState({
				colorsArray
			});
		});
	}

	loadColor(colorId) {
		const { colorsArray } = this.state;
		console.log('loading color data from: ', colorId);
		console.log('colorsArray is: ', colorsArray);
		const docRef = fbase.collection('colors').doc(colorId);
		docRef.get().then((doc) => {
			if (doc.exists) {
				console.log('color data:', doc.data());
				this.setState({
					colorObj: doc.data().colorObj,
					imageLevels: doc.data().imageLevels,
					theHue: doc.data().colorObj.hsl.h,
					theSaturation: doc.data().colorObj.hsl.s,
					theLightness: doc.data().colorObj.hsl.l,
				});
			} else {
				console.log('No such color!');
			}
		}).catch((error) => {
			console.log('Error getting color:', error);
		});
	}
	doRenderImages = () => {
		// NOTE: the 'mode' is passed through to display image and used for an id as theImage + 'mode'
		// eg theImage + thumbnail
		const theImageTh = document.getElementById('theImagethumbnail');
		const theImageSmall = document.getElementById('theImagesmall');
		const theImageMedium = document.getElementById('theImagemedium');
		const theImageLarge = document.getElementById('theImagelarge');
		const theImagePrint = document.getElementById('theImageprint');
		this.setState({
			isRendering: true,
			doingThumbnail: true,
			doingSmall: true,
			doingMedium: true,
			doingLarge: true,
			doingPrint: true,
			doneThumbnail: false,
			doneSmall: false,
			doneMedium: false,
			doneLarge: false,
			donePrint: false,
		});

		if (theImageTh) {
			const fStorage = firebase.storage();
			const newImgTh = document.getElementById('newImgThumbnail');
			domtoimage.toJpeg(theImageTh, { quality: 0.75 })
			.then((dataUrl) => {
				const img = new Image();
				img.src = dataUrl;
				const innerContent = newImgTh && newImgTh.innerHTML;
				const innerContentExists = innerContent.length;
				if (innerContentExists > 0) {
					newImgTh.replaceChild(img, newImgTh.children[0]);
				} else {
					newImgTh.appendChild(img);
				}
				this.setState({
					doneThumbnail: true,
					doingThumbnail: false,
					savingThumbnail: true,
					savedThumbnail: false,
				});
				const renderLocationThumbnail = `renders/${this.state.image}_thumbnail.jpg`;
				const storageRefThumbnail = fStorage.ref().child(renderLocationThumbnail);
				storageRefThumbnail.putString(dataUrl, 'data_url').then((snapshot) => {
					console.log('Uploaded a blob or file!');
					console.log(snapshot);
					this.setState({
						renderLocationThumbnail,
						renderUrlThumbnail: snapshot.downloadURL,
						savingThumbnail: false,
						savedThumbnail: true,
					});
				});
			})
			.catch((error) => {
				console.error('oops, something went wrong!', error);
			});
		}
		if (theImageSmall) {
			const fStorage = firebase.storage();
			const newImgSmall = document.getElementById('newImgSmall');
			domtoimage.toJpeg(theImageSmall, { quality: 1 })
			.then((dataUrl) => {
				const img = new Image();
				img.src = dataUrl;
				const innerContent = newImgSmall.innerHTML;
				const innerContentExists = innerContent.length;
				if (innerContentExists > 0) {
					newImgSmall.replaceChild(img, newImgSmall.children[0]);
				} else {
					newImgSmall.appendChild(img);
				}
				this.setState({
					doneSmall: true,
					doingSmall: false,
					savingSmall: true,
					savedSmall: false,
				});
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
			})
			.catch((error) => {
				console.error('oops, something went wrong!', error);
			});
		}
		if (theImageMedium) {
			const fStorage = firebase.storage();
			const newImgMedium = document.getElementById('newImgMedium');
			domtoimage.toJpeg(theImageMedium, { quality: 1 })
			.then((dataUrl) => {
				const img = new Image();
				img.src = dataUrl;
				const innerContent = newImgMedium.innerHTML;
				const innerContentExists = innerContent.length;
				if (innerContentExists > 0) {
					newImgMedium.replaceChild(img, newImgMedium.children[0]);
				} else {
					newImgMedium.appendChild(img);
				}
				this.setState({
					doneMedium: true,
					doingMedium: false,
					savingMedium: true,
					savedMedium: false,
				});
				const renderLocationMedium = `renders/${this.state.image}_medium.jpg`;
				const storageRefMedium = fStorage.ref().child(renderLocationMedium);
				storageRefMedium.putString(dataUrl, 'data_url').then((snapshot) => {
					console.log('Uploaded a blob or file!');
					console.log(snapshot);
					this.setState({
						renderLocationMedium,
						renderUrlMedium: snapshot.downloadURL,
						savingMedium: false,
						savedMedium: true,
					});
				});
			})
			.catch((error) => {
				console.error('oops, something went wrong!', error);
			});
		}
		if (theImageLarge) {
			const fStorage = firebase.storage();
			const newImgLarge = document.getElementById('newImgLarge');
			domtoimage.toJpeg(theImageLarge, { quality: 1 })
			.then((dataUrl) => {
				const img = new Image();
				img.src = dataUrl;
				const innerContent = newImgLarge.innerHTML;
				const innerContentExists = innerContent.length;
				if (innerContentExists > 0) {
					newImgLarge.replaceChild(img, newImgLarge.children[0]);
				} else {
					newImgLarge.appendChild(img);
				}
				this.setState({
					doneLarge: true,
					doingLarge: false,
					savingLarge: true,
					savedLarge: false,
				});
				const renderLocationLarge = `renders/${this.state.image}_large.jpg`;
				const storageRefLarge = fStorage.ref().child(renderLocationLarge);
				storageRefLarge.putString(dataUrl, 'data_url').then((snapshot) => {
					// console.log('Uploaded a blob or file!');
					console.log(snapshot);
					const renderUrlLarge = snapshot.downloadURL;
					this.setState({
						renderLocationLarge,
						renderUrlLarge,
						savingLarge: false,
						savedLarge: true,
					});
				});
			})
			.catch((error) => {
				console.error('oops, something went wrong!', error);
			});
		}
		if (theImagePrint) {
			const fStorage = firebase.storage();
			const newImgPrint = document.getElementById('newImgPrint');
			domtoimage.toJpeg(theImagePrint, { quality: 1 })
			.then((dataUrl) => {
				const img = new Image();
				img.src = dataUrl;
				const innerContent = newImgPrint.innerHTML;
				const innerContentExists = innerContent.length;
				if (innerContentExists > 0) {
					newImgPrint.replaceChild(img, newImgPrint.children[0]);
				} else {
					newImgPrint.appendChild(img);
				}
				this.setState({
					donePrint: true,
					doingPrint: false,
					savingPrint: true,
					savedPrint: false,
				});
				const renderLocationPrint = `renders/${this.state.image}_print.jpg`;
				const storageRefPrint = fStorage.ref().child(renderLocationPrint);
				console.log(storageRefPrint);
				// const file = dataUrl; // ... // use the Blob or File API
				storageRefPrint.putString(dataUrl, 'data_url').then((snapshot) => {
					console.log('Uploaded a blob or file!');
					console.log(snapshot);
					this.setState({
						renderLocationPrint,
						renderUrlPrint: snapshot.downloadURL,
						savingPrint: false,
						savedPrint: true,
					});
				});
			})
			.catch((error) => {
				console.error('oops, something went wrong!', error);
			});
		}
	}

	doRenderThumbnail = () => {
		const theImageTh = document.getElementById('theImagethumbnail');
		const { colorObj } = this.state;
		if (theImageTh) {
			const fStorage = firebase.storage();
			const newImgTh = document.getElementById('newImgThumbnail');
			domtoimage.toJpeg(theImageTh, { quality: 0.75 })
			.then((dataUrl) => {
				const img = new Image();
				img.src = dataUrl;
				const innerContent = newImgTh && newImgTh.innerHTML;
				const innerContentExists = innerContent.length;
				if (innerContentExists > 0) {
					newImgTh.replaceChild(img, newImgTh.children[0]);
				} else {
					newImgTh.appendChild(img);
				}
				this.setState({
					doneThumbnail: true,
					doingThumbnail: false,
					savingThumbnail: true,
					savedThumbnail: false,
				});
				const renderLocationThumbnail = `renders/${this.state.image}_${(colorObj && colorObj.hex) || ''}_thumbnail.jpg`;
				const storageRefThumbnail = fStorage.ref().child(renderLocationThumbnail);
				storageRefThumbnail.putString(dataUrl, 'data_url').then((snapshot) => {
					console.log('Uploaded a blob or file!');
					console.log(snapshot);
					this.setState({
						renderLocationThumbnail,
						renderUrlThumbnail: snapshot.downloadURL,
						savingThumbnail: false,
						savedThumbnail: true,
					});
					this.doSaveRender(snapshot, 'thumbnail', colorObj.hex);
				});
			})
			.catch((error) => {
				console.error('oops, something went wrong!', error);
			});
		}
	}

	doSaveRender = (snapshot, size, hex) => {
		console.log('doSaveRender was called', snapshot, hex);
		const currentDateTime = new Date();
		const {
			image,
			aspect,
			} = this.state;
		const renderObj = {};
		renderObj.aspect = aspect;
		renderObj.size = size;
		renderObj.imageId = image;
		renderObj.slug = image;
		renderObj.downloadURL = snapshot.downloadURL;
		renderObj.fullPath = snapshot.metadata && snapshot.metadata.fullPath;
		renderObj.modifiedDate = currentDateTime;
			if (image) {
				fbase.collection('renders').add({
					hex: hex || 'none',
					slug: image,
					modifiedDate: currentDateTime,
					[size]: renderObj
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
	doSaveRenders = async () => {
	}

	doSaveColor(colorId) {
		if (colorId) {
			console.log('Saving the color wid id: ', colorId);
		} else {
			console.log('Saving a new colour since there is no id');
		}
		const {
			colorObj,
			imageLevels,
			} = this.state;
		const currentDateTime = new Date();
		if (!colorId) {
			fbase.collection('colors').add({
				colorObj,
				imageLevels,
				modifiedDate: currentDateTime
			})
			.then((docRef) => {
				console.log('Color successfully written!, with reference of: ', docRef);
				this.setState({
					colorSaved: true,
					isError: false
				});
				setTimeout(() => {
					this.setState({
						imageSaved: false,
					});
				}, 2000);
			})
			.catch(((error) => {
				console.error('Error writing image: ', error);
				this.setState({
					imageSaved: false,
					isError: true
				});
			}));
		}
	}
	doSaveImage() {
		console.log('this will save the image');
		const currentDateTime = new Date();

		const {
			aspect,
			colorObj = this.props.location.state && this.props.location.state.colorObj,
			hasFrame,
			hasHighlight,
			hasBackground,
			image,
			imageLevels,
			theScale,
			theTranslateX,
			theTranslateY,
			} = this.state;
		const { file } = this.props;
		console.log('do save iamge: ', image, file);
		console.log('trying to save:',
				aspect,
				colorObj,
				hasFrame,
				hasHighlight,
				hasBackground,
				image,
				imageLevels,
				theScale,
				theTranslateX,
				theTranslateY
				);
			if (image) {
				fbase.collection('images').add({
				aspect,
				colorObj,
				hasFrame,
				hasHighlight,
				hasBackground,
				image,
				imageLevels,
				theScale,
				theTranslateX,
				theTranslateY,
				modifiedDate: currentDateTime
			})
			.then((imageRef) => {
				console.log('Image successfully written!, with reference of: ', imageRef);
				this.setState({
					imageSaved: true,
					isError: false
				});
				setTimeout(() => {
					this.setState({
						colorSaved: false,
					});
				}, 2000);
			})
			.catch(((error) => {
				console.error('Error writing color: ', error);
				this.setState({
					colorSaved: false,
					isError: true
				});
			}));
		}
	}
	loadImage = (name, aspect) => {
		this.setState({
			image: name,
			aspect,
			// previewImage: theImageToRender
		});
	}

	// TOGGLE OPTIONS
	setAspect = (aspect) => {
		this.setState({
			aspect
		});
	}
	toggleFrame = () => {
		this.setState({
			hasFrame: !this.state.hasFrame
		});
	}
	toggleBackground = () => {
		this.setState({
			hasBackground: !this.state.hasBackground
		});
	}
	toggleViewSources = () => {
		this.setState({
			showSources: !this.state.showSources
		});
	}
	toggleViewRendered = () => {
		this.setState({
			showRendered: !this.state.showRendered
		});
	}
	toggleViewAdjustments = () => {
		this.setState({
			showAdjustments: !this.state.showAdjustments
		});
	}
	toggleColorEdit = () => {
		this.setState({
			showColorEdit: !this.state.showColorEdit
		});
	}
	setColor(color) {
		console.log('setting the color', color);
		this.setState({
			colorObj: color,
			theHue: color.hsl.h,
			theSaturation: color.hsl.s,
			theLightness: color.hsl.l,
		});
	}
	setScale(value) {
		console.log('setting the scale value', value);
		this.setState({
			theScale: value
		});
	}
	onSliderChange = (value) => {
		this.setState({
			theScale: value,
		});
  }
  onTranslateXChange = (value) => {
		this.setState({
			theTranslateX: value,
		});
  }
  onTranslateYChange = (value) => {
		this.setState({
			theTranslateY: value,
		});
  }
	onChangeHues = (values) => {
		console.log('on change hues was called with', values);
		this.setState({
			imageLevels: values
		});
	}
}
/*
							<DisplayColor colorObj={colorObj} hsl={colorObj.hsl} hsv={colorObj.hsv} />
					<DisplayImage file="montenegro" aspect="portrait" />
					<DisplayImage file="auckland" aspect="landscape" />
					<DisplayImage file="sydney" aspect="portrait" />

											// $primaryColor: hsl($hue, 82%, 37%);
											// $lighter: hsl($hue, 82%, 61%);
											// $lightest: hsl($hue, 82%, 79%);
											// $darker: hsl($hue, 182%, 16%);
											// $darkest: hsl($hue, 82%, 10%);
											//	`hsla(${colorObj.hsl.h},
											// ${colorObj.hsl.s}, ${colorObj.hsl.l}, ${colorObj.hsl.a})` }}

/*
			doingThumbnail = false,
			doingSmall = false,
			doingMedium = false,
			doingLarge = false,
			doingPrint = false,
			doneThumbnail = false,
			doneSmall = false,
			doneMedium = false,
			doneLarge = false,
			donePrint = false,
*/
/*
			savingThumbnail = false,
			savingSmall = false,
			savingMedium = false,
			savingLarge = false,
			savingPrint = false,
			savedThumbnail = false,
			savedSmall = false,
			savedMedium = false,
			savedLarge = false,
			savedPrint = false,
*/
/*
			renderLocationThumbnail = null,
			renderLocationSmall = null,
			renderLocationMedium = null,
			renderLocationLarge = null,
			renderUrlLarge = null,
			renderLocationPrint = null,
			// theHue
			// image = 'montenegro',
			// aspect = 'portrait'

*/
