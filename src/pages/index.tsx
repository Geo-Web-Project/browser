import { useState, useEffect } from "react";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { CERAMIC_URL } from "../lib/constants";
import { getIpfs, providers } from "ipfs-provider";
import * as IPFSCore from "ipfs-core";
import * as IPFSHttpClient from "ipfs-http-client";
import { GeoWebContent } from "@geo-web/content";
import GWLoader from "../components/common/Loader/Loader";
import GWS from "../container/GeoWebSystem/GWS";
import LandingModal from "../components/common/LandingModal/LandingModal";

const { jsIpfs, httpClient } = providers;

export default function Index() {
  const [gwContent, setGWContent] = useState<GeoWebContent | null>(null);
  const [hasAgreedModal, setHasAgreedModal] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      setHasAgreedModal(
        localStorage.getItem("gwHasAgreedModal") ? true : false
      );

      const ceramic = new CeramicClient(CERAMIC_URL);

      const { ipfs, provider, apiAddress } = await getIpfs({
        providers: [
          httpClient({
            loadHttpClientModule: () => IPFSHttpClient,
            apiAddress: "/ip4/127.0.0.1/tcp/5001",
          }),
          httpClient({
            loadHttpClientModule: () => IPFSHttpClient,
            apiAddress: "/ip4/127.0.0.1/tcp/45005",
          }),
          jsIpfs({
            loadJsIpfsModule: () => IPFSCore,
            options: {
              preload: {
                enabled: false,
              },
            },
          }),
        ],
      });

      if (ipfs) {
        console.log("IPFS API is provided by: " + provider);
        if (provider === "httpClient") {
          console.log("HTTP API address: " + apiAddress);
        }
      }

      const _gwContent = new GeoWebContent({
        ceramic: ceramic as any,
        ipfs: ipfs,
        ipfsGatewayHost: process.env.NEXT_PUBLIC_IPFS_GATEWAY,
      });
      setGWContent(_gwContent);
    })();
  }, []);

  if (hasAgreedModal === null) {
    return <GWLoader />;
  } else if (hasAgreedModal) {
    return <GWS gwContent={gwContent} />;
  } else {
    return <LandingModal setHasAgreedModal={setHasAgreedModal} />;
  }
}
