import { useState, useMemo, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { GeoWebContent } from "@geo-web/content";
import { MediaGallery, BasicProfile } from "@geo-web/types";
import GWWebView from "../GeoWebView/GWWebView";
import GWCanvas from "../GeoWebCanvas/GWCanvas";
import StyledSwitch from "../../../../components/common/Switch/StyledSwitch";
import styles from "./styles.module.css";

export type GWContentViewProps = {
  basicProfile: BasicProfile | null;
  mediaGallery: MediaGallery | null;
  gwContent: GeoWebContent;
};

enum GwMode {
  WEB,
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

  const switchMode = (event: any) => {
    const { checked } = event.target;

    if (checked) {
      setGwMode(GwMode.GALLERY);
    } else {
      setGwMode(GwMode.WEB);
    }
  };

  return (
    <>
      {gwMode === GwMode.WEB ? (
        <GWWebView url={basicProfile?.url ?? null} />
      ) : (
        <GWCanvas mediaGallery={mediaGallery} gwContent={gwContent} />
      )}
      <div className={styles["switch-div"]}>
        <Typography>{isWebAr ? "WebAR" : "Web Content"}</Typography>
        <StyledSwitch
          color="default"
          inputProps={{ "aria-label": "checkbox with default color" }}
          checked={gwMode === GwMode.GALLERY}
          onChange={switchMode}
          className={isWebAr ? "" : styles["switch-web"]}
        />
        <Typography className={isWebAr ? "" : styles["gallery-web"]}>
          {"Gallery"}
        </Typography>
      </div>
    </>
  );
}
