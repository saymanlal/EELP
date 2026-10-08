"use client";

import React from "react";
import { Vote } from "lucide-react";
import { GovernancePanel } from "@/components/GovernancePanel";

export default function GovernancePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
          <Vote className="w-3.5 h-3.5" />
          <span>Decentralized Signaling</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Ecosystem Signal Governance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Use your $EELP ERC20Votes voting power to signal priority for cross-chain forensic adapters, anomaly thresholds, and feature milestones.
        </p>
      </div>

      <GovernancePanel />
    </div>
  );
}
