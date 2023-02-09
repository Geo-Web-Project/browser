import styles from "./styles.module.css";

type LandingModalProps = {
  setHasAgreedModal: React.Dispatch<React.SetStateAction<boolean | null>>;
};

export default function LandingModal(props: LandingModalProps) {
  const { setHasAgreedModal } = props;

  const handleClick = () => {
    localStorage.setItem("gwHasAgreedModal", "true");
    setHasAgreedModal(true);
  };

  return (
    <div className={styles["modal"]}>
      <div className={styles["modal-content"]}>
        <div className={styles["header"]}>
          <img src="/assets/geo-web-logo.png" alt="geo web logo" />
          <div>Welcome to the Geo Web</div>
        </div>
        <p>
          This spatial browser is a universal interface for viewing &
          interacting with content on the Geo Web—
          <a
            href="https://docs.geoweb.network/concepts/spatial-browsing"
            target="_blank"
            rel="noreferrer"
          >
            a public augmented reality network
          </a>
          .
        </p>
        <p>
          The spatial browser uses device location (& sometimes your camera) to
          show you 3D objects, NFTs, data, websites, & more that a{" "}
          <a
            href="https://docs.geoweb.network/concepts/digital-land"
            target="_blank"
            rel="noreferrer"
          >
            digital land licensor
          </a>{" "}
          has published to your current location.
        </p>
        <p>
          Everyone around you can share in this open web experience instead of
          being siloed into different app ecosystems or algorithms.
        </p>
        <p>
          To continue, you'll need to grant your browser & this website
          permission to access your device location.
        </p>
        <p>
          The spatial browser doesn't retain this data or use it for anything
          other than resolving content. But this is the open web, so always stay
          vigilant.
        </p>
        <div className={styles["footer"]}>
          <img src="/assets/location.svg" alt="location" />
          <div>
            <strong>This app requires device location</strong>
          </div>
          <button onClick={handleClick}>Continue</button>
        </div>
      </div>
    </div>
  );
}
