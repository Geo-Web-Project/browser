import { useState, useEffect } from "react";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { getContractsForChainOrThrow } from "@geo-web/sdk";
import { GeoWebCoordinate } from "js-geo-web-coordinate";
import { AccountId, AssetId } from "caip";
import { DataModel } from "@glazed/datamodel";
import { model as GeoWebModel } from "@geo-web/datamodels";
import BN from "bn.js";
import TitleBar from "../../components/common/TitleBar/TitleBar";
import GWLoader from "../../components/common/Loader/Loader";
import GWAvail from "../../components/common/ContentFiller/Avail";
import GWInfo from "../GeoWebInterface/components/GeoWebInfo/GWInfo";
import GWContent from "../GeoWebInterface/components/GeoWebContent/GWContent";
import {
  NETWORK_ID,
  CERAMIC_URL,
  IPFS_BOOTSTRAP_PEER,
  IPFS_PRELOAD_NODE,
} from "../../lib/constants";
import { getGeoId, getParcelInfo } from "../../lib/api";
import { parseMediaContent } from "../../helpers/gwParser";
import { BasicProfileStreamManager } from "../../lib/stream-managers/BasicProfileStreamManager";
import { AssetContentManager } from "../../lib/stream-managers/AssetContentManager";
import {
  MediaGalleryItemStreamManager,
  useMediaGalleryItemData,
} from "../../lib/stream-managers/MediaGalleryItemStreamManager";
import { useBasicProfileStreamManager } from "../../lib/stream-managers/BasicProfileStreamManager";
import { useMediaGalleryStreamManager } from "../../lib/stream-managers/MediaGalleryStreamManager";
import Gws_mock from "./Gws_mock.json";
import styles from "./styles.module.css";
import { ChatBox } from "@orbisclub/modules";
import "@orbisclub/modules/dist/index.modern.css";

const GW_MAX_LAT = 21;
const GW_MAX_LON = 22;

export default function GWS() {
  const initCoordinate = { lat: 0, lon: 0 }; //default lat, lon
  const [coordinate, setCoordinate] = useState(initCoordinate); //gps coordinates {lat, lon}
  const [gwInfo, setGwInfo] = useState(null);
  const [gwContent, setGwContent] = useState(null);
  const [parcelId, setParcelId] = useState("");
  const [assetId, setAssetId] = useState("");
  const [licenseOwner, setLicenseOwner] = useState("");
  const [parcelIndexStreamId, setParcelIndexStreamId] = useState(null);
  const [assetContentManager, setAssetContentManager] = useState(null);
  const [ceramic, setCeramic] = useState(new CeramicClient(CERAMIC_URL));
  const [loading, setLoading] = useState(true);

  console.log(parcelId);

  const basicProfileStreamManager =
    useBasicProfileStreamManager(assetContentManager);
  const parcelContent = basicProfileStreamManager
    ? basicProfileStreamManager.getStreamContent()
    : null;
  const mediaGalleryStreamManager =
    useMediaGalleryStreamManager(assetContentManager);
  const { mediaGalleryData, mediaGalleryItems } = useMediaGalleryItemData(
    mediaGalleryStreamManager,
    assetContentManager
  );

  useEffect(() => {
    (async () => {
      if (ceramic == null) {
        console.error("Ceramic instance not found");
        return;
      }

      const licenseContract =
        getContractsForChainOrThrow(NETWORK_ID).geoWebERC721LicenseContract;

      if (parcelId && licenseOwner) {
        const assetId = new AssetId({
          chainId: `eip155:${NETWORK_ID}`,
          assetName: {
            namespace: "erc721",
            reference: licenseContract.address.toLowerCase(),
          },
          tokenId: new BN(parcelId.slice(2), "hex").toString(10),
        });
        setAssetId(assetId);

        const accountId = new AccountId({
          chainId: `eip155:${NETWORK_ID}`,
          address: licenseOwner,
        });

        const model = new DataModel({
          ceramic,
          aliases: GeoWebModel,
        });

        const _assetContentManager = new AssetContentManager(
          ceramic,
          model,
          `did:pkh:${accountId.toString()}`,
          assetId
        );
        setAssetContentManager(_assetContentManager);

        const doc = await _assetContentManager.getIndex();
        setParcelIndexStreamId(doc.id.toString());
      } else {
        setAssetContentManager(null);
        setParcelIndexStreamId(null);
      }
    })();
  }, [ceramic, parcelId, licenseOwner]);

  useEffect(() => {
    (async () => {
      if (parcelId && parcelIndexStreamId) {
        const _parcelInfo = await getParcelInfo(parcelId, parcelIndexStreamId); //get parcel info and meta-data
        setGwInfo(_parcelInfo);
      }
    })();
  }, [parcelId, parcelIndexStreamId]);

  useEffect(() => {
    if (parcelContent && mediaGalleryData && mediaGalleryItems) {
      let _parcelContent = {
        name: parcelContent?.name,
        webContent: parcelContent?.url,
        mediaContent: parseMediaContent(mediaGalleryData, mediaGalleryItems),
      };

      setGwContent(_parcelContent);
      setLoading(false);
    }
  }, [mediaGalleryItems]);

  const accessGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition); //Get Position, with callback
    } else {
      console.log("Geolocation is not supported by this browser.");
      setCoordinate({ lat: -1, lon: -1 });
    }
  };

  const showPosition = (position) => {
    setLoading(true);

    //hard-coded coordinates for testing
    // Mt. Rainer
    //const latitude = 46.785802;
    //const longitude = -121.735557;

    //Doge Pool
    //const latitude = 12.823911;
    //const longitude = 80.075334;

    //const latitude = 0;
    //const longitude = 0;

    const { latitude, longitude } = position.coords;
    setCoordinate({ lat: latitude, lon: longitude }); //Set Lat and Lon state

    const _gwCoord = GeoWebCoordinate.fromGPS(
      longitude,
      latitude,
      GW_MAX_LON,
      GW_MAX_LAT
    ); //Convert Lon, Lat to GeoWebCoordinate

    /* *******************DEMO******************* */
    const _useGws = process.env.NEXT_PUBLIC_USE_GWS;

    if (_useGws === "false") {
      setPreDetermined();
      /* ****************************************** */
    } else {
      getParcelId(_gwCoord.toString());
    }
  };

  const setPreDetermined = () => {
    setGwInfo(Gws_mock.parcelInfo);
    setGwContent(Gws_mock.parcelContent);
    setParcelIndexStreamId(Gws_mock.ceramicUri);
    setLoading(false);
  };

  const getParcelId = async (id) => {
    const lookUpId = await getGeoId(id); //get root parcel id

    setParcelId(lookUpId.parcelId);
    setLicenseOwner(lookUpId.licenseOwner);
    setLoading(false);
  };

  const GeoWeb = () => {
    if (gwContent) {
      // Returns Info Expandable and Parcel Content
      return (
        <div className={styles["layout-root"]}>
          <GWInfo
            gwInfo={gwInfo}
            gwContentName={gwContent?.name ? gwContent.name : ""}
          />
          <GWContent
            gwWebContent={gwContent?.webContent ? gwContent.webContent : null}
            gwCanvasContent={
              gwContent?.mediaContent ? gwContent.mediaContent : null
            }
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
      {assetId ? (
        <ChatBox context={assetId.toString()} poweredByOrbis="black" />
      ) : null}
      {/*Display Mock Data*/}
      {/* <div style={{position: "absolute", top: '20%', color: 'white', width:'50%'}}>
                <span>{'lat : ' + coordinate.lat}</span>
                <br/>
                <span>{'lon : ' +coordinate.lon}</span>
            </div> */}
    </div>
  );
}
