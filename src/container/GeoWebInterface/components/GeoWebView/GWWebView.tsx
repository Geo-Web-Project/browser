import React, { useState } from "react";

import styles from "./styles.module.css";

import GWEmpty from "../../../../components/common/ContentFiller/Empty";
import ContentLabel from "../../../../components/common/ContentLabel/ContentLabel";

export type GWWebViewProps = {
  url: string | null;
};

const GWWebView = (props: GWWebViewProps) => {
  const gwWebContent = props.url;

  if (gwWebContent !== null) {
    return (
      <div>
        <iframe
          src={gwWebContent}
          className={styles["gwIframe"]}
          allow="camera;gyroscope;accelerometer;magnetometer;xr-spatial-tracking;microphone;"
        />
        <ContentLabel
          uri={gwWebContent ?? ""}
          label={gwWebContent ?? ""}
          hyperlink={true}
        />
      </div>
    );
  } else {
    return <GWEmpty promptType="web" />;
  }
};

export default GWWebView;
