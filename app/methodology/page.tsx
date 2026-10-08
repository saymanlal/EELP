"use client";

import React from "react";
import { BookOpen, CheckCircle2, ShieldAlert } from "lucide-react";
import { Disclaimer } from "@/components/Disclaimer";

export default function MethodologyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Full Transparency</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          EELP Forensic Methodology
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          No black-box algorithms or AI hallucinations. Transparent on-chain telemetry mathematical formulas.
        </p>
      </div>

      <div className="space-y-8 text-sm text-slate-700 dark:text-slate-300">
        {/* 1. Holder Quality Score */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            1. Holder Quality Score Formula
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            The Holder Quality Score measures structural ownership dispersion and holding maturity rather than raw count of vanity addresses.
          </p>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-xs border border-slate-200 dark:border-slate-800">
            <code>HolderQuality = (0.35 × Dispersion) + (0.25 × Independence) + (0.25 × HoldingHorizon) + (0.15 × OrganicRetention)</code>
          </div>

          <ul className="space-y-2 text-xs">
            <li>• <strong>Dispersion (35%):</strong> Evaluated using Gini coefficient and Top-10 / Top-20 supply concentration.</li>
            <li>• <strong>Independence (25%):</strong> Cross-referenced against common gas funder addresses to weed out sybil networks.</li>
            <li>• <strong>Holding Horizon (25%):</strong> Weighted average age of balances on the host blockchain.</li>
            <li>• <strong>Organic Retention (15%):</strong> Ratio of multi-week holding vs high-frequency rapid flipping.</li>
          </ul>
        </div>

        {/* 2. Wallet Clustering Detection */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            2. Wallet Clustering Detection
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            EELP identifies behaviorally linked wallet clusters based on empirical on-chain footprints:
          </p>
          <ul className="space-y-2 text-xs">
            <li>• <strong>Funding Origin:</strong> Wallets receiving initial ETH from identical centralized exchange deposit routers or deployer contracts within a narrow block timeframe.</li>
            <li>• <strong>Transaction Synchronization:</strong> Simultaneous buy/sell executions with identical gas priority and slippage tolerances.</li>
            <li>• <strong>Intermediary Routing:</strong> Cascading token split transfers routed through common relay contracts.</li>
          </ul>
        </div>

        {/* 3. Flow Divergence Engine */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            3. Flow Divergence Engine
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Flow divergence highlights when market pricing moves in opposition to underlying balance sheet activity:
          </p>
          <ul className="space-y-2 text-xs">
            <li>• <strong>Bullish Divergence:</strong> Price contracts while high-conviction whale wallets steadily accumulate and liquidity depth expands.</li>
            <li>• <strong>Bearish Divergence:</strong> Price expands while liquidity is steadily withdrawn from primary DEX pools and whale net flows turn negative.</li>
          </ul>
        </div>

        {/* 4. Risk Radar */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            4. 7-Vector Risk Radar
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            We evaluate 7 independent vulnerability dimensions: Ownership Concentration, Liquidity Depth, Bytecode Privileges (mint, pause, blacklist, taxes), Holder Maturity, Trading Velocity, Cluster Correlation, and Volume Anomalies.
          </p>
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}
