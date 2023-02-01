import Menu from "../Menu/Menu";
import GWInfo from "../../../container/GeoWebInterface/components/GeoWebInfo/GWInfo";

import styles from "./styles.module.css";

export default function TitleBar({
  accessGps,
  coordinate,
  showPosition,
  loading,
  parcelId,
  gwInfo,
  basicProfile,
}) {
  return (
    <header className={styles["title-bar"]}>
      {loading ? null : parcelId ? (
        <GWInfo
          gwInfo={gwInfo}
          gwContentName={
            basicProfile?.name ? basicProfile.name : `Parcel ${parcelId}`
          }
          gwContentUrl={basicProfile?.url ? basicProfile.url : ""}
        />
      ) : (
        <GWInfo gwInfo={null} gwContentName={"No Parcel Found"} />
      )}
      <Menu
        coordinate={coordinate}
        showPosition={showPosition}
        accessGps={accessGps}
      />
    </header>
  );
}
