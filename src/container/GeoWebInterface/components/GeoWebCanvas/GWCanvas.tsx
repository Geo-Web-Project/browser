import { useEffect, useState, useRef } from "react";
import GWEmpty from "../../../../components/common/ContentFiller/Empty";
import ContentLabel from "../../../../components/common/ContentLabel/ContentLabel";
import { GeoWebContent } from "@geo-web/content";
import { MediaGallery, MediaObject } from "@geo-web/types";
import styles from "./styles.module.css";

const gwGateway = process.env.NEXT_PUBLIC_MODEL_VIEWER_IPFS_GATEWAY;

export type GWCanvasProps = {
  mediaGallery: MediaGallery | null;
  gwContent: GeoWebContent;
};

const ModelViewer = (props: any) => {
  let url = props.url;
  let modelRef = props.modelRef;

  useEffect(() => {
    modelRef.current.src = url;
  }, [url]);

  return (
    // @ts-ignore
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
      <div id="ar-prompt">
        <img alt="AR prompt" id="ar-prompt-img" />
      </div>
      <button id="ar-failure">AR is not tracking!</button>
      {/* @ts-ignore */}
    </model-viewer>
  );
};

const GWCanvas = (props: GWCanvasProps) => {
  const { mediaGallery, gwContent } = props;
  const [modelIndex, setModelIndex] = useState(0);
  const modelRef = useRef();

  const [modelUrl, setModelUrl] = useState<string | undefined>(undefined);
  const [modelName, setModelName] = useState<string | undefined>(undefined);

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
      setModelUrl(`${gwGateway}/ipfs/` + mediaObject.content.toString());
      setModelName(mediaObject.name);
    };

    loadObj();
  }, [modelIndex]);

  const clickLeft = () => {
    setModelUrl(undefined);
    setModelName(undefined);

    let _modelIndex = modelIndex - 1;

    if (_modelIndex < 0) _modelIndex = mediaGallery?.length ?? 0 - 1;

    setModelIndex(_modelIndex);
  };

  const clickRight = () => {
    setModelUrl(undefined);
    setModelName(undefined);

    let _modelIndex = modelIndex + 1;

    if (_modelIndex > (mediaGallery?.length ?? 0) - 1) _modelIndex = 0;

    setModelIndex(_modelIndex);
  };

  if (mediaGallery && mediaGallery.length > 0) {
    return (
      <div>
        {mediaGallery.length > 1 && (
          <button className={styles["clk-left"]} onClick={() => clickLeft()} />
        )}
        <ModelViewer modelRef={modelRef} url={modelUrl} />
        {mediaGallery.length > 1 && (
          <button
            className={styles["clk-right"]}
            onClick={() => clickRight()}
          />
        )}

        <ContentLabel uri={""} label={modelName ?? ""} hyperlink={false} />
      </div>
    );
  } else {
    return <GWEmpty promptType="gallery" />;
  }
};

export default GWCanvas;
