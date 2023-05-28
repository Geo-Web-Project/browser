import {
  useState,
  useEffect,
  useCallback,
  MouseEventHandler,
  Dispatch,
  SetStateAction,
} from "react";
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
const INCUBATIONS_URL = "chrome://flags/#webxr-incubations";
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
  Initializing,
  Ready,
  NotSupported,
}

function EnterView({
  world,
  setState,
}: {
  world: World;
  setState: Dispatch<SetStateAction<State>>;
}) {
  const classes = useStyles();

  const copyUri = useCallback(() => {
    navigator.clipboard.writeText(INCUBATIONS_URL);
  }, []);

  const [isCanvasHidden, setIsCanvasHidden] = useState(true);
  const [isOverlayHidden, setIsOverlayHidden] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const enterWorld: MouseEventHandler = async () => {
    setIsLoading(true);

    // Create host systems
    const graphicsSystem = new GraphicsSystem(
      world,
      document.querySelector("canvas#augmented-world-canvas")!,
      "https://w3s.link"
    );
    const webXRSystem = new WebXRSystem(graphicsSystem.getScene());
    const webXRAnchorSystem = new AnchorSystem(webXRSystem);
    const anchorTransformSystem = new AnchorTransformSystem();
    const imageTrackingSystem = new ImageTrackingSystem(
      webXRSystem,
      "https://w3s.link"
    );
    const coachingOverlaySystem = new CoachingOverlaySystem(
      webXRSystem,
      "https://w3s.link",
      document.querySelector("div#augmented-world-overlay")!
    );

    world.add_system(graphicsSystem);
    world.add_system(webXRSystem);
    world.add_system(webXRAnchorSystem);
    world.add_system(anchorTransformSystem);
    world.add_system(imageTrackingSystem);
    world.add_system(coachingOverlaySystem);

    const testImageAnchor = world.create_entity();
    world.add_component_to_entity(testImageAnchor, ComponentType.Component, {});
    world.add_component_to_entity(
      testImageAnchor,
      ComponentType.Position,
      {} as Position
    );
    world.add_component_to_entity(
      testImageAnchor,
      ComponentType.Orientation,
      {} as Orientation
    );
    world.add_component_to_entity(testImageAnchor, ComponentType.TrackedImage, {
      imageAsset: {
        "/": "QmZsDopGXAGPtToWSi8bxYjsrZkiraX7wqMZ9K8LgW2tyE",
      },
      physicalWidthInMeters: 0.165,
    } as TrackedImage);
    world.add_component_to_entity(testImageAnchor, ComponentType.IsAnchor, {
      isAnchor: true,
    } as IsAnchor);

    const testEntity = world.create_entity();
    world.add_component_to_entity(testEntity, ComponentType.Component, {});
    world.add_component_to_entity(testEntity, ComponentType.GLTFModel, {
      glTFModel: { "/": "QmdPXtkGThsWvR1YKg4QVSR9n8oHMPmpBEnyyV8Tk638o9" },
    } as GLTFModel);
    world.add_component_to_entity(testEntity, ComponentType.Position, {
      startPosition: {
        x: 0,
        y: 0,
        z: 0,
      },
    } as Position);
    world.add_component_to_entity(testEntity, ComponentType.Orientation, {
      startOrientation: {
        x: 0,
        y: 0,
        z: 0,
        w: 1,
      },
    } as Orientation);
    world.add_component_to_entity(testEntity, ComponentType.Scale, {
      startScale: {
        x: 1,
        y: 1,
        z: 1,
      },
    } as Scale);
    world.add_component_to_entity(testEntity, ComponentType.Anchor, {
      anchor: testImageAnchor,
    } as Anchor);

    const coachingOverlayEntity = world.create_entity();
    world.add_component_to_entity(
      coachingOverlayEntity,
      ComponentType.CoachingOverlay,
      {
        trackedImages: [{ "/": testImageAnchor }],
        text: "Point and hold the camera on the image target to enter AR.",
      } as CoachingOverlay
    );

    graphicsSystem.start();

    try {
      await webXRSystem.startXRSession();
      setIsCanvasHidden(false);
      setIsOverlayHidden(false);
    } catch (e) {
      setState(State.NotSupported);
    }

    setIsLoading(false);
  };

  return isLoading ? (
    <GWLoader />
  ) : (
    <>
      <canvas id="augmented-world-canvas" hidden={isCanvasHidden} />
      <div id="augmented-world-overlay" hidden={isOverlayHidden} />
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
            <span style={{ textDecoration: "underline" }}>
              {INCUBATIONS_URL}
            </span>{" "}
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
        <Button className={classes.btn} onClick={enterWorld}>
          Start AR Session
        </Button>
      </span>
    </>
  );
}

function NotAvailableView() {
  const parser = new UAParser();
  const { os } = parser.getResult();

  return (
    <span className={styles["ar-txt"]}>
      <div className={styles["ar-unavailable-icon"]} />
      <h1>Browser Not Compatible</h1>
      {os.name === "iOS" ? (
        <p>iOS doesn’t yet support WebXR.</p>
      ) : os.name === "Android" ? (
        <p>
          On Android, try using Chrome (version 113+), enabling the WebXR
          Incubations flag, & installing the latest version of ARCore.
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

export default function AugmentedWorld() {
  const [state, setState] = useState(State.Initializing);
  const [world, setWorld] = useState<World | null>(null);

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
      setWorld(new World());
    })();
  }, []);

  if (!world) {
    return (
      <div className={styles["wrapper"]}>
        <GWLoader />
      </div>
    );
  }

  return (
    <div className={styles["wrapper"]}>
      {state === State.Ready ? (
        <EnterView world={world} setState={setState} />
      ) : (
        <NotAvailableView />
      )}
    </div>
  );
}
