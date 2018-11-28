import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import { Edit, Home, ImageAdmin, Upload } from "../components";
import styles from "./App.scss";
// import fbase from "../firebase";

export default class App extends Component {
  componentDidMount() {}
  render() {
    return (
      <div className={styles.App}>
        <div className={styles.header}>
          <div className={styles.headerItem}>
            <img src="../assets/imgs/logo2.png" height="32" alt="" />
          </div>
          <Link to={"/"} className={styles.headerItem}>
            Home
          </Link>
          <Link to={"/upload"} className={styles.headerItem}>
            Upload Source Svg
          </Link>
        </div>
        <Route exact path={"/"} component={Home} />
        <Route path={"/edit"} component={Edit} />
        <Route exact path={"/image/admin"} component={ImageAdmin} />
        <Route exact path={"/upload"} component={Upload} />
      </div>
    );
  }
}

/*
	
	    const imagesRef = fbase.collection("images");
    imagesRef.get().then(querySnapshot => {
      const newArray = [];
      querySnapshot.forEach(doc => {
        newArray[doc.id] = doc.data();
      });
      this.setState({
        images: querySnapshot
      });
      console.log("querySnapshot", querySnapshot);
      console.log("newArray", newArray);
    });



	          <Link to={"/edit"} className={styles.headerItem}>
            Edit
          </Link>
          <Link to={"/image/admin"} className={styles.headerItem}>
            Img Admin
          </Link>

	*/
