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
import { ethers } from "ethers";
import { CID } from "multiformats/cid";
import { useMUD } from "@geo-web/mud-world-base-client";
import { useComponentValue } from "@latticexyz/react";
import { singletonEntity } from "@latticexyz/store-sync/recs";

export default function GWS() {
  const initCoordinate = { lat: 0, lon: 0 }; //default lat, lon
  const [coordinate, setCoordinate] = useState(initCoordinate); //gps coordinates {lat, lon}
  const [gwInfo, setGwInfo] = useState<any>(null);
  const [parcelId, setParcelId] = useState("");
  const [licenseOwner, setLicenseOwner] = useState("");
  const [loading, setLoading] = useState(true);
  const [ownerDID, setOwnerDID] = useState("");

  const {
    components: { Name, Url },
  } = useMUD();

  const name = useComponentValue(Name, singletonEntity);
  const url = useComponentValue(Url, singletonEntity);
  const basicProfile = {
    name: name?.value,
    url: url?.value,
  };

  useEffect(() => {
    (async () => {
      const { registryDiamondContract } =
        getContractsForChainOrThrow(NETWORK_ID);

      if (parcelId && licenseOwner) {
        const assetId = new AssetId({
          chainId: `eip155:${NETWORK_ID}`,
          assetName: {
            namespace: "erc721",
            reference: registryDiamondContract.address.toLowerCase(),
          },
          tokenId: new BN(parcelId.slice(2), "hex").toString(10),
        });

        const ownerId = new AccountId({
          chainId: `eip155:${NETWORK_ID}`,
          address: ethers.utils.getAddress(licenseOwner),
        });
        const ownerDID = `did:pkh:${ownerId}`;

        const _parcelInfo = await getParcelInfo(parcelId);
        setGwInfo(_parcelInfo);

        setOwnerDID(ownerDID);
        setLoading(false);
      }
    })();
  }, [parcelId, licenseOwner, coordinate]);

  const accessGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        showPosition,
        (err) => {
          console.info(err.message);
          setLoading(false);
        },
        { maximumAge: 0, enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      console.info("Geolocation is not supported by this browser.");
      setCoordinate({ lat: -1, lon: -1 });
      setLoading(false);
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

    // setParcelId(parcelId as any);
    setParcelId("0x1");
    // setLicenseOwner(licenseOwner as any);
    setLicenseOwner("0xBA1231785A7b4AC0E8dC9a0403938C2182cE4A4e");
  };

  return (
    <>
      <TitleBar
        accessGps={accessGps}
        coordinate={coordinate}
        showPosition={showPosition}
        loading={loading}
        parcelId={parcelId}
        gwInfo={gwInfo}
        basicProfile={basicProfile}
      />
      {loading ? (
        <GWLoader />
      ) : parcelId && ownerDID ? (
        // <GWContentView
        //   gwContent={gwContent}
        //   basicProfile={basicProfile}
        //   mediaGallery={mediaGallery}
        //   augmentedWorld={CID.parse(
        //     "bafyreietptw7udedbdpro6fje5bzsqdhsktktqdl4273pmvbpjrc2odi3q"
        //   )}
        //   parcelId={parcelId}
        //   ownerDID={ownerDID}
        // />
        <div></div>
      ) : (
        <GWAvail />
      )}
    </>
  );
}
