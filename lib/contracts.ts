import ELPTokenAbi from "@/abi/ELPToken.json";
import StakingTiersAbi from "@/abi/StakingTiers.json";
import VestingVaultAbi from "@/abi/VestingVault.json";
import ELPGovernorAbi from "@/abi/ELPGovernor.json";
import ERC20Abi from "@/abi/ERC20.json";

export interface ContractAddresses {
  elpToken: `0x${string}` | "";
  staking: `0x${string}` | "";
  vesting: `0x${string}` | "";
  governor: `0x${string}` | "";
  liquidityPool: `0x${string}` | "";
  lpLock: `0x${string}` | "";
  faucetUrl: string;
}

export const CONTRACT_ADDRESSES: ContractAddresses = {
  elpToken: (process.env.NEXT_PUBLIC_ELP_TOKEN_ADDRESS as `0x${string}`) || "",
  staking: (process.env.NEXT_PUBLIC_STAKING_ADDRESS as `0x${string}`) || "",
  vesting: (process.env.NEXT_PUBLIC_VESTING_ADDRESS as `0x${string}`) || "",
  governor: (process.env.NEXT_PUBLIC_GOVERNOR_ADDRESS as `0x${string}`) || "",
  liquidityPool: (process.env.NEXT_PUBLIC_LIQUIDITY_POOL_ADDRESS as `0x${string}`) || "",
  lpLock: (process.env.NEXT_PUBLIC_LP_LOCK_ADDRESS as `0x${string}`) || "",
  faucetUrl: process.env.NEXT_PUBLIC_FAUCET_URL || "https://faucets.chain.link/arbitrum-sepolia",
};

export const CONTRACT_ABIS = {
  elpToken: ELPTokenAbi,
  staking: StakingTiersAbi,
  vesting: VestingVaultAbi,
  governor: ELPGovernorAbi,
  erc20: ERC20Abi,
};

export const STAKING_TIERS_CONFIG = {
  FREE: {
    name: "FREE",
    requiredStake: 0n,
    label: "0 $ELP",
    description: "Basic on-chain token X-Ray, public liquidity and market structure overview.",
    features: [
      "Token Contract X-Ray",
      "Deterministic Risk Radar",
      "Top-10 Ownership Concentration",
      "Basic Liquidity Health",
      "Global Market Overview",
    ],
  },
  PRO: {
    name: "PRO",
    requiredStake: 10_000n * 10n ** 18n,
    label: "10,000 $ELP",
    description: "Advanced wallet intelligence, flow divergence signals and cluster mapping.",
    features: [
      "All Free Tier capabilities",
      "Wallet Behavioral Fingerprinting",
      "Wallet Relationship Graph",
      "Flow Divergence Radar",
      "Liquidity Shock Detector",
      "What Changed Engine",
      "Who Moved Forensics",
    ],
  },
  ELITE: {
    name: "ELITE",
    requiredStake: 100_000n * 10n ** 18n,
    label: "100,000 $ELP",
    description: "Full institutional forensic suite, deep wallet clustering and signal governance.",
    features: [
      "All Pro Tier capabilities",
      "Deep Wallet Cluster Detection",
      "High-Conviction Wallet Tracking",
      "Cross-Chain Capital Flow Maps",
      "Signal Governance Proposal Creation",
      "Automated Forensic Report Exporter",
      "Priority Anomaly Notifications",
    ],
  },
};
