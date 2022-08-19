import React, { useState, useEffect } from "react";

import styles from "./styles.module.css";

const Loader = () => {
  return (
    <div className={styles["lds-ripple"]}>
      <div></div>
      <div></div>
    </div>
  );
};

export default Loader;
