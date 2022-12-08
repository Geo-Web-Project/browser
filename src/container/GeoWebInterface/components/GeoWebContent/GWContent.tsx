import React, { useState, useEffect } from "react";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import { MediaGallery, BasicProfile } from "@geo-web/types";
import { GeoWebContent } from "@geo-web/content";

import GWWebView from "../GeoWebView/GWWebView";
import GWCanvas from "../GeoWebCanvas/GWCanvas";

import styles from "./styles.module.css";

export type GWContentViewProps = {
  basicProfile: BasicProfile | null;
  mediaGallery: MediaGallery | null;
  gwContent: GeoWebContent;
};

const GWContentView = (props: GWContentViewProps) => {
  const { basicProfile, mediaGallery, gwContent } = props;
  const [gwMode, setGwMode] = useState("web");

  const switchMode = (event: any) => {
    let _checked = event.target.checked;

    if (_checked === false) setGwMode("web");
    else if (_checked === true) setGwMode("3d");
  };

  //Toggle Between Web & 3D Content
  return (
    <div>
      <div className={styles["switch-div"]}>
        <Typography className={styles["switch-left"]}>
          {"Web Content"}
        </Typography>
        <Switch
          color="default"
          inputProps={{ "aria-label": "checkbox with default color" }}
          style={{ position: "absolute", top: "0px" }}
          onChange={switchMode}
        />
        <Typography className={styles["switch-right"]}>
          {"3D Gallery"}
        </Typography>
      </div>

      <div
        style={{
          position: "absolute",
          width: "99%",
          visibility: gwMode === "web" ? "visible" : "hidden",
        }}
      >
        <GWWebView url={basicProfile?.url ?? null} />
      </div>

      <div style={{ visibility: gwMode === "3d" ? "visible" : "hidden" }}>
        <GWCanvas mediaGallery={mediaGallery} gwContent={gwContent} />
      </div>
    </div>
  );
};

export default GWContentView;
