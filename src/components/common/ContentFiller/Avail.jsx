import { useEffect, useState } from "react";

import styles from "./styles.module.css";

const GWAvail = (props) => {
  const promptType = props.promptType;

  const prompt1 = `No one has claimed a land parcel that includes your current location!
    Head over to `;

  const uri = "https://geoweb.land/";

  const prompt2 = ` to claim it yourself (desktop recommended).`;

  return (
    <div className={styles["wrapper"]}>
      <div className={styles["avail-img"]} />
      <div className={styles["empty-txt"]}>
        <span className={styles["txt1"]}> {prompt1} </span>
        <a
          href={uri}
          className={styles["txt2"]}
          target="_blank"
          rel="noreferrer"
        >
          {uri}
        </a>
        <span className={styles["txt3"]}> {prompt2} </span>
      </div>
    </div>
  );
};

export default GWAvail;
