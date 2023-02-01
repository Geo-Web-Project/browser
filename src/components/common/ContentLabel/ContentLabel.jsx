import styles from "./styles.module.css";

export default function ContentLabel({ label }) {
  return (
    <div className={styles["label"]}>
      <span>{label.substring(0, 30)}</span>
    </div>
  );
}
