import styles from "./styles.module.css";

export default function ContentLabel({ label }: { label: string }) {
  return (
    <div className={styles["label"]}>
      <span>{label}</span>
    </div>
  );
}
