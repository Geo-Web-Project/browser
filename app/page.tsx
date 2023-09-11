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
import { WS_RPC_URL } from "../src/lib/constants";

import "../src/App.css";
import "../src/App.scss";

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
        <GWS />
      </MUDProvider>
    );
  } else {
    return <LandingModal setHasAgreedModal={setHasAgreedModal} />;
  }
}
