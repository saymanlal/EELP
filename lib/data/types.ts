export interface TokenMetadata {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  totalSupplyFormatted: string;
  chainSlug: string;
  chainId: number;
  deployerAddress?: string;
  ownerAddress?: string;
  isProxy?: boolean;
  canMint?: boolean;
  canPause?: boolean;
  hasBlacklist?: boolean;
  transferTaxPercent?: number;
}

export interface MarketStructure {
  priceUsd: number;
  marketCapUsd: number;
  fdvUsd: number;
  liquidityUsd: number;
  volume24hUsd: number;
  volumeLiquidityRatio: number;
  liquidityMarketCapRatio: number;
  priceChange1h: number;
  priceChange24h: number;
  priceChange7d: number;
  txns24h: {
    buys: number;
    sells: number;
    total: number;
  };
  pairAddress?: string;
  dexName?: string;
  baseTokenSymbol?: string;
  quoteTokenSymbol?: string;
}

export interface HolderItem {
  address: string;
  balanceFormatted: string;
  balancePercentage: number;
  category: "deployer" | "liquidity_pool" | "exchange" | "treasury" | "contract" | "whale" | "user";
  isContract: boolean;
  firstSeen?: string;
  holdingDurationDays?: number;
  behaviorTag?: string;
}

export interface OwnershipForensics {
  top10Concentration: number;
  top20Concentration: number;
  top50Concentration: number;
  top100Concentration: number;
  totalHoldersEstimate: number;
  holdersAvailable: boolean;
  burnPercentage: number;
  liquidityPoolPercentage: number;
  deployerHoldingPercentage: number;
  topHolders: HolderItem[];
}

export interface HolderQualityBreakdown {
  score: number; // 0 - 100
  rating: "Exceptional" | "High" | "Moderate" | "Concerning" | "Fragile";
  factors: {
    name: string;
    score: number;
    weight: number;
    description: string;
  }[];
  independentWalletsEstimatePercent: number;
  averageHoldingDays: number;
}

export interface BehavioralFingerprint {
  accumulationScore: number; // 0 - 10
  distributionScore: number; // 0 - 10
  tradingIntensity: number; // 0 - 10
  dormancyRatio: number; // 0 - 10
  crossWalletInteractions: number; // 0 - 10
  organicSpread: number; // 0 - 10
  summary: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: "token" | "wallet" | "pool" | "exchange" | "deployer" | "contract";
  balance?: string;
  clusterId?: string;
  risk?: "low" | "medium" | "high";
}

export interface GraphEdge {
  source: string;
  target: string;
  type: "transfer" | "funding" | "swap" | "liquidity" | "approval";
  value?: string;
  timestamp?: number;
}

export interface WalletRelationshipGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface WalletCluster {
  id: string;
  name: string;
  walletCount: number;
  wallets: string[];
  totalHeldPercentage: number;
  sharedSignal: string;
  confidence: "High" | "Medium" | "Low";
  evidence: string[];
}

export interface HighConvictionWallet {
  address: string;
  label: string;
  entryPriceEstimate?: number;
  currentHolding: string;
  holdingPercentage: number;
  historicalSignalStrength: "Strong" | "Moderate" | "Emerging";
  observedPatterns: string[];
}

export interface CapitalFlowSummary {
  inflow24hUsd: number;
  outflow24hUsd: number;
  netFlow24hUsd: number;
  topInflowSource: string;
  topOutflowDestination: string;
  exchangeNetFlowUsd: number;
  dexNetFlowUsd: number;
  whaleNetFlowUsd: number;
}

export interface LiquidityShockEvent {
  id: string;
  timestamp: number;
  type: "addition" | "removal" | "large_swap" | "migration";
  magnitudeUsd: number;
  percentageChange: number;
  priceImpactPercent: number;
  description: string;
  walletAddress?: string;
}

export interface LiquidityHealth {
  liquidityUsd: number;
  liquidityHealthRating: "Robust" | "Adequate" | "Thin" | "Vulnerable";
  lpConcentrationTop3Percent: number;
  poolAgeDays: number;
  lockedEstimatedPercent: number;
  lockedStatusDescription: string;
  isLpLocked: boolean;
  shocks: LiquidityShockEvent[];
}

export interface FlowDivergenceData {
  divergenceDetected: boolean;
  severity: "None" | "Minor" | "Moderate" | "Severe";
  summary: string;
  metrics: {
    label: string;
    change24h: number;
    trend: "up" | "down" | "flat";
    supporting: boolean;
  }[];
  implication: string;
}

export interface WhatChangedItem {
  category: "Ownership" | "Liquidity" | "Flows" | "Wallets" | "Contract";
  title: string;
  description: string;
  evidence: string;
  severity: "info" | "positive" | "warning" | "alert";
}

export interface WhoMovedItem {
  type: "Accumulation" | "Distribution" | "Liquidity Interaction" | "New Whale";
  wallet: string;
  amount: string;
  usdValue: number;
  percentOfSupply: number;
  timeAgo: string;
  tag: string;
}

export interface AnomalyItem {
  id: string;
  title: string;
  category: "Volume" | "Concentration" | "Liquidity" | "Cluster" | "Velocity";
  deviationMultiplier: number;
  baselineDescription: string;
  currentObservation: string;
  severity: "low" | "medium" | "high";
  detectedAt: string;
}

export interface RiskRadarCategory {
  name: string;
  level: "LOW" | "MODERATE" | "HIGH";
  score: number; // 0-100
  evidence: string[];
}

export interface ContractControlForensics {
  mintCapability: "Disabled (Fixed Supply)" | "Enabled" | "Unknown / Needs Verification";
  upgradeability: "Immutable" | "Proxy / Upgradeable" | "Unknown";
  pauseMechanism: "Not Detected" | "Pauseable" | "Detected";
  blacklistMechanism: "Not Detected" | "Present" | "Unknown";
  transferTax: "0% / None" | "Variable Tax" | "Detected";
  feeSetterPrivilege: "None" | "Admin Fee Setter" | "Not Detected";
  verifiedSource: boolean;
  compiler?: string;
}

export interface DeployerProfile {
  address: string;
  balanceEth?: string;
  tokenHoldingsPercent: number;
  totalDeployedTokens?: number;
  firstFundedBy?: string;
  lastActiveTimestamp?: number;
  tags: string[];
}

export interface TokenXRayData {
  token: TokenMetadata;
  market: MarketStructure;
  ownership: OwnershipForensics;
  holderQuality: HolderQualityBreakdown;
  fingerprint: BehavioralFingerprint;
  relationshipGraph: WalletRelationshipGraphData;
  clusters: WalletCluster[];
  highConvictionWallets: HighConvictionWallet[];
  capitalFlow: CapitalFlowSummary;
  liquidity: LiquidityHealth;
  volumeQuality: {
    rating: "HIGH" | "MODERATE" | "LOW";
    uniqueBuyers24h: number;
    uniqueSellers24h: number;
    topWalletsVolumePercentage: number;
    evidence: string;
  };
  organicity: {
    score: number;
    rating: "High Organic" | "Moderate Organic" | "Low / Clustered";
    evidence: string;
  };
  flowDivergence: FlowDivergenceData;
  tokenLifecycle: {
    currentPhase: "Launch" | "Discovery" | "Liquidity Expansion" | "Acceleration" | "Distribution" | "Contraction" | "Recovery / Dormancy";
    ageDays: number;
    description: string;
  };
  eventTimeline: {
    timestamp: number;
    title: string;
    description: string;
    type: "transfer" | "liquidity" | "whale" | "price" | "milestone";
  }[];
  moveExplainer: {
    detectedMove24h: number;
    contributingFactors: string[];
    evidenceSummary: string;
  };
  anomalies: AnomalyItem[];
  riskRadar: RiskRadarCategory[];
  contractControl: ContractControlForensics;
  deployer: DeployerProfile;
  elpIntelligenceScore: {
    score: number; // 0 - 100
    confidence: "High" | "Medium" | "Low";
    breakdown: {
      dataQuality: number;
      holderDistribution: number;
      liquidityQuality: number;
      flowConsistency: number;
      walletConcentration: number;
      activityOrganicity: number;
      contractTransparency: number;
      anomalyControl: number;
    };
  };
  whatChanged: WhatChangedItem[];
  whoMoved: WhoMovedItem[];
  marketRegime: {
    regime: "Accumulation" | "Expansion" | "Distribution" | "Contraction" | "Recovery" | "Unclear";
    confidence: "High" | "Medium" | "Low";
    rationale: string;
  };
  analyzedAt: string;
}
