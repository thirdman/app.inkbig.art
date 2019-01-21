import React, { Component } from "react";
// import { BrowserRouter as Router } from 'react-router-dom'
// import * as firebase from 'firebase';
// import PropTypes from "prop-types";
import fbase from "../../firebase";

import styles from "./Home.scss";
import { DisplayImage } from "..";
import Loading from "../../assets/icons/loading.svg";

require("firebase/firestore");

// import * as theImages from '../../assets/svg';

// const svgs = require.context('../../assets/svg', true, /\.svg$/);
// const keys = svgs.keys();
// const svgsArray = keys.map(key => svgs(key));
const imageNames = [
	"auckland",
	"AucklandSkyline",
	"AucklandOneTreeHill",
	"sydney",
	"teanau",
	"fiordland_falls",
	"doubtful",
	"cave",
	"christchurch",
	"cathedral",
	"NorthEastValley",
	"Kahurangi",
	"MilfordSound",
	"moeraki",
	"Hokonui",
	"hillsTriptych1",
	"hillsTriptych2",
	"hillsTriptych3",
	"cottage_shore",
	"cottage_mountains",
	"dune",
	"Rakiura",
	"Port",
	"Piha",
	"montenegro",
	"NelsonLakes",
	"StClair",
	"Wakatipu",
	"Wellington",
	"Wedding"
];
const colorObj = {
	hsl: {
		h: 187.82608695652172,
		s: 0.5,
		l: 0.5,
		a: 1
	},
	hex: "#40afbf",
	rgb: {
		r: 64,
		g: 175,
		b: 191,
		a: 1
	},
	hsv: {
		h: 187.82608695652172,
		s: 0.6666666666666666,
		v: 0.75,
		a: 1
	},
	source: "hsl"
};

export default class Home extends Component {
	/*
	static propTypes = {
		history: React.PropTypes.shape({
			push: React.PropTypes.func.isRequired
		}).isRequired
	};
*/

	state = {
		isEditing: false,
		editId: null,
		// profile: {},
		// loggedIn: false,
		theHue: 215.625,
		theLightness: 0.45,
		theSaturation: 0.5,
		// isLoading: true,
		// isLoadingSvg: true,
		// isLoadingEditions: true,
		toDelete: null,
		toDeleteProduct: null
	};

	componentWillMount() {}

	componentDidMount() {
		// this.getImages();
		// this.getSources();
	}

	componentWillUnmount() {}

	render() {
		const {
			dataSources,
			isLoadingSvg,
			dataEditions,
			isLoadingEditions
		} = this.props;
		const {
			hasMenu = false,
			theHue,
			theLightness,
			theSaturation,
			// imagesArray,
			// svgArray,
			// isLoading,
			// isLoadingSvg,
			// isLoadingEditions,
			toDelete,
			toDeleteProduct,
			isDeleting
		} = this.state;
		return (
			<div
				className={`${styles.Home} ${styles.wrap} ${
					hasMenu ? styles.hasMenu : ""
				}`}
			>
				<div className={`${styles.column} `}>
					<h2>
						SVG{" "}
						<button onClick={() => this.props.getSources()}>
							Reload sources
						</button>
					</h2>
					{isDeleting && <div>Deleting...</div>}
					{isLoadingSvg && (
						<div className={styles.loadingWrap}>
							{isLoadingSvg && (
								<div
									className={styles.theLoading}
                  dangerouslySetInnerHTML={{ __html: Loading }} // eslint-disable-line
								/>
							)}
							<span>Loading SVG list</span>
						</div>
					)}
					{!isLoadingSvg &&
						dataSources &&
						dataSources.map(svg => {
							return (
								<div
									key={`image${svg.id}`}
									role="presentation"
									className={`${styles.svgItem} ${
										toDelete === svg.data.filename ? styles.toDelete : ""
									}`}
								>
									<div
										onClick={() =>
											this.doRoute(
												"edit/remote",
												svg.data.slug,
												svg.data.filename,
												svg.id
											)
                    } // eslint-disable-line
									>
										<div className={styles.svgIcon}>svg</div>
										<div>{svg.data.filename}</div>
										{svg.data.modifiedDate && (
											<h6>{svg.data.modifiedDate.toDateString()}</h6>
										)}
									</div>
									<div>{svg.data.size && `${svg.data.size}b`}</div>
									<div className={styles.buttonWrap}>
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
										<button
											className={styles.delete}
											onClick={() =>
												this.doDeleteSvg(
													svg.id,
													svg.data.slug,
													svg.data.filename
												)
                      } // eslint-disable-line
										>
											delete
										</button>
									</div>
									{toDelete === svg.data.filename && (
										<div className={styles.deleteWarning}>
											<strong>Are you sure? This cannot be undone.</strong>
											<div>
												<button
													className={styles.confirm}
													onClick={() =>
														this.onConfirmDelete(
															svg.id,
															svg.data.slug,
															svg.data.filename
														)
													}
												>
													Confirm
												</button>
												<button
													className={styles.edit}
													onClick={() => this.onCancelDelete()}
												>
													Cancel
												</button>
											</div>
										</div>
									)}
								</div>
							);
						})}
					<h2>Home: Local SVG</h2>
					{imageNames.map(name => {
						return (
							<div
								key={`image${name}`}
                onClick={() => this.doRoute("edit", name)} // eslint-disable-line
								role="presentation"
							>
								<DisplayImage
									file={name}
									aspect="portrait"
									mode="thumbnail"
									hasHighlight
									hasFrame
									isInline
									hasMargin
									hue={theHue}
									saturation={theSaturation}
									lightness={theLightness}
								/>
							</div>
						);
					})}
				</div>
				<div className={`${styles.column} `}>
					<h2>
						Products{" "}
						<button onClick={() => this.props.getProducts()}>
							Reload Products
						</button>
					</h2>
					{isLoadingEditions && (
						<div className={styles.loadingWrap}>
							{isLoadingEditions && (
								<div
									className={styles.theLoading}
                  dangerouslySetInnerHTML={{ __html: Loading }} // eslint-disable-line
								/>
							)}
							<span>Loading Editions</span>
						</div>
					)}
					<div className={`${styles.dbImagesWrap} ${styles.row}`}>
						<div className={styles.imageList}>
							{!isLoadingEditions &&
								dataEditions &&
								dataEditions.map(img => {
									// console.log('img.renders: ', img.renders);
									return (
										<div
											key={`img${img.id}`}
											className={`${styles.imageCard} ${styles.listItem} ${
												toDeleteProduct === img.id ? styles.toDelete : ""
											}`}
											// role="presentation"
											// onClick={() => this.doRouteImageEdit("/image/admin", img.id)} // eslint-disable-line
										>
											<div
												className={`${styles.preview} ${
													img.data && img.data.preview
														? styles.isImage
														: styles.isSvg
												}`}
											>
												{img.data && img.data.preview && (
													<img src={img.data.preview} alt="" />
												)}
												{img.data && img.data.image && !img.data.preview && (
													<DisplayImage
														file={img.data.image}
														aspect="square"
														mode="thumbnail"
														hasHighlight
														hasFrame={false}
														isInline
														hasMargin={false}
														hue={theHue}
														saturation={theSaturation}
														lightness={theLightness}
														scale={img.data.theScale}
														translateX={img.data.theTranslateX}
														translateY={img.data.theTranslateY}
													/>
												)}
											</div>
											<div className={styles.content}>
												<h5>{img.data.name || img.data.image || "-"}</h5>
												<h6>
													{img.data.modifiedDate && (
														<div>
															{img.data.modifiedDate.toDateString()} - {img.id}
														</div>
													)}
												</h6>
											</div>
											<div className={styles.svgWrap}>{img.data.svgId}</div>
											<div className={styles.meta}>
												{img.renders && ( // (img.renders.length >= 0) &&
													<div className={styles.theCount}>
														{img.renders.length}
													</div>
												)}
											</div>
											<div className={styles.buttonWrap}>
												<button
													className={styles.editButton}
													onClick={() =>
														this.doRouteImageEdit("/image/admin", img.id)
                        } // eslint-disable-line
												>
													edit
												</button>
												<button
													className={`${styles.btn} ${styles.delete}`}
													onClick={() => this.doDeleteProduct(img.id)}
												>
													delete
												</button>
											</div>
											{toDeleteProduct === img.id && (
												<div className={styles.deleteWarning}>
													<strong>Are you sure? This cannot be undone.</strong>
													<div>
														<button
															className={styles.confirm}
															onClick={() =>
																this.onConfirmDeleteProduct(img.id)
															}
														>
															Confirm
														</button>
														<button
															className={styles.edit}
															onClick={() => this.onCancelDelete()}
														>
															Cancel
														</button>
													</div>
												</div>
											)}
										</div>
									);
								})}
						</div>
					</div>

					{this.state.isEditing && (
						<div className={styles.row}>
							<h2>Edit</h2>
							editing {this.state.editId}
						</div>
					)}
				</div>
			</div>
		);
	}
	// FUCNTIONS

	showEdit(imageId) {
		this.setState({
			isEditing: true,
			editId: imageId
		});
	}

	doRoute(route, name, filename, id) {
		console.log("route, name", route, name, colorObj);
		const theRoute = route === "edit/remote" ? "/edit/remote" : "/edit";
		console.log(theRoute);
		const { history } = this.props;
		history.push({
			pathname: theRoute || "/edit",
			// search: '?query=abc',
			state: {
				image: name,
				filename,
				colorObj,
				id,
				mode: route === "edit/remote" ? "remote" : "local"
			}
		});
	}

	doRouteImageEdit(route, imageId) {
		console.log("route, imageId", route, imageId);
		const { history } = this.props;
		history.push({
			pathname: route,
			state: {
				imageId
			}
		});
	}

	doDeleteSvg = (id, slug, filename) => {
		this.setState({
			toDelete: filename
		});
	};

	onConfirmDelete = (id, slug, filename) => {
		console.log("this shoudl attempt to delete svg: ", id, slug, filename);
		console.log(fbase.collection("svg"));
		console.log(fbase.collection("svg").doc(id));
		this.setState({
			isDeleting: true
		});
		fbase
			.collection("svg")
			.doc(id)
			.delete()
			.then(snapshot => {
				console.log("Document successfully deleted!", snapshot);
				this.setState({
					toDelete: null,
					isDeleting: false
				});
			})
			.catch(error => {
				console.error("Error removing document: ", error);
			});
	};

	onCancelDelete = () => {
		this.setState({
			toDelete: null,
			toDeleteProduct: null
		});
	};

	doDeleteProduct = productId => {
		console.log("this should now confirm delete: ", productId);
		this.setState({
			toDeleteProduct: productId
		});
	};

	onConfirmDeleteProduct = productId => {
		console.log("this shoudl attempt to delete product: ", productId);
		console.log(fbase.collection("images").doc(productId));
		this.setState({
			isDeleting: true
		});
		fbase
			.collection("images")
			.doc(productId)
			.delete()
			.then(snapshot => {
				console.log("Product successfully deleted!", snapshot);
				this.setState({
					toDeleteProduct: null,
					isDeleting: false
				});
			})
			.then(() => {
				this.props.getProducts();
			})
			.catch(error => {
				console.error("Error removing document: ", error);
			});
	};
}

/*
	readTextFile = file => {
		const rawFile = new XMLHttpRequest();
		rawFile.open("GET", file, false);
		rawFile.onreadystatechange = () => {
			if (rawFile.readyState === 4) {
				if (rawFile.status === 200 || rawFile.status === 0) {
					const allText = rawFile.responseText;
					console.log("allText: ", allText);
					this.setState({
						fundData: allText
					});
				}
			}
		};
		rawFile.send(null);
	};
*/
/*
	addImage(imageName) {
		console.log(this);
		const currentDateTime = new Date();
		console.log("fbase", fbase);
		fbase
			.collection("images")
			.doc(imageName)
			.set(
				{
					name: imageName,
					modifiedDate: currentDateTime
				},
				{ merge: true }
			)
			.then(() => {
				console.log("Document successfully written!");
			})
			.catch(error => {
				console.error("Error writing document: ", error);
			});
	}
*/

/*
  getSources() {
    const svgRef = fbase.collection("svg");
    const svgArray = [];
    this.setState({ isLoadingSvg: true });
    svgRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        //	console.log(doc.id, ' => ', doc.data());
        const tempThing = {};
        tempThing.id = doc.id;
        tempThing.data = doc.data();
        svgArray.push(tempThing);
      });
      this.setState({
        svgArray,
        isLoadingSvg: false
      });
    });
  }
*/

/*
  getImages() {
    const imagesRef = fbase.collection("images");
    const imagesArray = [];
    this.setState({
      // isLoadingEditions: true
    });
    imagesRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        //				console.log(doc.id, ' => ', doc.data());
        const tempThing = {};
        tempThing.id = doc.id;
        tempThing.data = doc.data();

        const imageRenders = imagesRef
          .doc(doc.id)
          .collection("renders")
          .get() // eslint-disable-line
          .then(snapshot => {
            const tempArray = [];
            snapshot.forEach(subdoc => {
              // console.log('Sub Document ID: ', subdoc.id);
              tempArray.push(subdoc.id);
            });
            tempThing.renders = tempArray;
          })
          .catch(err => {
            console.log("Error getting sub-collection documents", err);
          });
        imagesArray.push(tempThing);
      });
      this.setState({
        imagesArray,
        isLoadingEditions: false
      });
    });
  }
*/
