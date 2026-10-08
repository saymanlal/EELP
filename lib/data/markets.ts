export interface ChainMarketMetrics {
  chainId: number;
  chainName: string;
  chainSlug: string;
  color: string;
  txns24h: number;
  activeAddresses24h: number;
  dexVolume24hUsd: number;
  stablecoinNetFlowUsd: number;
  newContractsDeployed24h: number;
  liquidityMigrationNetUsd: number;
  activityScore: number; // 0 - 100
}

export interface EmergingNarrative {
  category: string;
  narrativeName: string;
  growth24hPercent: number;
  tokenCount: number;
  dexVolumeUsd: number;
  topTokens: { symbol: string; address: string; chain: string; change24h: number }[];
  signalStrength: "Strong" | "Moderate" | "Emerging";
}

export interface GlobalMarketTelemetry {
  totalTrackedDexVolume24h: number;
  totalActiveClusters: number;
  divergenceAlertsActive: number;
  chains: ChainMarketMetrics[];
  narratives: EmergingNarrative[];
  capitalFlowByChain: {
    chain: string;
    inflowUsd: number;
    outflowUsd: number;
    netUsd: number;
  }[];
}

export function getGlobalMarketTelemetry(): GlobalMarketTelemetry {
  return {
    totalTrackedDexVolume24h: 3840200000,
    totalActiveClusters: 1420,
    divergenceAlertsActive: 48,
    chains: [
      {
        chainId: 1,
        chainName: "Ethereum",
        chainSlug: "ethereum",
        color: "#627EEA",
        txns24h: 1240500,
        activeAddresses24h: 395000,
        dexVolume24hUsd: 1420000000,
        stablecoinNetFlowUsd: 48000000,
        newContractsDeployed24h: 4200,
        liquidityMigrationNetUsd: 12500000,
        activityScore: 94,
      },
      {
        chainId: 42161,
        chainName: "Arbitrum One",
        chainSlug: "arbitrum",
        color: "#28A0F0",
        txns24h: 2150000,
        activeAddresses24h: 285000,
        dexVolume24hUsd: 680000000,
        stablecoinNetFlowUsd: 22000000,
        newContractsDeployed24h: 2100,
        liquidityMigrationNetUsd: 8400000,
        activityScore: 89,
      },
      {
        chainId: 8453,
        chainName: "Base",
        chainSlug: "base",
        color: "#0052FF",
        txns24h: 3800000,
        activeAddresses24h: 620000,
        dexVolume24hUsd: 790000000,
        stablecoinNetFlowUsd: 31000000,
        newContractsDeployed24h: 8900,
        liquidityMigrationNetUsd: 18200000,
        activityScore: 96,
      },
      {
        chainId: 56,
        chainName: "BNB Chain",
        chainSlug: "bsc",
        color: "#F3BA2F",
        txns24h: 3400000,
        activeAddresses24h: 780000,
        dexVolume24hUsd: 490000000,
        stablecoinNetFlowUsd: -5400000,
        newContractsDeployed24h: 3400,
        liquidityMigrationNetUsd: -2100000,
        activityScore: 82,
      },
      {
        chainId: 137,
        chainName: "Polygon",
        chainSlug: "polygon",
        color: "#8247E5",
        txns24h: 2900000,
        activeAddresses24h: 410000,
        dexVolume24hUsd: 230000000,
        stablecoinNetFlowUsd: 8900000,
        newContractsDeployed24h: 1800,
        liquidityMigrationNetUsd: 3400000,
        activityScore: 78,
      },
      {
        chainId: 10,
        chainName: "Optimism",
        chainSlug: "optimism",
        color: "#FF0420",
        txns24h: 890000,
        activeAddresses24h: 140000,
        dexVolume24hUsd: 230000000,
        stablecoinNetFlowUsd: 6200000,
        newContractsDeployed24h: 950,
        liquidityMigrationNetUsd: 4100000,
        activityScore: 74,
      },
    ],
    narratives: [
      {
        category: "Infrastructure",
        narrativeName: "Decentralized Forensics & On-Chain Intelligence",
        growth24hPercent: 28.4,
        tokenCount: 14,
        dexVolumeUsd: 45000000,
        topTokens: [
          { symbol: "ELP", address: "0x0000000000000000000000000000000000000000", chain: "arbitrum-sepolia", change24h: 14.8 },
        ],
        signalStrength: "Strong",
      },
      {
        category: "Layer 2",
        narrativeName: "L2 Execution Acceleration & Settlement",
        growth24hPercent: 12.1,
        tokenCount: 42,
        dexVolumeUsd: 310000000,
        topTokens: [
          { symbol: "ARB", address: "0x912ce59144191c1204e64559fe8253a0e49e6548", chain: "arbitrum", change24h: 4.2 },
          { symbol: "OP", address: "0x4200000000000000000000000000000000000042", chain: "optimism", change24h: 3.1 },
        ],
        signalStrength: "Moderate",
      },
      {
        category: "Real World Assets",
        narrativeName: "Tokenized Treasuries & Institutional Settlement",
        growth24hPercent: 8.9,
        tokenCount: 29,
        dexVolumeUsd: 140000000,
        topTokens: [
          { symbol: "ONDO", address: "0xfaba6f8e4a5e8ab82f62fe7c39859fa577269be3", chain: "ethereum", change24h: 5.6 },
        ],
        signalStrength: "Moderate",
      },
    ],
    capitalFlowByChain: [
      { chain: "Base", inflowUsd: 412000000, outflowUsd: 381000000, netUsd: 31000000 },
      { chain: "Arbitrum", inflowUsd: 351000000, outflowUsd: 329000000, netUsd: 22000000 },
      { chain: "Ethereum", inflowUsd: 734000000, outflowUsd: 686000000, netUsd: 48000000 },
      { chain: "Polygon", inflowUsd: 119000000, outflowUsd: 110100000, netUsd: 8900000 },
      { chain: "Optimism", inflowUsd: 118000000, outflowUsd: 111800000, netUsd: 6200000 },
      { chain: "BNB Chain", inflowUsd: 242000000, outflowUsd: 247400000, netUsd: -5400000 },
    ],
  };
}
