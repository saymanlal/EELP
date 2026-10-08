"use client";

import React from "react";
import Link from "next/link";
import { FileText, BookOpen, Shield, Code, ArrowRight } from "lucide-react";
import { Disclaimer } from "@/components/Disclaimer";

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
          <FileText className="w-3.5 h-3.5" />
          <span>Documentation Hub</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          EELP Terminal Litepaper & Documentation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Technical specifications, litepaper, deployment procedures, and API adapter architectures.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            EELP Litepaper
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Read the one-page overview of the EELP ecosystem, tokenomics, access tiers, and on-chain forensic mission.
          </p>
          <Link
            href="/methodology"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline pt-2"
          >
            <span>Read Methodology & Litepaper</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Code className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Smart Contracts & Foundry
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Explore OpenZeppelin 5.0 ERC20Votes contracts, StakingTiers, VestingVault, and Foundry unit test suites.
          </p>
          <Link
            href="/contracts"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline pt-2"
          >
            <span>View Verified Contracts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Section 1: Executive Summary */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Executive Summary
        </h2>
        <p>
          Most crypto market tooling focuses exclusively on superficial price charts, volume indicators, and marketing numbers. EELP Terminal provides a forensic intelligence layer that translates raw blockchain bytecode, DEX liquidity pool states, and wallet relationship topologies into understandable market intelligence.
        </p>
        <p>
          The native utility token $EELP powers access gating and decentralized community signal voting, operating on a fixed supply of 1,000,000,000 tokens with zero inflation, zero taxes, and trustless public vesting schedules.
        </p>
      </div>

      <Disclaimer />
    </div>
  );
}
