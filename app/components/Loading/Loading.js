import React, { Component } from "react";
import classNames from "classnames";

import LoadingIcon from "../../assets/icons/loading.svg";

import styles from "./Loading.scss";

class Loading extends Component {
	render() {
		const { isActive = true, displayMode = "default" } = this.props;
		return (
			<div
				className={classNames(styles.Loading, styles[displayMode], {
					[styles.isActive]: !!isActive
				})}
			>
				<div
					className={styles.theLoading}
					dangerouslySetInnerHTML={{ __html: LoadingIcon }}
				/>
			</div>
		);
	}
}

export default Loading;
