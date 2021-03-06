import React, { Component } from "react";
import Select from "react-select"; // , { components }
import { FixedSizeList as List } from "react-window";

// import reseneColors from "../../../node_modules/matrioshka.colors/dist/data/resene.json";
import reseneColors2 from "../../assets/resene.json";

import styles from "./NamedColor.scss";

export default class NamedColor extends Component {
	state = {
		isLoading: false,
		searchColor: ""
	};

	componentWillMount() {}

	componentDidMount() {
		// const {
		// type,
		// name,
		// } = this.props;
		// const selectedColor = this.filterSwatches(reseneColors, name);
	}

	render() {
		const {
			isLoading,
			selectedColorName,
			selectedColor,
			selectedColorObject
			// searchColor
		} = this.state;
		const {
			type = "resene"
			// name
			// onSelect
		} = this.props;
		const height = 35;
		const reseneColorsArray =
			reseneColors2 &&
			this.convertObjToArray(reseneColors2.colorGroups[0].shades);
		/*
		const Option = (props) => {
			console.log('option props: ', props);
		  return (
		    <div className={styles.optionItem}>
		    	<div classname={styles.swatchColor} style={{background: props.value}}/>
		      <components.Option {...props}/>
		    </div>
		  );
		};
*/
		class MenuList extends Component {
      // eslint-disable-line
			render() {
				const { options, children, maxHeight, getValue } = this.props;
				const [value] = getValue();
				const initialOffset = options.indexOf(value) * height;
				console.log("children[0]: ", children[0]);
				return (
					<List
						height={maxHeight}
						itemCount={children.length}
						itemSize={height}
						initialScrollOffset={initialOffset}
					>
						{({ index, style }) => (
							<div className={styles.swatchitem} style={style}>
								<div
									className={styles.swatchColor}
									style={{ background: children[index].props.value }}
								/>
								<div className={styles.swatchTitle}>{children[index]}</div>
							</div>
						)}
					</List>
				);
			}
		}

		return (
			<div
				className={`${styles.NamedColor} ${isLoading ? styles.isLoading : ""}`}
				onClick={this.props.onClickProps}
				role="presentation"
			>
				<div className={`${styles.segment} ${styles.info}`}>
					<h4>Select {type} Color</h4>
					<div>
						{reseneColorsArray && (
							<Select
								options={reseneColorsArray}
								// components={{ Option }}
								components={{ MenuList }}
								isSearchable
								onInputChange={this.onSelectChange}
								onChange={this.onSelectChange}
							/>
						)}
					</div>

					<div className={styles.swatchResults}>
						{selectedColor && (
							<div className={styles.swatchitem}>
								<div
									className={styles.swatchColor}
									style={{ background: selectedColor }}
								/>
								<div className={styles.swatchTitle}>{selectedColorName}</div>
								<button
									onClick={() => this.props.onSelect(selectedColorObject)}
								>
									Use Color
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
	// FUCNTIONS

	filterSwatches = (swatches, swatchName) => {
		console.log("filtering name in swatches", swatchName);
		// console.log('filtering name in swatches', swatches);
		if (!swatchName || !swatches) {
			console.log("missing name or swatches");
			return false;
		}
    // eslint-disable-line
		/*
			swatches && swatches.map((swatch) => {
				console.log('swatch: ', swatch);
				console.log('swatch.obj ', swatch.obj);
			})
*/
		const selected = swatches.filter(swatch => swatch.obj.key === swatchName);
		console.log("selected is: ", selected);
		return selected[0].obj;
	};

	convertObjToArray = object => {
		// console.log('converting obj', object);
		const theTempArray = Object.entries(object);
		// console.log('theTempArray: ', theTempArray);
		const theArray = theTempArray.map(color => ({
			value: color[1],
			label: color[0]
		}));
		// console.log('theArray', theArray);
		return theArray;
	};

	handleInputChange = event => {
		const { target } = event;
		const { name } = target;
		const value = target.type === "checkbox" ? target.checked : target.value;
		// const name = target.name;
		this.setState({
			[name]: value
		});
	};

	onSelectChange = selectedObject => {
		console.log("onSelectChange: ", selectedObject);
		const hsl = this.hexToHSL(selectedObject.value);
		const hslObject = this.hexToHSLObject(selectedObject.value);

		this.setState({
			selectedColor: hsl,
			selectedColorObject: hslObject,
			selectedColorName: selectedObject.label
		});
		this.props.onSelect(hslObject);
	};

	hexToHSL(hex = "#c7d92c") {
		// const color='#c7d92c'; // A nice shade of green.
		let r = parseInt(hex.substr(1, 2), 16); // Grab the hex representation of red (chars 1-2) and convert to decimal (base 10).
		let g = parseInt(hex.substr(3, 2), 16);
		let b = parseInt(hex.substr(5, 2), 16);

		r /= 255;
		g /= 255;
		b /= 255;
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h = (max + min) / 2;
		let s = (max + min) / 2;
		let l = (max + min) / 2;

		if (max === min) {
			h = s = 0; // achromatic // eslint-disable-line
		} else {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
				default:
					h = (g - b) / d + (g < b ? 6 : 0);
          break; // eslint-disable-line
			}
			h /= 6;
		}

		s *= 100;
		s = Math.round(s);
		l *= 100;
		l = Math.round(l);
		h = Math.round(360 * h);

		const colorInHSL = `hsl(${h}, ${s}%, ${l}%)`;
		return colorInHSL;
		// $rootScope.$emit('colorChanged', {colorInHSL});
	}

	hexToHSLObject(hex = "#c7d92c") {
		let r = parseInt(hex.substr(1, 2), 16); // Grab the hex representation of red (chars 1-2) and convert to decimal (base 10).
		let g = parseInt(hex.substr(3, 2), 16);
		let b = parseInt(hex.substr(5, 2), 16);

		r /= 255;
		g /= 255;
		b /= 255;
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h = (max + min) / 2;
		let s = (max + min) / 2;
		const l = (max + min) / 2;

		if (max === min) {
			h = s = 0; // achromatic // eslint-disable-line
		} else {
			const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min); // eslint-disable-line
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
          break; // eslint-disable-line
				case g:
					h = (b - r) / d + 2;
          break; // eslint-disable-line
				case b:
					h = (r - g) / d + 4;
          break; // eslint-disable-line
				default:
					h = (g - b) / d + (g < b ? 6 : 0);
          break; // eslint-disable-line
			}
			h /= 6;
		}

		// s = s*100;
		// l = l*100;
		// l = Math.round(l);
		h = Math.round(360 * h);

		const HSLObject = { h, s, l, a: 1 };
		return HSLObject;
		// $rootScope.$emit('colorChanged', {colorInHSL});
	}
}
/* <RenderColorList array={reseneColorsArray} /> */

/*
					<div>
						{reseneColorsArray &&
							<Select
								options={reseneColorsArray}
								components={{ Option }}
								isSearchable
								/>
						}
					</div>
*/
/*
						<div className={styles.inputWrap}>
							<input
								type="text"
								name="searchColor"
								value={searchColor}
								ref={(searchColor) => { this.textInput = searchColor; }}
								onChange={this.handleInputChange}
							/>
						<button onClick={() => this.getColor()}>Search</button>
					</div>

*/

/*
		const Option = ({ style, option, selectValue }) => {
			return (
				<a
					className={styles.optionItem}
					style={style}
					onClick={() => selectValue(option)}
				>
					<div
						className={styles.swatchColor}
						style={{ background: option.value }}
					/>
					{option.label}
				</a>
			);
		};
*/
/*
	getColor = name => {
		const {searchColor} = this.state;
		const {
			type = 'resene'
			} = this.props;
		// console.log('getting reseneColors: ', reseneColors);
		let prefix = (type === 'resene' ? 'RESENE_' : '');
		const colorToSearch = `${prefix}${searchColor}`;
		console.log('prefix: ', prefix);
		console.log('getting colorToSearch: ', colorToSearch);
		const selectedColor = this.filterSwatches(reseneColors.items, colorToSearch);
		if (selectedColor) {
			const hsl = this.hexToHSL(selectedColor.value);
			const hslObject = this.hexToHSLObject(selectedColor.value);
			this.setState({
				selectedColor: hsl,
				selectedColorObject: hslObject,
				selectedColorName: selectedColor.key
			});
		}
	};
*/
