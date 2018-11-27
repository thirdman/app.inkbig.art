import React, { Component } from 'react';
import reseneColors from '../../../node_modules/matrioshka.colors/dist/data/resene.json';

import styles from './NamedColor.scss';

export default class NamedColor extends Component {
	state = {
		isLoading: false,
		searchColor: '',
	};

	componentWillMount() {
  }

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
			selectedColorObject,
			searchColor,
		} = this.state;
    const {
			type = 'resene',
			name,
			// onSelect
		} = this.props;
		
		console.log('reseneColors', reseneColors);
		console.log('type', type);

		return (
			<div className={`${styles.NamedColor} ${isLoading ? styles.isLoading : ''}`} onClick={this.props.onClickProps} role="presentation">
				<div className={`${styles.segment} ${styles.info}`}>
					<h4>Select {type} Color: {selectedColorName}</h4>
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
					<div className={styles.swatchResults}>
					{selectedColor && 
						<div className={styles.swatchitem}>
							<div className={styles.swatchColor} style={{background: selectedColor}} />
							<div className={styles.swatchTitle}>
								{selectedColorName}
							</div>
							<button onClick={() => this.props.onSelect(selectedColorObject)}>Use Color</button>
						</div>
					}
					</div>
				</div>
				
			</div>
		);
	}
	// FUCNTIONS
	getColor = (name) => {
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
		
	}
	filterSwatches = (swatches, swatchName) => {
		console.log('filtering name in swatches', swatchName);
		// console.log('filtering name in swatches', swatches);
		if (!swatchName || !swatches) {
			console.log('missing name or swatches');
			return false;
		} else { // eslint-disable-line
/*
			swatches && swatches.map((swatch) => {
				console.log('swatch: ', swatch);
				console.log('swatch.obj ', swatch.obj);
			})
*/
			const selected = swatches.filter(swatch => swatch.obj.key === swatchName);
			console.log('selected is: ', selected);
			return selected[0].obj; 
		}
  }

	handleInputChange = (event) => {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		this.setState({
			[name]: value
		});
	}

	hexToHSL(hex = '#c7d92c') {
			// var color='#c7d92c'; // A nice shade of green.
			var r = parseInt(hex.substr(1,2), 16); // Grab the hex representation of red (chars 1-2) and convert to decimal (base 10).
			var g = parseInt(hex.substr(3,2), 16);
			var b = parseInt(hex.substr(5,2), 16);


    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    s = s*100;
    s = Math.round(s);
    l = l*100;
    l = Math.round(l);
		h = Math.round(360*h);
		
    const colorInHSL = 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
    return colorInHSL;
    // $rootScope.$emit('colorChanged', {colorInHSL});
   }
	hexToHSLObject(hex = '#c7d92c') {
			var r = parseInt(hex.substr(1,2), 16); // Grab the hex representation of red (chars 1-2) and convert to decimal (base 10).
			var g = parseInt(hex.substr(3,2), 16);
			var b = parseInt(hex.substr(5,2), 16);

    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2; // eslint-disable-line

    if (max === min){
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min); // eslint-disable-line
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break; // eslint-disable-line
            case g: h = (b - r) / d + 2; break; // eslint-disable-line
            case b: h = (r - g) / d + 4; break; // eslint-disable-line
        }
        h /= 6;
    }

    // s = s*100;
    // l = l*100;
    // l = Math.round(l);
		h = Math.round(360 * h);
		
    const HSLObject = {h, s, l, a: 1};
    return HSLObject;
    // $rootScope.$emit('colorChanged', {colorInHSL});
   }

}
