import React, { Component } from "react";
import * as firebase from "firebase";
import classNames from "classnames";
import { distanceInWords } from "date-fns";
// import request from "request";
import Toggle from "react-toggle";
import fbase from "../../firebase";
import Tick from "../../assets/icons/tick.svg";

import SwatchGroup from "../SwatchGroup/SwatchGroup";
import DisplayImage from "../DisplayImage/DisplayImage";
import Loading from "../Loading/Loading";
import RenderImage from "../RenderImage/RenderImage";
import AppConfig from "../../../appConfig.config";
import styles from "./ImageAdmin.scss";

const funtionBase = "https://us-central1-inkbig-717ee.cloudfunctions.net";
const defaultAdjustmentSets = {
	noAdjustment: {
		theScale: 1.0,
		theTranslateX: 0,
		theTranslateY: 0,
		scope: "all",
		name: "noAdjustment"
	}
};

export default class ImageAdmin extends Component {
	state = {
		adjustmentSets: defaultAdjustmentSets,
		profile: {},
		loggedIn: false,
		filesArray: [],
		currentRendersArray: [],
		doRenders: false,
		doSave: false,
		doRenderPreview: false,
		doRenderPrint: false,
		doRenderPromo: false,
		isLoadingSource: true,
		isLoadingSvgData: true,
		isLoadingImageData: true,
		isLoading: false,
		isAdding: false,
		isEditing: false,
		isUpdated: false,
		isError: false,
		activeControl: "settings",
		activeSelect: "",
		selectedSvg: "",
		showRenderDetail: null,
		tempSelectedSvg: "",
		aspects: ["portrait", "circle"],
		tempSelectedRenders: []
	};

	componentWillMount() {}

	componentDidMount() {
		this.getImage();
	}

	componentWillUnmount() {}

	// Note: `user` comes from the URL, courtesy of our router
	// { action, blogId }
	render() {
		const {
			imageId = (this.props.location.state &&
				this.props.location.state.imageId) ||
				"milfordSound",
			isLoadingSvg,
			isLoadingSwatches,
			dataSources,
			dataSwatches
		} = this.props;
		const {
			aspects,
			activeControl,
			activeSelect,
			adjustmentSets,
			doRenders,
			doSave,
			doRenderPreview,
			doRenderPrint,
			doRenderPromo,
			generatingId,
			generatingKey,
			generatingStatus,
			imageData,
			imageRenders,
			isError,
			isUpdated,
			isAdding,
			isLoading,
			isLoadingSource,
			isLoadingSvgData,
			isLoadingImageData,
			filesArray,
			currentRendersArray,
			sourceSvgData,
			selectedSvg,
			tempSelectedSvg,
			swatchSets,
			sourceSvgBlob,
			showRenderDetail,
			theTitle,
			theSubtitle1,
			theSubtitle2,
			renderCombinations,
			tempSelectedRenders
		} = this.state;
		let currentComboName = ""; // used to determin rows
		// console.log('state is', this.state);
		// console.log('props is', this.props);
		// console.log(imageId);
		// console.log("AppConfig:", AppConfig);
		return (
			<div
				className={classNames(styles.ImageAdmin, styles.wrap, {
					[styles.isUpdated]: !!isUpdated
				})}
			>
				<div className={styles.row}>
					<div className={styles.column}>
						<h1>Product: {imageData && imageData.name}</h1>
						<h5>ID: {imageId}</h5>
						<button onClick={() => this.fetchData()}>fetch data</button>
						<button onClick={() => this.fetchData2()}>fetch data2</button>
					</div>
				</div>
				<div className={styles.row}>
					{/* SUBNAV */}
					<section className={styles.subnavWrap}>
						<div className={classNames(styles.buttonGroup, styles.tabs)}>
							<div
								className={classNames(styles.btn, {
									[styles.selected]: this.state.activeControl === "settings"
								})}
								onClick={() =>
									this.setState({ activeControl: "settings", activeSelect: "" })
								}
								role="presentation"
							>
								Settings
							</div>
							<div
								className={classNames(styles.btn, {
									[styles.selected]: this.state.activeControl === "previews"
								})}
								onClick={() => this.setState({ activeControl: "previews" })}
								role="presentation"
							>
								previews
							</div>
							<div
								className={classNames(styles.btn, {
									[styles.selected]: this.state.activeControl === "adjustments"
								})}
								onClick={() => this.setState({ activeControl: "adjustments" })}
								role="presentation"
							>
								Adjustments
							</div>
							<div
								className={classNames(styles.btn, {
									[styles.selected]: this.state.activeControl === "swatches"
								})}
								onClick={() =>
									this.setState({
										activeControl: "swatches",
										activeSelect: "swatches"
									})
								}
								role="presentation"
							>
								swatches
							</div>
							<div
								className={classNames(styles.btn, {
									[styles.selected]: this.state.activeControl === "renders"
								})}
								onClick={() =>
									this.setState({
										activeControl: "renders",
										activeSelect: "renders"
									})
								}
								role="presentation"
							>
								renders
							</div>
						</div>
					</section>
				</div>
				<div className={styles.row}>
					<div
						className={`${styles.column} ${
							activeControl === "previews" ? styles.isHidden : ""
						}`}
					>
						{/* ERROS AND MESSAGES*/}
						{isError && (
							<div className={`${styles.message} ${styles.error}`}>
								Error: {this.state.error}
							</div>
						)}
						{isAdding && (
							<div className={`${styles.message}`}>
								<div
									className={styles.theTick}
									dangerouslySetInnerHTML={{ __html: Tick }}
								/>
								Adding
							</div>
						)}
						{isUpdated && (
							<div className={`${styles.message} ${styles.success}`}>
								<div
									className={styles.theTick}
									dangerouslySetInnerHTML={{ __html: Tick }}
								/>
								UPDATED
							</div>
						)}
						{isLoadingImageData && (
							<div className={`${styles.message}`}>loading Image Data</div>
						)}
						{/*SETTINGS*/}
						{activeControl === "settings" && (
							<div>
								<h3>SVG source</h3>
								<section>
									{selectedSvg && <h5>Selevted Svg Id: {selectedSvg}</h5>}
									{isLoadingSvgData ||
										(isLoadingSvgData && (
											<div>
												<Loading />
											</div>
										))}
									{sourceSvgData && (
										<div>
											<h5>Source SVG</h5>
											<p>filename: {sourceSvgData.filename}</p>
										</div>
									)}
									{!sourceSvgData && (
										<div>
											<h5>No Source</h5>
										</div>
									)}
									<button
										onClick={() => this.setState({ activeSelect: "svg" })}
									>
										Select SVG
									</button>
								</section>
								<h3>Variations</h3>
								<div className={styles.variationList}>
									<h5>Aspects</h5>
									{aspects &&
										aspects.map(aspect => {
											return <div key={aspect}>{aspect}</div>;
										})}
									<h5>Adjustment Sets</h5>
									{sourceSvgData && sourceSvgData.adjustmentSets && (
										<div>
											{Object.entries(sourceSvgData.adjustmentSets).map(
												([key]) => {
													// , value
													return (
														<div className={styles.row} key={key}>
															<span>{key}</span>{" "}
														</div>
													);
												}
											)}
										</div>
									)}
									<h5>
										Swatch sets{" "}
										<button
											onClick={() =>
												this.setState({ activeSelect: "swatches" })
											}
										>
											Select...
										</button>
									</h5>
									{swatchSets && (
										<div>
											{Object.entries(swatchSets).map(([key, value]) => {
												return (
													<div className={styles.row} key={key}>
														<SwatchGroup
															key={`imsw${key}`}
															swatch={value}
															isHorizontal
															role="presentation"
															onClickProps={() => this.removeSwatchSet(key)}
														/>
													</div>
												);
											})}
										</div>
									)}
								</div>
								<h3>Product Info</h3>
								<section>
									<div className={styles.contentItem}>
										<h5>Name</h5>
										<input
											type="text"
											name="name"
											value={imageData && imageData.name}
											ref={iName => {
												this.textInput = iName;
											}}
											onChange={this.handleInputChange}
										/>
									</div>
									<div className={styles.contentItem}>
										<h5>Slug</h5>
										<input
											type="text"
											name="slug"
											value={imageData && imageData.image}
											ref={iImage => {
												this.textInput = iImage;
											}}
											onChange={this.handleInputChange}
										/>
									</div>
									<div className={styles.contentItem}>
										<h5>Description</h5>
										<input
											type="text"
											name="description"
											value={imageData && imageData.description}
											ref={iDescription => {
												this.textInput = iDescription;
											}}
											onChange={this.handleInputChange}
										/>
									</div>
									<div className={styles.contentItem}>
										<h5>Updated</h5>
										<span>
											{imageData && imageData.modifiedDate.toString()}
										</span>
									</div>
								</section>

								{1 === 2 && (
									<section>
										<h3>Image Text</h3>
										<div className={styles.imageTextPreview}>
											{imageData && imageData.theTitle && (
												<h2>{imageData.theTitle}</h2>
											)}
											<h3>
												{imageData && imageData.theSubtitle1}
												{imageData && imageData.theSubtitle2 && (
													<span className={styles.divider} />
												)}
												{imageData && imageData.theSubtitle2}
											</h3>
										</div>
										<div className={styles.contentItem}>
											<h5>Title</h5>
											<input
												type="text"
												name="theTitle"
												value={imageData && imageData.theTitle}
												ref={theImageTitle => {
													this.textInput = theImageTitle;
												}}
												onChange={this.handleInputChange}
											/>
										</div>
										<div className={styles.contentItem}>
											<h5>Subtitle1</h5>
											<input
												type="text"
												name="theSubtitle1"
												value={imageData && imageData.theSubtitle1}
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
												value={imageData && imageData.theSubtitle2}
												ref={iSubtitle2 => {
													this.textInput = iSubtitle2;
												}}
												onChange={this.handleInputChange}
											/>
										</div>
									</section>
								)}
							</div>
						)}

						{/* ADJUSMTENT */}
						{activeControl === "adjustments" && (
							<section>
								<h3>Adjustments</h3>
								<div className={styles.contentItem}>
									<h5>TranslateX</h5>
									<span>{imageData && imageData.theTranslateX}</span>
								</div>
								<div className={styles.contentItem}>
									<h5>TranslateY</h5>
									<span>{imageData && imageData.theTranslateY}</span>
								</div>
								<div className={styles.contentItem}>
									<h5>Scale</h5>
									<span>{imageData && imageData.theScale}</span>
								</div>
								<div className={styles.contentItem}>
									<h5>Aspect</h5>
									<span>{imageData && imageData.aspect}</span>
								</div>
								<div className={styles.contentItem}>
									<h5>hasBackground</h5>
									<span>{imageData && imageData.hasBackground}</span>
								</div>
							</section>
						)}

						{/*SWATCHES*/}
						{activeControl === "swatches" && (
							<div>
								<h3>Swatches</h3>
								<section>
									<button
										onClick={() => this.setState({ activeSelect: "swatches" })}
									>
										Select Swatches
									</button>
								</section>
							</div>
						)}

						{/*RENDERS*/}
						{activeControl === "renders" && (
							<div>
								<h3>Renders</h3>
								<section>
									<div className={styles.switchWrap}>
										<Toggle
											className={styles.theToggle}
											id="doRenderToggle"
											defaultChecked={this.state.doRenders}
											onChange={this.toggleDoRenders}
										/>
										<label htmlFor="doRenderToggle">Render on Change</label>
									</div>
									<div className={styles.switchWrap}>
										<Toggle
											className={styles.theToggle}
											id="doSaveToggle"
											defaultChecked={this.state.doSave}
											onChange={this.toggleDoSave}
										/>
										<label htmlFor="doSaveToggle">Save on render</label>
									</div>
									<h4>Type</h4>
									<div className={styles.switchWrap}>
										<Toggle
											className={styles.theToggle}
											id="doRenderPrintToggle"
											defaultChecked={this.state.doRenderPrint}
											onChange={this.toggleDoRenderPrint}
										/>
										<label htmlFor="doRenderPrintToggle">
											Render Print Versions
										</label>
									</div>
									<div className={styles.switchWrap}>
										<Toggle
											className={styles.theToggle}
											id="doRenderPreviewToggle"
											defaultChecked={this.state.doRenderPreview}
											onChange={this.toggleDoRenderPreview}
										/>
										<label htmlFor="doRenderPreviewToggle">
											Render Preview Versions
										</label>
									</div>
									<div className={styles.switchWrap}>
										<Toggle
											className={styles.theToggle}
											id="doRenderPromoToggle"
											defaultChecked={this.state.doRenderPromo}
											onChange={this.toggleDoRenderPromo}
										/>
										<label htmlFor="doRenderPromoToggle">
											Show Promo Versions
										</label>
									</div>
									<div>
										<h5>optional</h5>
										<button onClick={() => this.doRenders()}>Render All</button>
										<button onClick={() => this.combinations()}>
											Reset Combinations
										</button>
									</div>
								</section>
								{doRenderPreview && (
									<section>
										<h3>Preview Renders</h3>
										{!isLoadingSource &&
											imageData &&
											sourceSvgBlob &&
											sourceSvgData &&
											(sourceSvgData.adjustmentSets || adjustmentSets) &&
											// sourceSvgData.adjustmentSets &&
											renderCombinations &&
											swatchSets &&
											// Object.entries(swatchSets).map(([key, value]) => {
											renderCombinations.map(combo => {
												// [0] = aspect
												// [1] = adjustment
												// [2] = swatch
												// console.log("render combo: ", combo);
												const willRender =
													(combo[1].data.scope &&
														combo[1].data.scope === "all") ||
													combo[1].data.scope === combo[0].name ||
													!combo[1].data.scope;
												// console.log("willRender: ", willRender);
												const thisKey = `PREVIEW_${combo[0].name}
														${combo[1].name}
														${combo[2].name}`;
												return willRender ? (
													<div key={thisKey}>
														<RenderImage
															productId={imageId}
															productName={imageData.name}
															doSave={doSave}
															doRender={doRenders}
															displayMode="mini"
															sourceSvg={sourceSvgBlob}
															hasTitles={combo[0].name === "circle"}
															// svgBackgroundColor={svgBackgroundColor}
															aspect={combo[0].name}
															mode="medium"
															hasFrame={false}
															scale={combo[1].data.theScale || 1}
															translateX={combo[1].data.translateX || 0}
															translateY={combo[1].data.translateY || 0}
															theTitle={theTitle}
															theSubtitle1={theSubtitle1}
															theSubtitle2={theSubtitle2}
															adjustmentName={combo[1].name}
															swatchName={combo[2].data.name}
															imageColorArray={
																combo[2].data.swatchColorArray ||
																combo[2].data.pairColorArray
															}
															onAssignRender={this.doAssignRenderToProduct}
														/>
													</div>
												) : (
													<div>NOPE</div>
												);
											})}
									</section>
								)}
								{doRenderPrint && (
									<section>
										<h3>Print Renders</h3>
										{!isLoadingSource &&
											imageData &&
											sourceSvgBlob &&
											sourceSvgData &&
											// sourceSvgData.adjustmentSets &&
											renderCombinations &&
											swatchSets &&
											// Object.entries(swatchSets).map(([key, value]) => {
											renderCombinations.map(combo => {
												// [0] = aspect
												// [1] = adjustment
												// [2] = swatch
												// console.log("render combo: ", combo);
												const willRender =
													(combo[1].data.scope &&
														combo[1].data.scope === "all") ||
													combo[1].data.scope === combo[0].name ||
													!combo[1].data.scope;
												// console.log("willRender: ", willRender);
												const thisKey = `PRINT_${combo[0].name}
														${combo[1].name}
														${combo[2].name}`;
												return willRender ? (
													<div key={thisKey}>
														<RenderImage
															productId={imageId}
															productName={imageData.name}
															doSave={doSave}
															doRender={doRenders}
															displayMode="mini"
															sourceSvg={sourceSvgBlob}
															hasTitles={combo[0].name === "circle"}
															svgBackgroundColor="#fff"
															aspect={combo[0].name}
															mode="print"
															hasFrame={false}
															scale={combo[1].data.theScale || 1}
															translateX={combo[1].data.translateX || 0}
															translateY={combo[1].data.translateY || 0}
															theTitle={theTitle}
															theSubtitle1={theSubtitle1}
															theSubtitle2={theSubtitle2}
															adjustmentName={combo[1].name}
															swatchName={combo[2].data.name}
															imageColorArray={
																combo[2].data.swatchColorArray ||
																combo[2].data.pairColorArray
															}
														/>
													</div>
												) : (
													<div>NOPE</div>
												);
											})}
									</section>
								)}

								{doRenderPromo && (
									<section>
										{!isLoading && sourceSvgBlob && (
											<div>
												<h4>PROMOTIONAL:</h4>
												<p>Includes grey backgrounds and/or frames</p>
												<RenderImage
													productId={imageId}
													productName={imageData.name}
													key="renderMediumPortraitBackgroundNoPaper"
													doSave={false}
													doRender={doRenders}
													sourceSvg={sourceSvgBlob}
													// svgBackgroundColor={svgBackgroundColor}
													aspect="portrait"
													mode="medium"
													hasFrame={false}
													hasBackground
													hasPaper={false}
													hasTitles={false}
													// scale={theScale}
													// translateX={theTranslateX}
													// translateY={theTranslateY}
													// theTitle={theTitle}
													// theSubtitle1={theSubtitle1}
													// theSubtitle2={theSubtitle2}
													// imageColorArray={swatchColorArray || pairColorArray}
													swatchName="test"
													adjustmentName="none"
													imageColorArray={[
														"hsl(100, 14.285714285714288%, 15%)",
														"hsl(100, 14.285714285714288%, 35%)",
														"hsl(100, 14.285714285714288%, 50%)",
														"hsl(100, 14.285714285714288%, 65%)",
														"hsl(100, 14.285714285714288%, 85%)"
													]}
												/>
												<RenderImage
													productId={imageId}
													productName={imageData.name}
													key="renderMediumPortraitBackgroundPaper"
													doSave={false}
													doRender={doRenders}
													sourceSvg={sourceSvgBlob}
													// svgBackgroundColor={svgBackgroundColor}
													aspect="portrait"
													mode="medium"
													hasFrame={false}
													hasBackground
													hasPaper
													hasScene
													scene="bluePillows"
													hasTitles={false}
													// scale={theScale}
													// translateX={theTranslateX}
													// translateY={theTranslateY}
													// theTitle={theTitle}
													// theSubtitle1={theSubtitle1}
													// theSubtitle2={theSubtitle2}
													// imageColorArray={swatchColorArray || pairColorArray}
													swatchName="test"
													adjustmentName="none"
													imageColorArray={[
														//  "hsl(100, 14.285714285714288%, 15%)",
														// "hsl(100, 14.285714285714288%, 35%)",
														// "hsl(100, 14.285714285714288%, 50%)",
														// "hsl(100, 14.285714285714288%, 65%)",
														// "hsl(100, 14.285714285714288%, 85%)"
														"hsl(206.7146974063401, 32%, 23%)",
														"hsl(206.7146974063401, 32%, 35%)",
														"hsl(206.7146974063401, 32%, 50%)",
														"hsl(206.7146974063401, 32%, 65%)",
														"hsl(206.7146974063401, 32%, 85%)"
													]}
												/>
												<RenderImage
													productId={imageId}
													productName={imageData.name}
													key="renderMediumPortraitBackground"
													doSave={false}
													doRender={doRenders}
													sourceSvg={sourceSvgBlob}
													hasTitles
													// svgBackgroundColor={svgBackgroundColor}
													aspect="circle"
													mode="medium"
													hasFrame={false}
													hasPaper
													hasBackground
													// scale={theScale}
													// translateX={theTranslateX}
													// translateY={theTranslateY}
													theTitle={theTitle}
													theSubtitle1={theSubtitle1}
													theSubtitle2={theSubtitle2}
													// imageColorArray={swatchColorArray || pairColorArray}
													swatchName="test"
													adjustmentName="none"
													imageColorArray={[
														"hsl(22.85714285714286, 16.660000000000004%, 18%)",
														"hsl(222.85714285714286, 16.660000000000004%, 35%)",
														"hsl(222.85714285714286, 16.660000000000004%, 50%)",
														"hsl(222.85714285714286, 16.660000000000004%, 65%)",
														"hsl(222.85714285714286, 16.660000000000004%, 84%)"
													]}
												/>

												<RenderImage
													productId={imageId}
													productName={imageData.name}
													key="renderMediumCircle"
													doSave={false}
													doRender={doRenders}
													displayMode="mini"
													sourceSvg={sourceSvgBlob}
													hasTitles
													aspect="landscape"
													mode="medium"
													hasFrame={false}
													// hasBackground
													// scale={theScale}
													// translateX={theTranslateX}
													// translateY={theTranslateY}
													theTitle={theTitle}
													theSubtitle1={theSubtitle1}
													theSubtitle2={theSubtitle2}
													// imageColorArray={swatchColorArray || pairColorArray}
													swatchName="test"
													imageColorArray={[
														"hsl(100, 14.285714285714288%, 15%)",
														"hsl(100, 14.285714285714288%, 35%)",
														"hsl(100, 14.285714285714288%, 50%)",
														"hsl(100, 14.285714285714288%, 65%)",
														"hsl(100, 14.285714285714288%, 85%)"
													]}
												/>
											</div>
										)}
									</section>
								)}
							</div>
						)}

						<hr />
						<button
              onClick={() => this.saveImage()} // eslint-disable-line
						>
							Save
						</button>
					</div>

					{/*
					 * ////////////////////////////////
					 * // COLUMN 2
					 * ////////////////////////////////
					 */}
					<div className={styles.column}>
						{/*DEFAULT*/}
						{(activeSelect === "preview" || activeSelect === "") && (
							<div>
								<h3>Previews</h3>
								<div>
									<button
										onClick={() =>
											this.combinations([["1", "2"], ["a", "b", "c"]])
										}
									>
										render Previews
									</button>
								</div>
								{isLoadingSource && (
									<div>
										<Loading />
										loading source blob
									</div>
								)}
								{!isLoadingSource &&
									sourceSvgData &&
									Object.keys(swatchSets).length === 0 && (
										<div className={`${styles.message} ${styles.error}`}>
											No swatches applied: {Object.keys(swatchSets).length}
										</div>
									)}
								<div
									style={{
										display: "flex",
										flexWrap: "wrap",
										justifyContent: "flex-start"
									}}
								>
									{!isLoadingSource &&
										sourceSvgData &&
										(sourceSvgData.adjustmentSets || adjustmentSets) &&
										sourceSvgBlob &&
										renderCombinations &&
										renderCombinations.map(combo => {
											// [0] = aspect
											// [1] = adjustment
											// [2] = swatch
											// console.log("combo: ", combo);
											const isNewAspect = currentComboName !== combo[0].name;
											const willRender =
												(combo[1].data.scope &&
													combo[1].data.scope === "all") ||
												combo[1].data.scope === combo[0].name ||
												!combo[1].data.scope;
											// console.log("willRender: ", willRender);
											// console.log('isNewAspect: ', isNewAspect);
											currentComboName = combo[0].name;
											return isNewAspect ? (
												<div
													style={{ flexBasis: "100%" }}
													key={`${combo[0].name}
														${combo[1].name}
														${combo[2].name}`}
												>
													<h3>{combo[0].name}</h3>
												</div>
											) : (
												<div
													style={{
														display: "flex",
														margin: "8px",
														flexBasis: `${isNewAspect ? "100%" : "100px"}`
													}}
													key={`${combo[0].name}
														${combo[1].name}
														${combo[2].name}`}
												>
													{!willRender && (
														<span>Skipped: adjustment not in scope</span>
													)}
													{willRender && (
														<div>
															<DisplayImage
																sourceSvg={sourceSvgBlob}
																aspect={combo[0].name}
																hasFrame={false}
																mode="preview"
																hasTitles={combo[0].name === "circle"}
																scale={combo[1].data.theScale || 1}
																translateX={combo[1].data.translateX || 0}
																translateY={combo[1].data.translateY || 0}
																theTitle={theTitle}
																theSubtitle1={theSubtitle1}
																theSubtitle2={theSubtitle2}
																imageColorArray={
																	combo[2].data.swatchColorArray ||
																	combo[2].data.pairColorArray
																}
															/>
															<div style={{ padding: "8px" }}>
																<div>
																	<h5>
																		<strong>
																			{willRender ? "Will render" : "NOT"}
																		</strong>
																	</h5>
																</div>
																<div>
																	<h5>Aspect:</h5>
																	<span>{combo[0].name}</span>
																</div>
																<div>
																	<h5>Adjustment</h5> {combo[1].name}
																</div>
																<div>
																	<h5>Scope</h5>
																	{combo[1].data.scope || "-"}
																</div>
																<div>
																	<h5>Swatch</h5>
																	{combo[2].data.name}
																</div>
															</div>
														</div>
													)}
												</div>
											);
										})}
								</div>
							</div>
						)}
						{/*SVG*/}
						{activeSelect === "svg" && (
							<div>
								<div className={styles.row}>
									<button onClick={() => this.setState({ activeSelect: "" })}>
										Cancel
									</button>
									{tempSelectedSvg && (
										<button
											onClick={() => this.setSelectedSvg(tempSelectedSvg)}
										>
											Assign
										</button>
									)}
								</div>
								{!isLoadingSvg &&
									dataSources &&
									dataSources.map(svg => {
										return (
											<div
												key={`image${svg.id}`}
												role="presentation"
												className={classNames(styles.svgItem, {
													[styles.isSelected]: tempSelectedSvg === svg.id
												})}
											>
												<div>
													<div className={styles.svgIcon}>svg</div>
													{svg.data.filename}
												</div>
												<div>{svg.data.size && `${svg.data.size}b`}</div>
												<div className={styles.buttonWrap}>
													<button
														className={styles.edit}
														onClick={() => this.selectSvg(svg.id)}
													>
														select
													</button>
													<button
														className={styles.edit}
														onClick={() =>
															this.doRoute(
																"edit/remote",
																svg.data.slug,
																svg.data.filename,
																svg.id
															)
                            } // eslint-disable-line
													>
														edit
													</button>
												</div>
											</div>
										);
									})}
							</div>
						)}
						{/*SWATCHES*/}
						{activeSelect === "swatches" && (
							<div>
								<div className={styles.row}>
									<button onClick={() => this.setState({ activeSelect: "" })}>
										Cancel
									</button>
								</div>
								{isLoadingSwatches && (
									<div>
										<Loading />
										loading swatches
									</div>
								)}
								{dataSwatches &&
									dataSwatches.map(swatch => {
										return (
											<div style={{ display: "flex" }} key={swatch.id}>
												<SwatchGroup
													key={`img${swatch.id}`}
													swatch={swatch.data}
													isHorizontal
													isFav={swatch.data.isFav}
													role="presentation"
													onClickProps={() => this.addSwatch(swatch.id)}
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
											</div>
										);
									})}
							</div>
						)}
						{/*RENDERs files*/}
						{activeControl === "renders" && (
							<div>
								<button
									className={styles.btn}
									onClick={() => this.getAvailableRenders(imageId)}
								>
									reload renders
								</button>
								<h3>Preview Render</h3>
								{imageRenders &&
									Object.entries(imageRenders).map(([key, value]) => {
										/*
										console.log(
											"imagerender key: ",
											key,
											" and value: ",
											value
										);
*/
										return (
											<div
												className={`${styles.row} ${styles.renderRow}`}
												key={key}
											>
												<div className={styles.column}>
													<span>
														<a
															href={value}
															target="_blank"
															rel="noopener noreferrer"
														>
															{key}
														</a>
													</span>{" "}
												</div>
												<div>
													<button onClick={() => this.removeRender(key)}>
														delete
													</button>
												</div>
											</div>
										);
									})}
								<h3>Temp Selected Renders</h3>
								{tempSelectedRenders && (
									<div>
										{tempSelectedRenders.map(renderId => (
											<div key={renderId}>{renderId}</div>
										))}
									</div>
								)}

								<h3>Assigned Renders</h3>
								{currentRendersArray &&
									currentRendersArray.map(render => {
										return (
											<div
												key={`imageRef${render}`}
												className={`${styles.listItem} ${styles.row}`}
												// onClick={() => this.toggleIncludeRender(file.id)}
												role="presentation"
											>
												<div className={styles.column}>{render}</div>
											</div>
										);
									})}
								{!currentRendersArray && <div>None</div>}
								<h3>Available renders</h3>
								{filesArray && (
									<div
										className={`${styles.listItem} ${styles.row} ${
											styles.listHeader
										}`}
									>
										{/*<div className={styles.column}>ProductId/slug</div>*/}
										<div className={styles.column}>Select</div>
										<div className={styles.column}>Aspect</div>
										<div className={styles.column}>Mode</div>
										<div className={styles.column}>Swatch</div>
										<div className={styles.column}>renderId</div>
										<div className={styles.column}>Modified</div>
										<div className={`${styles.column} ${styles.actions}`}>
											Action
										</div>
									</div>
								)}
								{filesArray &&
									filesArray.map(file => {
										// console.log("file: ", file);
										// console.log("does it include? ",currentRendersArray.includes(file.id));
										return (
											<div
												key={`imageRef${file.id}`}
												className={`${styles.listItem} ${styles.row} ${
													currentRendersArray.includes(file.id)
														? styles.isActive
														: ""
												}`}
												// onClick={() => this.toggleIncludeRender(file.id)}
												// role="presentation"
											>
												{/*<div className={styles.column}>
													{file.data && file.data.slug}
													{file.data &&
														file.data.thumbnail &&
														file.data.thumbnail.aspect && (
															<span> : {file.data.thumbnail.aspect}</span>
														)}
												</div>
												*/}
												<div className={styles.column}>
													<div
														className={`${styles.fakeSelectBox} ${
															this.filterTempRenderArray(
																tempSelectedRenders,
																file.id
															)
																? styles.isSelected
																: ""
														}`}
														onClick={() => this.selectRender(file.id)}
													/>
												</div>
												<div className={styles.column}>
													{file.data && file.data.aspect
														? file.data.aspect
														: "-"}
												</div>
												<div className={styles.column}>
													{file.data && file.data.mode ? file.data.mode : "-"}
												</div>
												<div className={styles.column}>
													{file.data && file.data.swatchName
														? file.data.swatchName
														: "-"}
												</div>
												<div className={styles.column}>
													<a
														href={file.data.downloadUrl}
														target="_blank"
														rel="noopener noreferrer"
													>
														{file.adjustmentName || "open"}
													</a>
												</div>
												<div className={styles.column}>
													{
														//file.data && file.data.modifiedDate.toString()
													}
													{distanceInWords(file.data.modifiedDate, new Date())}{" "}
													ago
												</div>
												<div className={`${styles.column} ${styles.actions}`}>
													<button
														className={styles.btn}
														onClick={() => this.toggleIncludeRender(file.id)}
													>
														{currentRendersArray.includes(file.id)
															? "Remove"
															: "Assign"}
													</button>
													<button
														className={styles.btn}
														onClick={() => this.toggleRenderInfo(file.id)}
													>
														Info
													</button>
													<button
														className={`{styles.btn} ${styles.delete}`}
														onClick={() => this.deleteRender(file.id)}
													>
														Delete
													</button>
												</div>
												{showRenderDetail === file.id && (
													<div className={`${styles.column} ${styles.detail}`}>
														<div className={styles.row}>
															<div className={`${styles.column} ${styles.key}`}>
																Filename
															</div>
															<div
																className={`${styles.column} ${styles.value}`}
															>
																<a
																	href={file.data.downloadUrl}
																	target="_blank"
																	rel="noopener noreferrer"
																>
																	{file.id}
																</a>
															</div>
														</div>
														<div className={styles.row}>
															<div className={`${styles.column} ${styles.key}`}>
																Mockup
															</div>
															<div
																className={`${styles.column} ${styles.value}`}
															>
																<button
																	className={styles.btn}
																	onClick={() =>
																		this.beginGenerateMockup(file.id)
																	}
																>
																	Generate
																</button>
																{generatingId && generatingId === file.id && (
																	<button
																		className={styles.btn}
																		onClick={() =>
																			this.checkMockupGeneration(
																				file.id,
																				generatingKey
																			)
																		}
																	>
																		check: {generatingStatus}
																	</button>
																)}
															</div>
														</div>
													</div>
												)}
											</div>
										);
									})}
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}

	// FUCNTIONS
	getImage() {
		const {
			imageId = (this.props.location.state &&
				this.props.location.state.imageId) ||
				"milfordSound"
		} = this.props;
		const imageRef = fbase.collection("images").doc(imageId);
		imageRef
			.get()
			.then(doc => {
				if (doc.exists) {
					console.log("Document data:", doc.data());
					this.setState({
						isLoadingImageData: false,
						imageData: doc.data(),
						selectedSvg: doc.data().svgId,
						swatchSets: doc.data().swatchSets,
						imageRenders: doc.data().imageRenders
					});
					this.getAvailableRenders(imageId);
					this.getImageRenders(imageId);
					this.getSvgData(doc.data().svgId);
				} else {
					console.log("No such document!");
					this.state({
						isLoadingImageData: false
					});
				}
			})
			.catch(error => {
				console.log("Error getting document:", error);
			});
	}

	getSvgData(svgId) {
		const svgRef = fbase.collection("svg").doc(`${svgId}`);
		svgRef
			.get()
			.then(querySnapshot => {
				if (querySnapshot.exists) {
					console.log("svg data: ", querySnapshot.data());
					const sourceSvgData = querySnapshot.data();
					this.setState({
						isLoadingSvgData: false,
						sourceSvgData,
						theTitle: sourceSvgData.theTitle,
						theSubtitle1: sourceSvgData.theSubtitle1,
						theSubtitle2: sourceSvgData.theSubtitle2
					});
					console.log(
						"querySnapshot.data().filename",
						querySnapshot.data().filename
					);
					if (querySnapshot.data().filename) {
						this.getSvgSource(querySnapshot.data().filename);
					}
				} else {
					this.state({
						isLoadingSvgData: false
					});
				}
			})
			.catch(error => {
				console.log("Error getting svg: ", error);
			});
	}

	getSvgSource = filename => {
		if (!filename) {
			console.error("no filename");
			return false;
		}
		this.setState({ isLoadingSvg: true });
		// console.log("imageId: ", imageId);
		// console.log("filename: ", filename);

		const fStorage = firebase.storage();
		const storageLocation = "svg";
		const storageRef = fStorage.ref().child(storageLocation);
		// const fileRef = storageRef.child(filename);

		return storageRef
			.child(filename)
			.getDownloadURL()
			.then(url => {
				const xhr = new XMLHttpRequest();
				xhr.responseType = "";
				xhr.onload = event => {
					const blob = xhr.response;
					// console.log("XHR event", event);
					this.setState({
						sourceSvgBlob: blob,
						isLoadingSource: false,
						xhrEvent: event
						// sourceSvg: url
					});
				};
				xhr.open("GET", url);
				xhr.send();
				// console.log("xhr: ", xhr);

				this.setState({
					isLoadingSvg: false
				});
			})
			.catch(error => {
				// Handle any errors
				console.log("error: ", error);
				this.setState({
					isLoadingSource: false
				});
			});
	};

	handleInputChange = event => {
		const { target } = event;
		const value = target.type === "checkbox" ? target.checked : target.value;
		const { name } = target;
		const tempImageData = { ...this.state.imageData };
		tempImageData[name] = value;
		this.setState({
			imageData: tempImageData
		});
		setTimeout(() => {
			this.saveImage();
		}, 1000);
	};

	saveImage() {
		const currentDateTime = new Date();
		const {
			imageId = (this.props.location.state &&
				this.props.location.state.imageId) ||
				"milfordSound"
		} = this.props;
		const { imageData } = this.state;
		console.log("imageData", imageData);
		fbase
			.collection("images")
			.doc(imageId)
			.update({
				name: imageData.name || imageData.slug,
				modifiedDate: currentDateTime
			}) // , { merge: true }
			.then(() => {
				console.log("Document successfully written!");
				this.setState({
					isUpdated: true,
					isError: false
				});
				setTimeout(() => {
					this.setState({
						isUpdated: false
					});
				}, 2000);
			})
			.catch(error => {
				console.error("Error writing document: ", error);
				this.setState({
					isUpdated: false,
					isError: true
				});
			});
	}

	////////////////////////////////////////
	// RENDERS (TO REFACTOR)
	////////////////////////////////////////

	doAssignRenderToProduct = (fileName, url, isPreview) => {
		const {
			productName,
			imageId = this.props.location.state && this.props.location.state.imageId
		} = this.props;
		console.log("productId, productName: ", imageId, productName);
		const obj = {
			[fileName]: url
		};
		console.log("this will assign url to imageId: ", imageId, url, obj);
		const currentDateTime = new Date();

		fbase
			.collection("images")
			.doc(imageId)
			.update({
				modifiedDate: currentDateTime,
				imageRenders: obj,
				preview: isPreview ? url : ""
			}) // , { merge: true }
			.then(() => {
				console.log("Document successfully written!");
				this.setState({
					isSaving: false,
					isUpdated: true,
					isError: false,
					imageRenders: obj,
					preview: isPreview ? url : ""
				});
				setTimeout(() => {
					this.setState({
						isUpdated: false
					});
				}, 2000);
			})
			.catch(error => {
				console.error("Error writing document: ", error);
				this.setState({
					isSaving: false,
					isUpdated: false,
					isError: true
				});
			});
	};

	////////////////////////////////////
	//// OLD RENDER STUFF
	////////////////////////////////////

	getAvailableRenders(productId) {
		const filesRef = fbase.collection("renders").where("slug", "==", productId);
		const filesArray = [];
		filesRef
			.get()
			.then(querySnapshot => {
				querySnapshot.forEach(doc => {
					const tempThing = {};
					tempThing.id = doc.id;
					tempThing.data = doc.data();
					filesArray.push(tempThing);
				});
				this.setState({
					filesArray
				});
			})
			.catch(error => {
				console.log("Error getting documents: ", error);
			});
	}

	getImageRenders(productId) {
		const rendersRef = fbase
			.collection("images")
			.doc(productId)
			.collection("renders");
		const currentRendersArray = [];
		rendersRef
			.get()
			.then(querySnapshot => {
				querySnapshot.forEach(doc => {
					// console.log(doc);
					const tempThing = {};
					tempThing.renderId = doc.id;
					currentRendersArray.push(doc.id);
				});
				this.setState({
					currentRendersArray
				});
				this.combinations();
			})
			.catch(error => {
				console.log("Error getting documents: ", error);
			});
	}

	toggleIncludeRender(renderId) {
		const { currentRendersArray } = this.state;
		const {
			imageId = (this.props.location.state &&
				this.props.location.state.imageId) ||
				"milfordSound"
		} = this.props;
		const renderObj = { renderId, test: "bbb" };
		const imageRef = fbase
			.collection("images")
			.doc(imageId)
			.collection("renders")
			.doc(renderId);
		this.setState({
			isAdding: true
		});
		if (currentRendersArray.includes(renderId)) {
			const currentRendersArrayTemp = currentRendersArray.slice();
			const index = currentRendersArrayTemp.findIndex(o => {
				return o === renderId;
			});
			if (index !== -1) {
				currentRendersArrayTemp.splice(index, 1);
			}
			imageRef
				.delete()
				.then(() => {
					this.setState({
						isUpdated: true,
						isAdding: false,
						currentRendersArray: currentRendersArrayTemp
					});
					setTimeout(() => {
						this.setState({
							isUpdated: false
						});
					}, 2000);
				})
				.catch(error => {
					console.error("Error removing document: ", error);
					this.setState({
						isAdding: false,
						isError: true
					});
				});
		} else {
			imageRef
				.set(renderObj, { merge: true })
				.then(() => {
					const currentRendersArrayTemp = currentRendersArray.slice();
					currentRendersArrayTemp.push(renderId);
					this.setState({
						isUpdated: true,
						isAdding: false,
						currentRendersArray: currentRendersArrayTemp
					});
					setTimeout(() => {
						this.setState({
							isUpdated: false
						});
					}, 2000);
				})
				.catch(error => {
					console.error("Error writing document: ", error);
					this.setState({
						isAdding: false,
						isError: true
					});
				});
		}
	}

	selectRender = renderId => {
		console.log("renderId: ", renderId);
		const { tempSelectedRenders } = this.state;
		const existingIndex = tempSelectedRenders.findIndex(o => {
			return o === renderId;
		});

		if (existingIndex !== -1) {
			// exists, so we need to remove it.
			console.log("tempSelectedRenders: ", tempSelectedRenders);
			console.log(
				"exists so we need to remove it. existing index: ",
				existingIndex
			);
			console.log("spliced array: ", tempSelectedRenders.slice());
			const currentRendersArrayTemp = tempSelectedRenders.slice();
			currentRendersArrayTemp.splice(existingIndex, 1);
			this.setState({
				tempSelectedRenders: currentRendersArrayTemp
			});
		} else {
			this.setState(prevState => ({
				tempSelectedRenders: [...prevState.tempSelectedRenders, renderId]
			}));
		}
	};

	filterTempRenderArray = (tempRenders, renderId) => {
		if (!tempRenders || !renderId) {
			console.log("missing id or swatches");
			return false;
		}
		const selected = tempRenders.filter(thisItem => thisItem === renderId);
		return selected.length > 0;
	};

	deleteRender = renderId => {
		const {
			imageId = (this.props.location.state &&
				this.props.location.state.imageId) ||
				"milfordSound"
		} = this.props;
		if (!renderId || !imageId) {
			return false;
		}
		const renderRef = fbase
			// .collection("images")
			// .doc(imageId)
			.collection("renders")
			.doc(renderId);
		console.log("renderref:", renderRef);
		console.log("todelete renderid and productId: ", renderId, imageId);

		return renderRef
			.delete()
			.then(() => {
				this.setState({
					isUpdated: true,
					isAdding: false
				});
				setTimeout(() => {
					this.setState({
						isUpdated: false
					});
				}, 2000);
			})
			.catch(error => {
				console.error("Error removing document: ", error);
				this.setState({
					isAdding: false,
					isError: true
				});
			});
	};

	toggleRenderInfo = renderId => {
		this.setState({
			showRenderDetail: renderId
		});
	};

	// GENERATING MOCKUPS

	beginGenerateMockup = renderId => {
		console.log("this would start generation for: ", renderId);
		// https://api.printful.com/mockup-generator/create-task/171
		const bodyObj = {
			variant_ids: [6876, 6880, 7845],
			format: "jpg",
			files: [
				{
					placement: "default",
					image_url:
						"https://cdn.shopify.com/s/files/1/2477/7864/products/MflOzOcJTIGISpbRtW7c_Auckland-One-Tree-Hill_R-Artemis_Circlrcrop_circle_pri_mockup_Person_Person_12x18_84f19493-12d0-4399-a5aa-f6c549205922_360x.jpg?v=1545132007"
				}
			]
		};
		return this.fetchData2("mockup-generator/create-task/171", bodyObj).then(
			data => {
				console.log("data: ", data);
				if (data.code === 200) {
					this.setState({
						generatingId: renderId,
						generatingKey: data.result.task_key,
						generatingStatus: data.result.status
					});
				}
			}
		);
	};

	checkMockupGeneration = (renderId, generatingKey) => {
		console.log("checkMockupGeneration: ", renderId, generatingKey);
	};

	/////////////////////////
	// Selecting
	/////////////////////////
	selectSvg = svgId => {
		this.setState({
			tempSelectedSvg: svgId
		});
	};

	setSelectedSvg = svgId => {
		console.log("setSelectedSvg", svgId);
		const currentDateTime = new Date();
		// const currentDateTime2 = fbase.firestore.ServerValue.TIMESTAMP;
		// console.log('currentDateTime2', currentDateTime2);
		const imageId =
			this.props.location.state && this.props.location.state.imageId;
		console.log("imageId", imageId);
		const { imageData } = this.state;
		// console.log("imageData", imageData);
		if (!imageId) {
			console.log("no iamgeId");
			return "no iamge Id";
		}
		return fbase
			.collection("images")
			.doc(imageId)
			.update({
				svgId,
				name: imageData.name || imageData.slug || "",
				modifiedDate: currentDateTime
			}) // { merge: true }
			.then(() => {
				console.log("Document successfully written!");
				this.setState({
					isUpdated: true,
					isError: false,
					selectedSvg: svgId
				});
				this.getSvgData(svgId);
				setTimeout(() => {
					this.setState({
						isUpdated: false
					});
				}, 2000);
			})
			.catch(error => {
				console.error("Error writing document: ", error);
				this.setState({
					isUpdated: false,
					isError: true
				});
			});
	};
	//////////////////////////////
	// SWATCHES
	//////////////////////////////

	addSwatch = swatchId => {
		const imageId =
			this.props.location.state && this.props.location.state.imageId;
		if (!swatchId) {
			return "no swatch id";
		}
		const currentDateTime = new Date();
		const tempSwatchSets = this.state.swatchSets || {};
		const { dataSwatches } = this.props;
		console.log("tempSwatchSets", tempSwatchSets);
		console.log("swatchData", dataSwatches);
		const thisSwatch = this.filterSwatches(dataSwatches, swatchId);
		console.log("thisSwatch", thisSwatch);

		// tempImageData[name] = value;
		tempSwatchSets[thisSwatch.id] = thisSwatch.data;
		console.log(tempSwatchSets);

		return fbase
			.collection("images")
			.doc(imageId)
			.update({
				swatchSets: tempSwatchSets,
				modifiedDate: currentDateTime
			}) // { merge: true }
			.then(() => {
				console.log("Document successfully written!");
				this.setState({
					isUpdated: true,
					isError: false,
					swatchSets: tempSwatchSets
				});
				// this.getSvgData(svgId);
				setTimeout(() => {
					this.setState({
						isUpdated: false
					});
				}, 2000);
			})
			.catch(error => {
				console.error("Error writing document: ", error);
				this.setState({
					isUpdated: false,
					isError: true
				});
			});
	};

	removeSwatchSet = swatchId => {
		console.log("swatchSets remove: ", swatchId);

		const imageId =
			this.props.location.state && this.props.location.state.imageId;
		const currentDateTime = new Date();
		const { swatchSets } = this.state;
		delete swatchSets[swatchId];
		console.log("swatchSets after: ", swatchSets);
		this.setState({
			isSaving: true
		});
		if (!swatchId) {
			return "no svg Id";
		}
		return fbase
			.collection("images")
			.doc(imageId)
			.update({
				swatchSets,
				modifiedDate: currentDateTime
			})
			.then(docRef => {
				console.log(
					"swatchSets successfully updated!, with reference of: ",
					docRef
				);
				this.setState({
					isSaving: false,
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

	//
	// PRINTFUL
	//
	fetchData2 = (url, bodyObj) => {
		console.log("url, bodyObj: ", url, bodyObj);
		const body = JSON.stringify(bodyObj);
		console.log("body: ", body);
		const functionUrl = `${funtionBase}/printfulApi?endpoint=${url}&productId=171&url=${url}&bodyObj=${body}`;
		const options = {};
		this.setState({
			isError: false,
			isLoading: true
		});
		return fetch(functionUrl, options)
			.then(res => res.json())
			.then(response => {
				// console.log("response", response);
				if (response.statusCode === 200) {
					console.log("response.body", response.body);
					const objBody = JSON.parse(response.body);
					// const objBody = response.json();
					// const objBody = response.body;
					console.log("fetchdata2 objBody:", objBody);
					this.setState({
						isError: false,
						isLoading: false
					});
					return objBody;
				}
			})
			.catch(error => {
				console.error("error: ", error);
				console.log("error for fetch: ", error);
				this.setState({
					isError: true,
					isLoading: false
				});
			});
	};

	fetchData = () => {
		const { printfulApiKey } = AppConfig;
		// const base64Key = new Buffer(printfulApiKey).toString("base64");
		const base64Key = Buffer.from(printfulApiKey).toString("base64");
		console.log("base64key", base64Key);
		// Where we're fetching data from
		fetch(`https://api.printful.com/mockup-generator/create-task/171`, {
			method: "post",
			// mode: "no-cors",
			headers: {
				Authorization: `Basic ${base64Key}`
				// 'Content-Type': 'application/x-www-form-urlencoded'
			},
			// body: "A=1&B=2"
			body: {
				product_id: 171,
				variant_ids: [6876, 6880, 7845],
				format: "jpg",
				files: [
					{
						placement: "front",
						image_url:
							"https://firebasestorage.googleapis.com/v0/b/inkbig-717ee.appspot.com/o/renders%2FAucklandOneTreeHill_bluePeach_circle_medium.jpg?alt=media&token=2e88be10-bd2b-4c70-a360-d909f8656d63",
						position: {
							area_width: 1800,
							area_height: 2400,
							width: 1800,
							height: 1800,
							top: 300,
							left: 0
						}
					}
				]
			}
		})
			// We get the API response and receive data in JSON format...
			.then(response => {
				console.log("response", response);
				console.log("response.body", response.body);
				response.json();
			})
			// ...then we update the users state
			.then(data =>
				this.setState({
					users: data,
					isLoading: false
				})
			)
			// Catch any errors we hit and update the app
			.catch(error => {
				console.error("error: ", error);
				this.setState({ error, isLoading: false });
			});
	};

	//////////////////////////////
	// MISC
	//////////////////////////////

	toggleDoRenders = () => {
		this.setState({
			doRenders: !this.state.doRenders
		});
	};

	toggleDoSave = () => {
		this.setState({
			doSave: !this.state.doSave
		});
	};

	toggleDoRenderPrint = () => {
		if (!this.state.doRenderPrint && !this.state.imageData.name) {
			alert("no product name!");
		}
		this.setState({
			doRenderPrint: !this.state.doRenderPrint
		});
	};

	toggleDoRenderPreview = () => {
		if (!this.state.doRenderPreview && !this.state.imageData.name) {
			alert("no product name!");
		}
		this.setState({
			doRenderPreview: !this.state.doRenderPreview
		});
	};

	toggleDoRenderPromo = () => {
		if (!this.state.doRenderPromo && !this.state.imageData.name) {
			alert("no product name!");
		}
		this.setState({
			doRenderPromo: !this.state.doRenderPromo
		});
	};

	doRenders = () => {
		this.setState({
			doRenders: true
		});
	};

	doRoute = (route, name, filename, id) => {
		const theRoute = route === "edit/remote" ? "/edit/remote" : "/edit";
		const { history } = this.props;
		history.push({
			pathname: theRoute || "/edit",
			state: {
				image: name,
				filename,
				// colorObj,
				id,
				mode: route === "edit/remote" ? "remote" : "local"
			}
		});
	};

	filterSwatches = (swatches, swatchId) => {
		// console.log("filtering id: ", swatchId, " in swatches", swatches);
		if (!swatchId || !swatches) {
			console.log("missing id or swatches");
			return false;
		}
		const selected = swatches.filter(swatch => swatch.id === swatchId);
		console.log("selected: ", selected);
		return selected[0];
	};

	combinations() {
		// array
		// console.log('initial array: ', array);
		const { swatchSets, sourceSvgData } = this.state;
		const aspects = [
			{ type: "aspect", name: "circle" },
			{ type: "aspect", name: "portrait" }
		];
		// console.log("sourceSvgData: ", sourceSvgData);
		let adjustmentArray = [];
		const swatchSetArray = [];
		if (swatchSets) {
			Object.entries(swatchSets).map(([key, value]) => {
				// key,
				// console.log("key, value", key, value);
				//swatchSetArray[key] = value;
				// swatchSetArray[value.name] = value;
				const tempObj = {
					type: "swatch",
					name: key,
					data: value
				};
				swatchSetArray.push(tempObj);
				return swatchSetArray;
			});
		}
		// console.log("swatchSetArray", swatchSetArray);
		// console.log("swatchSetArraylength", swatchSetArray.length);
		/*
		const defaultAdjustmentSets = {
			noAdjustment: {
				theScale: 1.0,
				theTranslateX: 0,
				theTranslateY: 0,
				type: "adjustment",
				scope: "all",
				name: "noAdjustment"
			}
		};
*/
		const adjustmentSetSource =
			(sourceSvgData && sourceSvgData.adjustmentSets) || defaultAdjustmentSets;
		console.log("adjustmentSetSource", adjustmentSetSource);
		if (adjustmentSetSource) {
			console.log("sourceSvgData.adjustmentSets", adjustmentSetSource);
			Object.entries(adjustmentSetSource).map(([key, value]) => {
				console.log("adjustment key, value", key, value);
				const tempObj = {
					type: "adjustment",
					name: key,
					data: value,
					theScale: value.theScale,
					theTranslateX: value.theTranslateX,
					theTranslateY: value.theTranslateY
				};
				adjustmentArray.push(tempObj);
				return adjustmentArray;
			});
		}
		// console.log("adjustmentArray", adjustmentArray);
		// console.log("adjustmentArrayLength", adjustmentArray.length);
		const fallBackAdjustmentArray = [
			{
				type: "adjustment",
				name: "default",
				theScale: 1,
				theTranslateX: 0,
				theTranslateY: 0,
				data: { scope: "all", theScale: 1, theTranslateX: 0, theTranslateY: 0 }
			}
		];

		if (adjustmentArray.length === 0) {
			adjustmentArray = fallBackAdjustmentArray;
		}

		let array = [aspects, adjustmentArray, swatchSetArray];
		if (!array.length) {
			return [];
		}

		// wrap non-array values
		// e.g. ['x',['y','z']] becomes [['x'],['y','z']]
		array = array.map(item => {
			return item instanceof Array ? item : [item];
		});

		// internal recursive function
		function combine(list) {
			if (list.length === 1) {
				return list[0];
			}

			const prefixes = list[0];
			const combinations = combine(list.slice(1)); // recurse

			// produce a flat list of each of the current
			// set of values prepended to each combination
			// of the remaining sets.
			return prefixes.reduce((memo, prefix) => {
				return memo.concat(
					combinations.map(combination => {
						return [prefix].concat(combination);
					})
				);
			}, []);
		}
		// console.log("result: ", combine(array));
		this.setState({
			renderCombinations: combine(array)
		});
		return combine(array);
	}
}
/*
		this.setState({
			[name]: value
		});
*/
