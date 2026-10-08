"use client";

import React from "react";
import { Coins } from "lucide-react";
import { StakingPanel } from "@/components/StakingPanel";

export default function StakingPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
          <Coins className="w-3.5 h-3.5" />
          <span>Access Staking</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          $ELP Tier Staking & Cooldown Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Stake $ELP tokens to qualify for Pro and Elite tier forensic capabilities. Staking does not mint inflationary tokens. Unstaking enforces a transparent 7-day cooldown.
        </p>
      </div>

      <StakingPanel />
    </div>
  );
}
