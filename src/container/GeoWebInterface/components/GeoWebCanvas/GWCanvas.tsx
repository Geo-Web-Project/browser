import { useEffect, useState, useRef } from "react";
import { GeoWebContent } from "@geo-web/content";
import { MediaGallery, MediaObject } from "@geo-web/types";
import GWEmpty from "../../../../components/common/ContentFiller/Empty";
import ContentLabel from "../../../../components/common/ContentLabel/ContentLabel";
import styles from "./styles.module.css";

const gwGateway = process.env.NEXT_PUBLIC_MODEL_VIEWER_IPFS_GATEWAY;

export type GWCanvasProps = {
  mediaGallery: MediaGallery | null;
  gwContent: GeoWebContent;
};

const ModelViewer = (props: any) => {
  const { url, modelRef, isUsdzModel } = props;

  useEffect(() => {
    if (url && !isUsdzModel) {
      modelRef.current.dismissPoster();
    } else {
      modelRef.current.showPoster();
    }
  }, [url, isUsdzModel]);

  return (
    /* @ts-ignore */
    <model-viewer
      ref={modelRef}
      className={styles["gwCanvas"]}
      src={url}
      ios-src={isUsdzModel ? url : ""}
      reveal="manual"
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
          className={styles["model-loading"]}
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
  const { mediaGallery, gwContent } = props;

  const [modelIndex, setModelIndex] = useState(0);
  const [modelUrl, setModelUrl] = useState<string | undefined>(undefined);
  const [modelName, setModelName] = useState<string | undefined>(undefined);
  const [isUsdzModel, setIsUsdzModel] = useState<boolean>(false);

  const modelRef = useRef();

  useEffect(() => {
    const loadObj = async () => {
      if (!mediaGallery) {
        setModelUrl(undefined);
        setModelName(undefined);
        return;
      }
      const mediaObject = await gwContent.raw.get(
        mediaGallery[modelIndex],
        "/",
        {}
      );

      if (mediaObject) {
        const _isUsdzModel =
          mediaObject.encodingFormat === "model/vnd.usdz+zip";
        const fileName = _isUsdzModel
          ? `?filename=${mediaObject.name}.usdz`
          : "";
        const contentUrl = `${gwGateway}/ipfs/${mediaObject.content.toString()}/${fileName}`;

        setIsUsdzModel(_isUsdzModel);
        setModelUrl(contentUrl);
        setModelName(mediaObject.name);
      }
    };

    loadObj();
  }, [modelIndex]);

  const clickLeft = () => {
    if (!mediaGallery) return;

    setModelUrl(undefined);
    setModelName(undefined);

    let _modelIndex = modelIndex - 1;

    if (_modelIndex < 0) _modelIndex = mediaGallery.length - 1;

    setModelIndex(_modelIndex);
  };

  const clickRight = () => {
    if (!mediaGallery) return;

    setModelUrl(undefined);
    setModelName(undefined);

    let _modelIndex = modelIndex + 1;

    if (_modelIndex > mediaGallery.length - 1) _modelIndex = 0;

    setModelIndex(_modelIndex);
  };

  if (mediaGallery && mediaGallery.length > 0) {
    return (
      <div>
        {mediaGallery.length > 1 && (
          <button className={styles["clk-left"]} onClick={() => clickLeft()} />
        )}
        <ModelViewer
          modelRef={modelRef}
          url={modelUrl}
          isUsdzModel={isUsdzModel}
        />
        {mediaGallery.length > 1 && (
          <button
            className={styles["clk-right"]}
            onClick={() => clickRight()}
          />
        )}

        <ContentLabel label={modelName ?? ""} />
      </div>
    );
  } else {
    return <GWEmpty promptType="gallery" />;
  }
};

export default GWCanvas;
