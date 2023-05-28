import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import Typography from "@material-ui/core/Typography";
import { GeoWebContent } from "@geo-web/content";
import { MediaGallery, BasicProfile } from "@geo-web/types";
import GWWebView from "../GeoWebView/GWWebView";
import GWCanvas from "../GeoWebCanvas/GWCanvas";
import AugmentedWorld from "../../../../components/common/AugmentedWorld/AugmentedWorld";
import "@orbisclub/components/dist/index.modern.css";
import styles from "./styles.module.css";
import { CID } from "multiformats/cid";

const Chat = dynamic(() => import("../../../../components/common/Chat/Chat"), {
  ssr: false,
});

export type GWContentViewProps = {
  basicProfile: BasicProfile | null;
  mediaGallery: MediaGallery | null;
  augmentedWorld: CID | null;
  gwContent: GeoWebContent;
  parcelId: string;
  ownerDID: string;
};

enum GwMode {
  CHAT,
  WEB,
  AR,
  GALLERY,
}

export default function GWContentView(props: GWContentViewProps) {
  const { basicProfile, mediaGallery, gwContent } = props;

  const [gwMode, setGwMode] = useState<GwMode>(GwMode.WEB);

  const isWebAr = useMemo(() => {
    if (basicProfile?.url) {
      try {
        const url = new URL(basicProfile.url);

        if (url.hostname.endsWith(".8thwall.app")) {
          return true;
        }
      } catch (err) {
        console.error(err);
      }
    }

    return false;
  }, [basicProfile]);

  useEffect(() => {
    if (!basicProfile?.url) {
      setGwMode(GwMode.GALLERY);
    }
  }, []);

  return (
    <>
      {gwMode === GwMode.CHAT ? (
        <Chat {...props} />
      ) : gwMode === GwMode.WEB ? (
        <GWWebView url={basicProfile?.url ?? null} />
      ) : gwMode === GwMode.AR ? (
        <AugmentedWorld />
      ) : (
        <GWCanvas mediaGallery={mediaGallery} gwContent={gwContent} />
      )}
      <div className={styles["tabs"]}>
        <div
          className={`${styles["tab"]} ${
            gwMode === GwMode.CHAT ? styles["selected"] : ""
          }`}
          onClick={() => setGwMode(GwMode.CHAT)}
        >
          Chat
        </div>
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
