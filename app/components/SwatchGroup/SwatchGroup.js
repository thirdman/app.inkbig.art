import React, { Component } from 'react';

import styles from './SwatchGroup.scss';

export default class SwatchGroup extends Component {
	state = {
		isLoading: false
	};

	componentWillMount() {
  }

	componentDidMount() {
	}

	render() {
		// const {} = this.state;
    const {
			isHorizontal = false,
			swatch,
		} = this.props;
		let {
			colorArray = this.props.swatch.colorArray || []
		} = this.props;
		if (swatch.type === 'pair') {
			colorArray = swatch.pairColorArray;
		}
		return (
			<div className={`${styles.SwatchGroup} ${isHorizontal ? styles.horizontal : styles.vertical}`} onClick={this.props.onClickProps} role="presentation">
				<div className={`${styles.segment} ${styles.info}`}>
					<h4>{swatch && swatch.name}</h4>
				</div>
				{colorArray.map((colorObj) => {
					return (
					<div className={`${styles.segment}`} key={`col${colorObj}`}>
						<span className={styles.colorSwatch} style={{ backgroundColor: colorObj }} />
						<span className={styles.colorName}>{colorObj}</span>
					</div>
					);
				})
				}
			</div>
		);
	}
	// FUCNTIONS
}
