import React, { Component } from "react";
// import * as firebase from "firebase";
// import fbase from "../../firebase";

import Loading from "../Loading/Loading";
import { DisplayImage } from "..";

import styles from "./Products.scss";

require("firebase/firestore");

export default class Products extends Component {
	state = {
		isLoading: false,
		isSaving: false,
		theHue: 215.625,
		theLightness: 0.45,
		theSaturation: 0.5,
		toDelete: null
	};

	render() {
		const { dataEditions, isLoadingEditions } = this.props;
		const {
			isSaving,
			isLoading,
			theHue,
			theLightness,
			theSaturation
			// toDelete
		} = this.state;

		return (
			<div className={`${styles.Products} ${styles.wrap}`}>
				<div className={`${styles.column} `}>
					<h1>Products</h1>
					{(isLoading || isSaving) && <Loading displayMode="default" />}
				</div>
				<div className={styles.column}>
					<div className={styles.imageList}>
						{!isLoadingEditions &&
							dataEditions &&
							dataEditions.map(img => {
								return (
									<div
										key={`img${img.id}`}
										className={`${styles.imageCard} ${styles.listItem}`}
										role="presentation"
										onClick={() =>
											this.doRouteImageEdit("/image/admin", img.id)
                    } // eslint-disable-line
									>
										<div className={styles.preview}>
											{img.data && img.data.image && (
												<DisplayImage
													file={img.data.image}
													aspect="square"
													mode="thumbnail"
													hasHighlight
													hasFrame={false}
													isInline
													hasMargin={false}
													hue={theHue}
													saturation={theSaturation}
													lightness={theLightness}
													scale={img.data.theScale}
													translateX={img.data.theTranslateX}
													translateY={img.data.theTranslateY}
												/>
											)}
										</div>
										<div className={styles.content}>
											<h5>{img.data.name || img.data.image || "-"}</h5>
											<h6>
												{img.data.modifiedDate && (
													<div>{img.data.modifiedDate.toDateString()}</div>
												)}
											</h6>
										</div>
										<div className={styles.meta}>
											{img.renders && ( // (img.renders.length >= 0) &&
												<div className={styles.theCount}>
													{img.renders.length}
												</div>
											)}
											<button
												className={styles.editButton}
												onClick={() =>
													this.doRouteImageEdit("/image/admin", img.id)
                        } // eslint-disable-line
											>
												edit
											</button>
										</div>
									</div>
								);
							})}
					</div>
				</div>
			</div>
		);
	}

	// FUNCTIONS
	doRouteImageEdit(route, imageId) {
		const { history } = this.props;
		history.push({
			pathname: route,
			state: {
				imageId
			}
		});
	}
}
