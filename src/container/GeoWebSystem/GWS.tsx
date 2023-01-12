import { useState, useEffect } from "react";
import { getContractsForChainOrThrow } from "@geo-web/sdk";
import { AccountId, AssetId } from "caip";
import BN from "bn.js";
import TitleBar from "../../components/common/TitleBar/TitleBar";
import GWLoader from "../../components/common/Loader/Loader";
import GWAvail from "../../components/common/ContentFiller/Avail";
import GWInfo from "../GeoWebInterface/components/GeoWebInfo/GWInfo";
import GWContentView from "../GeoWebInterface/components/GeoWebContent/GWContent";
import { NETWORK_ID } from "../../lib/constants";
import { getGeoId, getParcelInfo } from "../../lib/api";
import styles from "./styles.module.css";
import { ChatBox } from "@orbisclub/modules";
import "@orbisclub/modules/dist/index.modern.css";
import { ParcelRoot, MediaGallery, BasicProfile } from "@geo-web/types";
import { GeoWebContent } from "@geo-web/content";

export type GWSProps = {
  gwContent: GeoWebContent | null;
};

export default function GWS(props: GWSProps) {
  const { gwContent } = props;
  const initCoordinate = { lat: 0, lon: 0 }; //default lat, lon
  const [coordinate, setCoordinate] = useState(initCoordinate); //gps coordinates {lat, lon}
  const [gwInfo, setGwInfo] = useState<any>(null);
  const [parcelId, setParcelId] = useState("");
  const [licenseOwner, setLicenseOwner] = useState("");
  const [loading, setLoading] = useState(true);
  const [parcelRoot, setParcelRoot] = useState<ParcelRoot | null>(null);
  const [basicProfile, setBasicProfile] = useState<BasicProfile | null>(null);
  const [mediaGallery, setMediaGallery] = useState<MediaGallery | null>(null);

  useEffect(() => {
    (async () => {
      const { registryDiamondContract } =
        getContractsForChainOrThrow(NETWORK_ID);

      if (parcelId && licenseOwner && gwContent) {
        const assetId = new AssetId({
          chainId: `eip155:${NETWORK_ID}`,
          assetName: {
            namespace: "erc721",
            reference: registryDiamondContract.address.toLowerCase(),
          },
          tokenId: new BN(parcelId.slice(2), "hex").toString(10),
        });

        const accountId = new AccountId({
          chainId: `eip155:${NETWORK_ID}`,
          address: licenseOwner,
        });

        try {
          const _rootCid = (
            await gwContent.raw.resolveRoot({
              parcelId: assetId,
              ownerId: accountId,
            })
          ).toString();
          const _parcelInfo = await getParcelInfo(parcelId, _rootCid); //get parcel info and meta-data

          setGwInfo(_parcelInfo);
        } catch (e) {
          console.info(e);
          setGwInfo(null);
          setParcelRoot(null);
          setBasicProfile(null);
          setMediaGallery(null);
        }

        try {
          const _parcelRoot = await gwContent.raw.getPath("/", {
            parcelId: assetId,
            ownerId: accountId,
            schema: "ParcelRoot",
          });
          setParcelRoot(_parcelRoot);
        } catch (e) {
          console.info(e);
          setParcelRoot(null);
        }

        try {
          const _mediaGallery = await gwContent.raw.getPath("/mediaGallery", {
            parcelId: assetId,
            ownerId: accountId,
            schema: "MediaGallery",
          });

          setMediaGallery(_mediaGallery);
        } catch (e) {
          console.info(e);
          setMediaGallery(null);
        }

        try {
          const _basicProfile = await gwContent.raw.getPath("/basicProfile", {
            parcelId: assetId,
            ownerId: accountId,
            schema: "BasicProfile",
          });

          setBasicProfile(_basicProfile);
        } catch (e) {
          console.info(e);
          setBasicProfile(null);
        }

        setLoading(false);
      }
    })();
  }, [parcelId, licenseOwner, gwContent, coordinate]);

  const accessGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition); //Get Position, with callback
    } else {
      console.log("Geolocation is not supported by this browser.");
      setCoordinate({ lat: -1, lon: -1 });
    }
  };

  const showPosition = (position: any) => {
    setLoading(true);

    const { latitude, longitude } = position.coords;
    setCoordinate({ lat: latitude, lon: longitude }); //Set Lat and Lon state
    getParcelId(latitude.toString(), longitude.toString());
  };

  const getParcelId = async (latitude: any, longitude: any) => {
    const { parcelId, licenseOwner } = await getGeoId(latitude, longitude);

    if (!parcelId || !licenseOwner) {
      setLoading(false);
    }

    setParcelId(parcelId as any);
    setLicenseOwner(licenseOwner as any);
  };

  const GeoWeb = () => {
    if (parcelId && gwContent) {
      // Returns Info Expandable and Parcel Content
      return (
        <div className={styles["layout-root"]}>
          <GWInfo
            gwInfo={gwInfo}
            gwContentName={
              basicProfile?.name ? basicProfile.name : `Parcel ${parcelId}`
            }
          />
          <GWContentView
            gwContent={gwContent}
            basicProfile={basicProfile}
            mediaGallery={mediaGallery}
          />
        </div>
      );
    } else {
      return (
        <div className={styles["layout-root"]}>
          <GWInfo gwInfo={null} gwContentName={"No Parcel Found"} />
          <GWAvail />
        </div>
      );
    }
  };

  return (
    <div>
      <TitleBar
        accessGps={accessGps}
        coordinate={coordinate}
        showPosition={showPosition}
      />
      {loading ? <GWLoader /> : <GeoWeb />}
      {parcelId ? (
        <ChatBox
          context={`Geo Web Parcel - ${parcelId.toString()}`}
          title={"Leave a comment on this parcel"}
          poweredByOrbis="black"
        />
      ) : null}
    </div>
  );
}
