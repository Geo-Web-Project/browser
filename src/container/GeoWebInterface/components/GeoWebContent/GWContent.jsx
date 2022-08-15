import React, { useState, useEffect } from "react";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";

import GWWebView from "../GeoWebView/GWWebView";
import GWCanvas from "../GeoWebCanvas/GWCanvas";

import styles from "./styles.module.css";

const GWContent = (props) => {
    const gwWebContent = props.gwWebContent;
    const gwCanvasContent = props.gwCanvasContent;

    const [gwMode, setGwMode] = useState("web");

    const switchMode = (event) => {
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
                <GWWebView gwWebContent={gwWebContent} />
            </div>

            <div style={{ visibility: gwMode === "3d" ? "visible" : "hidden" }}>
                <GWCanvas gwCanvasContent={gwCanvasContent} />
            </div>
        </div>
    );
};

export default GWContent;
