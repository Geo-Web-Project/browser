import { useState } from "react";
import { Close } from "@material-ui/icons";
import GWEmpty from "../../../../components/common/ContentFiller/Empty";
import styles from "./styles.module.css";

export type GWWebViewProps = {
  url: string | null;
};

export default function GWWebView(props: GWWebViewProps) {
  const { url } = props;

  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  if (!url) {
    return <GWEmpty promptType="web" />;
  }

  return (
    <div className={styles["wrapper"]}>
      <iframe
        className={styles[isFullScreen ? "full-screen" : "gwIframe"]}
        src={url}
        allow="geolocation;camera;gyroscope;accelerometer;magnetometer;xr-spatial-tracking;microphone;"
      />
      <button
        className={`${styles["full-screen-btn"]} ${
          styles[isFullScreen ? "on" : "off"]
        }`}
        onClick={() => setIsFullScreen(!isFullScreen)}
      >
        {isFullScreen ? (
          <Close fontSize="large" style={{ color: "#fff" }} />
        ) : (
          <img
            style={{ width: 30 }}
            src="/assets/fullscreen.svg"
            alt="full screen button"
          />
        )}
      </button>
    </div>
  );
}
