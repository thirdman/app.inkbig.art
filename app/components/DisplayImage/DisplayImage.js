import React, { Component } from "react";
import InlineCss from "react-inline-css";

import styles from "./DisplayImage.scss";
import variables from "../../assets/scss/variables.scss";
import "../../assets/scss/variables.css";

import Loading from "../Loading/Loading";

import {
	Auckland,
	AucklandSkyline,
	AucklandOneTreeHill,
	Dune,
	Cave,
	Christchurch,
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
	Piha,
	Rakiura,
	StClair,
	Sydney,
	Teanau,
	FiordlandFalls,
	Wakatipu,
	Wellington,
	Wedding
} from "../../assets/svg";

export default class DisplayImage extends Component {
	/*
	static propTypes = {
		file
  };
*/
	state = {
		isLoading: true,
		hasLoaded: false,
		// theHue: 10,
		theId: this.makeId(),
		svgAttributes: {
			version: "1.1",
			xmlns: "http://www.w3.org/2000/svg",
			"xmlns:xlink": "http://www.w3.org/1999/xlink",
			x: "0",
			y: "0",
			viewBox: "0, 0, 3000, 3000",
			width: "100%",
			height: "100%",
			preserveAspectRatio: "xMidYMid slice"
		}
	};

	componentDidMount() {
		const { file } = this.props;
		// const { svgAttributes } = this.state;
		if (file) {
			this.setLoading(false);
		}
		if (this.props.sourceSvg) {
			this.setLoading(false);
			// this.resolveSvg();
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.sourceSvg && prevProps.sourceSvg !== this.props.sourceSvg) {
			console.log("sourcesvg props changed, loading it...");
			// this.resolveSvg();
		}
	}

	componentWillUnmount() {}

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

	render() {
		const { isLoading, svgAttributes, workingSvg } = this.state;
		const {
			divId,
			sourceSvg,
			file,
			aspect = "portrait",
			mode = "preview",
			svgBackgroundColor,
			hasBackground = false,
			hasFrame = true,
			hasMargin = false,
			hasHighlight = false,
			hasTitles = this.props.aspect === "circle" || false,
			isInline = false,
			isCentered = false,
			imageLevels = [10, 16, 37, 61, 79],
			hue = 10,
			saturation = 82,
			lightness = 37,
			scale = 1,
			translateX = 0,
			translateY = 0,
			imageColorArray,
			theTitle,
			theSubtitle1,
			theSubtitle2
		} = this.props;
		let theSvg = sourceSvg || file;
		if (file === "montenegro") {
			theSvg = Montenegro;
		}
		if (file === "auckland") {
			theSvg = Auckland;
		}
		if (file === "sydney") {
			theSvg = Sydney;
		}
		if (file === "teanau") {
			theSvg = Teanau;
		}
		if (file === "fiordland_falls") {
			theSvg = FiordlandFalls;
		}
		if (file === "dune") {
			theSvg = Dune;
		}
		if (file === "doubtful") {
			theSvg = Doubtful;
		}
		if (file === "cottage_shore") {
			theSvg = CottageShore;
		}
		if (file === "cottage_mountains") {
			theSvg = CottageMountains;
		}
		if (file === "christchurch") {
			theSvg = Christchurch;
		}
		if (file === "cave") {
			theSvg = Cave;
		}
		if (file === "cathedral") {
			theSvg = CathedralCove;
		}
		if (file === "moeraki") {
			theSvg = Moeraki;
		}
		if (file === "hillsTriptych1") {
			theSvg = HillsTriptych1;
		}
		if (file === "hillsTriptych2") {
			theSvg = HillsTriptych2;
		}
		if (file === "hillsTriptych3") {
			theSvg = HillsTriptych3;
		}
		if (file === "Port") {
			theSvg = Port;
		}
		if (file === "Piha") {
			theSvg = Piha;
		}
		if (file === "MilfordSound") {
			theSvg = MilfordSound;
		}
		if (file === "NorthEastValley") {
			theSvg = NorthEastValley;
		}
		if (file === "Rakiura") {
			theSvg = Rakiura;
		}
		if (file === "Kahurangi") {
			theSvg = Kahurangi;
		}
		if (file === "Wakatipu") {
			theSvg = Wakatipu;
		}
		if (file === "StClair") {
			theSvg = StClair;
		}
		if (file === "NelsonLakes") {
			theSvg = NelsonLakes;
		}
		if (file === "Hokonui") {
			theSvg = Hokonui;
		}
		if (file === "AucklandSkyline") {
			theSvg = AucklandSkyline;
		}
		if (file === "AucklandOneTreeHill") {
			theSvg = AucklandOneTreeHill;
		}
		if (file === "Wellington") {
			theSvg = Wellington;
		}
		if (file === "Wedding") {
			theSvg = Wedding;
		}

		if (sourceSvg) {
			/*
      const theSvgPreviewId = document.getElementById(`theImage${mode}`);
      // console.log("theSvgPreviewId", theSvgPreviewId);
      if (theSvgPreviewId) {
        const theSvgPreviewIdText = document.getElementById(
          `svg${file}${this.state.theId}`
        );
        console.log("theSvgPreviewIdText", theSvgPreviewIdText);
        const theSvgId = theSvgPreviewId.getElementsByTagName("svg")[0];
        console.log("theSvgId", theSvgId);
        if (theSvgPreviewIdText && theSvgId) {
          console.log("theSvgPreviewIdText && theSvgId exist");
          svgAttributes &&
            Object.entries(svgAttributes).map(([key, value]) => {
              // eslint-disable-line
              console.log("setting key: ", key, " and value: ", value);
              theSvgId.setAttribute(key, value);
            });
          theSvgId.setAttribute("hello", 12345);
        }
      }
*/
		}
		const titleLength = theTitle && theTitle.length;
		// console.log('titleLength', titleLength);
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
				// background: hsl(${hue}, ${saturation * 100}%, ${imageLevels[2]}%);
				background: ${svgBackgroundColor};
			}
				`}
				style={{ display: `${isInline ? "inline-block" : "block"}` }}
			>
				<div
					className={`
				${styles.DisplayImage} 
				${variables.colorScope} ${styles[aspect]} 
				${styles[mode]}
				${hasHighlight ? styles.hasHighlight : ""} 
				${isCentered ? styles.isCentered : ""} 
				${isLoading ? styles.isLoading : ""} 
				${isInline ? styles.isInline : ""} 
				${hasTitles ? styles.hasTitles : ""} 
				${hasFrame ? styles.hasFrame : ""} 
				${hasMargin ? styles.hasMargin : ""} 
				${hasBackground ? styles.hasBackground : ""} 
				${titleLength && titleLength > 15 ? styles.hasNarrowTitle : ""}
				`}
					id={divId || `theImage${mode}`}
				>
					{!isLoading && hasFrame && (
						<div className={styles.imgFrame} style={tempStyle} />
					)}

					<div
						className={styles.theSvg}
						id={`svg${file}${this.state.theId}`}
						dangerouslySetInnerHTML={{ __html: theSvg }}
					/>
					{!isLoading && hasTitles && (
						<div className={styles.titleBlock}>
							{theTitle && <h2>{theTitle}</h2>}
							<h3>
								{theSubtitle1}
								{theSubtitle2 && <span className={styles.divider} />}
								{theSubtitle2}
							</h3>
						</div>
					)}
					{isLoading && <Loading displayMode="centered" />}
				</div>
			</InlineCss>
		);
	}

	// FUCNCTIONS
	setLoading = state => {
		this.setState({
			isLoading: state
		});
	};

	resolveSvg = () => {
		const { sourceSvg, mode, file } = this.props;
		const { svgAttributes } = this.state;
		console.log("resolving svg, file, mode: ", file, mode);
		console.log("resolving svg, svgAttributes: ", svgAttributes);
		if (sourceSvg) {
			/*
      const theSvgPreviewId = document.getElementById(`theImage${mode}`);
      // console.log("theSvgPreviewId", theSvgPreviewId);
      if (theSvgPreviewId) {
        const theSvgPreviewIdText = document.getElementById(
          `svg${file}${this.state.theId}`
        );
        console.log("theSvgPreviewIdText", theSvgPreviewIdText);
        const theSvgId = theSvgPreviewId.getElementsByTagName("svg")[0];
        // const theSvgById = theSvgPreviewId.getElementsByTagName("svg")[0];
        if (theSvgPreviewIdText && theSvgId) {
          console.log("theSvgPreviewIdText && theSvgId exist");
          svgAttributes &&
            Object.entries(svgAttributes).map(([key, value]) => {
              // eslint-disable-line
              console.log("setting key: ", key, " and value: ", value);
              theSvgId.setAttribute(key, value);
            });
          theSvgId.setAttribute("hello", 12345);
        }
        this.setState({
          isLoading: false
          // workingSvg: workingSvgCode
        });
      }
*/
		}
	};
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

/*
		if (this.props.file === 'Wakatipu' && this.props.aspect === 'portrait') {
			const theWakatipu = document.getElementById('svgWakatipu');
			console.log('theWakatipu', theWakatipu);
			// theWakatipu.setAttribute('preserveAspectRatio', 'xMidYMid slice');
			theWakatipu.setAttribute('preserveAspectRatio', 'xMidYMin meet');
		}
*/

/*
    if (sourceSvg) {
      const theSvgPreviewId = document.getElementById(`theImage${mode}`);
      // console.log('theSvgPreviewId', theSvgPreviewId);
      if (theSvgPreviewId) {
        const theSvgPreviewIdText = document.getElementById(
          `svg${file}${this.state.theId}`
        );
        // console.log('theSvgPreviewIdText', theSvgPreviewIdText);
        const theSvgId = theSvgPreviewId.getElementsByTagName("svg")[0];
        // console.log('theSvgId', theSvgId);
        if (theSvgPreviewIdText && theSvgId) {
          svgAttributes &&
            Object.entries(svgAttributes).map(([key, value]) => {
              // eslint-disable-line
              theSvgId.setAttribute(key, value);
            });
        }
      }
    }
    
*/

/*
					theSvgId.setAttribute([svgAttributes.version].name, svgAttributes.version);
					theSvgId.setAttribute([svgAttributes.xmlns].name, svgAttributes.xmlns);
					// theSvgId.setAttribute([svgAttributes.xmlns:xlink].name, svgAttributes.'xmlns:xlink');
					// theSvgId.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
					theSvgId.setAttribute('x', '0');
					theSvgId.setAttribute('y', '0');
					theSvgId.setAttribute('viewBox', '0, 0, 3000, 3000');
					theSvgId.setAttribute('width', '100%');
					theSvgId.setAttribute('height', '100%');
					theSvgId.setAttribute('preserveAspectRatio', 'xMidYMid slice');
						*/
