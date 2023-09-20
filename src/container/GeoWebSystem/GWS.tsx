import { useState, useEffect } from "react";
import { AccountId } from "caip";
import TitleBar from "../../components/common/TitleBar/TitleBar";
import GWLoader from "../../components/common/Loader/Loader";
import GWAvail from "../../components/common/ContentFiller/Avail";
import GWContentView from "../GeoWebInterface/components/GeoWebContent/GWContent";
import { WS_RPC_URL, NETWORK_ID } from "../../lib/constants";
import { getGeoId, getParcelInfo } from "../../lib/api";
import { ethers } from "ethers";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { Has } from "@latticexyz/recs";
import { useMUD, MUDProvider, setup } from "@geo-web/mud-world-base-setup";
import { optimismGoerli } from "viem/chains";
import { MUDChain } from "@latticexyz/common/chains";
import { useSearchParams } from "react-router-dom";

const chainId = 420;
const supportedChains: MUDChain[] = [
  {
    ...optimismGoerli,
    rpcUrls: {
      ...optimismGoerli.rpcUrls,
      default: {
        http: optimismGoerli.rpcUrls.default.http,
        webSocket: [WS_RPC_URL],
      },
    },
  },
];

export default function GWS() {
  const [params] = useSearchParams();
  const world = params.get("world");

  const [mudSetup, setMUDSetup] = useState<any | null>(null);
  useEffect(() => {
    (async () => {
      const mudSetup = await setup({
        chainId,
        worlds: {
          [chainId]: {
            address: world,
            blockNumber: 14300510,
          },
        },
        supportedChains,
      });
      setMUDSetup(mudSetup);
    })();
  }, []);

  if (!mudSetup) {
    return <GWLoader />;
  }

  return (
    <MUDProvider value={mudSetup}>
      <InnerGWS />
    </MUDProvider>
  );
}

function InnerGWS() {
  const [params] = useSearchParams();
  const lat = params.get("latitude");
  const lon = params.get("longitude");
  const world = params.get("world");
  const initCoordinate =
    lat && lon && !isNaN(Number(lat)) && !isNaN(Number(lon))
      ? {
          lat: Number(lat),
          lon: Number(lon),
        }
      : null;
  const [coordinate, setCoordinate] = useState(initCoordinate); //gps coordinates {lat, lon}
  const [gwInfo, setGwInfo] = useState<any>(null);
  const [parcelId, setParcelId] = useState("");
  const [licenseOwner, setLicenseOwner] = useState("");
  const [loading, setLoading] = useState(true);
  const [ownerDID, setOwnerDID] = useState("");

  const {
    components: { Name, Url, MediaObject },
  } = useMUD();

  const name = useComponentValue(Name, singletonEntity);
  const url = useComponentValue(Url, singletonEntity);
  const mediaObjects = useEntityQuery([Has(MediaObject)]);

  const basicProfile = {
    name: name?.value,
    url: url?.value,
  };

  useEffect(() => {
    if (world !== null) {
      setGwInfo({
        worldAddress: world,
      });
      setLoading(false);
    } else {
      if (initCoordinate !== null) {
        showPosition({
          coords: {
            latitude: initCoordinate.lat,
            longitude: initCoordinate.lon,
          },
        });
      } else {
        accessGps();
      }
    }
  }, [world]);

  useEffect(() => {
    (async () => {
      if (parcelId && licenseOwner) {
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

    setParcelId(parcelId as any);
    setLicenseOwner(licenseOwner as any);
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
        world={world}
      />
      {loading ? (
        <GWLoader />
      ) : world || (parcelId && ownerDID) ? (
        <GWContentView
          url={url?.value as string}
          mediaObjects={mediaObjects}
          parcelId={parcelId}
          ownerDID={ownerDID}
        />
      ) : (
        <GWAvail />
      )}
    </>
  );
}
