import React, { Component } from 'react';
// import { BrowserRouter as Router } from 'react-router-dom'
import fbase from '../../firebase';

import styles from './Home.scss';
import { DisplayImage } from '../../components';
import Loading from '../../assets/icons/loading.svg';

// import * as theImages from '../../assets/svg';

// const svgs = require.context('../../assets/svg', true, /\.svg$/);
// const keys = svgs.keys();
// const svgsArray = keys.map(key => svgs(key));
const imageNames = [
	'auckland',
	'AucklandSkyline',
	'AucklandOneTreeHill',
	'sydney',
	'teanau',
	'fiordland_falls',
	'doubtful',
	'cave',
	'christchurch',
	'cathedral',
	'NorthEastValley',
	'Kahurangi',
	'MilfordSound',
	'moeraki',
	'Hokonui',
	'hillsTriptych1',
	'hillsTriptych2',
	'hillsTriptych3',
	'cottage_shore',
	'cottage_mountains',
	'dune',
	'Rakiura',
	'Port',
	'Piha',
	'montenegro',
	'NelsonLakes',
	'StClair',
	'Wakatipu',
	'Wellington',
	'Wedding',
];
const colorObj = {
	hsl: {
		h: 187.82608695652172,
		s: 0.5,
		l: 0.5,
		a: 1 },
	hex: '#40afbf',
	rgb: {
		r: 64,
		g: 175,
		b: 191,
		a: 1 },
	hsv: {
		h: 187.82608695652172,
		s: 0.6666666666666666,
		v: 0.75,
		a: 1 },
	source: 'hsl'
};

export default class Home extends Component {

	static propTypes = {
		history: React.PropTypes.shape({
			push: React.PropTypes.func.isRequired,
		}).isRequired
	};
	state = {
		isEditing: false,
		editId: null,
		profile: {},
		loggedIn: false,
		theHue: 215.625,
		theLightness: 0.45,
		theSaturation: 0.50,
		isLoading: true,
		isLoadingSvg: true,
	};

	componentWillMount() {
  }

	componentDidMount() {
		this.getImages();
		this.getSources();
	}

	componentWillUnmount() {
	}

	render() {
    const {
			history
		} = this.props;
		const {
			hasMenu = false,
			theHue,
			theLightness,
			theSaturation,
			imagesArray,
			svgArray,
			isLoading,
			isLoadingSvg,
			} = this.state;
		console.log('fbase: ', fbase);
		console.log('history: ', history);
		return (
			<div className={`${styles.Home} ${styles.wrap} ${hasMenu ? styles.hasMenu : ''}`}>
				<div className={`${styles.column} `}>
					<h2>Home: Remote SVG</h2>
						{isLoadingSvg &&
							<div>
							{(isLoadingSvg) &&
								<div
									className={styles.theLoading}
									dangerouslySetInnerHTML={{ __html: Loading }} // eslint-disable-line
								/>
							}
								<span>Loading SVG list</span>
							</div>
						}
						{!isLoadingSvg && svgArray && svgArray.map((svg, name) => {
							console.log('svg: ', svg);
							return (
								<a
									key={`image${name}`}
									onClick={() => this.doRoute('edit/remote', svg.data.slug)} // eslint-disable-line
									role="presentation"
									className={styles.svgItem}
								>
									<div>
										{svg.data.filename} | {svg.data.slug} | {svg.data.size}
									</div>
								</a>
							);
						})}
					<h2>Home: Local SVG</h2>
					{imageNames.map((name) => {
						return (
							<a
								key={`image${name}`}
								onClick={() => this.doRoute('edit', name)} // eslint-disable-line
								role="presentation"
							>
							<DisplayImage
								file={name}
								aspect={'portrait'}
								mode={'thumbnail'}
								hasHighlight
								hasFrame
								isInline
								hasMargin
								hue={theHue}
								saturation={theSaturation}
								lightness={theLightness}
							/>
							</a>
						);
					})}
				</div>
				<div className={`${styles.column} `}>
					<h2>Editions</h2>
					<div className={`${styles.dbImagesWrap} ${styles.row} ${isLoading ? styles.loading : ''}`}>
						<div className={styles.imageList}>
							{!isLoading && imagesArray && imagesArray.map((img) => {
								// console.log('img: ', img);
								// console.log('img.renders: ', img.renders);
								return (
									<div
										key={`img${img.id}`}
										className={`${styles.imageCard} ${styles.listItem}`}
										role="presentation"
										onClick={() => this.doRouteImageEdit('/image/admin', img.id)} // eslint-disable-line
									>
										<div className={styles.preview}>
											{img.data && img.data.image &&
												<DisplayImage
													file={img.data.image}
													aspect={'square'}
													mode={'thumbnail'}
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
											}
										</div>
										<div className={styles.content}>
											<h5>
												{img.data.name || img.data.image || '-' }
											</h5>
											<h6>
												{img.data.modifiedDate &&
												<div>{img.data.modifiedDate.toDateString()}</div>
												}
											</h6>
										</div>
										<div className={styles.meta}>
											{img.renders &&// (img.renders.length >= 0) &&
												<div className={styles.theCount}>{img.renders.length}</div>
											}
											<button
												className={styles.editButton}
												onClick={() => this.doRouteImageEdit('/image/admin', img.id)} // eslint-disable-line
											>edit
											</button>
										</div>
									</div>
								);
								})
							}
						</div>
					</div>
					<div className={styles.row}>
					<a
						onClick={() => this.addImage('milfordSound')} // eslint-disable-line
					role="presentation"
					>add image test (milfordSound)
					</a>
					</div>
					{this.state.isEditing &&
						<div className={styles.row}>
						<h2>Edit</h2>
							editing {this.state.editId}
						</div>
					}
				</div>
			</div>
		);
	}
	// FUCNTIONS
	getSources() {
		const svgRef = fbase.collection('svg');
		const svgArray = [];
		this.setState({ isLoadingSvg: true });
		svgRef.get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
			//	console.log(doc.id, ' => ', doc.data());
				const tempThing = {};
				tempThing.id = doc.id;
				tempThing.data = doc.data();
				svgArray.push(tempThing);
			});
			this.setState({
				svgArray,
				isLoadingSvg: false,
			});
		});
	}

	getImages() {
		const imagesRef = fbase.collection('images');
		const imagesArray = [];
		this.setState({ isLoading: true });
		imagesRef.get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
//				console.log(doc.id, ' => ', doc.data());
				const tempThing = {};
				tempThing.id = doc.id;
				tempThing.data = doc.data();

				const imageRenders = imagesRef.doc(doc.id).collection('renders').get() // eslint-disable-line
					.then((snapshot) => {
						const tempArray = [];
						snapshot.forEach((subdoc) => {
							// console.log('Sub Document ID: ', subdoc.id);
							tempArray.push(subdoc.id);
						});
						tempThing.renders = tempArray;
					})
					.catch((err) => {
						console.log('Error getting sub-collection documents', err);
					});
				imagesArray.push(tempThing);
			});
			this.setState({
				imagesArray,
				isLoading: false,
			});
		});
	}

	addImage(imageName) {
		console.log(this);
		const currentDateTime = new Date();
		console.log('fbase', fbase);
			fbase.collection('images').doc(imageName).set({
			name: imageName,
			modifiedDate: currentDateTime
		}, { merge: true })
		.then(() => {
			console.log('Document successfully written!');
		})
		.catch(((error) => {
			console.error('Error writing document: ', error);
		}));
	}

	showEdit(imageId) {
		this.setState({
			isEditing: true,
			editId: imageId
		});
	}

	doRoute(route, name) {
		console.log('route, name', route, name, colorObj);
		const { history } = this.props;
		history.push({
			pathname: '/edit',
			// search: '?query=abc',
			state: { image: name,
				colorObj
				}
		});
	}
	doRouteImageEdit(route, imageId) {
		console.log('route, imageId', route, imageId);
		const { history } = this.props;
		history.push({
			pathname: route,
			state: {
				imageId
				}
		});
	}
}
/*
				{ keys.map((img) => {
					return (
						<span>{img}</span>
						);
					})
				}
*/
