export const NETWORK_ID = 5;
export const NETWORK_NAME = "Goerli";
export const PAYMENT_TOKEN = "ETHx";
export const SUBGRAPH_URL = process.env.NEXT_PUBLIC_GRAPH_URI;

export const CERAMIC_URL = process.env.NEXT_PUBLIC_CERAMIC_URI;
export const CONNECT_NETWORK = "testnet-clay";
export const CERAMIC_EXPLORER = `https://cerscan.com/${CONNECT_NETWORK}/stream`;

export const IPFS_BOOTSTRAP_PEER =
  "/dns4/preload.ipfs.geoweb.network/tcp/4002/wss/p2p/12D3KooWKcc7Jz6jxCJeq8LRi6chufG16hbezYnT2DUhSZRy3whU";
export const IPFS_PRELOAD_NODE = "/dns4/preload.ipfs.geoweb.network/https";

export const PINATA_API_ENDPOINT = "https://api.pinata.cloud/psa";
export const STORAGE_WORKER_ENDPOINT = "https://storage-workers.geo-web.workers.dev";

export const SECONDS_IN_YEAR = 60 * 60 * 24 * 365;
