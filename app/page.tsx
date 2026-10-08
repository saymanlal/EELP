"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  Layers,
  Activity,
  GitCompare,
  Fingerprint,
  History,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Compass,
} from "lucide-react";
import { SUPPORTED_CHAINS } from "@/lib/chains";

export default function HomePage() {
  const router = useRouter();
  const [tokenInput, setTokenInput] = useState("");
  const [selectedChain, setSelectedChain] = useState("arbitrum-sepolia");

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    const cleanAddr = tokenInput.trim();
    router.push(`/analyze/${selectedChain}/${cleanAddr}`);
  };

  const sampleTokens = [
    {
      symbol: "EELP",
      name: "EELP Terminal",
      chain: "arbitrum-sepolia",
      address: process.env.NEXT_PUBLIC_EELP_TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000",
      desc: "Native Utility Token",
      tag: "Testnet Ready",
    },
    {
      symbol: "WETH",
      name: "Wrapped Ether",
      chain: "ethereum",
      address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      desc: "Canonical Wrapped ETH",
      tag: "DeFi Core",
    },
    {
      symbol: "ARB",
      name: "Arbitrum",
      chain: "arbitrum",
      address: "0x912ce59144191c1204e64559fe8253a0e49e6548",
      desc: "L2 Governance Token",
      tag: "Ecosystem",
    },
    {
      symbol: "PEPE",
      name: "Pepe",
      chain: "ethereum",
      address: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
      desc: "High-Volume Meme Asset",
      tag: "Whale Forensics",
    },
  ];

  return (
    <div className="space-y-20 py-4 sm:py-8">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>EELP On-Chain Forensic Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
          See what the market is doing{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
            beneath the chart.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Turn raw blockchain activity into structured market intelligence. Investigate wallet clusters, capital flows, liquidity health, and ownership concentration in seconds.
        </p>

        {/* Primary Token Input Form */}
        <form
          onSubmit={handleAnalyze}
          className="max-w-2xl mx-auto p-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="flex-1 flex items-center gap-2 px-3 w-full">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Paste token contract address (0x...)"
              className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm font-mono outline-none py-2"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border-none outline-none cursor-pointer"
            >
              {Object.values(SUPPORTED_CHAINS).map((chain) => (
                <option key={chain.slug} value={chain.slug}>
                  {chain.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-emerald-500 hover:bg-slate-800 dark:hover:bg-emerald-600 text-white dark:text-slate-950 font-bold text-sm shadow-sm transition flex items-center justify-center gap-2"
            >
              <span>Analyze Token</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick Launchers */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
          <span className="font-medium text-slate-400">Quick X-Ray:</span>
          {sampleTokens.map((st) => (
            <button
              key={st.symbol}
              onClick={() => router.push(`/analyze/${st.chain}/${st.address}`)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/40 text-slate-700 dark:text-slate-300 font-semibold transition"
            >
              {st.symbol}
            </button>
          ))}
        </div>
      </section>

      {/* Flagship Differentiator: Crypto X-Ray Architecture */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-8 sm:p-12 shadow-sm text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            The EELP Core Differentiator
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Don&apos;t just watch the chart. Investigate what is moving it.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Most platforms show prices and volume. EELP connects the dots between raw block traces, wallet relationships, and pool dynamics.
          </p>
        </div>

        {/* Visual Architecture Diagram */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
              <div className="text-emerald-500 font-bold mb-1">01. WALLETS</div>
              <div className="text-[11px] text-slate-500">Clusters • Quality • Fingerprints</div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
              <div className="text-blue-500 font-bold mb-1">02. LIQUIDITY</div>
              <div className="text-[11px] text-slate-500">Pool Shocks • Lock Status • Depth</div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
              <div className="text-purple-500 font-bold mb-1">03. FLOWS</div>
              <div className="text-[11px] text-slate-500">Divergence • CEX vs DEX • Whales</div>
            </div>
          </div>

          <div className="py-2 text-slate-400">↓</div>

          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold max-w-md mx-auto">
            EELP FORENSIC INTELLIGENCE ENGINE
          </div>

          <div className="py-2 text-slate-400">↓</div>

          <div className="text-slate-700 dark:text-slate-300 font-semibold text-xs">
            Actionable Market Structure & Deterministic Evidence Report
          </div>
        </div>
      </section>

      {/* 5 Core Feature Cards */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Forensic Intelligence Pillars
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Engineered around verifiable on-chain evidence with zero fabricated numbers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Token X-Ray
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Complete diagnostic assessment of token contracts, mint/pause privileges, ownership concentration, and holder quality score.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              What Changed? Engine
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Daily on-chain diffs tracking top holder accumulation shifts, liquidity pool adjustments, and new cluster entries since yesterday.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Wallet Clustering & Graphs
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Interactive node-link relationship mapping identifying behaviorally linked wallets sharing identical gas funders and entry timing.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <GitCompare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Flow Divergence Radar
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Flags structural imbalances when price expands while liquidity depth contracts or whale net flows turn negative.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Fingerprint className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Behavioral Fingerprinting
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Evaluates observed trading intensity, dormancy ratios, and cross-wallet paths to produce an analytical entropy profile.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              7-Vector Risk Radar
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Audits ownership concentration, liquidity vulnerability, bytecode privileges, organicity, and anomaly severity without subjective bias.
            </p>
          </div>
        </div>
      </section>

      {/* Zero Cost & Multi-Chain Architecture Callout */}
      <section className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Multi-Chain & Zero-Cost Architecture
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Ready for Arbitrum Sepolia & Mainnet Deployments
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Engineered to run seamlessly on Vercel&apos;s free tier with zero paid backend or database requirements. Configurable public RPCs and data adapters for Ethereum, Arbitrum, Base, BNB Chain, Polygon, and Optimism.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/discover"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-sm"
          >
            Explore Discoveries
          </Link>
          <Link
            href="/docs"
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs transition"
          >
            Read Documentation
          </Link>
        </div>
      </section>
    </div>
  );
}
