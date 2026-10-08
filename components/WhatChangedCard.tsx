import React from "react";
import { WhatChangedItem } from "@/lib/data/types";
import { History, ArrowRight, Info, AlertTriangle, CheckCircle2 } from "lucide-react";

interface WhatChangedCardProps {
  items: WhatChangedItem[];
}

export const WhatChangedCard: React.FC<WhatChangedCardProps> = ({ items }) => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-500" />
            <span>What Changed Since Yesterday?</span>
          </h3>
          <p className="text-xs text-slate-500">
            Telemetry delta comparing today&apos;s on-chain distribution, liquidity, and cluster activity to the previous baseline.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          {items.length} Significant Changes Detected
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 text-xs"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {item.category}
                </span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {item.title}
                </span>
              </div>
              {item.severity === "positive" && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              )}
              {item.severity === "warning" && (
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              )}
              {item.severity === "info" && (
                <Info className="w-4 h-4 text-blue-500 shrink-0" />
              )}
            </div>

            <p className="text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">
              {item.description}
            </p>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-600 dark:text-slate-400">
                Supporting Evidence:
              </span>
              <span>{item.evidence}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
