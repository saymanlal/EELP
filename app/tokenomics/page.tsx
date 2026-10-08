"use client";

import React from "react";
import { PieChart, ShieldCheck } from "lucide-react";
import { TokenomicsChart } from "@/components/TokenomicsChart";
import { VestingCard } from "@/components/VestingCard";

export default function TokenomicsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
          <PieChart className="w-3.5 h-3.5" />
          <span>Transparent Tokenomics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          $ELP Fixed Supply & Vesting
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Total fixed supply of 1,000,000,000 $ELP. No minting, no transaction taxes, no hidden admin keys.
        </p>
      </div>

      <TokenomicsChart />

      <VestingCard />
    </div>
  );
}
