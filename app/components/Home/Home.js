import React, { Component } from 'react';
// import { BrowserRouter as Router } from 'react-router-dom'
import fbase from '../../firebase';

import styles from './Home.scss';
import { DisplayImage } from '../../components';
// import * as theImages from '../../assets/svg';

// const svgs = require.context('../../assets/svg', true, /\.svg$/);
// const keys = svgs.keys();
// const svgsArray = keys.map(key => svgs(key));
const imageNames = [
	'auckland',
	'AucklandSkyline',
	'sydney',
	'teanau',
	'fiordland_falls',
	'doubtful',
	'cave',
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
	'montenegro',
	'NelsonLakes',
	'StClair',
	'Wakatipu',
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
	};

	componentWillMount() {
  }

	componentDidMount() {
		this.getImages();
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
			isLoading,
			} = this.state;
		console.log('fbase: ', fbase);
		console.log('history: ', history);
		// console.log('the iamges: ', theImages);
		// console.log('theiamges.keys(): ', theImages.keys());
		// console.log('the theImages.Auckland: ', theImages.Auckland);
		return (
			<div className={`${styles.Home} ${styles.wrap} ${hasMenu ? styles.hasMenu : ''}`}>
				<div className={`${styles.column} `}>
					<h2>Home: svg</h2>
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
					<h2>Data base images</h2>
					<div className={`${styles.row} ${isLoading ? styles.loading : ''}`}>
						{imagesArray && imagesArray.map((img) => {
							return (
								<div
									key={`img${img.id}`}
									className={styles.imageCard}
									role="presentation"
									onClick={() => this.doRouteImageEdit('/image/admin', img.id)} // eslint-disable-line
								>
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
										/>
									}
									<h5>
										{img.data.name}
									</h5>
									<button
										// onClick={() => this.showEdit(img.id)} // eslint-disable-line
										// role="button"
										onClick={() => this.doRouteImageEdit('/image/admin', img.id)} // eslint-disable-line
									>edit
									</button>
								</div>
							);
							})
						}
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
	getImages() {
		const imagesRef = fbase.collection('images');
		const imagesArray = [];
		imagesRef.get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				console.log(doc.id, ' => ', doc.data());
				// imagesArray[doc.id] = doc.data();
				const tempThing = {};
				tempThing.id = doc.id;
				tempThing.data = doc.data();
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
