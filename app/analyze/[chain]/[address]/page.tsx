"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Activity,
  Shield,
  Layers,
  Copy,
  Check,
  ExternalLink,
  Bookmark,
  Download,
  Share2,
  Sparkles,
  HelpCircle,
  RefreshCw,
  AlertTriangle,
  User,
  PieChart,
  GitCompare,
  TrendingUp,
} from "lucide-react";
import { analyzeToken } from "@/lib/data/forensics";
import { TokenXRayData } from "@/lib/data/types";
import { formatAddress, formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { getChainBySlug } from "@/lib/chains";
import { isTokenWatched, saveWatchedToken, removeWatchedToken } from "@/lib/data/storage";

// Components
import { StatCard } from "@/components/StatCard";
import { ForensicGraph } from "@/components/ForensicGraph";
import { FingerprintRadar } from "@/components/FingerprintRadar";
import { LiquidityShockTimeline } from "@/components/LiquidityShockTimeline";
import { ClusterMap } from "@/components/ClusterMap";
import { DivergenceIndicator } from "@/components/DivergenceIndicator";
import { RiskRadarGrid } from "@/components/RiskRadarGrid";
import { WhatChangedCard } from "@/components/WhatChangedCard";
import { MoveExplainerCard } from "@/components/MoveExplainerCard";
import { MethodologyModal } from "@/components/MethodologyModal";
import { AIExplainerModal } from "@/components/AIExplainerModal";
import { ReportExportModal } from "@/components/ReportExportModal";

export default function TokenXRayPage() {
  const params = useParams();
  const router = useRouter();

  const chainSlug = (params?.chain as string) || "arbitrum-sepolia";
  const address = (params?.address as string) || "";

  const [data, setData] = useState<TokenXRayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isWatched, setIsWatched] = useState(false);

  // Modals
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [aiModalData, setAiModalData] = useState<{
    isOpen: boolean;
    title: string;
    topicType: "anomaly" | "cluster" | "divergence" | "summary" | "organicity";
  }>({
    isOpen: false,
    title: "",
    topicType: "summary",
  });

  useEffect(() => {
    if (!address) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    analyzeToken(chainSlug, address)
      .then((res) => {
        if (!isMounted) return;
        if (!res) {
          setError("Unable to resolve contract telemetry for this address.");
        } else {
          setData(res);
          setIsWatched(isTokenWatched(address, chainSlug));
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error(err);
        setError("Error fetching blockchain forensic telemetry.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [chainSlug, address]);

  const chainConfig = getChainBySlug(chainSlug);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleWatchlist = () => {
    if (!data) return;
    if (isWatched) {
      removeWatchedToken(address, chainSlug);
      setIsWatched(false);
    } else {
      saveWatchedToken({
        address,
        chain: chainSlug,
        name: data.token.name,
        symbol: data.token.symbol,
        addedAt: Math.floor(Date.now() / 1000),
        lastPriceUsd: data.market.priceUsd,
        lastIntelligenceScore: data.elpIntelligenceScore.score,
        riskRating: data.holderQuality.rating,
      });
      setIsWatched(true);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center max-w-lg mx-auto space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 animate-spin">
          <RefreshCw className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Running Token X-Ray Forensics
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Analyzing bytecode, liquidity pools, wallet clusters, and transfer entropy...
          </p>
        </div>
        <div className="space-y-2 text-xs font-mono text-slate-400 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-left">
          <div className="flex items-center gap-2 text-emerald-600">
            <Check className="w-3.5 h-3.5" /> <span>Contract bytecode verified</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-600">
            <Check className="w-3.5 h-3.5" /> <span>DEX pool depth & liquidity mapped</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-600">
            <Check className="w-3.5 h-3.5" /> <span>Top-100 ownership concentration evaluated</span>
          </div>
          <div className="flex items-center gap-2 text-amber-500 animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />{" "}
            <span>Mapping wallet relationship clusters & flow divergence...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Forensic Telemetry Unavailable
        </h2>
        <p className="text-xs text-slate-500">
          {error || "The requested contract address could not be analyzed on this network."}
        </p>
        <button
          onClick={() => router.push("/discover")}
          className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-semibold"
        >
          Back to Discover
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                TOKEN X-RAY
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {chainConfig.name}
              </span>
              <span className="text-xs text-slate-400">
                Phase: <strong className="text-slate-700 dark:text-slate-200">{data.tokenLifecycle.currentPhase}</strong>
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {data.token.name}
              </h1>
              <span className="text-lg sm:text-xl font-bold text-slate-400 font-mono">
                ${data.token.symbol}
              </span>
            </div>

            {/* Address & Explorer */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500">
              <span className="text-slate-400">Contract:</span>
              <span className="text-slate-800 dark:text-slate-200 font-medium">
                {formatAddress(data.token.address, 6)}
              </span>
              <button
                onClick={handleCopy}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
                title="Copy Address"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={`${chainConfig.explorerUrl}/token/${data.token.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 inline-flex items-center gap-1"
                title="View on Explorer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Action Buttons & Composite Score */}
          <div className="flex flex-wrap items-center gap-3">
            {/* EELP Intelligence Score Badge */}
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center px-5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                EELP Intelligence Score
              </div>
              <div className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-300">
                {data.elpIntelligenceScore.score}
                <span className="text-sm font-normal text-slate-400">/100</span>
              </div>
            </div>

            <button
              onClick={handleToggleWatchlist}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                isWatched
                  ? "bg-amber-50 dark:bg-amber-950/60 border-amber-300 text-amber-700 dark:text-amber-400"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isWatched ? "fill-amber-500 text-amber-500" : ""}`} />
              <span>{isWatched ? "Watching" : "Watchlist"}</span>
            </button>

            <button
              onClick={() => setExportOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs shadow-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 1: Market Structure Supporting Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <StatCard
          label="Price (USD)"
          value={formatCurrency(data.market.priceUsd)}
          delta={data.market.priceChange24h}
        />
        <StatCard
          label="Pool Liquidity"
          value={formatCurrency(data.market.liquidityUsd)}
          subtext={`Ratio: ${data.market.liquidityMarketCapRatio.toFixed(2)}x MCap`}
        />
        <StatCard
          label="24H DEX Volume"
          value={formatCurrency(data.market.volume24hUsd)}
          subtext={`Vol/Liq: ${data.market.volumeLiquidityRatio.toFixed(2)}x`}
        />
        <StatCard
          label="Market Cap / FDV"
          value={formatCurrency(data.market.marketCapUsd)}
          subtext={`FDV: ${formatCurrency(data.market.fdvUsd)}`}
        />
        <StatCard
          label="24H Transactions"
          value={formatNumber(data.market.txns24h.total)}
          subtext={`${data.market.txns24h.buys} Buys • ${data.market.txns24h.sells} Sells`}
        />
        <StatCard
          label="Estimated Holders"
          value={formatNumber(data.ownership.totalHoldersEstimate)}
          subtext="On-chain distribution"
        />
      </div>

      {/* Section 2: Flagship Features - What Changed & Move Explainer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WhatChangedCard items={data.whatChanged} />
        <MoveExplainerCard
          movePercent={data.market.priceChange24h}
          factors={data.moveExplainer.contributingFactors}
          evidenceSummary={data.moveExplainer.evidenceSummary}
        />
      </div>

      {/* Section 3: Flow Divergence & Behavioral Fingerprint */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DivergenceIndicator divergence={data.flowDivergence} />
        <FingerprintRadar fingerprint={data.fingerprint} />
      </div>

      {/* Section 4: Wallet & Ecosystem Relationship Graph */}
      <ForensicGraph
        nodes={data.relationshipGraph.nodes}
        edges={data.relationshipGraph.edges}
      />

      {/* Section 5: Wallet Clusters & High Conviction Wallets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClusterMap clusters={data.clusters} />

        {/* High Conviction Wallets Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-500" />
                <span>High-Conviction Wallets</span>
              </h3>
              <p className="text-xs text-slate-500">
                Addresses with measurable historical accumulation discipline and zero panic selling.
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              {data.highConvictionWallets.length} Entities
            </span>
          </div>

          <div className="space-y-3">
            {data.highConvictionWallets.map((wallet, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatAddress(wallet.address, 4)}
                  </span>
                  <span className="font-semibold text-emerald-600">
                    {wallet.holdingPercentage}% of supply
                  </span>
                </div>
                <div className="text-slate-500 mb-2">
                  Label: <strong>{wallet.label}</strong> • Signal: {wallet.historicalSignalStrength}
                </div>
                <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                  {wallet.observedPatterns.map((pat, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-1">
                      <span>•</span>
                      <span>{pat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 6: Liquidity Shock Detector & Ownership Concentration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiquidityShockTimeline liquidity={data.liquidity} />

        {/* Ownership Forensics */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-500" />
                <span>Ownership Structure & Concentration</span>
              </h3>
              <p className="text-xs text-slate-500">
                Gini dispersion and top bracket holding concentration.
              </p>
            </div>
            <button
              onClick={() => setMethodologyOpen(true)}
              className="text-xs text-emerald-600 hover:underline flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Methodology</span>
            </button>
          </div>

          <div className="space-y-3 mb-5">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Top 10 Concentration</span>
                <span className="font-mono text-slate-900 dark:text-white">
                  {data.ownership.top10Concentration.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${data.ownership.top10Concentration}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Top 20 Concentration</span>
                <span className="font-mono text-slate-900 dark:text-white">
                  {data.ownership.top20Concentration.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: `${data.ownership.top20Concentration}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Top 50 Concentration</span>
                <span className="font-mono text-slate-900 dark:text-white">
                  {data.ownership.top50Concentration.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full"
                  style={{ width: `${data.ownership.top50Concentration}%` }}
                />
              </div>
            </div>
          </div>

          {/* Top Holders table snippet */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Top Verified Entities
            </div>
            <div className="space-y-1.5 max-h-44 overflow-y-auto">
              {data.ownership.topHolders.map((h, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {formatAddress(h.address, 3)}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-2">({h.behaviorTag})</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {h.balancePercentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 7: Risk Radar & Contract Control */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RiskRadarGrid categories={data.riskRadar} />
        </div>

        {/* Contract Control & Deployer Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Contract Bytecode Forensics</span>
            </h3>
            <p className="text-xs text-slate-500">
              Deterministic static bytecode inspection.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Mint Capability:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {data.contractControl.mintCapability}
              </span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Upgradeability:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {data.contractControl.upgradeability}
              </span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Pause Mechanism:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {data.contractControl.pauseMechanism}
              </span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Transfer Blacklist:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {data.contractControl.blacklistMechanism}
              </span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Transfer Tax:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {data.contractControl.transferTax}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Deployer Entity
            </div>
            <div className="font-mono text-[11px] text-slate-500 truncate">
              {data.deployer.address}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Funding: {data.deployer.firstFundedBy} • Retains {data.deployer.tokenHoldingsPercent}%
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <MethodologyModal
        isOpen={methodologyOpen}
        onClose={() => setMethodologyOpen(false)}
      />

      <ReportExportModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        data={data}
      />

      <AIExplainerModal
        isOpen={aiModalData.isOpen}
        title={aiModalData.title}
        topicType={aiModalData.topicType}
        contextData={data}
        onClose={() =>
          setAiModalData({ isOpen: false, title: "", topicType: "summary" })
        }
      />
    </div>
  );
}
