import React from "react";
import { RiskRadarCategory } from "@/lib/data/types";
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2 } from "lucide-react";

interface RiskRadarGridProps {
  categories: RiskRadarCategory[];
}

export const RiskRadarGrid: React.FC<RiskRadarGridProps> = ({ categories }) => {
  const getBadgeStyle = (level: RiskRadarCategory["level"]) => {
    switch (level) {
      case "LOW":
        return "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "MODERATE":
        return "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "HIGH":
        return "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>EELP Risk Radar Matrix</span>
          </h3>
          <p className="text-xs text-slate-500">
            Deterministic risk signal breakdown across 7 on-chain vulnerability vectors.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
          7 Categories Evaluated
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  {cat.name}
                </span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md border uppercase ${getBadgeStyle(
                    cat.level
                  )}`}
                >
                  {cat.level}
                </span>
              </div>

              <ul className="space-y-1.5 my-3 text-xs text-slate-600 dark:text-slate-400">
                {cat.evidence.map((ev, eIdx) => (
                  <li key={eIdx} className="flex items-start gap-1.5">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Risk Vector Score:</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                {cat.score}/100
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
