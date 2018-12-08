import React, { Component } from "react";
import * as firebase from "firebase";

// import domtoimage from 'dom-to-image';
// import { Link } from 'react-router-dom';
import {
	ChromePicker,
	// BlockPicker,
	HuePicker
	// SliderPicker,
	// SketchPicker
} from "react-color";
import Toggle from "react-toggle";
import Slider, { Range } from "rc-slider";
import "react-toggle/style.css";
// import '../../../node_modules/react-toggle/style.css';
import "../../assets/scss/rcSlider.css";
// import '../../assets/scss/toggle.css';
import fbase from "../../firebase";

// import Loading from "../../assets/icons/loading.svg";
import Loading from "../Loading/Loading";

import { DisplayImage, RenderImage, SwatchGroup, NamedColor } from "..";
// import Message from "../Message/Message.jsx";

import styles from "./Edit.scss";

const imageSizes = ["Thumbnail", "Small", "Medium", "Large", "Print"];

export default class Edit extends Component {
	/*
	static propTypes = {
		file
  };
*/
	state = {
		svgId: this.props.location.state && this.props.location.state.id,
		mode:
			(this.props.location.state && this.props.location.state.mode) || "local",
		image: this.props.location.state && this.props.location.state.image,
		profile: {},
		colorType: "swatch",
		adjustmentSets: [],
		activeAdjustmentSet: null,
		isLoading: true,
		isAdding: false,
		isEditing: false,
		isSaving: false,
		isPortrait: true,
		activeControl: "settings",
		editCustomColor: "",
		imageSaved: false,
		aspect: "portrait",
		hasFrame: false,
		hasPaper: false,
		hasHighlight: false,
		hasBackground: false,
		hasTitles: false,
		loggedIn: false,
		showSources: false,
		showColorEdit: true,
		showColorSave: false,
		showAdjustmentSave: false,
		showTitleSave: false,
		Adjustments: false,
		// imageLevels: [10, 16, 37, 61, 79],
		imageLevels: [15, 35, 50, 65, 85],
		colorsArray: [],
		pairColor1: "#444444",
		pairColor2: "#dddddd",
		svgBackgroundColor: "#ffffff",
		theScale: 1,
		theTranslateX: 0,
		theTranslateY: 0,
		theSaturation:
			(this.props.location && this.props.location.state.colorObj.hsl.s) || 0.5,
		theLightness:
			(this.props.location && this.props.location.state.colorObj.hsl.l) || 0.5,
		theHue:
			(this.props.location && this.props.location.state.colorObj.hsl.h) || 100,
		doRenders: false,
		// showRenders: true,
		swatchName: null,
		tempSwatchName: "",
		tempAdjustmentSetName: "",
		swatchArray: [],
		pairColorArray: [],
		swatchColorArray: [],
		customSwatchArray: ["#444444", "#777777", "#aaaaaa", "#cccccc", "#eeeeee"],
		selectedColorName: "",
		theTitle: "",
		theSubtitle1: "",
		theSubtitle2: "",
		renderPortraits: false,
		renderCircles: false,
		renderTitles: false,
		renderPromos: false,
		toDelete: null
	};

	componentWillMount() {}

	componentDidMount() {
		const { image } = this.state;
		const mode =
      (this.props.location.state && this.props.location.state.mode) || "local"; // eslint-disable-line
		const colorObj =
			this.props.location.state && this.props.location.state.colorObj;
		if (colorObj) {
			this.setState({
        // eslint-disable-line
				colorObj
			});
		}
		if (mode === "remote") {
			this.loadSvg();
			this.getColors();
			this.getSwatches();
			// get the info
			this.loadSvgData();
		} else {
			this.getColors();
			this.getSwatches();
			this.setState({
				isLoading: false
			});
		}
	}

	render() {
		// const {		} = this.props;
		const {
			mode,
			// sourceSvg,
			aspect,
			adjustmentSets,
			activeAdjustmentSet,
			colorSaved = false,
			colorType,
			doSave = false,
			doRenders = false,
			hasMenu,
			// isPortrait,
			isLoading,
			isSaving,
			image,
			imageSaved,
			editCustomColor,
			colorObj = this.props.location.state &&
				this.props.location.state.colorObj,
			colorsArray,
			swatchArray,
			customSwatchArray,
			swatchName,
			tempSwatchName,
			tempAdjustmentSetName,
			hasHighlight = false,
			hasFrame = false,
			hasPaper,
			hasBackground,
			hasTitles,
			pairColor1,
			pairColor2,
			pairColorArray,
			swatchColorArray,
			svgBackgroundColor,
			theScale,
			theTranslateX,
			theTranslateY,
			theHue = (this.props.location.state &&
				this.props.location.state.colorObj.hsl.h) ||
				187.82608695652172,
			theSaturation = (this.props.location.state &&
				this.props.location.state.colorObj.hsl.s) ||
				0.5,
			theLightness = (this.props.location.state &&
				this.props.location.state.colorObj.hsl.l) ||
				0.5,
			imageLevels,
			selectedColorName,
			showColorSave,
			showAdjustmentSave,
			showTitleSave,
			theTitle,
			theSubtitle1,
			theSubtitle2,
			toDelete,
			renderPortraits,
			renderCircles,
			renderTitles,
			renderPromos
		} = this.state;

		return (
			<div
				className={`${styles.Edit} ${styles.wrap} ${
					hasMenu ? styles.hasMenu : ""
				}`}
			>
				<div className={`${styles.column} ${styles.preview}`}>
					<div
						className={styles.row}
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between"
						}}
					>
						<button onClick={() => this.props.history.goBack()}>Back</button>
						<h2>Source Edit: ({mode})</h2>
						{imageSaved && "Image saved!"}
						{colorSaved && "Color saved!"}
						<div>
							{this.state.image && (
								<button onClick={() => this.doSaveImage()}>Save Image</button>
							)}
							{this.state.image && (
								<button onClick={() => this.doRenders()}>Render All</button>
							)}
							{this.state.sourceSvgBlob && (
								<button onClick={() => this.cleanUpSvg()}>Clean SVG</button>
							)}
						</div>
					</div>
					{isLoading && (
						<div className={styles.loadingWrap}>
							<Loading message="loading" />
						</div>
					)}
					{isSaving && (
						<div>
							<Loading message="saving svg..." />
						</div>
					)}
					{!isLoading &&
						((mode === "remote" && this.state.sourceSvgBlob) ||
							mode === "local") && (
							<div className={styles.previewImageWrap}>
								<DisplayImage
									file={mode === "local" && image}
									sourceSvg={
										mode === "remote" &&
										this.state.sourceSvgBlob &&
										this.state.sourceSvgBlob
									}
									svgBackgroundColor={svgBackgroundColor}
									aspect={aspect}
									mode="preview"
									hasHighlight={hasHighlight}
									hasFrame={hasFrame}
									hasBackground={hasBackground}
									hasPaper={hasPaper}
									imageLevels={imageLevels}
									isCentered
									hasMargin
									hasTitles={hasTitles}
									hue={theHue}
									saturation={theSaturation}
									lightness={theLightness}
									scale={theScale}
									translateX={theTranslateX}
									translateY={theTranslateY}
									theTitle={theTitle}
									theSubtitle1={theSubtitle1}
									theSubtitle2={theSubtitle2}
									imageColorArray={swatchColorArray || pairColorArray}
								/>
							</div>
						)}
					<div className={`${styles.formItem} ${styles.row}`}>
						<div className={styles.buttonGroup}>
							<div
								className={`${styles.btn} ${styles.portrait} ${
									aspect === "portrait" ? styles.selected : ""
								}`}
								onClick={() => this.setAspect("portrait")}
								role="presentation"
							>
								portrait
							</div>
							<div
								className={`${styles.btn} ${styles.landscape} ${
									aspect === "landscape" ? styles.selected : ""
								}`}
								onClick={() => this.setAspect("landscape")}
								role="presentation"
							>
								Landscape
							</div>
							<div
								className={`${styles.btn} ${styles.square} ${
									aspect === "square" ? styles.selected : ""
								}`}
								onClick={() => this.setAspect("square")}
								role="presentation"
							>
								Square
							</div>
							<div
								className={`${styles.btn} ${styles.circle} ${
									aspect === "circle" ? styles.selected : ""
								}`}
								onClick={() => this.setAspect("circle")}
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
							className={`${styles.btn} ${
								this.state.activeControl === "settings" ? styles.selected : ""
							}`}
							onClick={() => this.setState({ activeControl: "settings" })}
							role="presentation"
						>
							Settings
						</div>
						<div
							className={`${styles.btn} ${
								this.state.activeControl === "adjustments"
									? styles.selected
									: ""
							}`}
							onClick={() => this.setState({ activeControl: "adjustments" })}
							role="presentation"
						>
							Adjustments
						</div>
						<div
							className={`${styles.btn} ${
								this.state.activeControl === "color" ? styles.selected : ""
							}`}
							onClick={() => this.setState({ activeControl: "color" })}
							role="presentation"
						>
							colour
						</div>
						<div
							className={`${styles.btn} ${
								this.state.activeControl === "titles" ? styles.selected : ""
							}`}
							onClick={() => this.setState({ activeControl: "titles" })}
							role="presentation"
						>
							titles
						</div>
						<div
							className={`${styles.btn} ${
								this.state.activeControl === "renders" ? styles.selected : ""
							}`}
							onClick={() => this.setState({ activeControl: "renders" })}
							role="presentation"
						>
							renders
						</div>
					</div>
					{this.state.activeControl === "settings" && (
						<section>
							<div className={styles.titleBlock}>
								<h3>Settings</h3>
							</div>
							<div
								className={`${styles.formItem} ${
									this.state.doSave ? styles.isActive : ""
								}`}
							>
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
							<div
								className={`${styles.formItem} ${
									this.state.doSave ? styles.isActive : ""
								}`}
							>
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
							<div
								className={`${styles.formItem} ${
									this.state.hasBackground ? styles.isActive : ""
								}`}
							>
								<h5>
									hasBackground:{" "}
									<span>{this.state.hasBackground ? "yes" : "no"}</span>
								</h5>
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
							<div
								className={`${styles.formItem} ${
									this.state.hasFrame ? styles.isActive : ""
								}`}
							>
								<h5>
									Has Frame: <span>{this.state.hasFrame ? "yes" : "no"}</span>
								</h5>
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
							<div
								className={`${styles.formItem} ${
									this.state.hasPaper ? styles.isActive : ""
								}`}
							>
								<h5>Has Paper:</h5>
								<div className={styles.switchWrap}>
									<Toggle
										className={styles.theToggle}
										id="hasPaperToggle"
										defaultChecked={this.state.hasPaper}
										onChange={this.togglePaper}
									/>
									<label htmlFor="hasPaperToggle">Show Paper</label>
								</div>
							</div>
							<div
								className={`${styles.formItem} ${
									this.state.hasTitles ? styles.isActive : ""
								}`}
							>
								<h5>Titles</h5>
								<div className={styles.switchWrap}>
									<Toggle
										className={styles.theToggle}
										id="hasTitlesToggle"
										defaultChecked={this.state.hasTitles}
										onChange={this.toggleTitles}
									/>
									<label htmlFor="hasTitlesToggle">Show Titles</label>
								</div>
							</div>
						</section>
					)}
					{this.state.activeControl === "adjustments" && (
						<section>
							<div className={styles.titleBlock}>
								<h3>
									Adjustments
									{activeAdjustmentSet && ` (Active: ${activeAdjustmentSet})`}
								</h3>
								{!this.state.adjustmentSet && (
									<button onClick={() => this.toggleAdjustmentSaveDialog()}>
										Save Adjustments...
									</button>
								)}
							</div>
							{showAdjustmentSave && (
								<div className={styles.colorSave}>
									<h5>Adjustment Set Name</h5>
									<div className={`${styles.saveDialog}`}>
										<input
											type="text"
											ref={c => {
												this.tempAdjustmentSetName = c;
											}}
											value={this.state.tempAdjustmentSetName || ""}
											onChange={evt => {
												this.setAdjustmentName(evt);
											}}
										/>
										<input
											type="text"
											ref={c => {
												this.tempAdjustmentSetScope = c;
											}}
											value={this.state.tempAdjustmentSetScope || "all"}
											onChange={evt => {
												this.setAdjustmentScope(evt);
											}}
										/>

										<div
											style={{ opacity: `${tempAdjustmentSetName ? 1 : 0.3}` }}
										>
											<button onClick={() => this.saveAdjustmentSet()}>
												Save Adjustments
											</button>
											<button onClick={() => this.toggleAdjustmentSaveDialog()}>
												cancel
											</button>
										</div>
									</div>
								</div>
							)}
							{adjustmentSets && (
								<div className={styles.colorSave}>
									<h5>saved Sets</h5>
									<div>
										{Object.entries(adjustmentSets).map(([key, value]) => {
											// console.log("setting key: ", key, " and value: ", value);
											return (
												<div className={styles.row} key={key}>
													<span>{key}</span>{" "}
													<span>{activeAdjustmentSet === key && `Active`}</span>
													<button
														onClick={() => this.loadAdjustmentSet(key, value)}
													>
														load
													</button>
													<button onClick={() => this.removeAdjustmentSet(key)}>
														delete
													</button>
												</div>
											);
										})}
									</div>
								</div>
							)}
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
									<button
										onClick={() =>
											this.setState({ svgBackgroundColor: "#fff" })
										}
									>
										White
									</button>
									<button
										onClick={() =>
											this.setState({ svgBackgroundColor: "#000" })
										}
									>
										Black
									</button>
									{this.state.pairColor1 && (
										<button
											onClick={() =>
												this.setState({
													svgBackgroundColor: this.state.pairColor1
												})
											}
										>
											Pair Color 1 ({this.state.pairColor1})
										</button>
									)}
									{this.state.pairColor2 && (
										<button
											onClick={() =>
												this.setState({
													svgBackgroundColor: this.state.pairColor2
												})
											}
										>
											Pair Color 2: {this.state.pairColor1}
										</button>
									)}
								</div>
							</div>
						</section>
					)}
					{this.state.activeControl === "color" && (
						<section>
							<div className={styles.titleBlock}>
								<h3>
									<span>Color Pallette</span>
									{!this.state.swatchName && (
										<button onClick={() => this.toggleColorSaveDialog()}>
											Save as palette...
										</button>
									)}
								</h3>
							</div>
							<section>
								{this.state.swatchName && (
									<div>
										<h5>Active Swatch Group</h5>
										<SwatchGroup
											key={`img${(this.state.swatch &&
												this.state.swatch.name) ||
												"unnamed"}`}
											swatch={this.state.swatch}
											isHorizontal
											role="presentation"
										/>
									</div>
								)}
								{showColorSave && (
									<div className={styles.colorSave}>
										<h5>Unsaved Swatch</h5>
										<div className={`${styles.saveDialog}`}>
											<input
												type="text"
												ref={c => {
													this.tempSwatchName = c;
												}}
												value={this.state.tempSwatchName || ""}
												onChange={evt => {
													this.setSwatchName(evt);
												}}
											/>
											<div style={{ opacity: `${tempSwatchName ? 1 : 0.3}` }}>
												<button onClick={() => this.doSaveSwatch()}>
													Save as Swatch
												</button>
											</div>
										</div>
									</div>
								)}
							</section>
							<hr />
							<div className={`${styles.formItem}`}>
								<h5>Type</h5>
								<div className={styles.buttonGroup}>
									<div
										className={`${styles.btn} ${
											colorType === "swatch" ? styles.selected : ""
										}`}
										onClick={() => this.setColorType("swatch")}
										role="presentation"
									>
										Swatch
									</div>
									<div
										className={`${styles.btn} ${
											colorType === "hue" ? styles.selected : ""
										}`}
										onClick={() => this.setColorType("hue")}
										role="presentation"
									>
										Hue
									</div>
									<div
										className={`${styles.btn} ${
											colorType === "pair" ? styles.selected : ""
										}`}
										onClick={() => this.setColorType("pair")}
										role="presentation"
									>
										Pair
									</div>
									<div
										className={`${styles.btn} ${
											colorType === "custom" ? styles.selected : ""
										}`}
										onClick={() => this.setColorType("custom")}
										role="presentation"
									>
										Custom
									</div>
								</div>
							</div>
							<div
								className={`${styles.formItem}`}
								style={{
									display: `${colorType === "pair" ? "block" : "none"}`
								}}
							>
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
											onChange={color => {
												this.setColor1(color);
											}}
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
											onChange={color => {
												this.setColor2(color);
											}}
										/>
									</div>
								</div>
								<section>
									<h4>pair color array</h4>
									{pairColorArray && (
										<div className={styles.row}>
											<div className={styles.swatchWrap}>
												<h5>
													Darkest <span>{imageLevels[0]}</span>
												</h5>
												<div className={styles.swatch}>
													<div
														className={styles.color}
														style={{ backgroundColor: `${pairColorArray[0]}` }}
													/>
												</div>
											</div>
											<div className={styles.swatchWrap}>
												<h5>
													Darker <span>{imageLevels[1]}</span>
												</h5>
												<div className={styles.swatch}>
													<div
														className={styles.color}
														style={{ backgroundColor: `${pairColorArray[1]}` }}
													/>
												</div>
											</div>
											<div className={styles.swatchWrap}>
												<h5>
													Primary <span>{imageLevels[2]}</span>
												</h5>
												<div className={styles.swatch}>
													<div
														className={styles.color}
														style={{ backgroundColor: `${pairColorArray[2]}` }}
													/>
												</div>
											</div>
											<div className={styles.swatchWrap}>
												<h5>
													Lighter <span>{imageLevels[3]}</span>
												</h5>
												<div className={styles.swatch}>
													<div
														className={styles.color}
														style={{ backgroundColor: `${pairColorArray[3]}` }}
													/>
												</div>
											</div>
											<div className={styles.swatchWrap}>
												<h5>
													Lightest <span>{imageLevels[4]}</span>
												</h5>
												<div className={styles.swatch}>
													<div
														className={styles.color}
														style={{ backgroundColor: `${pairColorArray[4]}` }}
													/>
												</div>
											</div>
										</div>
									)}
								</section>
							</div>
							<section>
								<div
									className={`${styles.formItem}`}
									style={{
										display: `${colorType === "hue" ? "block" : "none"}`
									}}
								>
									<p>Generates colours from a single hue starting point.</p>
									<section className={styles.alt}>
										<div className={styles.formItem}>
											<div className={styles.row}>
												<div className={styles.swatchWrap}>
													<h5>
														Darkest <span>{imageLevels[0]}</span>
													</h5>
													<div className={styles.swatch}>
														<div
															className={styles.color}
															style={{
																// backgroundColor: `hsla(${colorObj.hsl.h}, ${colorObj.hsl.s * 100}%, ${imageLevels[0]}%, 1)`
																backgroundColor: `hsla(${theHue}, ${theSaturation *
																	100}%, ${imageLevels[0]}%, 1)`
															}} // eslint-disbable-line
														/>
													</div>
												</div>
												<div className={styles.swatchWrap}>
													<h5>
														Darker <span>{imageLevels[1]}</span>
													</h5>
													<div className={styles.swatch}>
														<div
															className={styles.color}
															style={{
																backgroundColor: `hsla(${theHue}, ${theSaturation *
																	100}%, ${imageLevels[1]}%, 1)`
															}} // eslint-disbable-line
														/>
													</div>
												</div>
												<div className={styles.swatchWrap}>
													<h5>
														Primary <span>{imageLevels[2]}</span>
													</h5>
													<div className={styles.swatch}>
														<div
															className={styles.color}
															style={{
																backgroundColor: `hsla(${theHue}, ${theSaturation *
																	100}%, ${imageLevels[2]}%, 1)`
															}} // eslint-disbable-line
														/>
													</div>
												</div>
												<div className={styles.swatchWrap}>
													<h5>
														Lighter <span>{imageLevels[3]}</span>
													</h5>
													<div className={styles.swatch}>
														<div
															className={styles.color}
															style={{
																backgroundColor: `hsla(${theHue}, ${theSaturation *
																	100}%, ${imageLevels[3]}%, 1)`
															}} // eslint-disbable-line
														/>
													</div>
												</div>
												<div className={styles.swatchWrap}>
													<h5>
														Lightest <span>{imageLevels[4]}</span>
													</h5>
													<div className={styles.swatch}>
														<div
															className={styles.color}
															style={{
																backgroundColor: `hsla(${theHue}, ${theSaturation *
																	100}%, ${imageLevels[4]}%, 1)`
															}} // eslint-disbable-line
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
												onChange={values => {
													this.onChangeHues(values);
												}}
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
									<div
										className={`${styles.colorEditWrap} ${
											this.state.showColorEdit ? styles.visible : ""
										}`}
									>
										<h5>Hue</h5>
										<div className={styles.formItem}>
											<div className={styles.huePickerWrap}>
												<HuePicker
													// color={colorObj && colorObj.hsl}
													color={{
														h: theHue,
														s: theSaturation,
														l: theLightness,
														a: 1
													}}
													// onChange={(color) => { this.setColor(color); }}
													onChange={color => {
														this.onHueChange(color);
													}}
												/>
											</div>
										</div>
										<h5>Saturation</h5>
										<div className={styles.formItem}>
											<div className={styles.huePickerWrap}>
												<Slider
													step={0.01}
													min={0}
													max={1}
													// trackStyle={{ backgroundColor: `rgb(${theHue}, ${theSaturation * 100}%, ${theLightness * 100})`, height: 16, borderRadius: 0, }}
													trackStyle={{
														marginTop: -4,
														// backgroundColor: `hsl(${theHue}, 50%, 56%)`,
														backgroundColor: "transparent",
														height: 16,
														borderRadius: 0
													}}
													handleStyle={{
														height: 16,
														width: 16,
														marginLeft: -8,
														marginTop: -4,
														border: "none"
													}}
													railStyle={{
														background: `linear-gradient(to right, hsl(${theHue}, 0%, ${theLightness *
															100}%) 0%, hsl(${theHue}, 100%, ${theLightness *
															100}%) 100%)`,
														height: 16,
														borderRadius: 0,
														marginTop: -4
													}}
													defaultValue={theSaturation}
													onChange={this.onSaturationChange}
												/>
											</div>
										</div>
										<h5>Lightness</h5>
										<div className={styles.formItem}>
											<div className={styles.huePickerWrap}>
												<Slider
													step={0.01}
													min={0}
													max={1}
													trackStyle={{
														marginTop: -4,
														// backgroundColor: `hsl(${theHue}, 50%, 56%)`,
														backgroundColor: "transparent",
														height: 16,
														borderRadius: 0
													}}
													handleStyle={{
														height: 16,
														width: 16,
														marginLeft: -8,
														marginTop: -4,
														border: "none"
													}}
													railStyle={{
														background: `linear-gradient(to right, hsl(${theHue}, ${theSaturation *
															100}%, 0%) 0%, hsl(${theHue}, ${theSaturation *
															100}%, 100%) 100%)`,
														height: 16,
														borderRadius: 0,
														marginTop: -4
													}}
													defaultValue={theLightness}
													onChange={this.onLightnessChange}
												/>
											</div>
										</div>
										<div className={styles.formitem}>
											<h4>named color</h4>
											<NamedColor
												onSelect={color => this.setColor(color, "named")}
											/>
										</div>
										<div className={styles.formItem}>
											<ChromePicker
												// color={colorObj && colorObj.hsl}
												color={{
													h: theHue,
													s: theSaturation,
													l: theLightness,
													a: 1
												}}
												onChange={color => {
													this.setColor(color);
												}}
											/>
										</div>
										{/*
											<SliderPicker
												color={colorObj && colorObj.hsl}
												onChange={(color) => { this.setColor(color); }}
											/>
											*/}
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
										<div>
											<input
												type="text"
												ref={c => {
													this.selectedColorName = c;
												}}
												value={this.state.selectedColorName || ""}
												onChange={evt => {
													this.setColorName(evt);
												}}
											/>
											<button
												className={styles.button}
												onClick={() => this.doSaveColor()}
											>
												save color
											</button>
										</div>
									</div>
								</div>
							</section>
							<div
								className={`${styles.formItem}`}
								style={{
									display: `${colorType === "swatch" ? "block" : "none"}`
								}}
							>
								<h3>Saved Swatches</h3>
								{swatchArray &&
									swatchArray.map(swatch => {
										return (
											<div style={{ display: "flex" }}>
												<SwatchGroup
													key={`img${swatch.id}`}
													swatch={swatch.data}
													isHorizontal
													isFav={swatch.data.isFav}
													role="presentation"
													onClickProps={() => this.loadSwatch(swatch.id)}
												/>
												{swatch.data.isFav ? (
													<button
														onClick={() => this.doSetUnfavSwatch(swatch.id)}
													>
														UNFAV
													</button>
												) : (
													<button
														onClick={() => this.doSetFavSwatch(swatch.id)}
													>
														Fav
													</button>
												)}
												<button
													onClick={() => this.setState({ toDelete: swatch.id })}
												>
													Delete
												</button>
												{toDelete === swatch.id && (
													<div>
														<p>Sure?</p>
														<button
															onClick={() => this.doDeleteSwatch(swatch.id)}
														>
															Delete
														</button>
													</div>
												)}
											</div>
										);
									})}
							</div>
							{colorType === "hue" && (
								<div className={styles.formitem}>
									<h3>Saved Colors</h3>
									<div
										className={styles.colorCard}
										style={{ background: "transparent" }}
									>
										<h5>Swatch</h5>
										<h5>Name</h5>
										<h5>Action</h5>
									</div>
									{colorsArray &&
										colorsArray.map(color => {
											return (
												<div
													key={`img${color.id}`}
													className={styles.colorCard}
													role="presentation"
													// onClick={() => this.doRouteImageEdit('/image/admin', img.id)}
                          // eslint-disable-line
												>
													<div
														className={styles.swatch}
														onClick={() => this.loadColor(color.id)}
														role="presentation"
													>
														{color.data.colorObj.hsl && (
															<div
																className={styles.color}
																style={{
																	backgroundColor: `hsla(${
																		color.data.colorObj.hsl.h
																	},
																 ${color.data.colorObj.hsl.s * 100}%,
																 ${color.data.colorObj.hsl.l * 100}%, 1)`
																}}
															/>
														)}
													</div>
													<div>{color.data.name}</div>
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
										})}
								</div>
							)}
							{colorType === "custom" && (
								<section className={styles.alt}>
									<div className={styles.formItem}>
										<div className={styles.row}>
											<div className={styles.swatchWrap}>
												<h5>1. Darkest</h5>
												<div
													className={styles.swatch}
													onClick={() => this.setState({ editCustomColor: 0 })}
												>
													<div
														className={styles.color}
														style={{
															backgroundColor: `${(customSwatchArray &&
																customSwatchArray[0]) ||
																"#444"}`
														}}
													/>
												</div>
											</div>
											<div className={styles.swatchWrap}>
												<h5>2. Darker</h5>
												<div
													className={styles.swatch}
													onClick={() => this.setState({ editCustomColor: 1 })}
												>
													<div
														className={styles.color}
														style={{
															backgroundColor: `${(customSwatchArray &&
																customSwatchArray[1]) ||
																"#777"}`
														}}
													/>
												</div>
											</div>
											<div className={styles.swatchWrap}>
												<h5>3. Primary</h5>
												<div
													className={styles.swatch}
													onClick={() => this.setState({ editCustomColor: 2 })}
												>
													<div
														className={styles.color}
														style={{
															backgroundColor: `${(customSwatchArray &&
																customSwatchArray[2]) ||
																"#aaa"}`
														}}
													/>
												</div>
											</div>
											<div className={styles.swatchWrap}>
												<h5>4: Lighter</h5>
												<div
													className={styles.swatch}
													onClick={() => this.setState({ editCustomColor: 3 })}
												>
													<div
														className={styles.color}
														style={{
															backgroundColor: `${(customSwatchArray &&
																customSwatchArray[3]) ||
																"#ccc"}`
														}}
													/>
												</div>
											</div>
											<div className={styles.swatchWrap}>
												<h5>5. Lightest</h5>
												<div
													className={styles.swatch}
													onClick={() => this.setState({ editCustomColor: 4 })}
												>
													<div
														className={styles.color}
														style={{
															backgroundColor: `${(customSwatchArray &&
																customSwatchArray[4]) ||
																"#eee"}`
														}}
													/>
												</div>
											</div>
										</div>
										<div className={styles.row}>
											{editCustomColor > -1 && (
												<div className={styles.columnSelect}>
													<div className={styles.swatch}>
														<div
															className={styles.color}
															style={{
																backgroundColor:
																	(customSwatchArray &&
																		customSwatchArray[editCustomColor]) ||
																	"#fff"
															}}
														/>
													</div>
													<ChromePicker
														color={
															(customSwatchArray &&
																customSwatchArray[editCustomColor]) ||
															"#fff"
														}
														// onChange={(color) => this.setCustomColor(0, color)}
														onChange={color => {
															this.setCustomColor(editCustomColor, color);
														}}
													/>
												</div>
											)}
										</div>
									</div>
								</section>
							)}
						</section>
					)}
					{this.state.activeControl === "titles" && (
						<section>
							<h3>
								<span>Image Text</span>
								<button onClick={() => this.toggleTitleSaveDialog()}>
									Save Titles
								</button>
							</h3>
							{showTitleSave && (
								<div className={styles.colorSave}>
									<h5>Save Titles</h5>
									<div className={`${styles.saveDialog}`}>
										<div>
											<button onClick={() => this.doSaveTitles()}>
												Save Titles
											</button>
											<button onClick={() => this.toggleTitleSaveDialog()}>
												cancel
											</button>
										</div>
									</div>
								</div>
							)}
							<div className={styles.imageTextPreview}>
								{theTitle && <h2>{theTitle}</h2>}
								<h3>
									{theSubtitle1}
									{theSubtitle2 && <span className={styles.divider} />}
									{theSubtitle2}
								</h3>
							</div>
							<div className={styles.contentItem}>
								<h5>Title</h5>
								<input
									type="text"
									name="theTitle"
									value={theTitle}
									ref={theTitle => {
										this.textInput = theTitle;
									}}
									onChange={this.handleInputChange}
								/>
							</div>
							<div className={styles.contentItem}>
								<h5>Subtitle1</h5>
								<input
									type="text"
									name="theSubtitle1"
									value={theSubtitle1}
									ref={iSubtitle1 => {
										this.textInput = iSubtitle1;
									}}
									onChange={this.handleInputChange}
								/>
							</div>
							<div className={styles.contentItem}>
								<h5>Subtitle2</h5>
								<input
									type="text"
									name="theSubtitle2"
									value={theSubtitle2}
									ref={iSubtitle2 => {
										this.textInput = iSubtitle2;
									}}
									onChange={this.handleInputChange}
								/>
							</div>
						</section>
					)}
					{this.state.activeControl === "renders" && (
						<section>
							<div className={styles.titleBlock}>
								<h3>Rendered Images</h3>
							</div>
							<section>
								<p>this will group the renders</p>
								<div className={`${styles.formItem}`}>
									<h5>Portrait</h5>
									<div className={styles.switchWrap}>
										<Toggle
											className={styles.theToggle}
											id="renderPortraits"
											defaultChecked={renderPortraits}
											onChange={() => this.toggleRender("renderPortraits")}
										/>
										<label htmlFor="renderPortraits">Render Portraits</label>
									</div>
								</div>
								<div className={`${styles.formItem}`}>
									<h5>Portrait</h5>
									<div className={styles.switchWrap}>
										<Toggle
											className={styles.theToggle}
											id="renderCircles"
											defaultChecked={renderCircles}
											onChange={() => this.toggleRender("renderCircles")}
										/>
										<label htmlFor="renderCircles">Render Circles</label>
									</div>
								</div>
								<div className={`${styles.formItem}`}>
									<h5>Portrait</h5>
									<div className={styles.switchWrap}>
										<Toggle
											className={styles.theToggle}
											id="renderTitles"
											defaultChecked={renderTitles}
											onChange={() => this.toggleRender("renderTitles")}
										/>
										<label htmlFor="renderTitles">Render Titles</label>
									</div>
								</div>
								<div className={`${styles.formItem}`}>
									<h5>Portrait</h5>
									<div className={styles.switchWrap}>
										<Toggle
											className={styles.theToggle}
											id="renderPromos"
											defaultChecked={renderPromos}
											onChange={() => this.toggleRender("renderPromos")}
										/>
										<label htmlFor="renderPromos">Render Promos</label>
									</div>
								</div>
							</section>
							{!isLoading &&
								imageSizes &&
								imageSizes.map(size => {
									return (
										<div key={`size${size}`} className={styles.renderGroup}>
											<h4>{size}:</h4>
											<RenderImage
												key={`render${size}portrait`}
												doSave={doSave}
												doRender={doRenders}
												displayMode="mini"
												file={image}
												sourceSvg={
													mode === "remote" &&
													this.state.sourceSvgBlob &&
													this.state.sourceSvgBlob
												}
												svgBackgroundColor={svgBackgroundColor}
												aspect="portrait"
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
												theTitle={theTitle}
												theSubtitle1={theSubtitle1}
												theSubtitle2={theSubtitle2}
												imageColorArray={swatchColorArray || pairColorArray}
												swatchName={swatchName}
											/>
											<RenderImage
												key={`render${size}circle`}
												doSave={doSave}
												doRender={doRenders}
												displayMode="mini"
												file={image}
												sourceSvg={
													mode === "remote" &&
													this.state.sourceSvgBlob &&
													this.state.sourceSvgBlob
												}
												svgBackgroundColor={svgBackgroundColor}
												aspect="circle"
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
												theTitle={theTitle}
												theSubtitle1={theSubtitle1}
												theSubtitle2={theSubtitle2}
												imageColorArray={swatchColorArray || pairColorArray}
												swatchName={swatchName}
											/>
											<RenderImage
												key={`render${size}landscape`}
												doSave={doSave}
												doRender={doRenders}
												displayMode="mini"
												file={image}
												sourceSvg={
													mode === "remote" &&
													this.state.sourceSvgBlob &&
													this.state.sourceSvgBlob
												}
												svgBackgroundColor={svgBackgroundColor}
												aspect="landscape"
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
												theTitle={theTitle}
												theSubtitle1={theSubtitle1}
												theSubtitle2={theSubtitle2}
												imageColorArray={swatchColorArray || pairColorArray}
												swatchName={swatchName}
											/>
										</div>
									);
								})}

							{!isLoading &&
							renderPromos && ( // this.state.sourceSvgBlob &&
									<div>
										<h4>PROMOTIONAL:</h4>
										<p>Includes grey backgrounds</p>
										<RenderImage
											key="renderMediumPortraitBackground"
											doSave={doSave}
											doRender={doRenders}
											displayMode="mini"
											file={image}
											sourceSvg={
												mode === "remote" &&
												this.state.sourceSvgBlob &&
												this.state.sourceSvgBlob
											}
											svgBackgroundColor={svgBackgroundColor}
											aspect="portrait"
											mode="medium"
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
											theTitle={theTitle}
											theSubtitle1={theSubtitle1}
											theSubtitle2={theSubtitle2}
											imageColorArray={swatchColorArray || pairColorArray}
											swatchName={swatchName}
										/>
										<RenderImage
											key="renderMediumCircleBackground"
											doSave={doSave}
											doRender={doRenders}
											displayMode="mini"
											file={image}
											sourceSvg={
												mode === "remote" &&
												this.state.sourceSvgBlob &&
												this.state.sourceSvgBlob
											}
											svgBackgroundColor={svgBackgroundColor}
											aspect="circle"
											mode="medium"
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
											theTitle={theTitle}
											theSubtitle1={theSubtitle1}
											theSubtitle2={theSubtitle2}
											imageColorArray={swatchColorArray || pairColorArray}
											swatchName={swatchName}
										/>
										<RenderImage
											key="renderMediumPortraitBackgroundFrame"
											doSave={doSave}
											doRender={doRenders}
											displayMode="mini"
											file={image}
											sourceSvg={
												mode === "remote" &&
												this.state.sourceSvgBlob &&
												this.state.sourceSvgBlob
											}
											svgBackgroundColor={svgBackgroundColor}
											aspect="portrait"
											mode="medium"
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
											theTitle={theTitle}
											theSubtitle1={theSubtitle1}
											theSubtitle2={theSubtitle2}
											imageColorArray={swatchColorArray || pairColorArray}
											swatchName={swatchName}
										/>
										<RenderImage
											key="renderMediumCircleBackgroundFrame"
											doSave={doSave}
											doRender={doRenders}
											displayMode="mini"
											file={image}
											sourceSvg={
												mode === "remote" &&
												this.state.sourceSvgBlob &&
												this.state.sourceSvgBlob
											}
											svgBackgroundColor={svgBackgroundColor}
											aspect="circle"
											mode="medium"
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
											theTitle={theTitle}
											theSubtitle1={theSubtitle1}
											theSubtitle2={theSubtitle2}
											imageColorArray={swatchColorArray || pairColorArray}
											swatchName={swatchName}
										/>
									</div>
								)}
						</section>
					)}
				</div>
			</div>
		);
	}
	//////////////////////////////
	// FUCNTIONS
	//////////////////////////////

	loadSvgData = () => {
		const { svgId } = this.state;
		const svgRef = fbase.collection("svg").doc(svgId);
		svgRef.get().then(snapshot => {
			const data = snapshot.data();
			console.log("svgData Found: ", snapshot.data());
			this.setState({
				isLoadingSvg: false,
				adjustmentSets: data.adjustmentSets,
				theTitle: data.theTitle,
				theSubtitle1: data.theSubtitle1,
				theSubtitle2: data.theSubtitle2
			});
		});
	};

	loadSvg = () => {
		console.log("this will load svg");
		this.setState({ isLoading: true });
		const {
			imageId = (this.props.location.state &&
				this.props.location.state.image) ||
        "milfordSound", // eslint-disable-line
      filename = this.props.location.state && this.props.location.state.filename // eslint-disable-line
		} = this.props;
		console.log("imageId: ", imageId);
		console.log("filename: ", filename);

		const fStorage = firebase.storage();
		const storageLocation = "svg";
		const storageRef = fStorage.ref().child(storageLocation);
		// const fileRef = storageRef.child(filename);

		storageRef
			.child(filename)
			.getDownloadURL()
			.then(url => {
				// `url` is the download URL for 'images/stars.jpg'
				// console.log('found image: ', url);
				// This can be downloaded directly:

				const xhr = new XMLHttpRequest();
				// xhr.responseType = 'blob';
				xhr.responseType = "";
				xhr.onload = event => {
					const blob = xhr.response;
					console.log("XHR event", event);
					// console.log('XHR complete', blob);
					// console.log('this!', this);
					this.setState({
						sourceSvgBlob: blob,
						sourceSvg: url
					});
				};
				xhr.open("GET", url);
				xhr.send();

				console.log("xhr: ", xhr);

				// Or inserted into an <img> element:
				// var img = document.getElementById('myimg');
				// img.src = url;
				this.setState({
					isLoading: false
				});
			})
			.catch(error => {
				// Handle any errors
				console.log("error: ", error);
			});
	};

	cleanUpSvg = () => {
		const { sourceSvgBlob } = this.state;
		console.log("cleaning up svg", sourceSvgBlob);
		const tempElement = document.createElement("p");
		// tempElement.appendChild(sourceSvgBlob);
		tempElement.innerHTML = sourceSvgBlob;
		console.log("el: ", tempElement);
		const workingSvg = tempElement.getElementsByTagName("svg")[0];
		console.log("el: ", workingSvg);
		const svgAttributes = {
			version: "1.1",
			xmlns: "http://www.w3.org/2000/svg",
			"xmlns:xlink": "http://www.w3.org/1999/xlink",
			x: "0",
			y: "0",
			viewBox: "0, 0, 3000, 3000",
			width: "100%",
			height: "100%",
			preserveAspectRatio: "xMidYMid slice"
		};
		if (workingSvg) {
			svgAttributes &&
				Object.entries(svgAttributes).map(([key, value]) => {
          // eslint-disable-line
					console.log("setting key: ", key, " and value: ", value);
					workingSvg.setAttribute(key, value);
				});
			workingSvg.setAttribute("hello", 88776439);
			const SvgCode = tempElement.innerHTML;
			// console.log('svgtopass', svgtopass);
			this.doSaveSvg(SvgCode);
		}
		console.log("working svg2", workingSvg);
	};

	doSaveSvg = SvgCode => {
		// dataUrl
		console.log("this will save the image", SvgCode);
		console.log("workingSvg: ", SvgCode);
		// const { files, slug } = this.state;
		const filename =
			this.props.location.state && this.props.location.state.filename;
		// const file = files[0];
		let newFileAddress;
		const tempFile = new Blob([SvgCode], { type: "text/plain" });
		console.log("tenpfile: ", tempFile);
		const fStorage = firebase.storage();
		const storageLocation = "svg";
		const storageRef = fStorage.ref().child(storageLocation);
		const fileRef = storageRef.child(filename);
		const uploadTask = fileRef.put(tempFile);
		console.log("storageRef", storageRef);
		console.log("fileRef", fileRef);
		this.setState({
			isSaving: true
		});

		uploadTask.on(
			"state_changed",
			snapshot => {
				// Observe state change events such as progress, pause, and resume
				// Get task progress, including the number of bytes uploaded
				// and the total number of bytes to be uploaded
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log(`Upload is ${progress}% done`);
				this.setState({ uploadPercentage: progress });
				switch (snapshot.state) {
					case firebase.storage.TaskState.PAUSED: // or 'paused'
						console.log("Upload is paused");
						break;
					case firebase.storage.TaskState.RUNNING: // or 'running'
						console.log("Upload is running");
						break;
					default:
						console.log("error");
						break;
				}
			},
			error => {
				// Handle unsuccessful uploads
				switch (error.code) {
					case "storage/unauthorized":
						// User doesn't have permission to access the object
						break;
					case "storage/canceled":
						// User canceled the upload
						break;
					case "storage/unknown":
						// Unknown error occurred, inspect error.serverResponse
						break;
					default:
						console.log("error");
						break;
				}
				console.warn("unsuccessful upload");
				return error;
			},
			snapshot => {
				console.log("successful upload snapshot: ", snapshot);
				// Handle successful uploads on complete
				// For instance, get the download URL: https://firebasestorage.googleapis.com/...
				uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
					console.log("File available at", downloadURL);
				});
			}
		);

		uploadTask.then(snapshot => {
			console.log("Uploaded a blob or file! snapshot: ", snapshot);
			snapshot.ref
				.getDownloadURL()
				.then(url => {
					newFileAddress = url;
					return snapshot;
				})
				.then(() => {
					this.setState({
						isSaving: false,
						file: null
					});
				})
				.then(() => {
					this.props.history.goBack();
				});
		});
	};

	//////////////////////////////
	// COLORS
	//////////////////////////////

	getColors() {
		const colorsRef = fbase.collection("colors");
		const colorsArray = [];
		colorsRef.get().then(querySnapshot => {
			querySnapshot.forEach(doc => {
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
		console.log("loading color data from: ", colorId);
		console.log("colorsArray is: ", colorsArray);
		this.setState({
			isLoading: true,
			isApplying: true
		});
		const docRef = fbase.collection("colors").doc(colorId);
		docRef
			.get()
			.then(doc => {
				if (doc.exists) {
					console.log("color data:", doc.data());
					this.setState({
						colorObj: doc.data().colorObj,
						selectedColorName: doc.data().name,
						imageLevels: doc.data().imageLevels,
						theHue: doc.data().colorObj.hsl.h,
						theSaturation: doc.data().colorObj.hsl.s,
						theLightness: doc.data().colorObj.hsl.l
					});
					this.setState({
						isLoading: false,
						isApplying: false
					});
				} else {
					console.log("No such color!");
				}
			})
			.catch(error => {
				console.log("Error getting color:", error);
			});
	}

	doSaveColor(colorId) {
		const { selectedColorName } = this.state;
		if (colorId) {
			console.log("Saving the color wid id: ", colorId);
		} else {
			console.log("should save a new colour since there is no id");
		}
		const { colorObj, imageLevels } = this.state;
		const currentDateTime = new Date();
		if (!colorId) {
			fbase
				.collection("colors")
				.add({
					colorObj,
					name: selectedColorName,
					imageLevels,
					modifiedDate: currentDateTime
				})
				.then(docRef => {
					console.log(
						"Color successfully written!, with reference of: ",
						docRef
					);
					this.setState({
						colorSaved: true,
						isError: false
					});
					setTimeout(() => {
						this.setState({
							imageSaved: false
						});
					}, 2000);
				})
				.catch(error => {
					console.error("Error writing image: ", error);
					this.setState({
						imageSaved: false,
						isError: true
					});
				});
		}
	}

	doSaveImage() {
		console.log("this will save the image");
		const currentDateTime = new Date();

		const {
			aspect,
			colorObj = this.props.location.state &&
				this.props.location.state.colorObj,
			hasFrame,
			hasHighlight,
			hasBackground,
			image,
			imageLevels,
			theScale,
			theTranslateX,
			theTranslateY,
			theTitle = "",
			theSubTitle1 = "",
			theSubTitle2 = ""
		} = this.state;
		const { file } = this.props;
		console.log("do save iamge: ", image, file);
		console.log(
			"trying to save:",
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
			theTitle,
			theSubTitle1,
			theSubTitle2
		);
		if (image) {
			fbase
				.collection("images")
				.add({
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
					theTitle,
					theSubTitle1,
					theSubTitle2,
					modifiedDate: currentDateTime
				})
				.then(imageRef => {
					console.log(
						"Image successfully written!, with reference of: ",
						imageRef
					);
					this.setState({
						imageSaved: true,
						isError: false
					});
					setTimeout(() => {
						this.setState({
							colorSaved: false
						});
					}, 2000);
				})
				.catch(error => {
					console.error("Error writing color: ", error);
					this.setState({
						colorSaved: false,
						isError: true
					});
				});
		}
	}

	doRenders = () => {
		console.log("this will trigger renders");
	};

	// TOGGLE OPTIONS
	setAspect = aspect => {
		this.setState({
			aspect
		});
	};

	toggleFrame = () => {
		this.setState({
			hasFrame: !this.state.hasFrame
		});
	};

	togglePaper = () => {
		this.setState({
			hasPaper: !this.state.hasPaper
		});
	};

	toggleTitles = () => {
		this.setState({
			hasTitles: !this.state.hasTitles
		});
	};

	toggleBackground = () => {
		this.setState({
			hasBackground: !this.state.hasBackground
		});
	};

	toggleViewSources = () => {
		this.setState({
			showSources: !this.state.showSources
		});
	};

	toggleViewAdjustments = () => {
		this.setState({
			showAdjustments: !this.state.showAdjustments
		});
	};

	toggleColorSaveDialog = () => {
		this.setState({
			showColorSave: !this.state.showColorSave
		});
	};

	toggleAdjustmentSaveDialog = () => {
		this.setState({
			showAdjustmentSave: !this.state.showAdjustmentSave
		});
	};

	toggleTitleSaveDialog = () => {
		this.setState({
			showTitleSave: !this.state.showTitleSave
		});
	};

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
	};

	toggleDoRenders = () => {
		this.setState({
			doRenders: !this.state.doRenders
		});
	};

	doRenders = () => {
		this.setState({
			doRenders: true
		});
	};
	/*
	toggleShowRenders = () => {
		this.setState({
			showRenders: !this.state.showRenders
		});
	}
*/

	toggleRender = renderMode => {
		console.log("toggleRender: ", renderMode);
		this.setState({
			[renderMode]: !this.state[renderMode]
		});
	};

	//////////////////////////////
	// TITLES
	//////////////////////////////
	handleInputChange = event => {
		const target = event.target;
		const value = target.type === "checkbox" ? target.checked : target.value;
		const name = target.name;
		this.setState({
			[name]: value
		});
		// setTimeout(() => {
		// this.saveImage();
		// }, 1000);
	};

	doSaveTitles = () => {
		console.log("this will save titles");
		const {
			theTitle = "",
			theSubtitle1 = "",
			theSubtitle2 = "",
			svgId
		} = this.state;
		this.setState({
			isSaving: true
		});
		const currentDateTime = new Date();
		if (!svgId) {
			return "no svg Id";
		}
		fbase
			.collection("svg")
			.doc(svgId)
			.set(
				{
					theTitle,
					theSubtitle1,
					theSubtitle2,
					modifiedDate: currentDateTime
				},
				{ merge: true }
			)
			.then(docRef => {
				console.log(
					"Titles successfully written!, with reference of: ",
					docRef
				);
				this.setState({
					isSaving: false,
					titlesSaved: true,
					isError: false
				});
				setTimeout(() => {
					this.setState({
						titlesSaved: false
					});
				}, 2000);
			})
			.catch(error => {
				console.error("Error writing image: ", error);
				this.setState({
					isSaving: false,
					titlesSaved: false,
					isError: true
				});
			});
	};
	//////////////////////////////
	// COLORS
	//////////////////////////////

	setColorType = type => {
		this.setState({
			colorType: type
		});
	};

	onHueChange = color => {
		const { theSaturation, theLightness } = this.state;
		console.log("HUE: setting the color", color.hsl);
		this.setState(
			{
				theHue: color.hsl.h
			},
			() => {
				this.setColor(
					{ h: color.hsl.h, s: theSaturation, l: theLightness, a: 1 },
					"manual"
				);
			}
		);
	};

	onSaturationChange = value => {
		const { theHue, theLightness } = this.state;
		console.log("changing saturation", value);
		this.setState(
			{
				theSaturation: value
			},
			() => {
				this.setColor({ h: theHue, s: value, l: theLightness, a: 1 }, "manual");
			}
		);
	};

	onLightnessChange = value => {
		const { theHue, theSaturation } = this.state;
		console.log("changing saturation", value);
		this.setState(
			{
				theLightness: value
			},
			() => {
				this.setColor(
					{ h: theHue, s: theSaturation, l: value, a: 1 },
					"manual"
				);
			}
		);
	};

	onChangeHues = values => {
		console.log("on change hues was called with", values);
		this.setState(
			{
				imageLevels: values
			},
			() => {
				this.setColor(this.state.colorObj);
			}
		);
	};

	setColor(color, mode = "auto") {
		const { imageLevels } = this.state;
		const theHue = mode === "auto" ? color.hsl.h : color.h;
		const theSaturation = mode === "auto" ? color.hsl.s : color.s;
		const theLightness = mode === "auto" ? color.hsl.l : color.l;
		console.log("color: ", color);
		console.log("therefor the color is: ", theHue, theSaturation, theLightness);
		console.log("HUE: setting the color", color.hsl);
		console.log("colour stops are: ", imageLevels);
		console.log("therefore the color points are: ");
		const colorStop1 = `hsl(${theHue}, ${theSaturation * 100}%, ${
			imageLevels[0]
		}%)`; // color.hsl.s
		const colorStop2 = `hsl(${theHue}, ${theSaturation * 100}%, ${
			imageLevels[1]
		}%)`;
		const colorStop3 = `hsl(${theHue}, ${theSaturation * 100}%, ${
			imageLevels[2]
		}%)`;
		const colorStop4 = `hsl(${theHue}, ${theSaturation * 100}%, ${
			imageLevels[3]
		}%)`;
		const colorStop5 = `hsl(${theHue}, ${theSaturation * 100}%, ${
			imageLevels[4]
		}%)`;
		const tempColorArray = [
			colorStop1,
			colorStop2,
			colorStop3,
			colorStop4,
			colorStop5
		];
		console.log("tempColorArray:", tempColorArray);
		const tempSwatch = {
			name: "unsaved swatch",
			type: "hue",
			swatchColorArray: tempColorArray
		};
		this.setState({
			colorObj: color,
			theHue,
			theSaturation,
			theLightness,
			tempSwatchName: "unsaved swatch",
			swatchName: "",
			swatch: tempSwatch,
			swatchColorArray: tempColorArray
		});
	}

	setColor1(color) {
		console.log("PAIR: setting the color1", color);
		const { pairColor2 } = this.state;
		const colorStop3 = this.hexAverage(color.hex, pairColor2); // calculate the middle
		const colorStop2 = this.hexAverage(color.hex, colorStop3); // between middle and initial
		const colorStop4 = this.hexAverage(colorStop3, pairColor2); // between middle and final
		const tempArray = [
			color.hex,
			colorStop2,
			colorStop3,
			colorStop4,
			pairColor2
		];
		console.log(tempArray);
		this.setState({
			pairColor1: color.hex,
			pairColorArray: tempArray,
			swatchColorArray: tempArray,
			swatchName: "",
			tempSwatchName: "unnamed swatch"
		});
	}

	setColor2(color) {
		console.log("PAIR: setting the color2", color);
		const { pairColor1 } = this.state;
		console.log(
			"the hex middle averege is thereforre: ",
			this.hexAverage(pairColor1, color.hex)
		);
		const colorStop3 = this.hexAverage(pairColor1, color.hex); // calc the middle
		const colorStop2 = this.hexAverage(pairColor1, colorStop3); // between middle and initial
		const colorStop4 = this.hexAverage(colorStop3, color.hex); // between middle and final
		const tempArray = [
			pairColor1,
			colorStop2,
			colorStop3,
			colorStop4,
			color.hex
		];
		this.setState({
			pairColor2: color.hex,
			pairColorArray: tempArray,
			swatchColorArray: tempArray,
			swatchName: "",
			tempSwatchName: "unnamed swatch"
		});
	}

	setCustomColor = (index, color) => {
    // eslint-disable-line
		console.log(index, color);
		if (index < 0 || !color) {
			console.log("Bailing out, no index or color");
			return false;
		}
		const {
			customSwatchArray = [
				"#444444",
				"#777777",
				"#aaaaaa",
				"#cccccc",
				"#eeeeee"
			]
		} = this.state;
		console.log("setting custom color ", index, color);
		console.log("customSwatchArray ", customSwatchArray);

		const tempArray = customSwatchArray.slice();
		tempArray[index] = color.hex;
		console.log("temparray: ", tempArray);
		const tempSwatch = {
			name: "unsaved swatch",
			type: "custom",
			swatchColorArray: tempArray
		};
		console.log("tempSwatch, ", tempSwatch);
		this.setState({
			customSwatchArray: tempArray,
			swatchColorArray: tempArray,
			swatchName: "",
			tempSwatchName: "unnamed swatch"
		});
	};

	////////////////////////////////////////////////
	// SWATCHES
	////////////////////////////////////////////////
	getSwatches() {
		const colorsRef = fbase.collection("swatches");
		const swatchArray = [];
		colorsRef.get().then(querySnapshot => {
			querySnapshot.forEach(doc => {
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
		console.log("loading swatch data from: ", swatchId);
		console.log("swatchArray is: ", swatchArray);
		this.setState({
			isLoading: true,
			isApplying: true
		});
		const docRef = fbase.collection("swatches").doc(swatchId);
		docRef
			.get()
			.then(doc => {
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
						isApplying: false
					});
				} else {
					console.log("No such swatch!");
				}
			})
			.catch(error => {
				console.log("Error getting swatch:", error);
			});
	}

	doSaveSwatch() {
		console.log("saving the swatch", this.state);
		const currentDateTime = new Date();
		const {
			tempSwatchName = "unnamed swatch",
			colorType,
			pairColorArray,
			swatchColorArray,
			customSwatchArray,
			pairColor1,
			pairColor2,
			swatch
			// theHue,
			// imageLevels,
		} = this.state;
		this.setState({
			isSaving: true
		});

		// TODO:
		console.log("this state swatch ", swatch);

		// convert hue swatches into custom ones.
		// and save as array
		if (tempSwatchName) {
			fbase
				.collection("swatches")
				.add({
					name: tempSwatchName,
					type: colorType,
					pairColorArray,
					swatchColorArray: swatch.swatchColorArray,
					customSwatchArray,
					pairColor1,
					pairColor2,
					// theHue,
					// imageLevels,
					modifiedDate: currentDateTime
				})
				.then(ref => {
					console.log("swatch Added: ", ref);
					this.setState({
						swatchSaved: true,
						isError: false,
						isSaving: false
					});
					setTimeout(() => {
						this.setState({
							swatchSaved: false
						});
					}, 2000);
				})
				.catch(error => {
					console.error("Error writing swatch: ", error);
					this.setState({
						swatchSaved: false,
						isSaving: false,
						isError: true
					});
				});
		}
	}

	doDeleteSwatch = swatchId => {
		console.log("delete swatch....", swatchId);
		if (!swatchId) {
			return "no swatchId";
		}
		this.setState({
			isSaving: true
		});
		fbase
			.collection("swatches")
			.doc(swatchId)
			.delete()
			.then(() => {
				console.log("Swatch successfully deleted!");
				this.setState({
					isSaving: false,
					isError: false
				});
			})
			.catch(error => {
				console.error("Error delteing swatch: ", error);
				this.setState({
					isSaving: false,
					isError: true
				});
			});
	};

	doSetFavSwatch = swatchId => {
		console.log("set fav swatch....", swatchId);
		if (swatchId) {
			fbase
				.collection("swatches")
				.doc(swatchId)
				.update({
					isFav: true
				})
				.then(() => {
					console.log("fav success added!");
					this.setState({
						isSaving: false,
						isError: false
					});
				})
				.catch(error => {
					console.error("Error adding fav swatch: ", error);
					this.setState({
						isSaving: false,
						isError: true
					});
				});
		}
	};

	doSetUnfavSwatch = swatchId => {
		console.log("unsetting swatch....", swatchId);
		if (swatchId) {
			fbase
				.collection("swatches")
				.doc(swatchId)
				.update({
					isFav: false
				})
				.then(() => {
					console.log("fav success removed!");
					this.setState({
						isSaving: false,
						isError: false
					});
				})
				.catch(error => {
					console.error("Error removing fav swatch: ", error);
					this.setState({
						isSaving: false,
						isError: true
					});
				});
		}
	};

	setSwatchName(evt) {
		// console.log("setting the swatchname", evt);
		this.setState({
			tempSwatchName: evt.target.value
		});
	}

	setColorName(evt) {
		// console.log("setting the colorName", evt);
		this.setState({
			selectedColorName: evt.target.value
		});
	}

	////////////////////////////////////////////////////////////
	// ADJUSTMENTS ////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////

	setAdjustmentName(evt) {
		// console.log("setting the adjname", evt);
		this.setState({
			tempAdjustmentSetName: evt.target.value
		});
	}

	setAdjustmentScope(evt) {
		// console.log("setting the adjname", evt);
		this.setState({
			tempAdjustmentSetScope: evt.target.value
		});
	}

	saveAdjustmentSet = () => {
		console.log("saveing adjustments to svg");
		const {
			theScale,
			theTranslateX,
			theTranslateY,
			tempAdjustmentSetName,
			tempAdjustmentSetScope = "all",
			svgId
		} = this.state;
		const tempSet = {
			theScale,
			theTranslateX,
			theTranslateY,
			scope: tempAdjustmentSetScope
		};
		this.setState({
			isSaving: true
		});
		const theAdjustments = {
			[tempAdjustmentSetName]: tempSet
		};
		console.log("theadjustments to save will be: ", theAdjustments);
		const currentDateTime = new Date();
		if (!svgId) {
			return "no svg Id";
		}
		fbase
			.collection("svg")
			.doc(svgId)
			.set(
				{
					adjustmentSets: theAdjustments,
					modifiedDate: currentDateTime
				},
				{ merge: true }
			)
			.then(docRef => {
				console.log(
					"Adjustments successfully written!, with reference of: ",
					docRef
				);
				this.setState({
					isSaving: false,
					adjustmentSaved: true,
					isError: false
				});
				setTimeout(() => {
					this.setState({
						adjustmentSaved: false
					});
				}, 2000);
			})
			.catch(error => {
				console.error("Error writing image: ", error);
				this.setState({
					isSaving: false,
					adjustmentSaved: false,
					isError: true
				});
			});
	};

	removeAdjustmentSet = setId => {
		const svgId = this.props.location.state && this.props.location.state.id;
		const currentDateTime = new Date();
		const { adjustmentSets } = this.state;
		delete adjustmentSets[setId];
		console.log("adjustmentSets after: ", adjustmentSets);
		this.setState({
			isSaving: true
		});
		if (!svgId) {
			return "no svg Id";
		}
		fbase
			.collection("svg")
			.doc(svgId)
			.update({
				adjustmentSets,
				modifiedDate: currentDateTime
			})
			.then(docRef => {
				console.log(
					"Adjustments successfully updated!, with reference of: ",
					docRef
				);
				this.setState({
					isSaving: false,
					adjustmentSaved: true,
					isError: false
				});
				setTimeout(() => {
					this.setState({
						adjustmentSaved: false
					});
				}, 2000);
			})
			.catch(error => {
				console.error("Error writing image: ", error);
				this.setState({
					isSaving: false,
					adjustmentSaved: false,
					isError: true
				});
			});
	};

	loadAdjustmentSet = (name, set) => {
		const { theScale, theTranslateX, theTranslateY } = set;
		this.setState({
			theScale,
			theTranslateX,
			theTranslateY,
			activeAdjustmentSet: name
		});
	};

	setScale(value) {
		console.log("setting the scale value", value);
		this.setState({
			theScale: value
		});
	}

	onSliderChange = value => {
		this.setState({
			theScale: value
		});
	};

	onTranslateXChange = value => {
		this.setState({
			theTranslateX: value
		});
	};

	onTranslateYChange = value => {
		this.setState({
			theTranslateY: value
		});
	};

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
		return args
			.reduce(
				(previousValue, currentValue) => {
					return currentValue
						.replace(/^#/, "")
						.match(/.{2}/g)
						.map((value, index) => {
							console.log("value", value);
							return previousValue[index] + parseInt(value, 16);
						});
				},
				[0, 0, 0]
			)
			.reduce((previousValue, currentValue) => {
				return (
					previousValue +
					this.padToTwo(Math.floor(currentValue / args.length).toString(16))
				);
			}, "#");
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

/*
	loadImage = (name, aspect) => {
		this.setState({
			image: name,
			aspect
		});
	};
*/
