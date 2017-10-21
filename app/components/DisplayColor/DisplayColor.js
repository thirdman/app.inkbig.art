import React, { Component } from 'react';
// import { ChromePicker, BlockPicker, SliderPicker, SketchPicker } from 'react-color';
// import fbase from '../../firebase';

import styles from './DisplayColor.scss';

const { Hue, Saturation } = require('react-color/lib/components/common');

export default class DisplayColor extends Component {
	state = {
		isError: false
	};

	componentWillMount() {
  }

	componentDidMount() {
	}

	render() {
    const {
			// colorObj,
			hsl = this.props.colorObj.hsl,
			// hsv = this.props.colorObj.hsv
		} = this.props;
		const {
			isError,
			} = this.state;
			console.log(hsl);
		return (
			<div className={`${styles.DisplayColor} ${isError ? styles.isError : ''}`}>
				<div className={`${styles.bar} ${styles.hueBar}`}>
					<Hue
						{...this.props}
						// pointer={ CustomPointer }
						// onChange={ this.handleChange }
						direction={'horizontal'}
					/>
				</div>
				<div className={`${styles.bar} ${styles.hueBar}`}>
					<Saturation
						{...this.props}
						direction={'horizontal'}
						// onChange={ this.handleChange }
					/>
				</div>
			</div>
		);
	}
	// FUCNTIONS
}
// onClick={ this.handleClick }
