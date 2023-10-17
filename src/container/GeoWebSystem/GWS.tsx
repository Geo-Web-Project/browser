import { useState, useEffect } from "react";
import { AccountId } from "caip";
import TitleBar from "../../components/common/TitleBar/TitleBar";
import GWLoader from "../../components/common/Loader/Loader";
import GWAvail from "../../components/common/ContentFiller/Avail";
import GWContentView from "../GeoWebInterface/components/GeoWebContent/GWContent";
import { HTTP_RPC_URL, WS_RPC_URL, NETWORK_ID } from "../../lib/constants";
import { getGeoId, getParcelInfo } from "../../lib/api";
import { ethers } from "ethers";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { namespaceWorld } from "@latticexyz/recs";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { Has } from "@latticexyz/recs";
import { useMUD, MUDProvider, setup } from "@geo-web/mud-world-base-setup";
import { optimismGoerli } from "viem/chains";
import { getContractAddressesForChainOrThrow } from "@geo-web/sdk";
import {
  Address,
  createPublicClient,
  http,
  encodePacked,
  decodeAbiParameters,
  parseAbiParameters,
} from "viem";
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
const publicClient = createPublicClient({
  chain: optimismGoerli,
  transport: http(HTTP_RPC_URL),
});
const worldAddress = "0x2f656242DE26118133F94991257A3B9c02d0831E";

export default function GWS() {
  const [params] = useSearchParams();
  const [mudSetup, setMUDSetup] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      const mudSetup = await setup({
        chainId,
        worlds: {
          [chainId]: {
            address: worldAddress,
            blockNumber: 15905323,
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
  const [basicProfile, setBasicProfile] = useState<{
    name: string;
    url: string;
  }>();
  const [namespacedWorld, setNamespacedWorld] = useState<any>();

  const {
    components: { Name, Url, MediaObject },
    network: { world },
  } = useMUD();

  const mediaObjects = namespacedWorld
    ? Has(
        namespacedWorld.components.filter(
          (item: any) => item.metadata.componentName === "MediaObject"
        )[0]
      )
    : (null as any);

  useEffect(() => {
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
  }, []);

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

        try {
          const registryDiamondAddress =
            getContractAddressesForChainOrThrow(NETWORK_ID).registryDiamond;
          // tokenURI(string tokenURI)
          const { data: encodedTokenURI } = await publicClient.call({
            to: registryDiamondAddress as Address,
            data: `0xc87b56dd${encodePacked(
              ["uint256"],
              [BigInt(parcelId)]
            ).slice(2)}`,
          });

          const [tokenURI] = decodeAbiParameters(
            parseAbiParameters("string tokenURI"),
            encodedTokenURI ?? "0x"
          );
          const res = await fetch(`https://ipfs.io/ipfs/${tokenURI.slice(7)}`);
          const basicProfile = await res.json();

          setBasicProfile({
            name: basicProfile?.name,
            url: basicProfile?.url,
          });
        } catch (err) {
          console.error(err);
        }

        try {
          // getNamespaceIdForParcel(uint256 parcelId)
          const { data: namespaceId } = await publicClient.call({
            to: worldAddress,
            data: `0x7d1d9e14${encodePacked(
              ["uint256"],
              [BigInt(parcelId)]
            ).slice(2)}`,
          });

          if (namespaceId) {
            const namespacedWorld = namespaceWorld(world, namespaceId);

            setNamespacedWorld(namespacedWorld);
          }
        } catch (err) {
          console.error(err);
        }

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
        world={worldAddress}
      />
      {loading ? (
        <GWLoader />
      ) : parcelId && ownerDID ? (
        <GWContentView
          url={basicProfile?.url ?? null}
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
