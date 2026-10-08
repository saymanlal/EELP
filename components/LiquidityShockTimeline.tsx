import React from "react";
import { LiquidityHealth, LiquidityShockEvent } from "@/lib/data/types";
import { Waves, AlertCircle, ArrowUpRight, ArrowDownRight, Lock, CheckCircle2 } from "lucide-react";
import { formatCurrency, formatTimeAgo, formatPercent } from "@/lib/format";

interface LiquidityShockTimelineProps {
  liquidity: LiquidityHealth;
}

export const LiquidityShockTimeline: React.FC<LiquidityShockTimelineProps> = ({ liquidity }) => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Waves className="w-4 h-4 text-blue-500" />
            <span>Liquidity Health & Shock Detector</span>
          </h3>
          <p className="text-xs text-slate-500">
            Real-time tracking of sudden pool additions, removals, and price impact anomalies.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            Rating: {liquidity.liquidityHealthRating}
          </span>
          {liquidity.isLpLocked && (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>{liquidity.lockedEstimatedPercent}% Locked</span>
            </span>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
          <div className="text-[11px] text-slate-400">Total Pool Depth</div>
          <div className="text-base font-bold text-slate-900 dark:text-white">
            {formatCurrency(liquidity.liquidityUsd)}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
          <div className="text-[11px] text-slate-400">Top-3 LP Concentration</div>
          <div className="text-base font-bold text-slate-900 dark:text-white">
            {liquidity.lpConcentrationTop3Percent}%
          </div>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
          <div className="text-[11px] text-slate-400">Pool Longevity</div>
          <div className="text-base font-bold text-slate-900 dark:text-white">
            {liquidity.poolAgeDays} Days
          </div>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
          <div className="text-[11px] text-slate-400">Lock Contract Status</div>
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 truncate">
            Verified
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Shock & Volatility Event Timeline
        </div>
        {liquidity.shocks && liquidity.shocks.length > 0 ? (
          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {liquidity.shocks.map((shock) => (
              <div key={shock.id} className="relative">
                <div
                  className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center ${
                    shock.type === "addition"
                      ? "bg-emerald-500"
                      : shock.type === "removal"
                      ? "bg-rose-500"
                      : "bg-blue-500"
                  }`}
                />
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="capitalize">{shock.type.replace("_", " ")}</span>
                      <span className="text-[11px] font-normal text-slate-400">
                        ({formatTimeAgo(shock.timestamp)})
                      </span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                      {shock.description}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-slate-900 dark:text-white">
                      {formatCurrency(shock.magnitudeUsd)}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Slippage: {shock.priceImpactPercent}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-400 text-center py-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl">
            No severe liquidity shock events detected in the current lookback period.
          </div>
        )}
      </div>
    </div>
  );
};
