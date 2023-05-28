import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import init, { World } from "augmented-worlds";
import { WebXRSystem } from "@augmented-worlds/system-babylonjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

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

function EnterView() {
  const classes = useStyles();

  return (
    <span className={styles["empty-txt"]}>
      <div className={styles["ar-icon"]} />
      <h1>Enter Augmented Reality</h1>
      <p>
        This AR experience relies on certain device permissions and
        dependencies. If you haven’t already:
      </p>
      <ul>
        <li>
          <FontAwesomeIcon
            icon={faCopy}
            size={"lg"}
            onTouchStart={(ev) => {
              (ev.target as HTMLElement).style.opacity = "0.5";
            }}
            onTouchEnd={(ev) => {
              (ev.target as HTMLElement).style.opacity = "1.0";
            }}
            onClick={() => {
              navigator.clipboard.writeText(
                "chrome://flags/#webxr-incubations"
              );
            }}
          />{" "}
          Copy{" "}
          <span style={{ textDecoration: "underline" }}>
            chrome://flags/#webxr-incubations
          </span>{" "}
          into your navigation bar and enable WebXR Incubations
        </li>
        <li>
          Install the{" "}
          <a href="https://play.google.com/store/apps/details?id=com.google.ar.core">
            latest version of ARCore
          </a>
        </li>
      </ul>
      <Button className={classes.btn}>Start AR Session</Button>
    </span>
  );
}

export default function AugmentedWorld() {
  const [state, setState] = useState(State.Initializing);

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
    })();
  }, []);

  return (
    <div className={styles["wrapper"]}>
      {state === State.Ready ? <EnterView /> : null}
    </div>
  );
}
