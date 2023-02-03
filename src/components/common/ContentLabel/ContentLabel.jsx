import styles from "./styles.module.css";

export default function ContentLabel({ label }) {
  return (
    <div className={styles["label"]}>
      <span>{label}</span>
    </div>
  );
}
