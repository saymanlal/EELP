"use client";

import React, { useState } from "react";
import { GitCompare, ArrowRight, ShieldCheck, PieChart, Activity, RefreshCw } from "lucide-react";
import { analyzeToken } from "@/lib/data/forensics";
import { TokenXRayData } from "@/lib/data/types";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/format";
import { SUPPORTED_CHAINS } from "@/lib/chains";

export default function ComparePage() {
  const [chainA, setChainA] = useState("arbitrum-sepolia");
  const [addressA, setAddressA] = useState(process.env.NEXT_PUBLIC_EELP_TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000");

  const [chainB, setChainB] = useState("ethereum");
  const [addressB, setAddressB] = useState("0x6982508145454ce325ddbe47a25d4ec3d2311933"); // PEPE

  const [dataA, setDataA] = useState<TokenXRayData | null>(null);
  const [dataB, setDataB] = useState<TokenXRayData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRunCompare = async () => {
    setLoading(true);
    try {
      const [resA, resB] = await Promise.all([
        analyzeToken(chainA, addressA),
        analyzeToken(chainB, addressB),
      ]);
      setDataA(resA);
      setDataB(resB);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
          <GitCompare className="w-3.5 h-3.5" />
          <span>Forensic Comparison</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Side-by-Side Token Forensic Comparison
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Compare Holder Quality, Top-10 Concentration, Liquidity Health, and Flow Divergence between any two tokens.
        </p>
      </div>

      {/* Selectors Form */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Token A */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Token A
            </label>
            <div className="flex gap-2">
              <select
                value={chainA}
                onChange={(e) => setChainA(e.target.value)}
                className="px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 outline-none"
              >
                {Object.values(SUPPORTED_CHAINS).map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={addressA}
                onChange={(e) => setAddressA(e.target.value)}
                placeholder="Token A Address (0x...)"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono outline-none"
              />
            </div>
          </div>

          {/* Token B */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Token B
            </label>
            <div className="flex gap-2">
              <select
                value={chainB}
                onChange={(e) => setChainB(e.target.value)}
                className="px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 outline-none"
              >
                {Object.values(SUPPORTED_CHAINS).map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={addressB}
                onChange={(e) => setAddressB(e.target.value)}
                placeholder="Token B Address (0x...)"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono outline-none"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleRunCompare}
          disabled={loading || !addressA || !addressB}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
        >
          {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
          <span>Run Comparative Forensics</span>
        </button>
      </div>

      {/* Comparison Matrix Output */}
      {dataA && dataB && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4 font-bold text-slate-400 uppercase tracking-wider">
                  Forensic Metric
                </th>
                <th className="py-3 px-4 font-bold text-slate-900 dark:text-white text-base">
                  {dataA.token.symbol} ({dataA.token.name})
                </th>
                <th className="py-3 px-4 font-bold text-slate-900 dark:text-white text-base">
                  {dataB.token.symbol} ({dataB.token.name})
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              <tr>
                <td className="py-3.5 px-4 font-sans font-semibold text-slate-600 dark:text-slate-400">
                  EELP Intelligence Score
                </td>
                <td className="py-3.5 px-4 font-bold text-emerald-600 text-sm">
                  {dataA.elpIntelligenceScore.score} / 100
                </td>
                <td className="py-3.5 px-4 font-bold text-emerald-600 text-sm">
                  {dataB.elpIntelligenceScore.score} / 100
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-sans font-semibold text-slate-600 dark:text-slate-400">
                  Holder Quality Score
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                  {dataA.holderQuality.score} / 100 ({dataA.holderQuality.rating})
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                  {dataB.holderQuality.score} / 100 ({dataB.holderQuality.rating})
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-sans font-semibold text-slate-600 dark:text-slate-400">
                  Top 10 Concentration
                </td>
                <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200">
                  {dataA.ownership.top10Concentration.toFixed(1)}%
                </td>
                <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200">
                  {dataB.ownership.top10Concentration.toFixed(1)}%
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-sans font-semibold text-slate-600 dark:text-slate-400">
                  Pool Liquidity Depth
                </td>
                <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200">
                  {formatCurrency(dataA.market.liquidityUsd)}
                </td>
                <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200">
                  {formatCurrency(dataB.market.liquidityUsd)}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-sans font-semibold text-slate-600 dark:text-slate-400">
                  Flow Divergence
                </td>
                <td className="py-3.5 px-4">
                  {dataA.flowDivergence.divergenceDetected ? (
                    <span className="text-amber-500 font-bold">Divergence ({dataA.flowDivergence.severity})</span>
                  ) : (
                    <span className="text-emerald-500 font-bold">Flows Aligned</span>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  {dataB.flowDivergence.divergenceDetected ? (
                    <span className="text-amber-500 font-bold">Divergence ({dataB.flowDivergence.severity})</span>
                  ) : (
                    <span className="text-emerald-500 font-bold">Flows Aligned</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-sans font-semibold text-slate-600 dark:text-slate-400">
                  Active Wallet Clusters
                </td>
                <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200">
                  {dataA.clusters.length} Cluster(s)
                </td>
                <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200">
                  {dataB.clusters.length} Cluster(s)
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-sans font-semibold text-slate-600 dark:text-slate-400">
                  Contract Immutability
                </td>
                <td className="py-3.5 px-4 text-emerald-600 font-bold">
                  {dataA.contractControl.mintCapability}
                </td>
                <td className="py-3.5 px-4 text-emerald-600 font-bold">
                  {dataB.contractControl.mintCapability}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
