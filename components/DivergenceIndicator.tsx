import React from "react";
import { FlowDivergenceData } from "@/lib/data/types";
import { GitCompare, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatPercent } from "@/lib/format";

interface DivergenceIndicatorProps {
  divergence: FlowDivergenceData;
}

export const DivergenceIndicator: React.FC<DivergenceIndicatorProps> = ({ divergence }) => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-emerald-500" />
            <span>Price / Flow Structural Divergence</span>
          </h3>
          <p className="text-xs text-slate-500">
            Compares price velocity against underlying balance sheet accumulation and liquidity changes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {divergence.divergenceDetected ? (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Divergence Detected ({divergence.severity})</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Flows Aligned</span>
            </span>
          )}
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-5">
        <p className="font-medium text-slate-900 dark:text-white mb-1">
          {divergence.summary}
        </p>
        <p className="text-slate-500 dark:text-slate-400">
          <strong>Forensic Implication:</strong> {divergence.implication}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {divergence.metrics.map((metric, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          >
            <div className="text-xs text-slate-500 mb-1">{metric.label}</div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                {formatPercent(metric.change24h)}
              </span>
              <div
                className={`p-1 rounded-md ${
                  metric.trend === "up"
                    ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
                    : metric.trend === "down"
                    ? "bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                }`}
              >
                {metric.trend === "up" && <TrendingUp className="w-3.5 h-3.5" />}
                {metric.trend === "down" && <TrendingDown className="w-3.5 h-3.5" />}
                {metric.trend === "flat" && <Minus className="w-3.5 h-3.5" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
