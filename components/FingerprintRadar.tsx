import React from "react";
import { BehavioralFingerprint } from "@/lib/data/types";
import { Fingerprint, Info } from "lucide-react";

interface FingerprintRadarProps {
  fingerprint: BehavioralFingerprint;
}

export const FingerprintRadar: React.FC<FingerprintRadarProps> = ({ fingerprint }) => {
  const metrics = [
    { label: "Accumulation", value: fingerprint.accumulationScore, color: "bg-emerald-500", desc: "Long-term wallet retention velocity" },
    { label: "Distribution", value: fingerprint.distributionScore, color: "bg-rose-500", desc: "Net selling and parcel dispersal" },
    { label: "Trading Intensity", value: fingerprint.tradingIntensity, color: "bg-blue-500", desc: "DEX order frequency and turnover" },
    { label: "Dormancy Ratio", value: fingerprint.dormancyRatio, color: "bg-indigo-500", desc: "Share of supply sitting motionless" },
    { label: "Cross-Wallet Links", value: fingerprint.crossWalletInteractions, color: "bg-amber-500", desc: "Inter-holder transfers & funding" },
    { label: "Organicity Spread", value: fingerprint.organicSpread, color: "bg-teal-500", desc: "Decentralized entropy score" },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Fingerprint className="w-5 h-5 text-emerald-500" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Wallet Behavioral Fingerprint
          </h3>
        </div>
        <span className="text-xs text-slate-400">Observed 30D Entropy</span>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 mb-5 bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
        {fingerprint.summary}
      </p>

      <div className="space-y-3.5">
        {metrics.map((m) => (
          <div key={m.label}>
            <div className="flex items-center justify-between text-xs mb-1 font-medium">
              <span className="text-slate-700 dark:text-slate-300">{m.label}</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {m.value}/10
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${m.color}`}
                style={{ width: `${(m.value / 10) * 100}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">{m.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
