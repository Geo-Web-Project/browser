import { useEffect, useState, useRef } from "react";
import GWEmpty from "../../../../components/common/ContentFiller/Empty";
import ContentLabel from "../../../../components/common/ContentLabel/ContentLabel";
import styles from "./styles.module.css";
import { Entity } from "@latticexyz/recs";
import { getComponentValue } from "@latticexyz/recs";
import { useMUD } from "@geo-web/mud-world-base-setup";
import contentHash from "@ensdomains/content-hash";
import { CID } from "multiformats";
import { Player } from "@livepeer/react";

const gwGateway = import.meta.env.NEXT_PUBLIC_MODEL_VIEWER_IPFS_GATEWAY;

export enum MediaObjectType {
  Image,
  Audio,
  Video,
  Model,
}
export enum MediaObjectEncodingFormat {
  Glb,
  Usdz,
  Gif,
  Jpeg,
  Png,
  Svg,
  Mpeg,
  Mp4,
  Mp3,
}

export type MediaObject = {
  contentSize: Number;
  mediaType: MediaObjectType;
  encodingFormat: MediaObjectEncodingFormat;
  name: string;
  contentHash: string;
};

export type GWCanvasProps = {
  mediaObjects: Entity[];
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
  const {
    components: { MediaObject },
  } = useMUD();

  const { mediaObjects } = props;

  const [modelIndex, setModelIndex] = useState(0);

  const modelRef = useRef();

  if (mediaObjects.length == 0) {
    return <GWEmpty promptType="gallery" />;
  }

  const mediaObject = getComponentValue(
    MediaObject,
    mediaObjects[modelIndex]
  ) as MediaObject | undefined;

  if (!mediaObject) {
    return <GWEmpty promptType="gallery" />;
  }

  const isGlbModel =
    mediaObject.encodingFormat === MediaObjectEncodingFormat.Glb;
  const isUsdzModel =
    mediaObject.encodingFormat === MediaObjectEncodingFormat.Usdz;
  const fileName = isUsdzModel
    ? `?filename=${mediaObject.name}.usdz`
    : isGlbModel
    ? `?filename=${mediaObject.name}.glb`
    : "";
  const contentCid = CID.parse(
    contentHash.decode(mediaObject.contentHash)
  ).toV1();
  const contentUrl = `${gwGateway}/ipfs/${contentCid.toString()}/${fileName}`;

  const clickLeft = () => {
    let _modelIndex = modelIndex - 1;

    if (_modelIndex < 0) _modelIndex = mediaObjects.length - 1;

    setModelIndex(_modelIndex);
  };

  const clickRight = () => {
    let _modelIndex = modelIndex + 1;

    if (_modelIndex > mediaObjects.length - 1) _modelIndex = 0;

    setModelIndex(_modelIndex);
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
                playbackId={contentCid.toString()}
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
