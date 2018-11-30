import React, { Component } from "react";
import * as firebase from "firebase";
import classNames from "classnames";
import fbase from "../../firebase";
import Tick from "../../assets/icons/tick.svg";

import SwatchGroup from "../SwatchGroup/SwatchGroup";
import DisplayImage from "../DisplayImage/DisplayImage";
import Loading from "../Loading/Loading";

import styles from "./ImageAdmin.scss";

export default class ImageAdmin extends Component {
	state = {
		profile: {},
		loggedIn: false,
		filesArray: [],
		currentRendersArray: [],
		isLoadingSource: true,
		isLoadingSvgData: true,
		isLoadingImageData: true,
		isAdding: false,
		isEditing: false,
		isUpdated: false,
		isError: false,
		activeControl: "settings",
		activeSelect: "",
		selectedSvg: "",
		tempSelectedSvg: "",
		aspects: ["portrait", "circle"],
		adjustmentSets: [
			{ default: { theScale: 1, theTranslateX: 0, theTranslateY: 0 } }
		]
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
			imageData,
			isError,
			isUpdated,
			isAdding,
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
			theTitle,
			theSubtitle1,
			theSubtitle2,
			renderCombinations
		} = this.state;

		// console.log('state is', this.state);
		// console.log('props is', this.props);
		// console.log(imageId);
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
								onClick={() => this.setState({ activeControl: "settings" })}
								role="presentation"
							>
								Settings
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
								onClick={() => this.setState({ activeControl: "swatches" })}
								role="presentation"
							>
								swatches
							</div>
							<div
								className={classNames(styles.btn, {
									[styles.selected]: this.state.activeControl === "renders"
								})}
								onClick={() => this.setState({ activeControl: "renders" })}
								role="presentation"
							>
								renders
							</div>
						</div>
					</section>
				</div>
				<div className={styles.row}>
					<div className={`${styles.column} `}>
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

						{/*SETTINGS*/}
						{activeControl === "settings" && (
							<div>
								<h3>SVG source</h3>
								<section>
									{selectedSvg && <h5>Selevted Svg Id: {selectedSvg}</h5>}
									{isLoadingSvgData && (
										<div>
											<Loading />
										</div>
									)}
									{sourceSvgData && (
										<div>
											<h5>Source SVG</h5>
											<p>filename: {sourceSvgData.filename}</p>
										</div>
									)}
									{!sourceSvgData && (
										<div>
											<h5>No Source</h5>
											<button
												onClick={() => this.setState({ activeSelect: "svg" })}
											>
												Select SVG
											</button>
										</div>
									)}
								</section>
								<h3>Variations</h3>
								<div className={styles.variationList}>
									<h5>Aspects</h5>
									{aspects &&
										aspects.map(aspect => {
											return <div>{aspect}</div>;
										})}
									<h5>AdjustmentSets</h5>
									{sourceSvgData && sourceSvgData.adjustmentSets && (
										<div>
											{Object.entries(sourceSvgData.adjustmentSets).map(
												([key, value]) => {
													// console.log("setting key: ", key, " and value: ", value);
													return (
														<div className={styles.row} key={key}>
															<span>{key}</span>{" "}
															{/*<span>{activeAdjustmentSet === key && `Active`}</span>*/}
															{/*<button
														onClick={() => this.loadAdjustmentSet(key, value)}
													>
														load
													</button>
													*/}
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
															onClickProps={() => this.removeSwatch(swatch.id)}
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
						<hr />
						<button
              onClick={() => this.saveImage()} // eslint-disable-line
						>
							Save
						</button>
					</div>
					<div className={styles.column}>
						{/*DEFAULT*/}
						{(activeSelect === "preview" || activeSelect === "") && (
							<div>
								<h3>Previews</h3>
								{isLoadingSource && (
									<div>
										<Loading />
										loading source blob
									</div>
								)}
								{1 === 2 && swatchSets && (
									<div className={styles.row}>
										{Object.entries(swatchSets).map(([key, value]) => {
											return (
												<div key={key}>
													{!isLoadingSource && sourceSvgBlob && (
														<div
															className={styles.previewImageWrap}
															style={{ display: "inline-block" }}
														>
															<DisplayImage
																// file={mode === "local" && image}
																sourceSvg={sourceSvgBlob}
																// svgBackgroundColor={svgBackgroundColor}
																aspect="portrait"
																mode="thumbnail"
																hasTitles
																// hue={theHue}
																// saturation={theSaturation}
																// lightness={theLightness}
																// scale={theScale}
																// translateX={theTranslateX}
																// translateY={theTranslateY}
																theTitle={theTitle}
																theSubtitle1={theSubtitle1}
																theSubtitle2={theSubtitle2}
																imageColorArray={
																	value.swatchColorArray || value.pairColorArray
																}
															/>
														</div>
													)}
												</div>
											);
										})}
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
										sourceSvgBlob &&
										renderCombinations &&
										renderCombinations.map(combo => {
											// [0] = aspect
											// [1] = adjustment
											// [2] = swatch
											console.log("combo: ", combo);
											return (
												<div style={{ display: "flex", margin: "8px" }}>
													<DisplayImage
														sourceSvg={sourceSvgBlob}
														aspect={combo[0].name}
														hasFrame={false}
														mode="thumbnail"
														hasTitles={combo[0].name === "circle"}
														scale={combo[1].data.theScale || 1}
														translateX={combo[1].data.translateX || 1}
														translateY={combo[1].data.translateY || 1}
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
															<h5>Aspect:</h5>
															<span>{combo[0].name}</span>
														</div>
														<div>
															<h5>Adjustment</h5> {combo[1].name}
														</div>
														<div>
															<h5>Swatch</h5>
															{combo[2].data.name}
														</div>
													</div>
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
						{/*SVG*/}
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
											<SwatchGroup
												key={`img${swatch.id}`}
												swatch={swatch.data}
												isHorizontal
												role="presentation"
												onClickProps={() => this.addSwatch(swatch.id)}
											/>
										);
									})}
							</div>
						)}
						{/*RENDERS*/}
						{activeControl === "renders" && (
							<div>
								<h3>Current Renders</h3>
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
								<h3>Available renders</h3>
								{filesArray &&
									filesArray.map(file => {
										console.log(
											"does it include? ",
											currentRendersArray.includes(file.id)
										);
										return (
											<div
												key={`imageRef${file.id}`}
												className={`${styles.listItem} ${styles.row} ${
													currentRendersArray.includes(file.id)
														? styles.isActive
														: ""
												}`}
												onClick={() => this.toggleIncludeRender(file.id)}
												role="presentation"
											>
												<div className={styles.column}>
													{file.data && file.data.slug}
													{file.data &&
														file.data.thumbnail &&
														file.data.thumbnail.aspect && (
															<span> : {file.data.thumbnail.aspect}</span>
														)}
												</div>
												<div className={styles.column}>
													{file.data && file.data.thumbnail && (
														<img
															src={file.data.thumbnail.downloadURL}
															alt=""
															className={styles.thumbnail}
														/>
													)}
												</div>
												<div className={styles.column}>
													{file.data && file.data.name}
												</div>
												<div className={styles.column}>
													{file.data && file.data.images && "yes"}
												</div>
												<div className={styles.column}>{file.id}</div>
												<div className={styles.column}>
													{file.data && file.data.modifiedDate.toString()}
												</div>
											</div>
										);
									})}
							</div>
						)}
						<div>
							<button
								onClick={() => this.combinations([["1", "2"], ["a", "b", "c"]])}
							>
								render Previews
							</button>
						</div>
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
						swatchSets: doc.data().swatchSets
					});
					this.getAvailableFiles(doc.data().image); // image = imageid!
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
		console.log("this will load svg");
		if (!filename) {
			console.error("no filename");
			return false;
		}
		this.setState({ isLoadingSvg: true });
		// console.log("imageId: ", imageId);
		console.log("filename: ", filename);

		const fStorage = firebase.storage();
		const storageLocation = "svg";
		const storageRef = fStorage.ref().child(storageLocation);
		// const fileRef = storageRef.child(filename);

		storageRef
			.child(filename)
			.getDownloadURL()
			.then(url => {
				const xhr = new XMLHttpRequest();
				xhr.responseType = "";
				xhr.onload = event => {
					const blob = xhr.response;
					console.log("XHR event", event);
					this.setState({
						sourceSvgBlob: blob,
						isLoadingSource: false
						// sourceSvg: url
					});
				};
				xhr.open("GET", url);
				xhr.send();

				console.log("xhr: ", xhr);

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

	getAvailableFiles(imageId) {
		const filesRef = fbase.collection("renders").where("slug", "==", imageId);
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

	getImageRenders(imageId) {
		const rendersRef = fbase
			.collection("images")
			.doc(imageId)
			.collection("renders");
		const currentRendersArray = [];
		rendersRef
			.get()
			.then(querySnapshot => {
				querySnapshot.forEach(doc => {
					console.log(doc);
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

	handleInputChange = event => {
		const target = event.target;
		const value = target.type === "checkbox" ? target.checked : target.value;
		const name = target.name;
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
		fbase
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

		fbase
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

	// MISC
	doRoute = (route, name, filename, id) => {
		const theRoute = route === "edit/remote" ? "/edit/remote" : "/edit";
		const { history } = this.props;
		history.push({
			pathname: theRoute || "/edit",
			state: {
				image: name,
				filename,
				colorObj,
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

		const adjustmentArray = [];
		const swatchSetArray = [];
		if (swatchSets) {
			console.log("swatchSets", swatchSets);
			Object.entries(swatchSets).map(([key, value]) => {
				console.log("key, value", key, value);
				swatchSetArray[key] = value;
				const tempObj = {
					type: "swatch",
					name: key,
					data: value
				};
				swatchSetArray.push(tempObj);
			});
		}
		const adjustmentSetSource =
			(sourceSvgData && sourceSvgData.adjustmentSets) ||
			this.state.adjustmentSets;
		if (adjustmentSetSource) {
			console.log("sourceSvgData.adjustmentSets", adjustmentSetSource);
			Object.entries(adjustmentSetSource).map(([key, value]) => {
				// console.log('key, value', key, value);
				const tempObj = {
					type: "adjustment",
					name: key,
					data: value,
					theScale: value.theScale,
					theTranslateX: value.theTranslateX,
					theTranslateY: value.theTranslateY
				};
				adjustmentArray.push(tempObj);
			});
		}
		console.log("swatchSetArray", swatchSetArray);
		console.log("swatchSetArraylength", swatchSetArray.length);
		const array2 = ["1", "2", "3"];
		let array = [aspects, array2];
		if (adjustmentArray.length) {
			array = [aspects, adjustmentArray, swatchSetArray];
		}
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
			let prefixes;
			let combinations;

			if (list.length === 1) {
				return list[0];
			}

			prefixes = list[0];
			combinations = combine(list.slice(1)); // recurse

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
		console.log("result: ", combine(array));
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
