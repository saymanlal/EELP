import React from "react";
import { ShieldAlert } from "lucide-react";

interface DisclaimerProps {
  className?: string;
  compact?: boolean;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ className = "", compact = false }) => {
  if (compact) {
    return (
      <div className={`p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs text-slate-600 dark:text-slate-400 ${className}`}>
        <div className="flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Analytical Disclaimer: </span>
            ELP provides blockchain data forensics for informational purposes only. Nothing here constitutes investment advice. Always verify on-chain contracts independently.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 text-xs text-slate-600 dark:text-slate-400 leading-relaxed ${className}`}>
      <div className="flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-slate-900 dark:text-slate-200 mb-1">
            ELP Regulatory & Forensic Notice
          </p>
          <p>
            ELP provides blockchain data analysis and analytical signals for informational purposes only. ELP does not provide financial, investment, legal, or tax advice. Analytical classifications and scores are estimates calculated deterministically from available on-chain data and may be incomplete. Nothing on ELP constitutes a recommendation to buy, sell, or hold any digital asset. $ELP is a utility token designed for accessing platform capabilities.
          </p>
        </div>
      </div>
    </div>
  );
};
