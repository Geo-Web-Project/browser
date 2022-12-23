import GWS from "../container/GeoWebSystem/GWS";

import { useState, useEffect } from "react";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { CERAMIC_URL } from "../lib/constants";
import { getIpfs, providers } from "ipfs-provider";
import * as IPFSCore from "ipfs-core";
import { GeoWebContent } from "@geo-web/content";

const { jsIpfs } = providers;

export default function Index() {
  const [gwContent, setGWContent] = useState<GeoWebContent | null>(null);

  useEffect(() => {
    (async () => {
      const ceramic = new CeramicClient(CERAMIC_URL);

      const { ipfs } = await getIpfs({
        providers: [
          // httpClient({
          //   loadHttpClientModule: () => require("ipfs-http-client"),
          //   apiAddress: "/ip4/127.0.0.1/tcp/5001",
          // }),
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
        console.log("IPFS API is provided by: " + ipfs.provider);
        if (ipfs.provider === "httpClient") {
          console.log("HTTP API address: " + ipfs.apiAddress);
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
