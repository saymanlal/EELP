import React from "react";
import { HelpCircle, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react";
import { formatPercent } from "@/lib/format";

interface MoveExplainerCardProps {
  movePercent: number;
  factors: string[];
  evidenceSummary: string;
}

export const MoveExplainerCard: React.FC<MoveExplainerCardProps> = ({
  movePercent,
  factors,
  evidenceSummary,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-500" />
            <span>Why Did This Move Happen?</span>
          </h3>
          <p className="text-xs text-slate-500">
            Evidence-based breakdown of on-chain capital flows and balance sheet adjustments during the recent move.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold">
          <span>Detected 24H:</span>
          <span className={movePercent >= 0 ? "text-emerald-600" : "text-rose-600"}>
            {formatPercent(movePercent)}
          </span>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
        <strong>Forensic Summary: </strong>
        {evidenceSummary}
      </div>

      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Likely Contributing Factors
        </div>
        <div className="space-y-2">
          {factors.map((factor, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <span className="leading-snug">{factor}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
