import { useState, useMemo, useEffect } from "react";
import { Discussion } from "@orbisclub/components";
import Typography from "@material-ui/core/Typography";
import { GeoWebContent } from "@geo-web/content";
import { MediaGallery, BasicProfile } from "@geo-web/types";
import GWWebView from "../GeoWebView/GWWebView";
import GWCanvas from "../GeoWebCanvas/GWCanvas";
import "@orbisclub/components/dist/index.modern.css";
import styles from "./styles.module.css";

const CONTEXT_STREAM =
  "kjzl6cwe1jw145l33v3vbl5171apg9n413hdn0yf8eo0m95qi0iq3wdkqa71fjx";
const THEME_STREAM =
  "kjzl6cwe1jw146bq6o1175c6f0aagjtwe4t8t5csuk8onwga63k4377tpbz5ggz";

export type GWContentViewProps = {
  basicProfile: BasicProfile | null;
  mediaGallery: MediaGallery | null;
  gwContent: GeoWebContent;
  parcelId: string;
  ownerDID: string;
};

enum GwMode {
  CHAT,
  WEB,
  GALLERY,
}

export default function GWContentView(props: GWContentViewProps) {
  const { basicProfile, mediaGallery, gwContent, parcelId, ownerDID } = props;

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
        <div className={styles["chat-wrapper"]}>
          <Discussion
            context={`${CONTEXT_STREAM}:${parcelId};${ownerDID}`}
            theme={THEME_STREAM}
          />
        </div>
      ) : gwMode === GwMode.WEB ? (
        <GWWebView url={basicProfile?.url ?? null} />
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
          Parcel Chat
        </div>
        <div
          className={`${styles["tab"]} ${
            gwMode === GwMode.WEB ? styles["selected"] : ""
          }`}
          onClick={() => setGwMode(GwMode.WEB)}
        >
          {isWebAr ? "WebAR" : "Web Content"}
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
