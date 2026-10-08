import React from "react";
import { ArrowUpRight, ArrowDownRight, Info } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  delta?: number;
  tooltip?: string;
  badgeText?: string;
  badgeVariant?: "neutral" | "success" | "warning" | "danger" | "brand";
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  delta,
  tooltip,
  badgeText,
  badgeVariant = "neutral",
  className = "",
}) => {
  const badgeClasses = {
    neutral: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
    success: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    warning: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    danger: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800",
    brand: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-4 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700 ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>{label}</span>
          {tooltip && (
            <span title={tooltip} className="cursor-help text-slate-400 hover:text-slate-600">
              <Info className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
        {badgeText && (
          <span
            className={`px-2 py-0.5 text-[11px] font-medium rounded border ${badgeClasses[badgeVariant]}`}
          >
            {badgeText}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </div>
        {delta !== undefined && (
          <div
            className={`flex items-center text-xs font-semibold ${
              delta > 0
                ? "text-emerald-600 dark:text-emerald-400"
                : delta < 0
                ? "text-rose-600 dark:text-rose-400"
                : "text-slate-500"
            }`}
          >
            {delta > 0 ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            ) : delta < 0 ? (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            ) : null}
            {delta > 0 ? `+${delta.toFixed(1)}%` : `${delta.toFixed(1)}%`}
          </div>
        )}
      </div>

      {subtext && (
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">
          {subtext}
        </div>
      )}
    </div>
  );
};
