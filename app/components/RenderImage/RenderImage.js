import React, { Component } from "react";
import domtoimage from "dom-to-image";
import * as firebase from "firebase";
import fbase from "../../firebase";
import { DisplayImage } from "..";

import styles from "./RenderImage.scss";
import Tick from "../../assets/icons/tick.svg";
import Loading from "../../assets/icons/loading.svg";

require("firebase/firestore"); // loads the storage part

export default class RenderImage extends Component {
	state = {
		isLoading: true,
		isRendering: false,
		hasRendered: false,
		isSaving: false,
		hasSaved: false,
		theId: this.makeId(),
		showDetail: false
	};

	componentWillMount() {}

	componentDidMount() {
		const { doRender, doSave } = this.props;
		this.toggleLoading();
		if (doRender) {
			this.doRender(doSave);
		}
	}

	componentDidUpdate(prevProps) {
		const { doRender } = this.props;
		if (prevProps.doRender !== doRender && doRender) {
			console.log("THIS WOULD RENDER");
			this.doRender(false);
		}
	}

	render() {
		const {
			isError,
			isLoading,
			isRendering,
			isSaving,
			hasSaved,
			hasRendered,
			showRendered,
			renderUrl,
			theId = this.makeId(),
			dataUrl
		} = this.state;
		const {
			// productId,
			// productName,
			doSave = false,
			doRender = false,
			displayMode = "max",
			file = "montenegro",
			aspect = "portrait",
			// hasFrame = false,
			swatchName,
			adjustmentName
			// onAssignRender
		} = this.props;

		return (
			<div
				className={`${styles.RenderImage} 
					${styles[displayMode]} 
					${isLoading ? styles.isLoading : ""} 
					${isRendering ? styles.isRendering : ""} 
					${isSaving ? styles.isSaving : ""}`}
				id={`renderImage${theId}_${file}`}
			>
				{isError && (
					<div className={styles.message} mode="error" text="Error" />
				)}
				<div className={`${styles.row} ${styles.infoRow}`}>
					<div className={styles.column}>
						<h4>Aspect</h4>
						<span>{aspect}</span>
					</div>
					<div className={styles.column}>
						<h4>Swatch</h4>
						<span>{swatchName}</span>
					</div>
					<div className={styles.column}>
						<h4>Adjustment</h4>
						<span>{adjustmentName}</span>
					</div>
					<div className={styles.column}>
						<h4>Rendered</h4>
						<div>
							{isRendering ? (
								<div
									className={styles.theLoading}
									dangerouslySetInnerHTML={{ __html: Loading }}
								/>
							) : (
								""
							)}
							<div>
								{!isRendering && hasRendered && (
									<div
										className={styles.theTick}
										dangerouslySetInnerHTML={{ __html: Tick }}
									/>
								)}
							</div>
						</div>
					</div>
					<div className={styles.column}>
						<h4>Saved</h4>
						<div>
							{isSaving ? (
								<div
									className={styles.theLoading}
									dangerouslySetInnerHTML={{ __html: Loading }}
								/>
							) : (
								""
							)}
							{!isSaving && hasSaved && (
								<div
									className={styles.theTick}
									dangerouslySetInnerHTML={{ __html: Tick }}
								/>
							)}
						</div>
					</div>
					<div className={styles.column}>
						<h4>Detail</h4>
						{(this.props.file || this.props.sourceSvg) && (
							<button onClick={() => this.toggleDetail()}>
								{this.state.showDetail ? "Hide" : "Show"}
							</button>
						)}
					</div>
				</div>
				<div
					className={`${styles.detailRow} ${styles.row} ${
						this.state.showDetail ? styles.visible : styles.invisible
					}`}
				>
					<div className={styles.column}>
						<p>
							<span>Mode: </span>
							<span>{this.props.mode}</span>
						</p>
						{this.props.hasFrame && (
							<p>
								<span>hasFrame: </span>
								<span>Yes</span>
							</p>
						)}
						{this.props.hasBackground && (
							<p>
								<span>hasBackground: </span>
								<span>Yes</span>
							</p>
						)}
						<p>
							<span>Do Render: </span>
							<span>{doRender ? "Yes" : "No"}</span>
						</p>
						<p>
							<span>Do Save: </span>
							<span>{doSave ? "Yes" : "No"}</span>
						</p>
						{isRendering && (
							<p>
								<span>Rendering: </span>
								<span>{isRendering ? "Yes" : ""}</span>
							</p>
						)}
						<p>
							<span>Has Rendered: </span>
							<span>{hasRendered ? "Yes" : ""}</span>
						</p>
						{isSaving && (
							<p>
								<span>Saving: </span>
								<span>{isSaving ? "Yes" : ""}</span>
							</p>
						)}
						<p>
							<span>Has Saved: </span>
							<span>
								{hasSaved ? "Yes" : ""}
								{hasSaved && (
									<div
										className={styles.theTick}
										dangerouslySetInnerHTML={{ __html: Tick }}
									/>
								)}
							</span>
						</p>
					</div>
					<div className={styles.column}>
						{(this.props.file || this.props.sourceSvg) && (
							<button onClick={() => this.doRender()}>Render Image</button>
						)}
						{(this.props.file || this.props.sourceSvg) && (
							<button onClick={() => this.doRender(true)}>
								Render and save Image
							</button>
						)}
						{(this.props.file || this.props.sourceSvg) && dataUrl && (
							<button onClick={() => this.doSave(dataUrl)}>Save Image</button>
						)}
					</div>
				</div>
				<div
					className={`${styles.detailRow} ${styles.row} ${
						showRendered ? styles.isvisible : ""
					} ${this.state.showDetail ? styles.visible : styles.invisible}`}
				>
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
								{isRendering && (
									<div className={styles.placeholder}>
										<div
											className={styles.theLoading}
											dangerouslySetInnerHTML={{ __html: Loading }}
										/>
										<span>Rendering...</span>
									</div>
								)}
								{!hasSaved && isSaving && (
									<div className={`${styles.placeholder} ${styles.saving}`}>
										<div
											className={styles.theLoading}
											dangerouslySetInnerHTML={{ __html: Loading }}
										/>
										<span>Saving....</span>
									</div>
								)}
								<div className={styles.cropper}>
									<div id={`target${theId}`} />
									{renderUrl && (
										<div>
											<a
												target="_blank"
												rel="noreferrer noopener"
												href={renderUrl}
												className={styles.link}
											>
												Open in new window
											</a>
										</div>
									)}
									{renderUrl && (
										<button
											onClick={() => this.doAssignRenderToProduct(renderUrl)}
										>
											save as product Preview
										</button>
									)}
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
			hasRendered: true // for completeness
		});
		domtoimage
			.toJpeg(theSource, { quality: 1 })
			.then(dataUrl => {
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
					dataUrl
				});
				if (doSave) {
					this.doSave(dataUrl);
				}
			})
			.catch(error => {
				console.error("oops, something went wrong!", error);
			});
	}

	doSave(dataUrl) {
		// console.log("this will save the image", this.state);
		const {
			productId,
			productName,
			file,
			mode,
			aspect,
			hasFrame = false,
			hasBackground,
			swatchName,
			adjustmentName
			// sourceSvg
		} = this.props;
		const { size } = this.state;
		if (!dataUrl) {
			console.error("no data url");
			return false;
		}
		console.log(
			"productId, productName, file, aspect, swatchName: ",
			productId,
			productName,
			file,
			aspect,
			swatchName,
			adjustmentName
		);
		const cleanSwatchName = swatchName.replace(/\s+/g, "-");

		// console.log("dataUrl: ", dataUrl);
		// console.log(fbase.collection("renders"));
		const fStorage = firebase.storage();
		const storageLocation = `renders/${productId}_${productName ||
			file}_${cleanSwatchName}_${adjustmentName}_${aspect}_${mode}${
			hasFrame ? "_Frame" : ""
		}${hasBackground ? "_Background" : ""}.jpg`;
		// const renderType = sourceSvg ? "source" : "file";
		// console.log("cleanSwatchName: ", cleanSwatchName);
		// console.log("renderType: ", renderType);
		// console.log("storageLocation", storageLocation);
		const storageRef = fStorage.ref().child(storageLocation);
		this.setState({
			isSaving: true
		});
		return storageRef.putString(dataUrl, "data_url").then(snapshot => {
			console.log("Uploaded a blob or file!", snapshot);
			this.setState({
				// storageLocation,
				renderUrl: snapshot.downloadURL,
				isSaving: false,
				hasSaved: true
			});
			console.log(
				"about to doSaveRender(snapshot, size, null)",
				snapshot,
				size,
				null
			);
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
		console.log("saving the render details:", snapshot, size, hex);
		const currentDateTime = new Date();
		const {
			productId,
			productName,
			adjustmentName,
			aspect,
			file,
			mode,
			swatchName,
			slug,
			hasFrame,
			hasBackground,
			imageColorArray
		} = this.props;
		const renderObj = {};
		renderObj.productId = productId;
		renderObj.productName = productName;
		renderObj.aspect = aspect;
		renderObj.mode = mode;
		renderObj.slug = slug || file || productId;
		renderObj.hasFrame = hasFrame;
		renderObj.imageColorArray = imageColorArray;
		renderObj.swatchName = swatchName;
		renderObj.hasBackground = hasBackground || false;
		renderObj.downloadURL = snapshot.downloadURL;
		renderObj.fullPath = snapshot.metadata && snapshot.metadata.fullPath;
		renderObj.modifiedDate = currentDateTime;
		// console.log("renderObj is", renderObj, "productId is", productId);
		const fileName = snapshot.metadata && snapshot.metadata.name;
		console.log("fileName is: ", fileName);
		if (productId) {
			fbase
				.collection("renders")
				.doc(fileName)
				.set(
					{
						hex: hex || "none",
						productId,
						mode,
						swatchName,
						adjustmentName,
						aspect,
						downloadUrl: snapshot.downloadURL,
						slug: slug || file || productId,
						modifiedDate: currentDateTime,
						[mode]: renderObj
					},
					{ merge: true }
				)

				/*
				.add({
					hex: hex || "none",
					productId,
					mode,
					swatchName,
					adjustmentName,
					aspect,
					downloadUrl: snapshot.downloadURL,
					slug: slug || file || productId,
					modifiedDate: currentDateTime,
					[mode]: renderObj
				})
*/
				.then(renderRef => {
					console.log(
						"render successfully added to db, with reference of: ",
						renderRef
					);
					this.setState({
						isError: false
					});
				})
				.catch(error => {
					console.error("Error writing render: ", error);
					this.setState({
						isError: true
					});
				});
		}
	}

	doAssignRenderToProduct = url => {
		const {
			productId,
			productName,
			aspect,
			swatchName,
			adjustmentName
		} = this.props;
		const renderName = `${productName}_${aspect}_${swatchName.replace(
			/\s+/g,
			"-"
		)}_${adjustmentName}`;
		const obj = {
			[renderName]: url
		};
		console.log("this will assign url to productId: ", productId, url, obj);
		this.props.onAssignRender(renderName, url, true); // name, url, isPreview
	};

	makeId() {
    // eslint-disable-line
		let text = "";
		const possible =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for (let i = 0; i < 5; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
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
