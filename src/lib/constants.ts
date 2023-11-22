export const NETWORK_ID = parseInt(import.meta.env.VITE_NETWORK_ID!);
export const PAYMENT_TOKEN = "ETHx";
export const WORLD = {
  worldAddress: import.meta.env.VITE_WORLD_ADDRESS,
  blockNumber: import.meta.env.VITE_WORLD_BLOCK_NUMBER,
};
export const SUBGRAPH_URL = import.meta.env.VITE_GRAPH_URI;
export const GRAPH_URL = import.meta.env.VITE_GRAPH_URI;
export const IPFS_GATEWAY = import.meta.env.VITE_IPFS_GATEWAY;
export const IPFS_DELEGATE = import.meta.env.VITE_IPFS_DELEGATE;
export const PINATA_API_ENDPOINT = "https://api.pinata.cloud/psa";
export const STORAGE_WORKER_ENDPOINT =
  "https://storage-workers.geo-web.workers.dev";
export const SECONDS_IN_YEAR = 60 * 60 * 24 * 365;
export const WS_RPC_URL = import.meta.env.VITE_WS_RPC_URL!;
export const HTTP_RPC_URL = import.meta.env.VITE_HTTP_RPC_URL!;
export const LIVEPEER_API_KEY = import.meta.env.VITE_LIVEPEER_API_KEY!;
