"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Activity, Layers, ShieldCheck, Compass } from "lucide-react";
import { SUPPORTED_CHAINS } from "@/lib/chains";

export default function AnalyzeIndexPage() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [chain, setChain] = useState("arbitrum-sepolia");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    router.push(`/analyze/${chain}/${address.trim()}`);
  };

  const curatedTokens = [
    {
      name: "ELP Terminal",
      symbol: "ELP",
      chain: "arbitrum-sepolia",
      address: process.env.NEXT_PUBLIC_ELP_TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000",
      type: "Utility & Access Token",
    },
    {
      name: "Wrapped Ether",
      symbol: "WETH",
      chain: "ethereum",
      address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      type: "Core DeFi Asset",
    },
    {
      name: "Arbitrum",
      symbol: "ARB",
      chain: "arbitrum",
      address: "0x912ce59144191c1204e64559fe8253a0e49e6548",
      type: "Layer-2 Governance",
    },
    {
      name: "Pepe",
      symbol: "PEPE",
      chain: "ethereum",
      address: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
      type: "High-Volume Whale Forensics",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <Activity className="w-3.5 h-3.5" />
          <span>Token X-Ray Search</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Inspect Any Token Contract
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Enter an EVM token address to generate a forensic analysis of ownership concentration, wallet clusters, and liquidity health.
        </p>
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleSubmit}
        className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-3"
      >
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 flex items-center gap-2 px-3 w-full bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 py-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm font-mono outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={chain}
              onChange={(e) => setChain(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border-none outline-none cursor-pointer"
            >
              {Object.values(SUPPORTED_CHAINS).map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 dark:bg-emerald-500 hover:bg-slate-800 dark:hover:bg-emerald-600 text-white dark:text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>Analyze</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </form>

      {/* Curated Direct Launches */}
      <div className="space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
          Quick Launch Directory
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {curatedTokens.map((t) => (
            <button
              key={`${t.chain}-${t.symbol}`}
              onClick={() => router.push(`/analyze/${t.chain}/${t.address}`)}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/40 text-left transition group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {t.name}
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-400">
                    ${t.symbol}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition" />
              </div>
              <div className="text-xs text-slate-500 mb-1">{t.type}</div>
              <div className="text-[11px] font-mono text-slate-400 truncate">
                {t.chain} • {t.address}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
