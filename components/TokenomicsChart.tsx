"use client";

import React, { useState } from "react";
import { PieChart, ShieldCheck } from "lucide-react";
import { formatNumber } from "@/lib/format";

interface Segment {
  name: string;
  percentage: number;
  tokens: number;
  color: string;
  description: string;
  vesting: string;
}

const ALLOCATIONS: Segment[] = [
  {
    name: "Community / Liquidity",
    percentage: 50,
    tokens: 500_000_000,
    color: "#10B981", // Emerald
    description: "Initial DEX liquidity pools, Siren Launchpad distribution, and public circulation.",
    vesting: "100% unlocked at Genesis / LP lock",
  },
  {
    name: "Ecosystem & Rewards",
    percentage: 20,
    tokens: 200_000_000,
    color: "#3B82F6", // Blue
    description: "Forensic node operators, ecosystem grants, and pre-funded access staking reserve.",
    vesting: "Non-inflationary milestone releases",
  },
  {
    name: "Treasury",
    percentage: 15,
    tokens: 150_000_000,
    color: "#8B5CF6", // Purple
    description: "Multi-sig DAO treasury for long-term development, audits, and infrastructure operations.",
    vesting: "Multi-signature timelock execution",
  },
  {
    name: "Team & Contributors",
    percentage: 10,
    tokens: 100_000_000,
    color: "#F59E0B", // Amber
    description: "Core architects, smart contract engineers, and on-chain security researchers.",
    vesting: "3-Month Cliff + 12-Month Linear Vesting via VestingVault",
  },
  {
    name: "Airdrop / Early Users",
    percentage: 5,
    tokens: 50_000_000,
    color: "#EC4899", // Pink
    description: "Early testnet participants, beta forensic researchers, and community signal voters.",
    vesting: "Direct distribution upon verification",
  },
];

export const TokenomicsChart: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<Segment>(ALLOCATIONS[0]);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-500" />
            <span>$EELP Token Distribution & Allocation</span>
          </h3>
          <p className="text-xs text-slate-500">
            Total Fixed Supply: 1,000,000,000 $EELP (No minting, no taxes, no hidden admin).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Fixed Supply</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Visual Donut Chart */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
            {ALLOCATIONS.reduce(
              (acc, seg, idx) => {
                const strokeDasharray = `${seg.percentage} ${100 - seg.percentage}`;
                const strokeDashoffset = -acc.offset;
                acc.elements.push(
                  <circle
                    key={idx}
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth={activeSegment.name === seg.name ? "14" : "11"}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    pathLength="100"
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onMouseEnter={() => setActiveSegment(seg)}
                    onClick={() => setActiveSegment(seg)}
                  />
                );
                acc.offset += seg.percentage;
                return acc;
              },
              { elements: [] as React.ReactNode[], offset: 0 }
            ).elements}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {activeSegment.name}
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {activeSegment.percentage}%
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 font-mono">
              {formatNumber(activeSegment.tokens)} $EELP
            </span>
          </div>
        </div>

        {/* Legend & Selected Segment Detail */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-2">
            {ALLOCATIONS.map((seg) => {
              const isSelected = activeSegment.name === seg.name;
              return (
                <button
                  key={seg.name}
                  onClick={() => setActiveSegment(seg)}
                  onMouseEnter={() => setActiveSegment(seg)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition ${
                    isSelected
                      ? "bg-slate-50 dark:bg-slate-800/90 border-slate-300 dark:border-slate-700 shadow-sm"
                      : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: seg.color }}
                    />
                    <div>
                      <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                        {seg.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {formatNumber(seg.tokens)} $EELP
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                    {seg.percentage}%
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Detail Callout */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>{activeSegment.name} Details</span>
              <span className="text-emerald-600 font-mono font-semibold">
                {activeSegment.percentage}% ({formatNumber(activeSegment.tokens)} $EELP)
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              {activeSegment.description}
            </p>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-semibold">Vesting Schedule:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {activeSegment.vesting}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
