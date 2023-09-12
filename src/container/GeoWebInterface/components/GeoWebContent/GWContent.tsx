import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import Typography from "@material-ui/core/Typography";
import GWWebView from "../GeoWebView/GWWebView";
import GWCanvas from "../GeoWebCanvas/GWCanvas";
import { MediaGallery } from "../GeoWebCanvas/GWCanvas";
import AugmentedWorld from "../../../../components/common/AugmentedWorld/AugmentedWorld";
import styles from "./styles.module.css";
import { Entity } from "@latticexyz/recs";

export type GWContentViewProps = {
  url: string | null;
  mediaObjects: Entity[];
  // augmentedWorld: CID | null;
  parcelId: string;
  ownerDID: string;
};

enum GwMode {
  WEB,
  AR,
  GALLERY,
}

export default function GWContentView(props: GWContentViewProps) {
  const { url, mediaObjects } = props;

  const [gwMode, setGwMode] = useState<GwMode>(GwMode.WEB);

  const isWebAr = useMemo(() => {
    if (url) {
      try {
        const parsedUrl = new URL(url);

        if (parsedUrl.hostname.endsWith(".8thwall.app")) {
          return true;
        }
      } catch (err) {
        console.error(err);
      }
    }

    return false;
  }, [url]);

  useEffect(() => {
    if (!url) {
      setGwMode(GwMode.GALLERY);
    }
  }, []);

  return (
    <>
      {gwMode === GwMode.WEB ? (
        <GWWebView url={url ?? null} />
      ) : gwMode === GwMode.AR ? (
        <div></div>
      ) : (
        // <AugmentedWorld
        //   augmentedWorldCid={augmentedWorld}
        //   gwContent={gwContent}
        // />
        <GWCanvas mediaObjects={mediaObjects} />
      )}
      <div className={styles["tabs"]}>
        <div
          className={`${styles["tab"]} ${
            gwMode === GwMode.WEB ? styles["selected"] : ""
          }`}
          onClick={() => setGwMode(GwMode.WEB)}
        >
          {isWebAr ? "WebAR" : "Web"}
        </div>
        <div
          className={`${styles["tab"]} ${
            gwMode === GwMode.AR ? styles["selected"] : ""
          }`}
          onClick={() => setGwMode(GwMode.AR)}
        >
          AR
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
