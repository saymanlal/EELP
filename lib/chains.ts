import {
  mainnet,
  arbitrum,
  arbitrumSepolia,
  base,
  bsc,
  polygon,
  optimism,
  type Chain,
} from "viem/chains";

export interface ChainConfig {
  id: number;
  name: string;
  slug: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrl: string;
  fallbackRpcs: string[];
  explorerUrl: string;
  explorerApiUrl?: string;
  dexScreenerChainId: string;
  isTestnet?: boolean;
  color: string;
  viemChain: Chain;
}

export const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
  ethereum: {
    id: 1,
    name: "Ethereum",
    slug: "ethereum",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrl: process.env.NEXT_PUBLIC_ETHEREUM_RPC || "https://eth.llamarpc.com",
    fallbackRpcs: [
      "https://eth.llamarpc.com",
      "https://rpc.ankr.com/eth",
      "https://cloudflare-eth.com",
    ],
    explorerUrl: "https://etherscan.io",
    dexScreenerChainId: "ethereum",
    color: "#627EEA",
    viemChain: mainnet,
  },
  arbitrum: {
    id: 42161,
    name: "Arbitrum One",
    slug: "arbitrum",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrl: process.env.NEXT_PUBLIC_ARBITRUM_RPC || "https://arb1.arbitrum.io/rpc",
    fallbackRpcs: [
      "https://arb1.arbitrum.io/rpc",
      "https://rpc.ankr.com/arbitrum",
      "https://arbitrum.llamarpc.com",
    ],
    explorerUrl: "https://arbiscan.io",
    dexScreenerChainId: "arbitrum",
    color: "#28A0F0",
    viemChain: arbitrum,
  },
  "arbitrum-sepolia": {
    id: 421614,
    name: "Arbitrum Sepolia",
    slug: "arbitrum-sepolia",
    nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "https://sepolia-rollup.arbitrum.io/rpc",
    fallbackRpcs: [
      "https://sepolia-rollup.arbitrum.io/rpc",
      "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
    ],
    explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL || "https://sepolia.arbiscan.io",
    dexScreenerChainId: "arbitrum-sepolia",
    isTestnet: true,
    color: "#4A7C59",
    viemChain: arbitrumSepolia,
  },
  base: {
    id: 8453,
    name: "Base",
    slug: "base",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC || "https://mainnet.base.org",
    fallbackRpcs: [
      "https://mainnet.base.org",
      "https://base.llamarpc.com",
      "https://1rpc.io/base",
    ],
    explorerUrl: "https://basescan.org",
    dexScreenerChainId: "base",
    color: "#0052FF",
    viemChain: base,
  },
  bsc: {
    id: 56,
    name: "BNB Chain",
    slug: "bsc",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    rpcUrl: process.env.NEXT_PUBLIC_BSC_RPC || "https://bsc-dataseed.binance.org",
    fallbackRpcs: [
      "https://bsc-dataseed.binance.org",
      "https://bsc-dataseed1.defibit.io",
      "https://rpc.ankr.com/bsc",
    ],
    explorerUrl: "https://bscscan.com",
    dexScreenerChainId: "bsc",
    color: "#F3BA2F",
    viemChain: bsc,
  },
  polygon: {
    id: 137,
    name: "Polygon",
    slug: "polygon",
    nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
    rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC || "https://polygon-rpc.com",
    fallbackRpcs: [
      "https://polygon-rpc.com",
      "https://rpc.ankr.com/polygon",
      "https://polygon.llamarpc.com",
    ],
    explorerUrl: "https://polygonscan.com",
    dexScreenerChainId: "polygon",
    color: "#8247E5",
    viemChain: polygon,
  },
  optimism: {
    id: 10,
    name: "Optimism",
    slug: "optimism",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrl: process.env.NEXT_PUBLIC_OPTIMISM_RPC || "https://mainnet.optimism.io",
    fallbackRpcs: [
      "https://mainnet.optimism.io",
      "https://optimism.llamarpc.com",
      "https://rpc.ankr.com/optimism",
    ],
    explorerUrl: "https://optimistic.etherscan.io",
    dexScreenerChainId: "optimism",
    color: "#FF0420",
    viemChain: optimism,
  },
};

export const DEFAULT_CHAIN_SLUG =
  process.env.NEXT_PUBLIC_DEFAULT_CHAIN || "arbitrum-sepolia";

export function getChainBySlug(slug: string): ChainConfig {
  const normalized = slug.toLowerCase();
  if (SUPPORTED_CHAINS[normalized]) {
    return SUPPORTED_CHAINS[normalized];
  }
  // Fallbacks
  if (normalized === "eth" || normalized === "1") return SUPPORTED_CHAINS["ethereum"];
  if (normalized === "arb" || normalized === "42161") return SUPPORTED_CHAINS["arbitrum"];
  if (normalized === "sepolia" || normalized === "421614") return SUPPORTED_CHAINS["arbitrum-sepolia"];
  if (normalized === "bnb" || normalized === "binance" || normalized === "56") return SUPPORTED_CHAINS["bsc"];
  if (normalized === "matic" || normalized === "137") return SUPPORTED_CHAINS["polygon"];
  if (normalized === "op" || normalized === "10") return SUPPORTED_CHAINS["optimism"];

  return SUPPORTED_CHAINS[DEFAULT_CHAIN_SLUG] || SUPPORTED_CHAINS["arbitrum-sepolia"];
}

export function getChainById(chainId: number): ChainConfig | undefined {
  return Object.values(SUPPORTED_CHAINS).find((c) => c.id === chainId);
}
