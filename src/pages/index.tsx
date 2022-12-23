import GWS from "../container/GeoWebSystem/GWS";

import { useState, useEffect } from "react";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { CERAMIC_URL } from "../lib/constants";
import { getIpfs, providers } from "ipfs-provider";
import * as IPFSCore from "ipfs-core";
import * as IPFSHttpClient from "ipfs-http-client";
import { GeoWebContent } from "@geo-web/content";

const { jsIpfs, httpClient } = providers;

export default function Index() {
  const [gwContent, setGWContent] = useState<GeoWebContent | null>(null);

  useEffect(() => {
    (async () => {
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

  return (
    <div className="App">
      <div className="bg-theme">
        <GWS gwContent={gwContent} />
      </div>
    </div>
  );
}
