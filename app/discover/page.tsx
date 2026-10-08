"use client";

import React from "react";
import Link from "next/link";
import { Compass, TrendingUp, Waves, Users, AlertTriangle, ArrowRight, ShieldCheck, Activity } from "lucide-react";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/format";

export default function DiscoverPage() {
  const emergingTokens = [
    {
      symbol: "ELP",
      name: "ELP Terminal",
      chain: "arbitrum-sepolia",
      address: process.env.NEXT_PUBLIC_ELP_TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000",
      priceChange24h: 14.8,
      liquidityUsd: 250000,
      flowSignal: "High Organic Accumulation",
      score: 92,
      anomalyStatus: "Normal Baseline",
    },
    {
      symbol: "ARB",
      name: "Arbitrum",
      chain: "arbitrum",
      address: "0x912ce59144191c1204e64559fe8253a0e49e6548",
      priceChange24h: 4.2,
      liquidityUsd: 14200000,
      flowSignal: "L2 Volume Expansion",
      score: 88,
      anomalyStatus: "Normal Baseline",
    },
    {
      symbol: "PEPE",
      name: "Pepe",
      chain: "ethereum",
      address: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
      priceChange24h: -2.4,
      liquidityUsd: 89000000,
      flowSignal: "Whale Cluster Rebalancing",
      score: 74,
      anomalyStatus: "Cluster Outflow Alert",
    },
    {
      symbol: "BRETT",
      name: "Brett",
      chain: "base",
      address: "0x532f27101965dd16442e59d40670faf5ebb142e4",
      priceChange24h: 8.6,
      liquidityUsd: 24000000,
      flowSignal: "Base Ecosystem Inflow",
      score: 82,
      anomalyStatus: "Normal Baseline",
    },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>On-Chain Telemetry Feed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Emerging Forensic Discoveries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time on-chain capital rotations, liquidity adjustments, and wallet cluster anomalies across tracked chains.
          </p>
        </div>
      </div>

      {/* Discover Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {emergingTokens.map((t) => (
          <div
            key={`${t.chain}-${t.symbol}`}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center font-bold text-sm text-emerald-600 dark:text-emerald-400">
                  {t.symbol.slice(0, 3)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-slate-900 dark:text-white">
                      {t.name}
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-400">
                      ${t.symbol}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    {t.chain}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  ELP Score
                </div>
                <div className="text-lg font-black font-mono text-emerald-600">
                  {t.score}/100
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-400">24H Move</div>
                <div className={`font-mono font-bold ${t.priceChange24h >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {formatPercent(t.priceChange24h)}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-400">Liquidity Depth</div>
                <div className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {formatCurrency(t.liquidityUsd)}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-400">Anomaly Signal</div>
                <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">
                  {t.anomalyStatus}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
              <span><strong>Observed Flow: </strong>{t.flowSignal}</span>
              <Link
                href={`/analyze/${t.chain}/${t.address}`}
                className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0 ml-2"
              >
                <span>X-Ray</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
