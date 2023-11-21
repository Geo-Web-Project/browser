import { useState, useEffect } from "react";
import TitleBar from "../../components/common/TitleBar/TitleBar";
import GWLoader from "../../components/common/Loader/Loader";
import GWAvail from "../../components/common/ContentFiller/Avail";
import GWContentView from "../GeoWebInterface/components/GeoWebContent/GWContent";
import {
  HTTP_RPC_URL,
  WS_RPC_URL,
  NETWORK_ID,
  IPFS_GATEWAY,
  WORLD,
} from "../../lib/constants";
import { getGeoId, getParcelInfo } from "../../lib/api";
import { useWorld } from "../../lib/world";
import { MUDProvider } from "../../context/MUDContext";
import { syncWorld, SyncWorldResult } from "@geo-web/mud-world-base-setup";
import { optimismGoerli } from "viem/chains";
import {
  IRegistryDiamondABI,
  getContractAddressesForChainOrThrow,
} from "@geo-web/sdk";
import { createPublicClient, getContract, http, Address } from "viem";
import { MUDChain } from "@latticexyz/common/chains";
import { useSearchParams } from "react-router-dom";

type BasicProfile = {
  name: string;
  url: string;
};

type Coords = {
  lat: number;
  lon: number;
};

const mudChain: MUDChain = {
  ...optimismGoerli,
  rpcUrls: {
    ...optimismGoerli.rpcUrls,
    default: {
      http: optimismGoerli.rpcUrls.default.http,
      webSocket: [WS_RPC_URL],
    },
  },
};

export default function GWS() {
  const [parcelId, setParcelId] = useState("");
  const [worldConfig, setWorldConfig] = useState<typeof SyncWorldResult>();
  const [loading, setLoading] = useState(true);
  const [gwInfo, setGwInfo] = useState<any>(null);
  const [basicProfile, setBasicProfile] = useState<BasicProfile>();
  const [coordinate, setCoordinate] = useState<Coords>();

  const [params] = useSearchParams();

  const lat = params.get("latitude");
  const lon = params.get("longitude");
  const initCoordinate =
    lat && lon && !isNaN(Number(lat)) && !isNaN(Number(lon))
      ? {
          lat: Number(lat),
          lon: Number(lon),
        }
      : null;

  useEffect(() => {
    if (initCoordinate !== null) {
      showPosition({
        coords: {
          latitude: initCoordinate.lat,
          longitude: initCoordinate.lon,
        },
      });
      setCoordinate(initCoordinate);
    } else {
      accessGps();
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (!parcelId) {
        return;
      }

      const worldConfig = await syncWorld({
        chainId: NETWORK_ID,
        world: WORLD,
        mudChain,
        namespaces: [Number(parcelId).toString()],
      });
      const _parcelInfo = await getParcelInfo(parcelId);

      setWorldConfig(worldConfig);
      setGwInfo(_parcelInfo);

      try {
        const publicClient = createPublicClient({
          chain: mudChain,
          transport: http(HTTP_RPC_URL),
        });
        const registryContract = getContract({
          address: getContractAddressesForChainOrThrow(NETWORK_ID)
            .registryDiamond as Address,
          abi: IRegistryDiamondABI,
          publicClient,
        });
        const tokenURI = (await registryContract.read.tokenURI([
          BigInt(parcelId),
        ])) as string;

        if (tokenURI) {
          const basicProfileRes = await fetch(
            `${IPFS_GATEWAY}/ipfs/${tokenURI.slice(7)}`
          );
          const basicProfile = await basicProfileRes.json();

          setBasicProfile({
            name: basicProfile?.name,
            url: basicProfile?.external_url,
          });
        }
      } catch (err) {
        console.warn(err);
      }

      setLoading(false);
    })();
  }, [parcelId]);

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
    const { parcelId } = await getGeoId(latitude, longitude);

    if (!parcelId) {
      setLoading(false);
    }

    setParcelId(parcelId ?? "");
  };

  if (!worldConfig || !coordinate) {
    return <GWLoader />;
  }

  return (
    <MUDProvider value={worldConfig}>
      <InnerGWS
        parcelId={parcelId}
        loading={loading}
        showPosition={showPosition}
        accessGps={accessGps}
        coordinate={coordinate}
        gwInfo={gwInfo}
        basicProfile={basicProfile}
      />
    </MUDProvider>
  );
}

function InnerGWS({
  parcelId,
  accessGps,
  showPosition,
  loading,
  coordinate,
  gwInfo,
  basicProfile,
}: {
  parcelId: string;
  loading: boolean;
  coordinate: Coords;
  gwInfo: any;
  basicProfile?: BasicProfile;
  accessGps: () => void;
  showPosition: (position: any) => void;
}) {
  const { mediaObjects } = useWorld();

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
      ) : parcelId ? (
        <GWContentView
          url={basicProfile?.url ?? null}
          mediaObjects={mediaObjects}
          parcelId={parcelId}
        />
      ) : (
        <GWAvail />
      )}
    </>
  );
}
