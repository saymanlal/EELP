"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  useAccount,
  useReadContract,
  useWriteContract,
} from "wagmi";
import {
  Shield,
  Coins,
  Vote,
  Plus,
  ExternalLink,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info,
  Sparkles,
} from "lucide-react";
import { CONTRACT_ADDRESSES, CONTRACT_ABIS, STAKING_TIERS_CONFIG } from "@/lib/contracts";
import { formatNumber, formatAddress } from "@/lib/format";
import { formatUnits } from "viem";
import { TierBadge } from "@/components/TierBadge";
import { StatCard } from "@/components/StatCard";

export default function DashboardPage() {
  const { address, isConnected, chain } = useAccount();
  const [addTokenSuccess, setAddTokenSuccess] = useState(false);

  // Read User ELP Balance
  const { data: elpBalanceRaw } = useReadContract({
    address: CONTRACT_ADDRESSES.elpToken as `0x${string}`,
    abi: CONTRACT_ABIS.elpToken,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address && !!CONTRACT_ADDRESSES.elpToken,
    },
  });

  // Read User Staked Balance
  const { data: stakedBalanceRaw } = useReadContract({
    address: CONTRACT_ADDRESSES.staking as `0x${string}`,
    abi: CONTRACT_ABIS.staking,
    functionName: "stakedBalance",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address && !!CONTRACT_ADDRESSES.staking,
    },
  });

  // Read User Tier
  const { data: tierRaw } = useReadContract({
    address: CONTRACT_ADDRESSES.staking as `0x${string}`,
    abi: CONTRACT_ABIS.staking,
    functionName: "getTier",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address && !!CONTRACT_ADDRESSES.staking,
    },
  });

  // Read Voting Power
  const { data: votesRaw } = useReadContract({
    address: CONTRACT_ADDRESSES.elpToken as `0x${string}`,
    abi: CONTRACT_ABIS.elpToken,
    functionName: "getVotes",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address && !!CONTRACT_ADDRESSES.elpToken,
    },
  });

  const elpBalance = elpBalanceRaw ? Number(formatUnits(elpBalanceRaw as bigint, 18)) : 0;
  const stakedBalance = stakedBalanceRaw ? Number(formatUnits(stakedBalanceRaw as bigint, 18)) : 0;
  const votingPower = votesRaw ? Number(formatUnits(votesRaw as bigint, 18)) : 0;
  const currentTier = tierRaw === 2 ? "ELITE" : tierRaw === 1 ? "PRO" : "FREE";

  const handleAddTokenToWallet = async () => {
    if (typeof window === "undefined" || !(window as any).ethereum || !CONTRACT_ADDRESSES.elpToken) return;
    try {
      await (window as any).ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: CONTRACT_ADDRESSES.elpToken,
            symbol: "ELP",
            decimals: 18,
          },
        },
      });
      setAddTokenSuccess(true);
      setTimeout(() => setAddTokenSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Holder & Utility Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            ELP Ecosystem Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your $ELP balance, inspect tier benefits, claim testnet tokens, and participate in signal governance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <TierBadge tier={currentTier} size="lg" />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Wallet $ELP Balance"
          value={formatNumber(elpBalance)}
          subtext="Available in connected wallet"
        />
        <StatCard
          label="Active Staked $ELP"
          value={formatNumber(stakedBalance)}
          subtext={`Current Tier: ${currentTier}`}
        />
        <StatCard
          label="Signal Voting Power"
          value={formatNumber(votingPower)}
          subtext="ERC20Votes checkpoint balance"
        />
        <StatCard
          label="Unlocked Capabilities"
          value={currentTier === "ELITE" ? "Full Suite" : currentTier === "PRO" ? "Advanced Forensics" : "Core X-Ray"}
          subtext="Access level"
        />
      </div>

      {/* Testnet & Add Token Banner */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Arbitrum Sepolia Testnet Environment
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Testnet $ELP is intended for testing, development, and experimentation and has no intended monetary value.
          </p>
          {CONTRACT_ADDRESSES.elpToken && (
            <div className="text-xs font-mono text-slate-500">
              Contract: {formatAddress(CONTRACT_ADDRESSES.elpToken, 6)}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href={CONTRACT_ADDRESSES.faucetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-emerald-500 hover:bg-slate-800 dark:hover:bg-emerald-600 text-white dark:text-slate-950 font-bold text-xs shadow-sm transition inline-flex items-center gap-1.5"
          >
            <span>Get Sepolia ETH / ELP</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleAddTokenToWallet}
            disabled={!CONTRACT_ADDRESSES.elpToken}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{addTokenSuccess ? "Added to Wallet!" : "Add $ELP to Wallet"}</span>
          </button>
        </div>
      </div>

      {/* Tier Feature Matrix */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            Ecosystem Access Tiers
          </h3>
          <p className="text-xs text-slate-500">
            Stake $ELP to unlock progressively deeper forensic capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(STAKING_TIERS_CONFIG).map(([key, config]) => {
            const isCurrent = currentTier === key;
            return (
              <div
                key={key}
                className={`p-5 rounded-2xl border flex flex-col justify-between ${
                  isCurrent
                    ? "bg-emerald-500/5 border-emerald-500/40 ring-1 ring-emerald-500/20"
                    : "bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-base text-slate-900 dark:text-white">
                      {config.name}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                        Current Tier
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono font-semibold text-emerald-600 mb-3">
                    {config.label}
                  </div>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    {config.description}
                  </p>

                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {config.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <Link
                    href="/staking"
                    className="w-full block py-2.5 rounded-xl text-center font-semibold text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-sm"
                  >
                    {isCurrent ? "Manage Staking" : "Upgrade to " + config.name}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Indexer Notice */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
        <div>
          <strong>Global Leaderboard: </strong>
          Coming when high-throughput on-chain indexing is configured. No fabricated holder rankings.
        </div>
        <Link href="/methodology" className="text-emerald-600 hover:underline shrink-0 ml-4 font-semibold">
          Read Methodology
        </Link>
      </div>
    </div>
  );
}
