import React, { Component } from "react";

import styles from "./SwatchGroup.scss";

export default class SwatchGroup extends Component {
	state = {
		isLoading: false
	};

	componentWillMount() {}

	componentDidMount() {}

	render() {
		const { isLoading } = this.state;
		const { isHorizontal = false, swatch, isFav = false } = this.props;
		let {
			colorArray = (this.props.swatch && this.props.swatch.swatchColorArray) ||
				[]
		} = this.props;
		if (swatch && swatch.type === "pair") {
			colorArray = swatch.pairColorArray;
		}
		return swatch ? (
			<div
				className={`${styles.SwatchGroup} ${
					isHorizontal ? styles.horizontal : styles.vertical
				} ${isLoading ? styles.isLoading : ""} ${isFav ? styles.isFav : ""}`}
				onClick={this.props.onClickProps}
				role="presentation"
			>
				<div className={`${styles.segment} ${styles.info}`}>
					<h4>{swatch && swatch.name}</h4>
				</div>
				{colorArray.map(colorObj => {
					return (
						<div className={`${styles.segment}`} key={`col${colorObj}`}>
							<span
								className={styles.colorSwatch}
								style={{ backgroundColor: colorObj }}
							/>
							<span className={styles.colorName}>{colorObj}</span>
						</div>
					);
				})}
			</div>
		) : (
			<div>no swatch defined</div>
		);
	}
	// FUCNTIONS
}
