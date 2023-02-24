export const NETWORK_ID = parseInt(process.env.NEXT_PUBLIC_NETWORK_ID);
export const PAYMENT_TOKEN = "ETHx";
export const SUBGRAPH_URL = process.env.NEXT_PUBLIC_GRAPH_URI;

export const CERAMIC_URL = process.env.NEXT_PUBLIC_CERAMIC_URI;
export const CONNECT_NETWORK = process.env.NEXT_PUBLIC_CERAMIC_CONNECT_NETWORK;
export const CERAMIC_EXPLORER = `https://cerscan.com/${CONNECT_NETWORK}/stream`;
export const IPFS_DELEGATE = process.env.NEXT_PUBLIC_IPFS_DELEGATE;

export const PINATA_API_ENDPOINT = "https://api.pinata.cloud/psa";
export const STORAGE_WORKER_ENDPOINT = "https://storage-workers.geo-web.workers.dev";

export const SECONDS_IN_YEAR = 60 * 60 * 24 * 365;
