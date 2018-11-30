import React, { Component } from "react";
import Dropzone from "react-dropzone";
import * as firebase from "firebase";
import fbase from "../../firebase";

import Loading from "../../assets/icons/loading.svg";
import styles from "./Upload.scss";

require("firebase/firestore"); // loads the storage part

export default class Upload extends Component {
	state = {
		files: null,
		uploadPercentage: 0,
		filename: "",
		slug: "",
		profile: {},
		loggedIn: false,
		isLoading: false,
		isSaving: false,
		isAdding: false,
		isEditing: false,
		isUpdated: false,
		isError: false
	};

	componentWillMount() {}

	componentDidMount() {}

	render() {
		//    const {} = this.props;
		const {
			uploadPercentage,
			isSaving,
			isLoading,
			isError,
			isUpdated,
			isAdding,
			files,
			error
			// currentRendersArray,
		} = this.state;

		return (
			<div
				className={`${styles.Upload} ${styles.wrap} ${
					isUpdated ? styles.isUpdated : ""
				}`}
			>
				<div className={styles.row}>
					<div className={`${styles.column} `}>
						{isError && (
							<div className={`${styles.message} ${styles.error}`}>
								Error: {error}
							</div>
						)}
						{isAdding && <div className={`${styles.message}`}>Adding</div>}
						{isUpdated && (
							<div className={`${styles.message} ${styles.success}`}>
								UPDATED
							</div>
						)}
						<h1>Upload Source SVG</h1>
						{(isLoading || isSaving) && (
							<div
								className={styles.theLoading}
                dangerouslySetInnerHTML={{ __html: Loading }} // eslint-disable-line
							/>
						)}
						{isSaving && <div>Uploading: {uploadPercentage}</div>}
						{!isLoading && !files && <div>Uplod a svg to continue.</div>}

						{!isLoading &&
							files &&
							files.map(file => {
								console.log(file);
								return (
									<section
										className={styles.previewSection}
										key={`file_${file.name}`}
									>
										<div className={styles.contentItem}>
											<h4>Name</h4>
											<input
												type="text"
												name="filename"
												// defaultValue={file.name}
												value={this.state.filename}
												ref={iName => {
													this.textInput = iName;
												}}
												onChange={this.handleInputChange}
											/>
										</div>
										<div className={styles.contentItem}>
											<h4>Slug</h4>
											<input
												type="text"
												name="slug"
												value={this.state.slug}
												ref={iImage => {
													this.textInput = iImage;
												}}
												onChange={this.handleInputChange}
											/>
										</div>
										<div className={styles.contentItem}>
											<h4>Size</h4>
											{file.size}
										</div>
										<div className={styles.contentItem}>
											<h4>Type</h4>
											{file.type}
										</div>
										{file.type === "image/svg+xml" && (
											<button
                        onClick={() => this.doSave()} // eslint-disable-line
											>
												Save
											</button>
										)}
									</section>
								);
							})}
					</div>
					<div className={styles.column}>
						<h3>Current ?</h3>
						<section>
							<Dropzone
								multiple={false}
								onDrop={this.onDrop}
								className={styles.dropZone}
								activeClassName={styles.dropZoneActive}
								rejectClassName={styles.dropZoneReject}
							>
								<span>Drag image here, or click to select...</span>
							</Dropzone>
						</section>
					</div>
				</div>
			</div>
		);
	}

	// DROPZONE
	onDrop = files => {
    // eslint-disable-line
		console.log("this on Drop: ", this, files);
		const filename = files && files[0].name;
		const slug =
			files &&
			files[0].name &&
			files[0].name.substr(0, files[0].name.lastIndexOf(".")).replace(/ /g, "");
		this.setState({
			files,
			filename,
			slug
		});
	};

	cancelFile = index => {
		// const { files } = this.state;
		this.setState(prevState => ({
      // eslint-disable-line
			files: prevState.files.filter((_, i) => i !== index)
		}));
		this.setState({
			fileIsUploading: false
		});
	};

	// FUCNTIONS

	handleInputChange = event => {
		// console.log('changed input: ', event, attribute, theValue);
		const { target } = event;
		const value = target.type === "checkbox" ? target.checked : target.value;
		const attribute = target.name;
		console.log("changed attribute: ", attribute);
		console.log("changed value: ", value);
		this.setState({
			[attribute]: value
		});
	};

	doSave() {
		// dataUrl
		console.log("this will save the image", this.state);
		const { files, filename, slug } = this.state;
		const file = files[0];
		let newFileAddress;
		// console.log(fbase.collection('svg'));
		console.log("filename, slug", filename, slug);
		const fStorage = firebase.storage();
		const storageLocation = "svg";
		const storageRef = fStorage.ref().child(storageLocation);
		const fileRef = storageRef.child(filename);
		const uploadTask = fileRef.put(file);
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
				.then(snap => {
					console.log("snapshot: ", snap);
					console.log("metadata: ", snap && snap.metatdata);
					console.log("newFileAddress: ", newFileAddress);
					console.log("file: ", file);
					const currentDateTime = new Date();
					const svgObj = {};
					svgObj.createdDate = currentDateTime;
					svgObj.modifiedDate = currentDateTime;
					svgObj.filename = filename;
					svgObj.slug = slug;
					svgObj.fullPath = snapshot.metadata && snapshot.metadata.fullPath;
					console.log("svgObj is", svgObj, "file is", file);
					console.log("fbase.collection(svg) is", fbase.collection("svg"));
					if (file) {
						fbase
							.collection("svg")
							.add({
								filename,
								slug,
								size: file.size,
								createdDate: currentDateTime,
								source: svgObj
							})
							.then(svgRef => {
								console.log(
									"SVG successfully added to db, with reference of: ",
									svgRef
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
					// return svgRef;
				})
				.then(() => {
					// console.log('new svg ref is ', svgRef);
					this.setState({
						isSaving: false,
						newFileAddress,
						files: null,
						isUpdated: true
					});
					setTimeout(() => {
						this.setState({
							isUpdated: false
						});
					}, 2000);
				});
		});
		/*
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
*/
	}
}
