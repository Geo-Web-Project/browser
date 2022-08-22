import React, { useState } from "react";

import styles from "./styles.module.css";

import GWEmpty from "../../../../components/common/ContentFiller/Empty";
import ContentLabel from "../../../../components/common/ContentLabel/ContentLabel";

const GWWebView = (props) => {
  const gwWebContent = props.gwWebContent;

  if (gwWebContent !== null) {
    return (
      <div>
        <iframe
          src={gwWebContent}
          className={styles["gwIframe"]}
          referrerPolicy="allow-same-origin"
        />
        <ContentLabel
          uri={gwWebContent}
          label={gwWebContent}
          hyperlink={true}
        />
      </div>
    );
  } else {
    return <GWEmpty promptType="web" />;
  }
};

export default GWWebView;
