import React, { Component } from 'react';

import {
	DisplayImage
	} from '../../components';

import styles from './RenderImage.scss';

export default class RenderImage extends Component {
	state = {
		isLoading: true,
		hasLoaded: false,
		theHue: 10,
		theId: this.makeId()
	};

	componentWillMount() {
  }

	componentDidMount() {
	}

	makeId() {
		let text = '';
		console.log('display image this:', this);
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (let i = 0; i < 5; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}

	render() {
		const {
			isLoading,
			theId = this.makeId()
			} = this.state;
    const {
			doSave = false,
			file = 'montenegro',
/*
			aspect = 'portrait',
			mode = 'preview',
			hasBackground = false,
			hasFrame = true,
			hasMargin = false,
			hasHighlight = false,
			isInline = false,
			imageLevels = [10, 16, 37, 61, 79],
			hue = 10,
			saturation = 82,
			lightness = 37,
			scale = 1,
			translateX = 0,
			translateY = 0,
			imageColorArray,
*/
		} = this.props;

		return (

			<div className={`${styles.RenderImage} ${isLoading ? styles.isLoading : ''}`} id={`renderImage${theId}_${file}`}>
				<DisplayImage
					{...this.props}
				/>
				<p>DoSave: {doSave ? 'Yes' : 'No'}</p>
			</div>
		);
	}
	// FUCNTIONS
}
