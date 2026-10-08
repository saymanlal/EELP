"use client";

import React from "react";
import { Layers, TrendingUp, ArrowUpRight, ArrowDownRight, Compass, ShieldCheck, Flame } from "lucide-react";
import { getGlobalMarketTelemetry } from "@/lib/data/markets";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { StatCard } from "@/components/StatCard";

export default function MarketsPage() {
  const telemetry = getGlobalMarketTelemetry();

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Cross-Chain Forensic Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Global Market Forensics & Heatmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Aggregated liquidity movements, cross-chain capital bridges, stablecoin rotations, and narrative signals.
          </p>
        </div>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Tracked 24H DEX Volume"
          value={formatCurrency(telemetry.totalTrackedDexVolume24h)}
          subtext="Across 6 core EVM ecosystems"
        />
        <StatCard
          label="Active Behavior Clusters"
          value={formatNumber(telemetry.totalActiveClusters)}
          subtext="Behaviorally linked wallet groups"
        />
        <StatCard
          label="Flow Divergence Alerts"
          value={telemetry.divergenceAlertsActive}
          subtext="Price vs Liquidity mismatch detected"
          badgeText="Active"
          badgeVariant="warning"
        />
      </div>

      {/* Multi-Chain Heatmap Matrix */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-500" />
              <span>Multi-Chain Activity & Velocity Heatmap</span>
            </h3>
            <p className="text-xs text-slate-500">
              Comparative telemetry across Ethereum, Arbitrum, Base, BNB, Polygon, and Optimism.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3">Network</th>
                <th className="py-3 px-3">24H DEX Volume</th>
                <th className="py-3 px-3">24H Transactions</th>
                <th className="py-3 px-3">Active Wallets</th>
                <th className="py-3 px-3">Stablecoin Net Flow</th>
                <th className="py-3 px-3">Activity Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {telemetry.chains.map((chain) => (
                <tr key={chain.chainId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-3 font-sans font-bold flex items-center gap-2.5 text-slate-900 dark:text-white">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: chain.color }}
                    />
                    <span>{chain.chainName}</span>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                    {formatCurrency(chain.dexVolume24hUsd)}
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                    {formatNumber(chain.txns24h)}
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                    {formatNumber(chain.activeAddresses24h)}
                  </td>
                  <td className={`py-3.5 px-3 font-semibold ${chain.stablecoinNetFlowUsd >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {chain.stablecoinNetFlowUsd >= 0 ? "+" : ""}{formatCurrency(chain.stablecoinNetFlowUsd)}
                  </td>
                  <td className="py-3.5 px-3 font-sans">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold">
                      {chain.activityScore}/100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Capital Flow By Chain & Emerging Narratives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Capital Flow */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Net Capital Flow Movement
            </h3>
            <p className="text-xs text-slate-500">
              Inter-chain bridge telemetry and net settlement.
            </p>
          </div>

          <div className="space-y-3">
            {telemetry.capitalFlowByChain.map((cf) => (
              <div
                key={cf.chain}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex items-center justify-between text-xs"
              >
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {cf.chain}
                </span>
                <div className="flex items-center gap-4 font-mono">
                  <span className="text-slate-400">In: {formatCurrency(cf.inflowUsd)}</span>
                  <span className={`font-bold ${cf.netUsd >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    Net: {cf.netUsd >= 0 ? "+" : ""}{formatCurrency(cf.netUsd)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emerging Narratives */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Emerging Narrative Momentum</span>
              </h3>
              <p className="text-xs text-slate-500">
                On-chain activity concentration across sector categories.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {telemetry.narratives.map((n, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                      {n.category}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {n.narrativeName}
                    </span>
                  </div>
                  <span className="font-bold font-mono text-emerald-600">
                    +{n.growth24hPercent}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>24H Volume: {formatCurrency(n.dexVolumeUsd)}</span>
                  <span>Signal: <strong>{n.signalStrength}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
