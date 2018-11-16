import React, { Component } from 'react';
import * as firebase from 'firebase';
// import domtoimage from 'dom-to-image';
// import { Link } from 'react-router-dom';
import {
	ChromePicker,
	// BlockPicker,
	HuePicker,
	// SliderPicker,
	// SketchPicker
	} from 'react-color';
import Toggle from 'react-toggle';
import Slider, { Range } from 'rc-slider';
import 'react-toggle/style.css';
import '../../assets/scss/rcSlider.css';
// import '../../assets/scss/toggle.css';
import fbase from '../../firebase';

import Loading from '../../assets/icons/loading.svg';

// import Dispimport variables from '../../assets/scss/variables.scss';
// import Tick from '../../assets/icons/tick.svg';

import {
	DisplayImage,
	RenderImage,
	SwatchGroup,
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
		mode: (this.props.location.state && this.props.location.state.mode) || 'local',
		image: (this.props.location.state && this.props.location.state.image) || 'montenegro',
		profile: {},
		colorType: 'swatch',
		loggedIn: false,
		isLoading: false,
		isAdding: false,
		isEditing: false,
		isPortrait: true,
		activeControl: 'settings',
		editCustomColor: '',
		imageSaved: false,
		aspect: 'portrait',
		hasFrame: false,
		hasHighlight: false,
		hasBackground: false,
		showSources: false,
		showColorEdit: true,
		Adjustments: false,
		// imageLevels: [10, 16, 37, 61, 79],
		imageLevels: [15, 30, 50, 70, 85],
		colorsArray: [],
		pairColor1: '#444444',
		pairColor2: '#dddddd',
		svgBackgroundColor: '#ffffff',
		theScale: 1,
		theTranslateX: 0,
		theTranslateY: 0,
		doRenders: false,
		// showRenders: true,
		swatchName: null,
		tempSwatchName: '',
		swatchArray: [],
		pairColorArray: [],
		swatchColorArray: [],
		customSwatchArray: ['#444444', '#777777', '#aaaaaa', '#cccccc', '#eeeeee'],
	};

	componentWillMount() {
  }

	componentDidMount() {
		const mode = (this.props.location.state && this.props.location.state.mode || 'local'); // eslint-disable-line
		const colorObj = (this.props.location.state && this.props.location.state.colorObj);
		if (colorObj) {
			this.setState({ // eslint-disable-line
				colorObj
			});
		}
		if (mode === 'remote') {
			this.loadSvg();
		}
		this.getColors();
		this.getSwatches();
	}

	render() {
    // const {		} = this.props;
		const {
			mode,
			// sourceSvg,
			aspect,
			colorSaved = false,
			colorType,
			doSave = false,
			doRenders = false,
			hasMenu,
			// isPortrait,
			isLoading,
			image,
			imageSaved,
			editCustomColor,
			colorObj = this.props.location.state && this.props.location.state.colorObj,
			colorsArray,
			swatchArray,
			customSwatchArray,
			swatchName,
			tempSwatchName,
			hasHighlight = false,
			hasFrame = false,
			hasBackground,
			pairColor1,
			pairColor2,
			pairColorArray,
			swatchColorArray,
			svgBackgroundColor,
			theScale,
			theTranslateX,
			theTranslateY,
			theHue = (this.props.location.state &&
				this.props.location.state.colorObj.hsl.h) || 187.82608695652172,
			theSaturation = (this.props.location.state &&
				this.props.location.state.colorObj.hsl.s) || 0.5,
			theLightness = (this.props.location.state &&
				this.props.location.state.colorObj.hsl.l) || 0.5,
			imageLevels,
			} = this.state;

		if (!firebase.apps.length) {
			// firebase.initializeApp();
		} else {
			// console.log('FOREBASE:', firebase.apps);
			// const fStorage = firebase.storage();
			// console.log(fStorage);
		}
		return (
			<div className={`${styles.Edit} ${styles.wrap} ${hasMenu ? styles.hasMenu : ''}`}>
				<div className={`${styles.column} ${styles.preview}`}>
					<div className={styles.row} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
						<h2>Edit: {mode}</h2>
						{imageSaved && 'Image saved!'}
						{colorSaved && 'Color saved!'}
						<div>
							{this.state.image &&
								<button onClick={() => this.doSaveImage()} >Save Image</button>
							}
							{this.state.image &&
								<button onClick={() => this.doRenders()} >Render All</button>
							}
						</div>
					</div>
					{isLoading &&
						<div className={styles.loadingWrap}>
						{(isLoading) &&
							<div
								className={styles.theLoading}
								dangerouslySetInnerHTML={{ __html: Loading }} // eslint-disable-line
							/>
						}
							<span>Loading</span>
						</div>
					}
						

					{!isLoading &&
					<div className={styles.previewImageWrap}>
						<DisplayImage
							file={image}
							sourceSvg={mode === 'remote' && this.state.sourceSvgBlob && this.state.sourceSvgBlob}
							svgBackgroundColor={svgBackgroundColor}
							aspect={aspect}
							mode={'preview'}
							hasHighlight={hasHighlight}
							hasFrame={hasFrame}
							hasBackground={hasBackground}
							imageLevels={imageLevels}
							isCentered
							hasMargin
							hue={theHue}
							saturation={theSaturation}
							lightness={theLightness}
							scale={theScale}
							translateX={theTranslateX}
							translateY={theTranslateY}
							imageColorArray={swatchColorArray || pairColorArray}
						/>
					</div>
					}
							<div className={`${styles.formItem} ${styles.row}`}>
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

				</div>

				<div className={`${styles.column} ${styles.controls}`}>
					<div className={`${styles.buttonGroup} ${styles.tabs}`}>
						<div
							className={`${styles.btn} ${this.state.activeControl === 'settings' ? styles.selected : ''}`}
							onClick={() => this.setState({ activeControl: 'settings' })}
							role="presentation"
						>
							Settings
						</div>
						<div
							className={`${styles.btn} ${this.state.activeControl === 'adjustments' ? styles.selected : ''}`}
							onClick={() => this.setState({ activeControl: 'adjustments' })}
							role="presentation"
						>
							Adjustments
						</div>
						<div
							className={`${styles.btn} ${this.state.activeControl === 'color' ? styles.selected : ''}`}
							onClick={() => this.setState({ activeControl: 'color' })}
							role="presentation"
						>
							colour
						</div>
						<div
							className={`${styles.btn} ${this.state.activeControl === 'renders' ? styles.selected : ''}`}
							onClick={() => this.setState({ activeControl: 'renders' })}
							role="presentation"
						>
							renders
						</div>
					</div>
					{this.state.activeControl === 'settings' &&
						<section>
							<div className={styles.titleBlock}>
								<h3>Settings</h3>
							</div>
							<div className={`${styles.formItem} ${this.state.doSave ? styles.isActive : ''}`}>
								<h5>Render Mode</h5>
								<div className={styles.switchWrap}>
									<Toggle
										className={styles.theToggle}
										id="doRenderToggle"
										defaultChecked={this.state.doRenders}
										onChange={this.toggleDoRenders}
									/>
									<label htmlFor="doRenderToggle">Render on Change</label>
								</div>
							</div>
							<div className={`${styles.formItem} ${this.state.doSave ? styles.isActive : ''}`}>
								<h5>Save Mode</h5>
								<div className={styles.switchWrap}>
									<Toggle
										className={styles.theToggle}
										id="doSaveToggle"
										defaultChecked={this.state.doSave}
										onChange={this.toggleDoSave}
									/>
									<label htmlFor="doSaveToggle">Save on render</label>
								</div>
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
						</section>
					}
					{this.state.activeControl === 'adjustments' &&
						<section>
							<div className={styles.titleBlock}>
								<h3>Adjustments</h3>
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
							<div className={`${styles.notformItem}`}>
								<h5>SVG Background</h5>
								<div className={styles.buttonGroup}>
									<button onClick={() => this.setState({svgBackgroundColor: '#fff'})}>White</button>
									<button onClick={() => this.setState({svgBackgroundColor: '#000'})}>Black</button>
									{this.state.pairColor1 &&
										<button onClick={() => this.setState({svgBackgroundColor: this.state.pairColor1})}>
											Pair Color 1 ({this.state.pairColor1})
										</button>
									}
									{this.state.pairColor2 &&
										<button onClick={() => this.setState({svgBackgroundColor: this.state.pairColor2})}>
											Pair Color 2: {this.state.pairColor1}
										</button>
									}

								</div>
							</div>
						</section>
					}
					{this.state.activeControl === 'color' &&
						<section>
							<div className={styles.titleBlock}>
								<h3>Color</h3>
							</div>
							<section>
							{this.state.swatchName &&
								<div>
								<h5>Active Swatch Group</h5>
									<SwatchGroup
										key={`img${this.state.swatch && this.state.swatch.name || 'unnamed'}`}
										swatch={this.state.swatch}
										isHorizontal
										role="presentation"
										// onClickProps={() => this.loadSwatch(swatch.id)}
									/>
								</div>
							}
							{!this.state.swatchName &&
							<div className={styles.colorSave}>
								<h5>Unsaved Swatch</h5>
								<div className={`${styles.row}`}>								
									<input
									type="text"
										ref={(c) => { this.tempSwatchName = c; }}
										value={this.state.tempSwatchName || ''}
										onChange={(evt) => { this.setSwatchName(evt); }}
									/>
									<div style={{opacity: `${tempSwatchName ? 1 : 0.3}`}}>
									<button onClick={() => this.doSaveSwatch()}>Save as Swatch</button>
									</div>
								</div>
							</div>
							}
							</section>
							<hr />
							<div className={`${styles.formItem}`}>
								<h5>Color type</h5>
								<div className={styles.buttonGroup}>
									<div
										className={`${styles.btn} ${colorType === 'swatch' ? styles.selected : ''}`}
										onClick={() => this.setColorType('swatch')}
										role="presentation"
									>
										Swatch
									</div>
									<div
										className={`${styles.btn} ${colorType === 'hue' ? styles.selected : ''}`}
										onClick={() => this.setColorType('hue')}
										role="presentation"
									>
										Hue
									</div>
									<div
										className={`${styles.btn} ${colorType === 'pair' ? styles.selected : ''}`}
										onClick={() => this.setColorType('pair')}
										role="presentation"
									>
										Pair
									</div>
									<div
										className={`${styles.btn} ${colorType === 'custom' ? styles.selected : ''}`}
										onClick={() => this.setColorType('custom')}
										role="presentation"
									>
										Custom
									</div>
								</div>
							</div>
							<div className={`${styles.formItem}`} style={{ display: `${colorType === 'pair' ? 'block' : 'none'}` }}>
								<h5>Pair</h5>
								<p>Generates colours evenly between two points.</p>
								<div className={styles.row}>
									<div className={styles.columnSelect}>
										<h5>Color 1 (Darkest).</h5>
										<div className={styles.swatch}>
											<div
												className={styles.color}
													style={{ backgroundColor: pairColor1 }}
											/>
										</div>
											<ChromePicker
												color={pairColor1}
												onChange={(color) => { this.setColor1(color); }}
											/>
									</div>
									<div className={styles.columnSelect}>
										<h5>Color 2 (Lightest).</h5>
										<div className={styles.swatch}>
											<div
												className={styles.color}
													style={{ backgroundColor: pairColor2 }}
											/>
										</div>
											<ChromePicker
												color={pairColor2}
												onChange={(color) => { this.setColor2(color); }}
											/>
									</div>
								</div>
								<section>
									<h4>pair color array</h4>
										{pairColorArray &&
									<div className={styles.row}>
										<div className={styles.swatchWrap}>
											<h5>Darkest <span>{imageLevels[0]}</span></h5>
											<div className={styles.swatch}>
												<div
													className={styles.color}
														style={{ backgroundColor: `${pairColorArray[0]}` }}
												/>
											</div>
										</div>
										<div className={styles.swatchWrap}>
											<h5>Darker <span>{imageLevels[1]}</span></h5>
											<div className={styles.swatch}>
												<div
													className={styles.color}
														style={{ backgroundColor: `${pairColorArray[1]}` }}
												/>
											</div>
										</div>
										<div className={styles.swatchWrap}>
											<h5>Primary <span>{imageLevels[2]}</span></h5>
											<div className={styles.swatch}>
												<div
													className={styles.color}
														style={{ backgroundColor: `${pairColorArray[2]}` }}
												/>
											</div>
										</div>
										<div className={styles.swatchWrap}>
											<h5>Lighter <span>{imageLevels[3]}</span></h5>
											<div className={styles.swatch}>
												<div
													className={styles.color}
														style={{ backgroundColor: `${pairColorArray[3]}` }}
												/>
											</div>
										</div>
										<div className={styles.swatchWrap}>
											<h5>Lightest <span>{imageLevels[4]}</span></h5>
											<div className={styles.swatch}>
												<div
													className={styles.color}
														style={{ backgroundColor: `${pairColorArray[4]}` }}
												/>
											</div>
										</div>
									</div>
									}
								</section>
							</div>
								<section>
									<div className={`${styles.formItem}`} style={{ display: `${colorType === 'hue' ? 'block' : 'none'}` }}>
									<p>Generates colours from a single hue starting point.</p>
										<section className={styles.alt}>
											<div className={styles.formItem}>
												<div className={styles.row}>
													<div className={styles.swatchWrap}>
														<h5>Darkest <span>{imageLevels[0]}</span></h5>
														<div className={styles.swatch}>
															<div
																className={styles.color}
																	style={{ backgroundColor: `hsla(${colorObj.hsl.h}, ${colorObj.hsl.s * 100}%, ${imageLevels[0]}%, 1)` }} // eslint-disbable-line
															/>
														</div>
													</div>
													<div className={styles.swatchWrap}>
														<h5>Darker <span>{imageLevels[1]}</span></h5>
														<div className={styles.swatch}>
															<div
																className={styles.color}
																	style={{ backgroundColor: `hsla(${colorObj.hsl.h}, ${colorObj.hsl.s * 100}%, ${imageLevels[1]}%, 1)` }} // eslint-disbable-line
															/>
														</div>
													</div>
													<div className={styles.swatchWrap}>
														<h5>Primary <span>{imageLevels[2]}</span></h5>
														<div className={styles.swatch}>
															<div
																className={styles.color}
																	style={{ backgroundColor: `hsla(${colorObj.hsl.h}, ${colorObj.hsl.s * 100}%, ${imageLevels[2]}%, 1)` }} // eslint-disbable-line
															/>
														</div>
													</div>
													<div className={styles.swatchWrap}>
														<h5>Lighter <span>{imageLevels[3]}</span></h5>
														<div className={styles.swatch}>
															<div
																className={styles.color}
																	style={{ backgroundColor: `hsla(${colorObj.hsl.h}, ${colorObj.hsl.s * 100}%, ${imageLevels[3]}%, 1)` }} // eslint-disbable-line
															/>
														</div>
													</div>
													<div className={styles.swatchWrap}>
														<h5>Lightest <span>{imageLevels[4]}</span></h5>
														<div className={styles.swatch}>
															<div
																className={styles.color}
																	style={{ backgroundColor: `hsla(${colorObj.hsl.h}, ${colorObj.hsl.s * 100}%, ${imageLevels[4]}%, 1)` }} // eslint-disbable-line
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
											<div className={styles.row}>
												<div className={styles.column}>
													<h5>Hue: </h5>
													{theHue}
												</div>
												<div className={styles.column}>
													<h5>Saturation: </h5>
													{theSaturation}
												</div>
												<div className={styles.column}>
													<h5>Lightness: </h5>
													{theLightness}
												</div>
											</div>
										</section>
									<div className={`${styles.colorEditWrap} ${this.state.showColorEdit ? styles.visible : ''}`}>
										<h5>Hue</h5>
										<div className={styles.formItem}>
											<div className={styles.huePickerWrap}>
											<HuePicker
												color={colorObj && colorObj.hsl}
												onChange={(color) => { this.setColor(color); }}
											/>
											</div>
											{/*
											<SliderPicker
												color={colorObj && colorObj.hsl}
												onChange={(color) => { this.setColor(color); }}
											/>
											*/}
										</div>
										{/*
										<div className={styles.row}>
											<div className={styles.column}>
												<ChromePicker
													color={colorObj && colorObj.hsl}
													onChange={(color) => { this.setColor(color); }}
												/>
											</div>
										</div>
										*/}
										<button
											className={styles.button}
											onClick={() => this.doSaveColor()}
										>
											save color
										</button>
									</div>
								</div>
							</section>
							<div className={`${styles.formItem}`} style={{ display: `${colorType === 'swatch' ? 'block' : 'none'}` }}>
								<h3>Saved Swatches</h3>
								{swatchArray && swatchArray.map((swatch) => {
									return (
										<SwatchGroup
											key={`img${swatch.id}`}
											swatch={swatch.data}
											isHorizontal
											role="presentation"
											onClickProps={() => this.loadSwatch(swatch.id)}
										/>
									);
								})
								}
							</div>
							{colorType === 'hue' &&
								<div className={styles.formitem}>
									<h3>Saved Colors</h3>
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
															style={{
																backgroundColor: `hsla(${
																color.data.colorObj.hsl.h},
																 ${color.data.colorObj.hsl.s * 100}%,
																 ${color.data.colorObj.hsl.l * 100}%, 1)`
																}}
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
							}
							{colorType === "custom" && 
								<section className={styles.alt}>
								<div className={styles.formItem}>
									<div className={styles.row}>
										<div className={styles.swatchWrap}>
											<h5>1. Darkest</h5>
											<div className={styles.swatch} onClick={() => this.setState({editCustomColor: 0})}>
												<div
													className={styles.color}
														style={{ backgroundColor: `${customSwatchArray && customSwatchArray[0] || '#444'}` }}
												/>
											</div>
										</div>
										<div className={styles.swatchWrap}>
											<h5>2. Darker</h5>
											<div className={styles.swatch} onClick={() => this.setState({editCustomColor: 1})}>
												<div
													className={styles.color}
														style={{ backgroundColor: `${customSwatchArray && customSwatchArray[1] || '#777'}` }}
												/>
											</div>
										</div>
										<div className={styles.swatchWrap}>
											<h5>3. Primary</h5>
											<div className={styles.swatch} onClick={() => this.setState({editCustomColor: 2})}>
												<div
													className={styles.color}
														style={{ backgroundColor: `${customSwatchArray && customSwatchArray[2] || '#aaa'}` }}
												/>
											</div>
										</div>
										<div className={styles.swatchWrap}>
											<h5>4: Lighter</h5>
											<div className={styles.swatch} onClick={() => this.setState({editCustomColor: 3})}>
												<div
													className={styles.color}
														style={{ backgroundColor: `${customSwatchArray && customSwatchArray[3] || '#ccc'}` }}
												/>
											</div>
										</div>
										<div className={styles.swatchWrap}>
											<h5>5. Lightest</h5>
											<div className={styles.swatch} onClick={() => this.setState({editCustomColor: 4})}>
												<div
													className={styles.color}
														style={{ backgroundColor: `${customSwatchArray && customSwatchArray[4] || '#eee'}` }}
												/>
											</div>
										</div>
									</div>
									<div className={styles.row}>
										{editCustomColor > -1 &&
											<div className={styles.columnSelect}>
												<div className={styles.swatch}>
													<div
														className={styles.color}
															style={{ backgroundColor: customSwatchArray && customSwatchArray[editCustomColor] || '#fff'}}
													/>
												</div>
													<ChromePicker
														color={customSwatchArray && customSwatchArray[editCustomColor] || '#fff'}
														// onChange={(color) => this.setCustomColor(0, color)}
														onChange={(color) => { this.setCustomColor(editCustomColor, color); }}
													/>
											</div>
										}
									</div>
								</div>
								</section>
							}
						</section>
					}
					{this.state.activeControl === 'renders' &&
						<section>
						<div className={styles.titleBlock}>
							<h4>Rendered Images</h4>
						</div>
						{imageSizes && imageSizes.map((size) => {
							return (<div key={`size${size}`} className={styles.renderGroup}>
							<h4>{size}:</h4>
							<RenderImage
								key={`render${size}portrait`}
								doSave={doSave}
								doRender={doRenders}
								displayMode={'mini'}
								file={image}
								sourceSvg={mode === 'remote' && this.state.sourceSvgBlob && this.state.sourceSvgBlob}
								svgBackgroundColor={svgBackgroundColor}
								aspect={'portrait'}
								mode={size.toLowerCase()}
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
								imageColorArray={swatchColorArray || pairColorArray}
								swatchName={swatchName}
							/>
							<RenderImage
								key={`render${size}circle`}
								doSave={doSave}
								doRender={doRenders}
								displayMode={'mini'}
								file={image}
								sourceSvg={mode === 'remote' && this.state.sourceSvgBlob && this.state.sourceSvgBlob}
								svgBackgroundColor={svgBackgroundColor}
								aspect={'circle'}
								mode={size.toLowerCase()}
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
								imageColorArray={swatchColorArray || pairColorArray}
								swatchName={swatchName}
							/>
							<RenderImage
								key={`render${size}landscape`}
								doSave={doSave}
								doRender={doRenders}
								displayMode={'mini'}
								file={image}
								sourceSvg={mode === 'remote' && this.state.sourceSvgBlob && this.state.sourceSvgBlob}
								svgBackgroundColor={svgBackgroundColor}
								aspect={'landscape'}
								mode={size.toLowerCase()}
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
								imageColorArray={swatchColorArray || pairColorArray}
								swatchName={swatchName}
							/>
							</div>);
						})}
							<div>
							<h4>MISC:</h4>
							<RenderImage
								key={'renderMediumPortraitBackground'}
								doSave={doSave}
								doRender={doRenders}
								displayMode={'mini'}
								file={image}
								sourceSvg={mode === 'remote' && this.state.sourceSvgBlob && this.state.sourceSvgBlob}
								svgBackgroundColor={svgBackgroundColor}
								aspect={'portrait'}
								mode={'medium'}
								hasHighlight={hasHighlight}
								hasFrame={hasFrame}
								hasBackground
								imageLevels={imageLevels}
								hue={theHue}
								saturation={theSaturation}
								lightness={theLightness}
								scale={theScale}
								translateX={theTranslateX}
								translateY={theTranslateY}
								imageColorArray={swatchColorArray || pairColorArray}
								swatchName={swatchName}
							/>
							<RenderImage
								key={'renderMediumCircleBackground'}
								doSave={doSave}
								doRender={doRenders}
								displayMode={'mini'}
								file={image}
								sourceSvg={mode === 'remote' && this.state.sourceSvgBlob && this.state.sourceSvgBlob}
								svgBackgroundColor={svgBackgroundColor}
								aspect={'circle'}
								mode={'medium'}
								hasHighlight={hasHighlight}
								hasFrame={hasFrame}
								hasBackground
								imageLevels={imageLevels}
								hue={theHue}
								saturation={theSaturation}
								lightness={theLightness}
								scale={theScale}
								translateX={theTranslateX}
								translateY={theTranslateY}
								imageColorArray={swatchColorArray || pairColorArray}
								swatchName={swatchName}
							/>
							<RenderImage
								key={'renderMediumPortraitBackgroundFrame'}
								doSave={doSave}
								doRender={doRenders}
								displayMode={'mini'}
								file={image}
								sourceSvg={mode === 'remote' && this.state.sourceSvgBlob && this.state.sourceSvgBlob}
								svgBackgroundColor={svgBackgroundColor}
								aspect={'portrait'}
								mode={'medium'}
								hasHighlight={hasHighlight}
								hasFrame
								hasBackground
								imageLevels={imageLevels}
								hue={theHue}
								saturation={theSaturation}
								lightness={theLightness}
								scale={theScale}
								translateX={theTranslateX}
								translateY={theTranslateY}
								imageColorArray={swatchColorArray || pairColorArray}
								swatchName={swatchName}
							/>
							<RenderImage
								key={'renderMediumCircleBackgroundFrame'}
								doSave={doSave}
								doRender={doRenders}
								displayMode={'mini'}
								file={image}
								sourceSvg={mode === 'remote' && this.state.sourceSvgBlob && this.state.sourceSvgBlob}
								svgBackgroundColor={svgBackgroundColor}
								aspect={'circle'}
								mode={'medium'}
								hasHighlight={hasHighlight}
								hasFrame
								hasBackground
								imageLevels={imageLevels}
								hue={theHue}
								saturation={theSaturation}
								lightness={theLightness}
								scale={theScale}
								translateX={theTranslateX}
								translateY={theTranslateY}
								imageColorArray={swatchColorArray || pairColorArray}
								swatchName={swatchName}
							/>
							</div>
						
						</section>
					}
				</div>
			</div>
		);
	}
	//////////////////////////////
	// FUCNTIONS
	//////////////////////////////
	loadSvg = () => {
		console.log('this will load svg');
		this.setState({isLoading: true});
			const {
				imageId = this.props.location.state && this.props.location.state.image || 'milfordSound', // eslint-disable-line
				filename = this.props.location.state && this.props.location.state.filename, // eslint-disable-line
			} = this.props;
			console.log('imageId: ', imageId);
			console.log('filename: ', filename);

			const fStorage = firebase.storage();
			const storageLocation = 'svg';
			const storageRef = fStorage.ref().child(storageLocation);
			// const fileRef = storageRef.child(filename);

			storageRef.child(filename).getDownloadURL().then((url) => {
				// `url` is the download URL for 'images/stars.jpg'
				// console.log('found image: ', url);
				// This can be downloaded directly:

				const xhr = new XMLHttpRequest();
				// xhr.responseType = 'blob';
				xhr.responseType = '';
				xhr.onload = (event) => {
					const blob = xhr.response;
					console.log('XHR event', event);
					// console.log('XHR complete', blob);
					// console.log('this!', this);
					this.setState({
						sourceSvgBlob: blob,
						sourceSvg: url,
					});
				};
				xhr.open('GET', url);
				xhr.send();

				console.log('xhr: ', xhr);

				// Or inserted into an <img> element:
				// var img = document.getElementById('myimg');
				// img.src = url;
				this.setState({
					isLoading: false,
				});
			}).catch((error) => {
				// Handle any errors
				console.log('error: ', error);
			});
			
/*
			const imageRef = fbase.collection('svg').doc(imageId);
			imageRef.get().then((doc) => {
				if (doc.exists) {
					console.log('Document data:', doc.data());
					this.setState({
						sourceSvg: doc.data()
					});
					// this.getAvailableFiles(doc.data().image); // image = imageid!
					// this.getImageRenders(imageId);
				} else {
					console.log('No such document!');
				}
			}).catch((error) => {
				console.log('Error getting document:', error);
			});
*/
	}
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
		this.setState({
			isLoading: true,
			isApplying: true,
		});
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
				this.setState({
					isLoading: false,
					isApplying: false,
				});
			} else {
				console.log('No such color!');
			}
		}).catch((error) => {
			console.log('Error getting color:', error);
		});
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
	doRenders = () => {
		console.log('this will trigger renders');
	}
	loadImage = (name, aspect) => {
		this.setState({
			image: name,
			aspect,
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
	toggleViewAdjustments = () => {
		this.setState({
			showAdjustments: !this.state.showAdjustments
		});
	}
/*
	toggleColorEdit = () => {
		this.setState({
			showColorEdit: !this.state.showColorEdit
		});
	}
*/
	toggleDoSave = () => {
		this.setState({
			doSave: !this.state.doSave
		});
	}
	toggleDoRenders = () => {
		this.setState({
			doRenders: !this.state.doRenders
		});
	}
	doRenders = () => {
		this.setState({
			doRenders: true
		});
	}
/*
	toggleShowRenders = () => {
		this.setState({
			showRenders: !this.state.showRenders
		});
	}
*/


	//////////////////////////////
	// COLORS
	//////////////////////////////


	setColorType = (type) => {
		this.setState({
			colorType: type
		});
	}

	onChangeHues = (values) => {
		console.log('on change hues was called with', values);
		this.setState({
			imageLevels: values
		}, (() => {
			this.setColor(this.state.colorObj);
		}));
	}
	setColor(color) {
		const {imageLevels} = this.state;
		console.log('HUE: setting the color', color.hsl);
		console.log('colour stops are: ', imageLevels);
		console.log('therefore the color points are: ');
		const colorStop1 = `hsl(${color.hsl.h}, ${color.hsl.s * 100}%, ${imageLevels[0]}%)`;
		const colorStop2 = `hsl(${color.hsl.h}, ${color.hsl.s * 100}%, ${imageLevels[1]}%)`;
		const colorStop3 = `hsl(${color.hsl.h}, ${color.hsl.s * 100}%, ${imageLevels[2]}%)`;
		const colorStop4 = `hsl(${color.hsl.h}, ${color.hsl.s * 100}%, ${imageLevels[3]}%)`;
		const colorStop5 = `hsl(${color.hsl.h}, ${color.hsl.s * 100}%, ${imageLevels[4]}%)`;
		const tempColorArray = [colorStop1, colorStop2, colorStop3, colorStop4, colorStop5];
		console.log('tempColorArray:', tempColorArray);
		const tempSwatch = {
			name: 'unsaved swatch',
			type: 'hue',
			swatchColorArray: tempColorArray,
		}
		this.setState({
			colorObj: color,
			theHue: color.hsl.h,
			theSaturation: color.hsl.s,
			theLightness: color.hsl.l,
			tempSwatchName: 'unsaved swatch',
			swatchName: '',
			swatch: tempSwatch,
			swatchColorArray: tempColorArray,
		});
	}
	setColor1(color) {
		console.log('PAIR: setting the color1', color);
		const { pairColor2 } = this.state;
		const colorStop3 = this.hexAverage(color.hex, pairColor2);// calculate the middle
		const colorStop2 = this.hexAverage(color.hex, colorStop3); // between middle and initial
		const colorStop4 = this.hexAverage(colorStop3, pairColor2); // between middle and final
		const tempArray = [color.hex, colorStop2, colorStop3, colorStop4, pairColor2];
		console.log(tempArray);
		this.setState({
			pairColor1: color.hex,
			pairColorArray: tempArray,
			swatchColorArray: tempArray, 
			swatchName: '',
			tempSwatchName: 'unnamed swatch',
		});
	}
	setColor2(color) {
		console.log('PAIR: setting the color2', color);
		const { pairColor1 } = this.state;
		console.log('the hex middle averege is thereforre: ', this.hexAverage(pairColor1, color.hex));
		const colorStop3 = this.hexAverage(pairColor1, color.hex);	// calc the middle
		const colorStop2 = this.hexAverage(pairColor1, colorStop3); // between middle and initial
		const colorStop4 = this.hexAverage(colorStop3, color.hex); // between middle and final
		const tempArray = [pairColor1, colorStop2, colorStop3, colorStop4, color.hex];
		this.setState({
			pairColor2: color.hex,
			pairColorArray: tempArray,
			swatchColorArray: tempArray, 
			swatchName: '',
			tempSwatchName: 'unnamed swatch',
		});
	}
	setCustomColor = (index, color) => {
		console.log(index, color)
		if (index < 0 || !color) {
			console.log('Bailing out, no index or color');
			return false;
		}
		const {
			customSwatchArray = ['#444444', '#777777', '#aaaaaa', '#cccccc', '#eeeeee'],
		} = this.state;
		console.log('setting custom color ', index, color);
		console.log('customSwatchArray ', customSwatchArray);

		const tempArray = customSwatchArray.slice();
		tempArray[index] = color.hex;
		console.log('temparray: ', tempArray);
		const tempSwatch = {
			name: 'unsaved swatch',
			type: 'custom',
			swatchColorArray: tempArray,
		}
		this.setState({
			customSwatchArray: tempArray,
			swatchColorArray: tempArray, 
			swatchName: '',
			tempSwatchName: 'unnamed swatch',
		})
	}
	// SWATCH
	getSwatches() {
		const colorsRef = fbase.collection('swatches');
		const swatchArray = [];
		colorsRef.get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				// console.log(doc.id, ' => ', doc.data());
				// imagesArray[doc.id] = doc.data();
				const tempThing = {};
				tempThing.id = doc.id;
				tempThing.data = doc.data();
				swatchArray.push(tempThing);
			});
			this.setState({
				swatchArray
			});
		});
	}

	loadSwatch(swatchId) {
		const { swatchArray } = this.state;
		console.log('loading swatch data from: ', swatchId);
		console.log('swatchArray is: ', swatchArray);
		this.setState({
			isLoading: true,
			isApplying: true,
		});
		const docRef = fbase.collection('swatches').doc(swatchId);
		docRef.get().then((doc) => {
			if (doc.exists) {
				// console.log('swatch data:', doc.data());
				this.setState({
					swatch: doc.data(),
					colorType: doc.data().type,
					pairColor1: doc.data().pairColor1,
					pairColor2: doc.data().pairColor2,
					pairColorArray: doc.data().pairColorArray,
					swatchColorArray: doc.data().swatchColorArray,
					customSwatchArray: doc.data().swatchColorArray, 
					swatchName: doc.data().name,
					isLoading: false,
					isApplying: false,
				});
			} else {
				console.log('No such swatch!');
			}
		}).catch((error) => {
			console.log('Error getting swatch:', error);
		});
	}

	doSaveSwatch() {
		console.log('saving the swatch', this.state);
		const currentDateTime = new Date();
		const {
			tempSwatchName = 'unnamed swatch',
			colorType,
			pairColorArray,
			swatchColorArray,
			customSwatchArray,
			pairColor1,
			pairColor2,
			// theHue,
			// imageLevels,
		} = this.state;
		// TODO:
		// convert hue swatches into custom ones.
		// and save as array
		if (tempSwatchName) {
			fbase.collection('swatches').add({
				name: tempSwatchName,
				type: colorType,
				pairColorArray,
				swatchColorArray,
				customSwatchArray,
				pairColor1,
				pairColor2,
				// theHue,
				// imageLevels,
				modifiedDate: currentDateTime
		})
		.then((ref) => {
			console.log('swatch Added: ', ref);
			this.setState({
				swatchSaved: true,
				isError: false
			});
			setTimeout(() => {
				this.setState({
					swatchSaved: false,
				});
			}, 2000);
		})
		.catch(((error) => {
			console.error('Error writing swatch: ', error);
			this.setState({
				swatchSaved: false,
				isError: true
			});
		}));
		}
	}
	setSwatchName(evt) {
		console.log('setting the swatchname', evt);
		this.setState({
			tempSwatchName: evt.target.value
		});
	}

	// ADJUSTMENTS ////////////////////////////////////////////////////////////
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
	padToTwo(numberString) {
		console.log(this.state);
		let newNumberString = numberString;
		if (numberString.length < 2) {
			newNumberString = `0${numberString}`; // eslint-disable-line;
			}
		return newNumberString;
	}

	hexAverage(...args) {
		// const args = Array.prototype.slice.call(arguments); // eslint-disable-line;
		return args.reduce((previousValue, currentValue) => {
			return currentValue
			.replace(/^#/, '')
			.match(/.{2}/g)
			.map((value, index) => {
				console.log('value', value);
				return previousValue[index] + parseInt(value, 16);
			});
		}, [0, 0, 0])
		.reduce((previousValue, currentValue) => {
			return previousValue + this.padToTwo(Math.floor(currentValue / args.length).toString(16));
		}, '#');
	}
}
/*
							{this.state.image &&
							<button onClick={() => this.doRenders()} >Renders</button>
						}

							{this.state.image &&
							<button onClick={() => this.doRenderImages()} >Generate Images</button>
						}

			// console.log(previousValue, currentValue);
			tempArray.push(previousValue);
			tempArray.push(previousValue
			+ this.padToTwo(Math.floor(currentValue / 5).toString(16)));
			tempArray.push(previousValue
			+ this.padToTwo(Math.floor((currentValue / 5) * 2).toString(16))); // eslint-disable-line;
			tempArray.push(previousValue
			+ this.padToTwo(Math.floor((currentValue / 5) * 3).toString(16))); // eslint-disable-line;
			tempArray.push(currentValue);
			// console.log('therefore the array is: ', tempArray);
			// console.log('2nd color stop =/5',
			previousValue + this.padToTwo(Math.floor(currentValue / 5).toString(16)));
			// console.log('3rd color stop =/5*2',
			previousValue + this.padToTwo(Math.floor((currentValue / 5) * 2).toString(16)));
			// console.log('4th color stop =/5*2',
			previousValue + this.padToTwo(Math.floor((currentValue / 5) * 3).toString(16)));


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
/*
					<div className={styles.titleBlock}>
						<h4>Preview SVG</h4>
					</div>
*/
	/*
									<div className={styles.column}>
											<SketchPicker
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
*/
