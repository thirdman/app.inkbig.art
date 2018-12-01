import React, { Component } from "react";
// import * as firebase from "firebase";
// import fbase from "../../firebase";

import Loading from "../Loading/Loading";
import SwatchGroup from "../SwatchGroup/SwatchGroup";
import { DisplayImage } from "..";

import styles from "./Swatches.scss";

require("firebase/firestore");

export default class Products extends Component {
  state = {
    isLoading: false,
    isSaving: false,
    toDelete: null
  };

  render() {
    const { dataSwatches, isLoadingSwatches } = this.props;
    const {
      isSaving,
      isLoading
      // toDelete
    } = this.state;

    return (
      <div className={`${styles.Swatches} ${styles.wrap}`}>
        <div className={`${styles.column} `}>
          <h1>Swatches</h1>
          {(isLoading || isSaving) && <Loading displayMode="default" />}
        </div>
        <div className={styles.column}>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {isLoadingSwatches && (
              <div>
                <Loading message="Loading swatches..." />
              </div>
            )}
            {dataSwatches &&
              dataSwatches.map(swatch => {
                return (
                  <SwatchGroup
                    key={`img${swatch.id}`}
                    swatch={swatch.data}
                    isVertical
                    role="presentation"
                    isFav={swatch.data.isFav}
                    onClickProps={() => this.addSwatch(swatch.id)}
                  />
                );
              })}
          </div>
        </div>
      </div>
    );
  }

  // FUNCTIONS
}
