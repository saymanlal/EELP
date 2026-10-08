"use client";

import React from "react";
import { Shield } from "lucide-react";
import { VestingCard } from "@/components/VestingCard";

export default function VestingPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-2">
          <Shield className="w-3.5 h-3.5" />
          <span>Vesting Vault</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Team Vesting Schedule & Claimer
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Verifiable non-custodial smart contract lock with 3-month cliff and 12-month linear vesting.
        </p>
      </div>

      <VestingCard />
    </div>
  );
}
