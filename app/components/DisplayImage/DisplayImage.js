import React, { Component } from 'react';
import InlineCss from 'react-inline-css';

import styles from './DisplayImage.scss';
import variables from '../../assets/scss/variables.scss';
import '../../assets/scss/variables.css';

import {
	Auckland,
	AucklandSkyline,
	Dune,
	Cave,
	CathedralCove,
	CottageShore,
	CottageMountains,
	Doubtful,
	Hokonui,
	HillsTriptych1,
	HillsTriptych2,
	HillsTriptych3,
	Kahurangi,
	MilfordSound,
	Moeraki,
	Montenegro,
	NorthEastValley,
	NelsonLakes,
	Port,
	Rakiura,
	StClair,
	Sydney,
	Teanau,
	FiordlandFalls,
	Wakatipu,
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
/*
		if (this.props.file === 'Wakatipu' && this.props.aspect === 'portrait') {
			const theWakatipu = document.getElementById('svgWakatipu');
			console.log('theWakatipu', theWakatipu);
			// theWakatipu.setAttribute('preserveAspectRatio', 'xMidYMid slice');
			theWakatipu.setAttribute('preserveAspectRatio', 'xMidYMin meet');
		}
*/
		if (this.props.file === 'Wakatipu' && this.props.aspect === 'landscape') {
			const theWakatipu = document.getElementById('svgWakatipu');
			theWakatipu.setAttribute('preserveAspectRatio', 'xMidYMid slice');
		}
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
			divId,
			file = 'montenegro',
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
		if (file === 'Rakiura') {
			theSvg = Rakiura;
		}
		if (file === 'Kahurangi') {
			theSvg = Kahurangi;
		}
		if (file === 'Wakatipu') {
			theSvg = Wakatipu;
		}
		if (file === 'StClair') {
			theSvg = StClair;
		}
		if (file === 'NelsonLakes') {
			theSvg = NelsonLakes;
		}
		if (file === 'Hokonui') {
			theSvg = Hokonui;
		}
		if (file === 'AucklandSkyline') {
			theSvg = AucklandSkyline;
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
		let colorStop1 = `hsl(${hue}, ${saturation * 100}%, ${imageLevels[0]}%)`;
		let colorStop2 = `hsl(${hue}, ${saturation * 100}%, ${imageLevels[1]}%)`;
		let colorStop3 = `hsl(${hue}, ${saturation * 100}%, ${imageLevels[2]}%)`;
		let colorStop4 = `hsl(${hue}, ${saturation * 100}%, ${imageLevels[3]}%)`;
		let colorStop5 = `hsl(${hue}, ${saturation * 100}%, ${imageLevels[4]}%)`;
		// console.log('colorStop1 and imageColorArray', colorStop1, imageColorArray);
		if (imageColorArray) {
			colorStop1 = imageColorArray[0];
			colorStop2 = imageColorArray[1];
			colorStop3 = imageColorArray[2];
			colorStop4 = imageColorArray[3];
			colorStop5 = imageColorArray[4];
		}
		return (
			<InlineCss
			stylesheet={`
				#svg${file}${this.state.theId} svg .darkest path,
				#svg${file}${this.state.theId} svg .darkestFill,
				#svg${file}${this.state.theId} svg .darkest rect,
				#svg${file}${this.state.theId} svg .darkest circle,
				#svg${file}${this.state.theId} svg .darkest polygon{
						fill: ${colorStop1};
				}
				#svg${file}${this.state.theId} svg .darker path,
				#svg${file}${this.state.theId} svg .darkerFill,
				#svg${file}${this.state.theId} svg .darker rect,
				#svg${file}${this.state.theId} svg .darker circle,
				#svg${file}${this.state.theId} svg .darker polygon{
						fill: ${colorStop2};
				}

				#svg${file}${this.state.theId} svg .primary path,
				#svg${file}${this.state.theId} svg .primaryFill,
				#svg${file}${this.state.theId} svg .primary rect,
				#svg${file}${this.state.theId} svg .primary circle,
				#svg${file}${this.state.theId} svg .primary polygon{
						fill: ${colorStop3};
				}
				#svg${file}${this.state.theId} svg .lighter path,
				#svg${file}${this.state.theId} svg .lighterFill,
				#svg${file}${this.state.theId} svg .lighter rect,
				#svg${file}${this.state.theId} svg .lighter circle,
				#svg${file}${this.state.theId} svg .lighter polygon{
						fill: ${colorStop4};
				}
				#svg${file}${this.state.theId} svg .lightest path,
				#svg${file}${this.state.theId} svg .lightestFill,
				#svg${file}${this.state.theId} svg .lightest rect,
				#svg${file}${this.state.theId} svg .lightest circle,
				#svg${file}${this.state.theId} svg .lightest polygon{
						fill: ${colorStop5};
				}

				#svg${file}${this.state.theId} svg .shadow path,
				#svg${file}${this.state.theId} svg .shadowFill,
				#svg${file}${this.state.theId} svg .shadow rect,
				#svg${file}${this.state.theId} svg .shadow circle,
				#svg${file}${this.state.theId} svg .shadow polygon{
						fill: hsla(${hue}, ${saturation * 100}%, ${imageLevels[0]}%, 0.1);
				}
				#svg${file}${this.state.theId} svg .highlight path,
				#svg${file}${this.state.theId} svg .highlightFill,
				#svg${file}${this.state.theId} svg .highlight rect,
				#svg${file}${this.state.theId} svg .highlight circle,
				#svg${file}${this.state.theId} svg .highlight polygon{
						fill: hsla(${hue}, ${saturation * 100}%, ${imageLevels[4]}%, 0.1);
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
			#svg${file}${this.state.theId}{
				background: hsl(${hue}, ${saturation * 100}%, ${imageLevels[2]}%);
			}
				`}
				style={{ display: `${isInline ? 'inline-block' : 'block'}` }}
			>
			<div className={`${styles.DisplayImage} ${variables.colorScope} ${styles[aspect]} ${styles[mode]} ${hasHighlight ? styles.hasHighlight : ''} ${isLoading ? styles.isLoading : ''} ${hasFrame ? styles.hasFrame : ''}  ${hasBackground ? styles.hasBackground : ''} ${isInline ? styles.isInline : ''} ${hasMargin ? styles.hasMargin : ''}`} id={divId || `theImage${mode}`}>
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
/*
	// darkest fill: hsl(${hue}, ${saturation * 100}%, ${(lightness - 0.35) * 100}%);
	// darker fill: hsl(${hue}, ${saturation * 100}%, ${(lightness - 0.2) * 100}%);
	// primary fill: hsl(${hue}, ${saturation * 100}%, ${lightness * 100}%);
	// lighter fill: hsl(${hue}, ${saturation * 100}%, ${(lightness + 0.2) * 100}%);
	// lightest fill: hsl(${hue}, ${saturation * 100}%, ${(lightness + 0.4) * 100}%);
	// shadow fill: hsla(${hue}, ${saturation * 100}%, ${(lightness - 0.35) * 100}%, 0.1);
	// highlight fill: hsla(${hue}, ${saturation * 100}%, ${(lightness + 0.35) * 100}%, 0.1);
*/
