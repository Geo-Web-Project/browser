import styles from "./styles.module.css";

export default function GWEmpty({ promptType }) {
  const prompt = `Enjoy the beauty of empty space...The current land parcel holder has not added ${promptType} content here yet.`;

  return (
    <div className={styles["wrapper"]}>
      <div className={styles["rect-box"]} />
      <span className={styles["empty-txt"]}>{prompt}</span>
    </div>
  );
}
