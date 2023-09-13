"use client";

import { useState, useEffect } from "react";
import GWLoader from "../src/components/common/Loader/Loader";
import GWS from "../src/container/GeoWebSystem/GWS";
import LandingModal from "../src/components/common/LandingModal/LandingModal";
import { LIVEPEER_API_KEY } from "../src/lib/constants";
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

export default function Index() {
  const [hasAgreedModal, setHasAgreedModal] = useState<boolean | null>(null);

  const client = createReactClient({
    provider: studioProvider({ apiKey: LIVEPEER_API_KEY }),
  });

  useEffect(() => {
    (async () => {
      setHasAgreedModal(
        localStorage.getItem("gwHasAgreedModal") ? true : false
      );
    })();
  }, []);

  if (hasAgreedModal === null) {
    return <GWLoader />;
  } else if (hasAgreedModal) {
    return (
      <LivepeerConfig client={client} theme={livepeerTheme}>
        <GWS />
      </LivepeerConfig>
    );
  } else {
    return <LandingModal setHasAgreedModal={setHasAgreedModal} />;
  }
}
