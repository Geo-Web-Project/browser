import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Menu from "../Menu/Menu";
//Page Layout including Title and Background
const TitleBar = (props) => {
  const accessGps = props.accessGps;

  return (
    <div className={styles["layout-div"]}>
      <div className={styles["title-bar"]}>
        <div className={styles["logo"]} />
        <div className={styles["title-txt"]}>{"Geo Web"}</div>
        <div className={styles["title-caption"]}>{"Browse Earth"}</div>
        <Menu
          coordinate={props.coordinate}
          showPosition={props.showPosition}
          accessGps={accessGps}
        />
      </div>
    </div>
  );
};

export default TitleBar;
