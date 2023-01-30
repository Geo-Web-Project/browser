import styles from "./styles.module.css";

export default function GWAvail() {
  const prompt1 = `No one has claimed a land parcel that includes your current location!
    Head over to `;
  const uri = "https://geoweb.land/";
  const prompt2 = ` to claim it yourself (desktop recommended).`;

  return (
    <div className={styles["wrapper"]}>
      <img
        src="/assets/available-land.png"
        alt="available"
        className={styles["avail-img"]}
      />
      <div className={styles["empty-txt"]}>
        <span>{prompt1}</span>
        <a href={uri} target="_blank" rel="noreferrer">
          {uri}
        </a>
        <span>{prompt2}</span>
      </div>
    </div>
  );
}
