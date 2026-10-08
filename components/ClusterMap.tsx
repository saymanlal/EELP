import React from "react";
import { WalletCluster } from "@/lib/data/types";
import { Network, Users, AlertCircle, ShieldAlert, CheckCircle2 } from "lucide-react";
import { formatAddress } from "@/lib/format";

interface ClusterMapProps {
  clusters: WalletCluster[];
}

export const ClusterMap: React.FC<ClusterMapProps> = ({ clusters }) => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Network className="w-4 h-4 text-purple-500" />
            <span>Behaviorally Linked Wallet Clusters</span>
          </h3>
          <p className="text-xs text-slate-500">
            Detected groupings with correlated timing, common gas originators, or shared transfer routes.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
          {clusters.length} Active Cluster(s)
        </span>
      </div>

      <div className="space-y-4">
        {clusters.map((cluster) => (
          <div
            key={cluster.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 p-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300">
                  {cluster.id}
                </span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {cluster.name}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{cluster.walletCount} Wallets</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Controls: {cluster.totalHeldPercentage.toFixed(1)}% of supply
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    cluster.confidence === "High"
                      ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600"
                  }`}
                >
                  Confidence: {cluster.confidence}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
              <strong>Shared Signal:</strong> {cluster.sharedSignal}
            </p>

            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Forensic Evidence Checklist
              </div>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                {cluster.evidence.map((ev, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Wallets snippet */}
            <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap gap-1.5">
              {cluster.wallets.map((w, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400"
                >
                  {formatAddress(w, 3)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
