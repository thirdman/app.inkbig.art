import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import { Edit, Home, ImageAdmin, Upload, Products, Swatches } from ".";
import styles from "./App.scss";
import fbase from "../firebase";

require("firebase/firestore");

export default class App extends Component {
	state = {
		// dataSources,
		isLoadingSvg: true,
		isLoadingEditions: true,
		isLoadingSwatches: true
	};

	componentDidMount() {
		this.getEditions();
		this.getSources();
		this.getSwatches();
	}

	render() {
		const {
			dataSources,
			dataEditions,
			dataSwatches,
			isLoadingSvg,
			isLoadingEditions,
			isLoadingSwatches
		} = this.state;
		return (
			<div className={styles.App}>
				<div className={styles.header}>
					<div className={styles.headerItem}>
						<img src="../assets/imgs/logo2.png" height="32" alt="" />
					</div>
					<Link
						to="/"
						className={`${styles.headerItem} ${
							this.props.location.pathname.substring(1) === ""
								? styles.isActive
								: ""
						}`}
					>
						Home
					</Link>
					<Link
						to="/upload"
						className={`${styles.headerItem} ${
							this.props.location.pathname.substring(1) === "upload"
								? styles.isActive
								: ""
						}`}
					>
						Upload Source Svg
					</Link>
					<Link
						to="/products"
						className={`${styles.headerItem} ${
							this.props.location.pathname.substring(1) === "products"
								? styles.isActive
								: ""
						}`}
					>
						Products
					</Link>
					<Link
						to="/swatches"
						className={`${styles.headerItem} ${
							this.props.location.pathname.substring(1) === "swatches"
								? styles.isActive
								: ""
						}`}
					>
						Swatches
					</Link>
				</div>
				<Route
					exact
					path="/"
					render={props => (
						<Home
							{...props}
							dataSources={dataSources}
							isLoadingSvg={isLoadingSvg}
							dataEditions={dataEditions}
							isLoadingEditions={isLoadingEditions}
						/>
					)}
				/>
				<Route path="/edit" component={Edit} />
				<Route
					exact
					path="/image/admin"
					// component={ImageAdmin}
					render={props => (
						<ImageAdmin
							{...props}
							dataSources={dataSources}
							isLoadingSvg={isLoadingSvg}
							dataSwatches={dataSwatches}
							isLoadingSwatches={isLoadingSwatches}
						/>
					)}
				/>
				<Route exact path="/upload" component={Upload} />
				<Route
					exact
					path="/products"
					render={props => (
						<Products
							{...props}
							dataEditions={dataEditions}
							isLoadingEditions={isLoadingEditions}
						/>
					)}
				/>
				<Route
					exact
					path="/swatches"
					// component={ImageAdmin}
					render={props => (
						<Swatches
							{...props}
							dataSwatches={dataSwatches}
							isLoadingSwatches={isLoadingSwatches}
						/>
					)}
				/>
			</div>
		);
	}

	// LOAD FIREBASE DATA
	// FUCNTIONS
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
			const sortedArray = svgArray.sort((a, b) => {
				return b.data.modifiedDate - a.data.modifiedDate;
			});
			this.setState({
				dataSources: sortedArray,
				isLoadingSvg: false
			});
		});
	}

	getEditions() {
		const imagesRef = fbase.collection("images");
		const imagesArray = [];
		this.setState({
			isLoadingEditions: true
		});
		imagesRef.get().then(querySnapshot => {
			querySnapshot.forEach(doc => {
				// console.log('doc data: ', doc.data());
				const tempThing = {};
				tempThing.id = doc.id;
				tempThing.modifiedDate = doc.data().modifiedDate;
				tempThing.data = doc.data();

				imagesRef
					.doc(doc.id)
					.collection("renders")
          .get() // eslint-disable-line
					.then(snapshot => {
						const tempArray = [];
						snapshot.forEach(subdoc => {
							tempArray.push(subdoc.id);
						});
						tempThing.renders = tempArray;
					})
					.catch(err => {
						console.log("Error getting sub-collection documents", err);
					});
				imagesArray.push(tempThing);
			});
			const sortedImages = imagesArray.sort((a, b) => {
				return b.modifiedDate - a.modifiedDate;
			});
			this.setState({
				dataEditions: sortedImages,
				isLoadingEditions: false
			});
		});
	}

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
				dataSwatches: swatchArray,
				isLoadingSwatches: false
			});
		});
	}
}

/*
	
	    const imagesRef = fbase.collection("images");
    imagesRef.get().then(querySnapshot => {
      const newArray = [];
      querySnapshot.forEach(doc => {
        newArray[doc.id] = doc.data();
      });
      this.setState({
        images: querySnapshot
      });
      console.log("querySnapshot", querySnapshot);
      console.log("newArray", newArray);
    });



	          <Link to={"/edit"} className={styles.headerItem}>
            Edit
          </Link>
          <Link to={"/image/admin"} className={styles.headerItem}>
            Img Admin
          </Link>

	*/
