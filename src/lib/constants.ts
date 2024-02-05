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
export const LIVEPEER_API_KEY = import.meta.env.VITE_LIVEPEER_API_KEY!;

export const RPC_URLS_HTTP: Record<number, string> = {
  10: `https://opt-mainnet.g.alchemy.com/v2/${import.meta.env
    .VITE_ALCHEMY_MAINNET_API_KEY!}`,
  11155420: `https://opt-sepolia.g.alchemy.com/v2/${import.meta.env
    .VITE_ALCHEMY_TESTNET_API_KEY!}`,
};
export const RPC_URLS_WS: Record<number, string> = {
  10: `wss://opt-goerli.g.alchemy.com/v2/${import.meta.env
    .VITE_ALCHEMY_MAINNET_API_KEY!}`,
  11155420: `wss://opt-sepolia.g.alchemy.com/v2/${import.meta.env
    .VITE_ALCHEMY_TESTNET_API_KEY!}`,
};
