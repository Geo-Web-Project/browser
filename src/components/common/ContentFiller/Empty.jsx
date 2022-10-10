import React, { useEffect, useState } from "react";

import styles from "./styles.module.css";

const GWEmpty = (props) => {
  const promptType = props.promptType;

  const prompt = `Enjoy the beauty of empty space...The current land parcel holder has not added ${promptType} content here yet.`;

  return (
    <div className={styles["wrapper"]}>
      <div className={styles["rect-box"]} />
      <span className={styles["empty-txt"]}>{prompt}</span>
    </div>
  );
};

export default GWEmpty;
