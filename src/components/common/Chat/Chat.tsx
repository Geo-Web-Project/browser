import { Discussion } from "@orbisclub/components";
import { GWContentViewProps } from "../../../container/GeoWebInterface/components/GeoWebContent/GWContent";
import styles from "./styles.module.css";

const CONTEXT_STREAM =
  "kjzl6cwe1jw145l33v3vbl5171apg9n413hdn0yf8eo0m95qi0iq3wdkqa71fjx";
const THEME_STREAM =
  "kjzl6cwe1jw146bq6o1175c6f0aagjtwe4t8t5csuk8onwga63k4377tpbz5ggz";

export default function Chat(props: GWContentViewProps) {
  const { parcelId, ownerDID } = props;

  return (
    <div className={styles["wrapper"]}>
      <Discussion
        context={`${CONTEXT_STREAM}:${parcelId};${ownerDID}`}
        theme={THEME_STREAM}
      />
    </div>
  );
}
