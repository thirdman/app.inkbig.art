import React, { Component } from 'react';
import * as firebase from 'firebase';
import domtoimage from 'dom-to-image';
import { Link } from 'react-router-dom';
import { BlockPicker, SliderPicker, SketchPicker } from 'react-color';
import Slider from 'rc-slider'; // , { Range }
import '../../assets/scss/rcSlider.css';

// import Dispimport variables from '../../assets/scss/variables.scss';
import Tick from '../../assets/icons/tick.svg';
import Loading from '../../assets/icons/loading.svg';
import { DisplayImage } from '../../components';
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
		aspect: 'portrait',
		hasFrame: false,
		isPreview: true,
		isPortrait: true,
		showSources: false,
		showRendered: true,
	};

	componentWillMount() {
  }

	componentDidMount() {
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
			hasMenu,
			isPortrait,
			image,
			colorObj = this.props.location.state && this.props.location.state.colorObj,
			isPreview,
			hasHighlight = false,
			hasFrame = false,
			theScale = 1,
			theTranslateX = 0,
			theTranslateY = 0,
			theHue = (this.props.location.state &&
				this.props.location.state.colorObj.hsl.h) || 187.82608695652172,
			theSaturation = (this.props.location.state &&
				this.props.location.state.colorObj.hsl.s) || 0.5,
			theLightness = (this.props.location.state &&
				this.props.location.state.colorObj.hsl.l) || 0.5,
			isRendering,
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
			renderLocationThumbnail = null,
			renderLocationSmall = null,
			renderLocationMedium = null,
			// renderLocationLarge = null,
			renderUrlLarge = null,
			renderLocationPrint = null,
			// theHue
			// image = 'montenegro',
			// aspect = 'portrait'
			} = this.state;

		// console.log('state is', this.state);
		// console.log('props is', this.props);
		console.log(file);
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
					<div className={styles.titleBlock}>
						<h4>Preview SVG</h4>
						{this.state.image &&
							<button onClick={() => this.doSave()} >Generate Images</button>
						}
					</div>
					<div className={styles.previewImageWrap}>
						<DisplayImage
							file={image}
							aspect={isPortrait ? 'portrait' : 'landscape'}
							mode={isPreview ? 'preview' : 'print'}
							hasHighlight={hasHighlight}
							hasFrame={hasFrame}
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
								aspect={isPortrait ? 'portrait' : 'landscape'}
								mode={'thumbnail'}
								hasHighlight={hasHighlight}
								hasFrame={hasFrame}
								hue={theHue}
								saturation={theSaturation}
								lightness={theLightness}
							/>
						</div>
						<div className={`${styles.sourceImage} ${styles.small}`}>
							<DisplayImage
								file={image}
								aspect={isPortrait ? 'portrait' : 'landscape'}
								mode={'small'}
								hasHighlight={hasHighlight}
								hasFrame={hasFrame}
								hue={theHue}
								saturation={theSaturation}
								lightness={theLightness}
							/>
						</div>
						<div className={`${styles.sourceImage} ${styles.medium}`}>
							<DisplayImage
								file={image}
								aspect={isPortrait ? 'portrait' : 'landscape'}
								mode={'medium'}
								hasHighlight={hasHighlight}
								hasFrame={hasFrame}
								hue={theHue}
								saturation={theSaturation}
								lightness={theLightness}
							/>
						</div>
						<div className={`${styles.sourceImage} ${styles.large}`}>
							<DisplayImage
								file={image}
								aspect={isPortrait ? 'portrait' : 'landscape'}
								mode={'large'}
								hasHighlight={hasHighlight}
								hasFrame={hasFrame}
								hue={theHue}
								saturation={theSaturation}
								lightness={theLightness}
							/>
						</div>
						<div className={`${styles.sourceImage} ${styles.print}`}>
							<DisplayImage
								file={image}
								aspect={isPortrait ? 'portrait' : 'landscape'}
								mode={'print'}
								hasHighlight={hasHighlight}
								hasFrame={hasFrame}
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
					<div style={{ border: '1px solid red' }}>
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
									{doingLarge &&
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
					<div className={`${styles.renderImageWrap} ${this.state.showRendered ? styles.visible : ''} ${isRendering ? styles.loading : ''}`}>
						<div className={`${styles.renderImage} ${styles.th} ${doneThumbnail ? styles.done : ''}`}>
							<h4>Thumb</h4>
							<div
								className={styles.theTick}
								dangerouslySetInnerHTML={{ __html: Tick }}
							/>
							{doingThumbnail &&
								<div className={styles.placeholder}>Rendering...</div>
							}
							<div id="newImgTh" />
							{renderLocationThumbnail && <p>{renderLocationThumbnail}</p>}
						</div>

						<div className={`${styles.renderImage} ${styles.small} ${doneSmall ? styles.done : ''}`}>
							<h4>small</h4>
							<div
								className={styles.theTick}
								dangerouslySetInnerHTML={{ __html: Tick }}
							/>
							{doingSmall &&
								<div className={styles.placeholder}>Rendering...</div>
							}
							<div id="newImgSmall" />
							{renderLocationSmall && <p>{renderLocationSmall}</p>}
						</div>
						<div className={`${styles.renderImage} ${styles.medium} ${doneMedium ? styles.done : ''}`}>
							<h4>Medium</h4>
							<div
								className={styles.theTick}
								dangerouslySetInnerHTML={{ __html: Tick }}
							/>
							{doingMedium &&
								<div className={styles.placeholder}>Rendering...</div>
							}
							<div id="newImgMedium" />
							{renderLocationMedium && <p>{renderLocationMedium}</p>}
						</div>
						<div className={`${styles.renderImage} ${styles.large} ${doneLarge ? styles.done : ''}`}>
							<h4>Large</h4>
							<div
								className={styles.theTick}
								dangerouslySetInnerHTML={{ __html: Tick }}
							/>
								{doingLarge &&
									<div className={styles.placeholder}>
										<div
											className={styles.theLoading}
											dangerouslySetInnerHTML={{ __html: Loading }}
										/>
										Rendering...
									</div>
								}
								<div id="newImgLarge" />
								{!this.state.savedLarge && this.state.savingLarge &&
									<div className={styles.saving}>
									<div
										className={styles.theLoading}
										dangerouslySetInnerHTML={{ __html: Loading }}
									/>
									saving....
									</div>
								}
								{renderUrlLarge &&
									<div>
										<Link
											target="blank"
											to={renderUrlLarge}
											className={styles.link}
										>
											Link
										</Link>
									</div>
								}
						</div>
						<div className={`${styles.renderImage} ${styles.print} ${donePrint ? styles.done : ''}`}>
							<h4>Print</h4>
							<div
								className={styles.theTick}
								dangerouslySetInnerHTML={{ __html: Tick }}
							/>
							{doingPrint &&
								<div className={styles.placeholder}>Rendering...</div>
							}
							<div id="newImgPrint" />
							{renderLocationPrint &&
								<div>
									<p>{renderLocationPrint}</p>
									<Link
										target="blank"
										to={`https://firebasestorage.googleapis.com/v0/b/inkbig-717ee.appspot.com/o/${renderLocationPrint}?alt=media&token=b19f8b35-7e91-40e1-9154-7fb2eb00ad69`}
										className={styles.link}
									>
										View File
									</Link>
								</div>
							}
						</div>
					</div>
					{doneThumbnail &&
						<h5>Done Thumnail</h5>
					}
					{doneSmall &&
						<h5>Done Small</h5>
					}
					{doneMedium &&
						<h5>Done medium</h5>
					}
					{doneLarge &&
						<h5>Done large</h5>
					}
					{donePrint &&
						<h5>Done Print</h5>
					}
				</div>
				<div className={`${styles.column} `}>
					<div className={`${styles.formItem} ${this.state.isPreview ? styles.isActive : ''}`}>
						<h5>IsPreview: <span>{this.state.isPreview ? 'yes' : 'no'}</span></h5>
						<button
							className={styles.button}
							onClick={() => this.toggleRenderMode()}
						>
							toggle Render Mode
						</button>
					</div>
					<div className={`${styles.formItem} ${this.state.hasFrame ? styles.isActive : ''}`}>
						<h5>Has Frame: <span>{this.state.hasFrame ? 'yes' : 'no'}</span></h5>
						<button
							className={styles.button}
							onClick={() => this.toggleFrame()}
						>
							toggle Frame
						</button>
					</div>
					<div className={`${styles.formItem} ${isPortrait ? styles.isActive : ''}`}>
						<h5>Aspect: {this.state.isPortrait ? 'Portrait' : 'Landscape'}</h5>
						<button
							className={styles.button}
							onClick={() => this.togglePortrait()}
						>
							toggle Portrait
						</button>
					</div>
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
					<div className={styles.formItem}>
						<BlockPicker onChange={(color) => { this.setColor(color); }} />
					</div>
					<div className={styles.formItem}>
						<SliderPicker
							color={colorObj && colorObj.hsl}
							onChange={(color) => { this.setColor(color); }}
						/>
					</div>
					<div className={styles.formItem}>
						<SketchPicker
							color={colorObj && colorObj.hsl}
							onChange={(color) => { this.setColor(color); }}
						/>
					</div>
				</div>
			</div>
		);
	}
	// FUCNTIONS
	doSave = () => {
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

	loadImage = (name, aspect) => {
		this.setState({
			image: name,
			aspect,
			// previewImage: theImageToRender
		});
	}

	toggleRenderMode = () => {
		this.setState({
			isPreview: !this.state.isPreview
		});
	}
	togglePortrait = () => {
		this.setState({
			isPortrait: !this.state.isPortrait
		});
	}
	toggleFrame = () => {
		this.setState({
			hasFrame: !this.state.hasFrame
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
}
/*
					<DisplayImage file="montenegro" aspect="portrait" />
					<DisplayImage file="auckland" aspect="landscape" />
					<DisplayImage file="sydney" aspect="portrait" />
*/
