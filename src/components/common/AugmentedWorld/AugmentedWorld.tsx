import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./styles.module.css";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import init, {
  World,
  ComponentType,
  GLTFModel,
  Position,
  Orientation,
  IsAnchor,
  Anchor,
  TrackedImage,
  CoachingOverlay,
  Scale,
} from "augmented-worlds";
import {
  GraphicsSystem,
  WebXRSystem,
  AnchorSystem,
  AnchorTransformSystem,
  ImageTrackingSystem,
  CoachingOverlaySystem,
} from "@augmented-worlds/system-babylonjs";
import GWLoader from "../Loader/Loader";
import CopyTooltip from "../CopyTooltip";
import Image from "react-bootstrap/Image";
import { UAParser } from "ua-parser-js";
import { Close } from "@material-ui/icons";
import { CID } from "multiformats";
import { GeoWebContent } from "@geo-web/content";
import { encode as encodeDagJson } from "@ipld/dag-json";
import { decode as decodeJson } from "multiformats/codecs/json";

const useStyles = makeStyles(() => ({
  btn: {
    alignSelf: "flex-end",
    marginRight: "20px",
    backgroundColor: "#2fc1c1",
    color: "white",
    marginTop: "50px",
  },
}));

enum State {
  Loading,
  Ready,
  NotSupported,
}

function EnterView({
  incubationsUri,
  enterWorld,
}: {
  incubationsUri: string;
  enterWorld: () => Promise<void>;
}) {
  const classes = useStyles();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const copyUri = useCallback(() => {
    navigator.clipboard.writeText(incubationsUri);
  }, [incubationsUri]);

  return (
    <span className={styles["ar-txt"]}>
      <div className={styles["ar-icon"]} />
      <h1>Enter Augmented Reality</h1>
      <p>
        This AR experience relies on certain device permissions and
        dependencies. If you haven’t already:
      </p>
      <ul>
        <li>
          Paste the following into your URL bar & enable the WebXR Incubations
          flag:{" "}
          <span style={{ textDecoration: "underline" }}>{incubationsUri}</span>{" "}
          <CopyTooltip
            contentClick="Copied"
            contentHover="Copy Address"
            target={
              <div className="d-flex flex-shrink-1 align-items-center">
                <Image width={25} src="/assets/copy-light.svg" alt="copy" />
              </div>
            }
            handleCopy={copyUri}
          />
        </li>
        <li>
          Install the{" "}
          <a href="https://play.google.com/store/apps/details?id=com.google.ar.core">
            latest version of ARCore
          </a>
        </li>
      </ul>
      <Button
        ref={buttonRef}
        className={classes.btn}
        onClick={() => {
          buttonRef.current?.blur();
          enterWorld();
        }}
        style={{ marginTop: "20px" }}
      >
        Start AR Session
      </Button>
    </span>
  );
}

function NotAvailableView({ incubationsUri }: { incubationsUri: string }) {
  const parser = new UAParser();
  const { os } = parser.getResult();

  const copyUri = useCallback(() => {
    navigator.clipboard.writeText(incubationsUri);
  }, [incubationsUri]);

  return (
    <span className={styles["ar-txt"]}>
      <div className={styles["ar-unavailable-icon"]} />
      <h1>Browser Not Compatible</h1>
      {os.name === "iOS" ? (
        <p>iOS doesn’t yet support WebXR.</p>
      ) : os.name === "Android" ? (
        <p>
          On Android, try using{" "}
          <a href="https://play.google.com/store/apps/details?id=com.android.chrome">
            Chrome (version 113+)
          </a>{" "}
          & installing the{" "}
          <a href="https://play.google.com/store/apps/details?id=com.google.ar.core">
            latest version of ARCore
          </a>
          . Then paste the following into your URL bar & enable the WebXR
          Incubations flag:{" "}
          <span style={{ textDecoration: "underline" }}>{incubationsUri}</span>{" "}
          <CopyTooltip
            contentClick="Copied"
            contentHover="Copy Address"
            target={
              <div className="d-flex flex-shrink-1 align-items-center">
                <Image width={25} src="/assets/copy-light.svg" alt="copy" />
              </div>
            }
            handleCopy={copyUri}
          />
        </p>
      ) : (
        <p>
          This augmented reality experience uses experimental features of the
          open-source WebXR standard. Not all devices and browsers support these
          features.
        </p>
      )}
    </span>
  );
}

export default function AugmentedWorld({
  augmentedWorldCid,
  gwContent,
}: {
  augmentedWorldCid: CID;
  gwContent: GeoWebContent;
}) {
  const [state, setState] = useState(State.Ready);
  const [world, setWorld] = useState<World | null>(null);
  const [isWorldReady, setIsWorldReady] = useState(false);
  const [webXRSystem, setWebXRSystem] = useState<WebXRSystem | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const parser = new UAParser();
  const { browser } = parser.getResult();

  const incubationsUri = `${
    browser.name === "Brave"
      ? "brave"
      : browser.name === "Samsung Browser"
      ? "internet"
      : "chrome"
  }://flags/#webxr-incubations`;

  // Setup World
  useEffect(() => {
    (async () => {
      const isSupported = await WebXRSystem.isSupported();

      if (isSupported) {
        setState(State.Ready);
      } else {
        setState(State.NotSupported);
      }

      await init();

      // Create World
      const world = new World();
      setWorld(world);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!world) return;

      setIsWorldReady(false);

      // Download world
      const entities = (await gwContent.raw.get(
        augmentedWorldCid as any,
        "/",
        {}
      )) as CID[];

      const localEntityMap: Record<string, number> = {};
      const trackedImages: number[] = [];
      const worldEntities: number[] = [];

      // Add all entities locally
      for (const entityCid of entities) {
        const worldEntity = world.create_entity();
        worldEntities.push(worldEntity);
        localEntityMap[entityCid.toString()] = worldEntity;
      }

      // Add components
      for (const entityCid of entities) {
        const entity = await gwContent.raw.get(entityCid as any, "/", {});

        const worldEntity = localEntityMap[entityCid.toString()];
        world.add_component_to_entity(worldEntity, ComponentType.Component, {});

        if (entity.isAnchor !== undefined) {
          world.add_component_to_entity(worldEntity, ComponentType.IsAnchor, {
            isAnchor: entity.isAnchor,
          } as IsAnchor);
        }

        if (entity.glTFModel) {
          world.add_component_to_entity(worldEntity, ComponentType.GLTFModel, {
            glTFModel: { "/": entity.glTFModel.toString() },
          } as GLTFModel);

          world.add_component_to_entity(worldEntity, ComponentType.Position, {
            startPosition: {
              x: entity.position?.x ?? 0,
              y: entity.position?.y ?? 0,
              z: entity.position?.z ?? 0,
            },
          } as Position);

          world.add_component_to_entity(worldEntity, ComponentType.Scale, {
            startScale: {
              x: entity.scale?.x ?? 1,
              y: entity.scale?.y ?? 1,
              z: entity.scale?.z ?? 1,
            },
          } as Scale);

          world.add_component_to_entity(
            worldEntity,
            ComponentType.Orientation,
            {
              startOrientation: {
                x: entity.orientation?.x ?? 0,
                y: entity.orientation?.y ?? 0,
                z: entity.orientation?.z ?? 0,
                w: entity.orientation?.w ?? 1,
              },
            } as Orientation
          );
        } else {
          world.add_component_to_entity(
            worldEntity,
            ComponentType.Position,
            entity.position
              ? ({
                  startPosition: {
                    x: entity.position?.x ?? 0,
                    y: entity.position?.y ?? 0,
                    z: entity.position?.z ?? 0,
                  },
                } as Position)
              : {}
          );

          world.add_component_to_entity(
            worldEntity,
            ComponentType.Scale,
            entity.scale
              ? ({
                  startScale: {
                    x: entity.scale?.x ?? 1,
                    y: entity.scale?.y ?? 1,
                    z: entity.scale?.z ?? 1,
                  },
                } as Scale)
              : {}
          );

          world.add_component_to_entity(
            worldEntity,
            ComponentType.Orientation,
            entity.orientation
              ? ({
                  startOrientation: {
                    x: entity.orientation?.x ?? 0,
                    y: entity.orientation?.y ?? 0,
                    z: entity.orientation?.z ?? 0,
                    w: entity.orientation?.w ?? 1,
                  },
                } as Orientation)
              : {}
          );
        }

        if (entity.anchor) {
          // Replace CID with local entity
          // TODO: Support nested anchors
          const anchor = {
            anchor: localEntityMap[entity.anchor.toString()],
          } as Anchor;
          world.add_component_to_entity(
            worldEntity,
            ComponentType.Anchor,
            anchor
          );
        }

        if (entity.trackedImage) {
          world.add_component_to_entity(
            worldEntity,
            ComponentType.TrackedImage,
            decodeJson(encodeDagJson(entity.trackedImage)) as TrackedImage
          );
          trackedImages.push(worldEntity);
        }
      }

      if (trackedImages.length > 0) {
        const coachingOverlayEntity = world.create_entity();
        world.add_component_to_entity(
          coachingOverlayEntity,
          ComponentType.CoachingOverlay,
          {
            trackedImages: trackedImages.map((v) => {
              return { "/": localEntityMap[v] };
            }),
            text: "Point and hold the camera on the image target to enter AR.",
          } as CoachingOverlay
        );
      }

      setIsWorldReady(true);
    })();
  }, [world]);

  const enterWorld = async () => {
    if (!world || !canvasRef.current || !overlayRef.current) return;

    setState(State.Loading);

    // Create host systems
    const graphicsSystem = new GraphicsSystem(
      world,
      canvasRef.current,
      "https://w3s.link"
    );
    const webXRSystem = new WebXRSystem(graphicsSystem.getScene());
    setWebXRSystem(webXRSystem);
    const webXRAnchorSystem = new AnchorSystem(webXRSystem);
    const anchorTransformSystem = new AnchorTransformSystem();
    const imageTrackingSystem = new ImageTrackingSystem(
      webXRSystem,
      "https://w3s.link"
    );
    const coachingOverlaySystem = new CoachingOverlaySystem(
      webXRSystem,
      "https://w3s.link",
      overlayRef.current
    );

    world.add_system(graphicsSystem);
    world.add_system(webXRSystem);
    world.add_system(webXRAnchorSystem);
    world.add_system(anchorTransformSystem);
    world.add_system(imageTrackingSystem);
    world.add_system(coachingOverlaySystem);

    try {
      graphicsSystem.start();
      await webXRSystem.startXRSession();

      (await webXRSystem.getXRSessionManager()).onXRSessionEnded.add(() => {
        if (canvasRef.current) canvasRef.current.hidden = true;
        if (overlayRef.current && closeButtonRef.current) {
          overlayRef.current.innerHTML = "";
          overlayRef.current.appendChild(closeButtonRef.current);
          overlayRef.current.hidden = true;
        }
        graphicsSystem.getScene().getEngine().dispose();
        setWorld(new World());
      });

      canvasRef.current.hidden = false;
      overlayRef.current.hidden = false;

      setState(State.Ready);
    } catch (e) {
      console.log(e);
      setState(State.NotSupported);
    }
  };

  return (
    <div className={styles["wrapper"]}>
      <canvas ref={canvasRef} hidden />
      <div ref={overlayRef} hidden>
        <button
          ref={closeButtonRef}
          className={`${styles["close-btn"]}`}
          onClick={async () => {
            const sessionManager = await webXRSystem?.getXRSessionManager();
            await sessionManager?.exitXRAsync();
          }}
        >
          <Close style={{ color: "#fff" }} />
        </button>
      </div>
      {!world || state === State.Loading || !isWorldReady ? (
        <GWLoader />
      ) : state === State.Ready ? (
        <EnterView enterWorld={enterWorld} incubationsUri={incubationsUri} />
      ) : (
        <NotAvailableView incubationsUri={incubationsUri} />
      )}
    </div>
  );
}
