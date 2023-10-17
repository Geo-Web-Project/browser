export const NETWORK_ID = parseInt(import.meta.env.VITE_PUBLIC_NETWORK_ID!);
export const PAYMENT_TOKEN = "ETHx";
export const SUBGRAPH_URL = import.meta.env.VITE_PUBLIC_GRAPH_URI;
export const GRAPH_URL = import.meta.env.VITE_PUBLIC_GRAPH_URI;
export const CERAMIC_URL = import.meta.env.VITE_PUBLIC_CERAMIC_URI;
export const CONNECT_NETWORK = import.meta.env
  .VITE_PUBLIC_CERAMIC_CONNECT_NETWORK;
export const CERAMIC_EXPLORER = `https://cerscan.com/${CONNECT_NETWORK}/stream`;
export const IPFS_DELEGATE = import.meta.env.VITE_PUBLIC_IPFS_DELEGATE;
export const PINATA_API_ENDPOINT = "https://api.pinata.cloud/psa";
export const STORAGE_WORKER_ENDPOINT =
  "https://storage-workers.geo-web.workers.dev";
export const SECONDS_IN_YEAR = 60 * 60 * 24 * 365;
export const WS_RPC_URL = import.meta.env.VITE_PUBLIC_WS_RPC_URL!;
export const HTTP_RPC_URL = import.meta.env.VITE_PUBLIC_HTTP_RPC_URL!;
export const LIVEPEER_API_KEY = import.meta.env.VITE_PUBLIC_LIVEPEER_API_KEY!;
