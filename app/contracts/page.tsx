"use client";

import React, { useState } from "react";
import { FileCode, ExternalLink, Copy, Check, ShieldCheck } from "lucide-react";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import { formatAddress } from "@/lib/format";

interface ContractRegistryItem {
  name: string;
  description: string;
  address: string;
  network: string;
  explorerUrl: string;
}

export default function ContractsPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const contractsList: ContractRegistryItem[] = [
    {
      name: "EELP Token ($EELP)",
      description: "Fixed supply ERC20, ERC20Permit, ERC20Votes token (1,000,000,000 fixed supply).",
      address: CONTRACT_ADDRESSES.elpToken,
      network: "Arbitrum Sepolia (421614)",
      explorerUrl: "https://sepolia.arbiscan.io",
    },
    {
      name: "Staking Tiers",
      description: "Non-inflationary access staking contract with 7-day cooldown flow.",
      address: CONTRACT_ADDRESSES.staking,
      network: "Arbitrum Sepolia (421614)",
      explorerUrl: "https://sepolia.arbiscan.io",
    },
    {
      name: "Team Vesting Vault",
      description: "Public verifiable linear vesting contract (100M EELP, 3-mo cliff, 12-mo linear).",
      address: CONTRACT_ADDRESSES.vesting,
      network: "Arbitrum Sepolia (421614)",
      explorerUrl: "https://sepolia.arbiscan.io",
    },
    {
      name: "EELP Governor",
      description: "OpenZeppelin Governor contract for decentralized signal voting.",
      address: CONTRACT_ADDRESSES.governor,
      network: "Arbitrum Sepolia (421614)",
      explorerUrl: "https://sepolia.arbiscan.io",
    },
    {
      name: "Primary Liquidity Pool",
      description: "DEX liquidity pool pairing on Arbitrum.",
      address: CONTRACT_ADDRESSES.liquidityPool,
      network: "Arbitrum Sepolia (421614)",
      explorerUrl: "https://sepolia.arbiscan.io",
    },
    {
      name: "LP Token Lock Vault",
      description: "Time-locked smart contract holding initial liquidity provider LP tokens.",
      address: CONTRACT_ADDRESSES.lpLock,
      network: "Arbitrum Sepolia (421614)",
      explorerUrl: "https://sepolia.arbiscan.io",
    },
  ];

  const handleCopy = (address: string, idx: number) => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
          <FileCode className="w-3.5 h-3.5" />
          <span>On-Chain Registry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Verified Smart Contracts
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Direct verifiable on-chain registry for $EELP ecosystem contracts. No fabricated addresses.
        </p>
      </div>

      <div className="space-y-4">
        {contractsList.map((item, idx) => {
          const isDeployed = Boolean(item.address && item.address.startsWith("0x") && item.address !== "0x0000000000000000000000000000000000000000");

          return (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {item.network}
                  </span>
                  {isDeployed ? (
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 font-medium">
                      Not deployed yet
                    </span>
                  )}
                </div>
              </div>

              {isDeployed ? (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                  <span className="text-slate-800 dark:text-slate-200 truncate">
                    {item.address}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopy(item.address, idx)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1 font-sans font-semibold text-xs"
                    >
                      {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === idx ? "Copied" : "Copy"}</span>
                    </button>
                    <a
                      href={`${item.explorerUrl}/address/${item.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1 font-sans font-semibold text-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Explorer</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-400 font-mono">
                  Address will appear here upon contract deployment via Foundry broadcast script.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
