import { useEffect, useState, useRef } from "react";
import GWEmpty from "../../../../components/common/ContentFiller/Empty";
import ContentLabel from "../../../../components/common/ContentLabel/ContentLabel";
import styles from "./styles.module.css";
import { Player } from "@livepeer/react";
import { IPFS_GATEWAY } from "../../../../lib/constants";
import {
  MediaObject,
  MediaObjectType,
  MediaObjectEncodingFormat,
} from "../../../../lib/world";

export type GWCanvasProps = {
  mediaObjects: MediaObject[];
};

const ModelViewer = (props: any) => {
  const { url, modelRef, isUsdzModel } = props;

  useEffect(() => {
    import("@google/model-viewer").catch(console.error);
  }, []);

  return (
    /* @ts-ignore */
    <model-viewer
      ref={modelRef}
      className={styles["gwCanvas"]}
      src={url}
      ios-src={isUsdzModel ? url : ""}
      environment-image="neutral"
      shadow-intensity="1"
      ar
      ar-modes="webxr scene-viewer quick-look"
      quick-look-browsers="safari chrome"
      auto-rotate
      camera-controls
      alt=""
    >
      <div id="ar-prompt">
        <img alt="AR prompt" src="assets/hand.png" />
      </div>
      <button id="ar-failure">AR is not tracking!</button>
      {isUsdzModel ? (
        <div className={styles["ar-only"]} slot="poster">
          This model is only viewable on iPhone and iPad AR
        </div>
      ) : (
        <img
          className={styles["loading"]}
          src="/assets/spinner.svg"
          alt="loading"
          slot="poster"
        />
      )}
      {/* @ts-ignore */}
    </model-viewer>
  );
};

const GWCanvas = (props: GWCanvasProps) => {
  const { mediaObjects } = props;

  const [objectIndex, setObjectIndex] = useState(0);

  const modelRef = useRef();

  if (mediaObjects.length === 0) {
    return <GWEmpty promptType="gallery" />;
  }

  const mediaObject = mediaObjects[objectIndex];

  if (!mediaObject) {
    return <GWEmpty promptType="gallery" />;
  }

  const isUsdzModel =
    mediaObject.encodingFormat === MediaObjectEncodingFormat.Usdz;
  const contentUrl = mediaObject.contentURI.startsWith("ipfs://")
    ? `${IPFS_GATEWAY}/ipfs/${mediaObject.contentURI.slice(7)}`
    : mediaObject.contentURI;

  const clickLeft = () => {
    let _objectIndex = objectIndex - 1;

    if (_objectIndex < 0) _objectIndex = mediaObjects.length - 1;

    setObjectIndex(_objectIndex);
  };

  const clickRight = () => {
    let _objectIndex = objectIndex + 1;

    if (_objectIndex > mediaObjects.length - 1) _objectIndex = 0;

    setObjectIndex(_objectIndex);
  };

  if (mediaObjects.length > 0) {
    return (
      <div>
        {mediaObjects.length > 1 && (
          <button className={styles["clk-left"]} onClick={() => clickLeft()} />
        )}
        <div className={styles["gallery"]}>
          {mediaObject.mediaType === MediaObjectType.Model ? (
            <ModelViewer
              modelRef={modelRef}
              url={contentUrl}
              isUsdzModel={isUsdzModel}
            />
          ) : mediaObject.mediaType === MediaObjectType.Image ? (
            <span className={styles["image-wrapper"]}>
              <img
                src={contentUrl ?? "/assets/spinner.svg"}
                alt={contentUrl ? "image content" : "loading"}
                className={styles[contentUrl ? "image-content" : "loading"]}
              />
            </span>
          ) : mediaObject.mediaType === MediaObjectType.Video ||
            mediaObject.mediaType === MediaObjectType.Audio ? (
            <div className={styles["player-wrapper"]}>
              <Player
                playbackId={mediaObject.contentURI}
                showTitle={false}
                muted
              />
            </div>
          ) : (
            <div className={styles["player-wrapper"]}>
              <h1>Unknown Media Type</h1>
            </div>
          )}
        </div>
        {mediaObjects.length > 1 && (
          <button
            className={styles["clk-right"]}
            onClick={() => clickRight()}
          />
        )}

        <ContentLabel label={mediaObject.name ?? ""} />
      </div>
    );
  } else {
    return <GWEmpty promptType="gallery" />;
  }
};

export default GWCanvas;
