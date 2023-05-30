import { useState, useEffect } from "react";
import { Close } from "@material-ui/icons";
import GWEmpty from "../../../../components/common/ContentFiller/Empty";
import styles from "./styles.module.css";

export type GWWebViewProps = {
  url: string | null;
};

export default function GWWebView(props: GWWebViewProps) {
  const { url } = props;

  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  useEffect(() => {
    [
      "fullscreenchange",
      "webkitfullscreenchange",
      "mozfullscreenchange",
      "fullscreenerror",
      "webkitfullscreenerror",
      "mozfullscreenerror",
    ].forEach((eventName) =>
      document.documentElement.addEventListener(eventName, () =>
        setIsFullScreen((prev) => !prev)
      )
    );
  }, []);

  const toggleFullScreen = () => {
    const doc: any = document;
    const docElem: any = document.documentElement;

    if (
      !doc.fullscreenElement &&
      !doc.webkitFullscreenElement &&
      !doc.mozFullScreenElement
    ) {
      if (docElem.requestFullscreen) {
        docElem.requestFullscreen();
      } else if (docElem.webkitRequestFullscreen) {
        docElem.webkitRequestFullscreen();
      } else if (docElem.mozRequestFullScreen) {
        docElem.mozRequestFullScreen();
      } else {
        setIsFullScreen(!isFullScreen);
      }
    } else if (
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement
    ) {
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.cancelFullScreen();
      }
    }
  };

  if (!url) {
    return <GWEmpty promptType="web" />;
  }

  return (
    <div className={styles["wrapper"]}>
      <iframe
        className={styles[isFullScreen ? "full-screen" : "gwIframe"]}
        src={"https://192.168.40.215:8081"}
        allow="fullscreen;geolocation;camera;gyroscope;accelerometer;magnetometer;xr-spatial-tracking;microphone;clipboard-write;"
      />
      <button
        className={`${styles["full-screen-btn"]} ${
          styles[isFullScreen ? "off" : "on"]
        }`}
        onClick={toggleFullScreen}
      >
        {isFullScreen ? (
          <Close style={{ color: "#fff" }} />
        ) : (
          <img
            style={{ width: 22 }}
            src="/assets/fullscreen.svg"
            alt="full screen button"
          />
        )}
      </button>
    </div>
  );
}
