import React, { Component } from "react";
import classNames from "classnames";

import LoadingIcon from "../../assets/icons/loading.svg";

import styles from "./Loading.scss";

class Loading extends Component {
	render() {
		const { isActive = true, displayMode = "default", message } = this.props;
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
				{message && <span>{message}</span>}
			</div>
		);
	}
}

export default Loading;
