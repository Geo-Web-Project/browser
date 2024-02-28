import { useState, useEffect } from "react";
import GWWebView from "../GeoWebView/GWWebView";
import GWCanvas from "../GeoWebCanvas/GWCanvas";
import { MediaObject } from "../../../../lib/world";
import styles from "./styles.module.css";

export type GWContentViewProps = {
  url: string | null;
  mediaObjects: MediaObject[];
  parcelId: string;
};

enum GwMode {
  WEB,
  GALLERY,
}

export default function GWContentView(props: GWContentViewProps) {
  const { url, mediaObjects } = props;

  const [gwMode, setGwMode] = useState<GwMode>(GwMode.WEB);

  useEffect(() => {
    if (!url) {
      setGwMode(GwMode.GALLERY);
    }
  }, []);

  return (
    <>
      {gwMode === GwMode.WEB ? (
        <GWWebView url={url ?? null} />
      ) : (
        <GWCanvas mediaObjects={mediaObjects} />
      )}
      <div className={styles["tabs"]}>
        <div
          className={`${styles["tab"]} ${
            gwMode === GwMode.WEB ? styles["selected"] : ""
          }`}
          onClick={() => setGwMode(GwMode.WEB)}
        >
          Web
        </div>
        <div
          className={`${styles["tab"]} ${
            gwMode === GwMode.GALLERY ? styles["selected"] : ""
          }`}
          onClick={() => setGwMode(GwMode.GALLERY)}
        >
          Gallery
        </div>
      </div>
    </>
  );
}
