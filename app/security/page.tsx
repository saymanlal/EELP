"use client";

import React from "react";
import { ShieldCheck, Lock, AlertOctagon, CheckCircle2, ShieldAlert } from "lucide-react";
import { Disclaimer } from "@/components/Disclaimer";

export default function SecurityPage() {
  const securityGuarantees = [
    {
      title: "100% Fixed Supply (1 Billion $EELP)",
      description: "The entire supply of 1,000,000,000 $EELP is minted exactly once during contract deployment. No post-deployment mint function exists in the contract bytecode.",
    },
    {
      title: "No Privilege Controls / No Hidden Admin",
      description: "No contract owner or multi-sig can alter token balances, pause transfers, or restrict individual wallet transactions.",
    },
    {
      title: "Zero Transaction Taxes & Fees",
      description: "0% buy tax, 0% sell tax, 0% transfer deductions. Transfers execute with exact balance accounting.",
    },
    {
      title: "No Blacklists or Address Freezing",
      description: "The token contains no blacklist, whitelist, or arbitrary balance modification logic.",
    },
    {
      title: "Non-Inflationary Access Staking",
      description: "Staking is designed solely for utility tier gating. Staking does not mint new tokens.",
    },
    {
      title: "Trustless Public Team Vesting",
      description: "The team allocation is locked in an immutable VestingVault contract with 3-month cliff and 12-month linear release. No early or discretionary withdrawals can occur.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Security Architecture</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Security Guarantees & Audit Standards
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Smart contracts built with OpenZeppelin libraries, tested rigorously in Foundry, and validated with Slither.
        </p>
      </div>

      {/* Guarantees List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {securityGuarantees.map((g, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2"
          >
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{g.title}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-6">
              {g.description}
            </p>
          </div>
        ))}
      </div>

      {/* User Safety Guidelines */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 space-y-3">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-500" />
          <span>User Safety Guidelines</span>
        </h3>
        <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <li>• Never share your seed phrase or private keys with anyone. EELP will NEVER ask for private keys.</li>
          <li>• Always verify contract addresses against the official On-Chain Registry before approving transactions.</li>
          <li>• Ensure your connected network is Arbitrum Sepolia (421614) for testnet testing or Arbitrum One (42161) for production.</li>
          <li>• Always review transaction data and token allowances in your wallet before signing.</li>
        </ul>
      </div>

      <Disclaimer />
    </div>
  );
}
