import React, { Component } from 'react';
import InlineCss from 'react-inline-css';

import styles from './DisplayImage.scss';
import variables from '../../assets/scss/variables.scss';
import '../../assets/scss/variables.css';

import {
	Auckland,
	Dune,
	Cave,
	CathedralCove,
	CottageShore,
	CottageMountains,
	Doubtful,
	HillsTriptych1,
	HillsTriptych2,
	HillsTriptych3,
	MilfordSound,
	Moeraki,
	Montenegro,
	NorthEastValley,
	Port,
	Sydney,
	Teanau,
	FiordlandFalls,
	} from '../../assets/svg';

export default class DisplayImage extends Component {
/*
	static propTypes = {
		file
  };
*/
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

	componentWillUnmount() {
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
			// theHue,
			} = this.state;
    const {
			file = 'montenegro',
			aspect = 'portrait',
			mode = 'preview',
			hasFrame = true,
			hasMargin = false,
			hasHighlight = false,
			isInline = false,
			hue = 10,
			saturation = 82,
			lightness = 37,
			scale = 1,
			translateX = 0,
			translateY = 0,
		} = this.props;
		let theSvg = file;
		if (file === 'montenegro') {
			theSvg = Montenegro;
		}
		if (file === 'auckland') {
			theSvg = Auckland;
		}
		if (file === 'sydney') {
			theSvg = Sydney;
		}
		if (file === 'teanau') {
			theSvg = Teanau;
		}
		if (file === 'fiordland_falls') {
			theSvg = FiordlandFalls;
		}
		if (file === 'dune') {
			theSvg = Dune;
		}
		if (file === 'doubtful') {
			theSvg = Doubtful;
		}
		if (file === 'cottage_shore') {
			theSvg = CottageShore;
		}
		if (file === 'cottage_mountains') {
			theSvg = CottageMountains;
		}
		if (file === 'cave') {
			theSvg = Cave;
		}
		if (file === 'cathedral') {
			theSvg = CathedralCove;
		}
		if (file === 'moeraki') {
			theSvg = Moeraki;
		}
		if (file === 'hillsTriptych1') {
			theSvg = HillsTriptych1;
		}
		if (file === 'hillsTriptych2') {
			theSvg = HillsTriptych2;
		}
		if (file === 'hillsTriptych3') {
			theSvg = HillsTriptych3;
		}
		if (file === 'Port') {
			theSvg = Port;
		}
		if (file === 'MilfordSound') {
			theSvg = MilfordSound;
		}
		if (file === 'NorthEastValley') {
			theSvg = NorthEastValley;
		}
		const tempStyle = {
			// backgroundColor: `hsl(${theHue}, 82%, 37%)`
			// backgroundColor: `hsl(${theHue}, 50%, 50%)`
		};
						// fill: hsl(${hue}, 82%, 10%);
						// fill: hsl(${hue}, 82%, 16%);
						// fill: hsl(${hue}, 82%, 37%);
						// fill: hsl(${hue}, 82%, 61%);
						// fill: hsl(${hue}, 82%, 79%);
		const theTransform = `scale(${scale}) translateX(${translateX}%) translateY(${translateY}%)`;
		return (
			<InlineCss
			stylesheet={`
				background: red;
				.darkest path, .darkestFill, .darkest rect, .darkest circle, .darkest polygon{
						fill: hsl(${hue}, ${saturation * 100}%, ${(lightness - 0.35) * 100}%);
				}
				.darker path, .darkerFill, .darker rect, .darker circle, .darker polygon{
						fill: hsl(${hue}, ${saturation * 100}%, ${(lightness - 0.2) * 100}%);
				}
				.primary path, .primaryFill, .primary rect, .primary circle, .primary polygon{
						fill: hsl(${hue}, ${saturation * 100}%, ${lightness * 100}%);
				}
				.lighter  path, .lighterFill, .lighter rect, .lighter circle, .lighter polygon{
						fill: hsl(${hue}, ${saturation * 100}%, ${(lightness + 0.2) * 100}%);
				}
				.lightest path, .lightestFill, .lightest rect, .lightest circle, .lightest polygon{
						fill: hsl(${hue}, ${saturation * 100}%, ${(lightness + 0.4) * 100}%);
				}
				.shadow path, .shadow rect, .shadow circle, .shadow polygon{
						fill: hsla(${hue}, ${saturation * 100}%, ${(lightness - 0.35) * 100}%, 0.1);
				}
				.highlight path, .highlight rect, .highlight circle, .highlight polygon{
						fill: hsla(${hue}, ${saturation * 100}%, ${(lightness + 0.35) * 100}%, 0.1);
				}
			.color1 {
			  stop-color: hsl(${hue}, ${saturation * 100}%, ${(lightness + 0.2) * 100}%);
			}
			.color2 {
			  stop-color: hsl(${hue}, ${saturation * 100}%, ${lightness * 100}%);
			}
			.primaryStop {
			  stop-color: hsl(${hue}, ${saturation * 100}%, ${(lightness - 0.2) * 100}%);
			}
			#logo1 {
			  fill: url(#g1)
			}
			#darkerPrimary{
				fill: url(#g3)
			}
			#lighterPrimary{
				fill: url(#g2)
			}
			#svg${file}${this.state.theId} svg {
				transform: ${theTransform};
			}
				`}
				style={{ display: `${isInline ? 'inline-block' : 'block'}` }}
			>
			<div className={`${styles.DisplayImage} ${variables.colorScope} ${styles[aspect]} ${styles[mode]} ${hasHighlight ? styles.hasHighlight : ''} ${isLoading ? styles.isLoading : ''} ${hasFrame ? styles.hasFrame : ''} ${isInline ? styles.isInline : ''} ${hasMargin ? styles.hasMargin : ''}`} id={`theImage${mode}`}>
				{hasFrame &&
				<div className={styles.imgFrame} style={tempStyle} />
				}
				<div
					className={styles.theSvg}
					id={`svg${file}${this.state.theId}`}
					dangerouslySetInnerHTML={{ __html: theSvg }}
				/>
			</div>
			</InlineCss>
		);
	}
	// FUCNTIONS
}
