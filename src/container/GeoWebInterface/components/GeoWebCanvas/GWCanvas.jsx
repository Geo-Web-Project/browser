import React, { useEffect, useState } from "react";
import GWEmpty from "../../../../components/common/ContentFiller/Empty";
import ContentLabel from "../../../../components/common/ContentLabel/ContentLabel";

import styles from "./styles.module.css";

const gwGateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY;

const ModelViewer = (props) => {
    let url = props.url;
    let modelRef = props.modelRef;

    useEffect(() => {
        modelRef.current.src = url;
    }, [url]);

    return (
        <model-viewer
            ref={modelRef}
            className={styles["gwCanvas"]}
            src={""}
            environment-image="neutral"
            shadow-intensity="1"
            ar
            ar-modes="webxr scene-viewer quick-look"
            quick-look-browsers="safari chrome"
            auto-rotate
            camera-controls
            alt=""
        >
            <button slot="ar-button" id="ar-button" />

            <div id="ar-prompt">
                <img id="ar-prompt-img" />
            </div>

            <button id="ar-failure">AR is not tracking!</button>
        </model-viewer>
    );
};

const GWCanvas = (props) => {
    const gwCanvasContent = props.gwCanvasContent;
    let [modelIndex, setModelIndex] = useState(0);
    let modelRef = React.createRef();

    let [modelUrl, setModelUrl] = useState("");
    let [modelName, setModelName] = useState("");

    useEffect(() => {
        if (gwCanvasContent) {
            const cid = gwCanvasContent[modelIndex].contentUrl.replace(
                "ipfs://",
                ""
            );
            modelUrl = gwGateway + cid;
            setModelUrl(modelUrl);
            setModelName(gwCanvasContent[modelIndex]["name"]);
        }
    }, []);

    const clickLeft = () => {
        if (gwCanvasContent === null) return;

        modelIndex = modelIndex - 1;

        if (modelIndex < 0) modelIndex = gwCanvasContent.length - 1;

        setModelIndex(modelIndex);
        const cid = gwCanvasContent[modelIndex].contentUrl.replace(
            "ipfs://",
            ""
        );
        var _src = gwGateway + cid;
        setModelUrl(_src);
        setModelName(gwCanvasContent[modelIndex]["name"]);
    };

    const clickRight = () => {
        if (gwCanvasContent === null) return;

        modelIndex = modelIndex + 1;

        if (modelIndex > gwCanvasContent.length - 1) modelIndex = 0;

        setModelIndex(modelIndex);
        const cid = gwCanvasContent[modelIndex].contentUrl.replace(
            "ipfs://",
            ""
        );
        var _src = gwGateway + cid;
        setModelUrl(_src);
        setModelName(gwCanvasContent[modelIndex]["name"]);
    };

    if (gwCanvasContent !== null) {
        return (
            <div>
                <button
                    className={styles["clk-left"]}
                    onClick={() => clickLeft()}
                />
                <ModelViewer modelRef={modelRef} url={modelUrl} />
                <button
                    className={styles["clk-right"]}
                    onClick={() => clickRight()}
                />

                <ContentLabel uri={""} label={modelName} hyperlink={false} />
            </div>
        );
    } else {
        return <GWEmpty promptType="gallery" />;
    }
};

export default GWCanvas;
