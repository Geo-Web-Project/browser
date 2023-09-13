"use client";

import { useState, useEffect } from "react";
import GWLoader from "../src/components/common/Loader/Loader";
import GWS from "../src/container/GeoWebSystem/GWS";
import LandingModal from "../src/components/common/LandingModal/LandingModal";
import {
  MUDProvider,
  SetupResult,
  setup,
} from "@geo-web/mud-world-base-client";
import worldsJson from "../src/mud/worlds.json";
import { optimismGoerli } from "viem/chains";
import { MUDChain } from "@latticexyz/common/chains";
import { WS_RPC_URL, LIVEPEER_API_KEY } from "../src/lib/constants";
import {
  LivepeerConfig,
  ThemeConfig,
  createReactClient,
  studioProvider,
} from "@livepeer/react";

import "../src/App.css";
import "../src/App.scss";
import "@augmented-worlds/system-babylonjs/styles.css";
import "swiper/css";
import "swiper/css/navigation";

const livepeerTheme: ThemeConfig = {
  colors: {
    accent: "#2fc1c1",
    containerBorderColor: "rgba(0, 145, 255, 0.9)",
  },
  fonts: {
    display: "Abel",
  },
};

const chainId = 420;
const worlds = worldsJson as Partial<
  Record<string, { address: string; blockNumber?: number }>
>;
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

const client = createReactClient({
  provider: studioProvider({ apiKey: LIVEPEER_API_KEY }),
});

export default function Index() {
  const [mudSetup, setMUDSetup] = useState<SetupResult | null>(null);
  const [hasAgreedModal, setHasAgreedModal] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const mudSetup = await setup({ chainId, worlds, supportedChains });
      setMUDSetup(mudSetup);

      setHasAgreedModal(
        localStorage.getItem("gwHasAgreedModal") ? true : false
      );
    })();
  }, []);

  if (hasAgreedModal === null) {
    return <GWLoader />;
  } else if (hasAgreedModal && mudSetup) {
    return (
      <MUDProvider value={mudSetup}>
        <LivepeerConfig client={client} theme={livepeerTheme}>
          <GWS />
        </LivepeerConfig>
      </MUDProvider>
    );
  } else {
    return <LandingModal setHasAgreedModal={setHasAgreedModal} />;
  }
}
