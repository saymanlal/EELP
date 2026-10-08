import React from "react";
import { Shield, Zap, Crown } from "lucide-react";

interface TierBadgeProps {
  tier: "FREE" | "PRO" | "ELITE" | string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const TierBadge: React.FC<TierBadgeProps> = ({ tier, size = "md", className = "" }) => {
  const normalized = tier.toUpperCase();

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs font-semibold gap-1.5",
    lg: "px-3.5 py-1.5 text-sm font-semibold gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  if (normalized === "ELITE") {
    return (
      <span
        className={`inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 ${sizeClasses[size]} ${className}`}
      >
        <Crown className={iconSizes[size]} />
        ELITE TIER
      </span>
    );
  }

  if (normalized === "PRO") {
    return (
      <span
        className={`inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ${sizeClasses[size]} ${className}`}
      >
        <Zap className={iconSizes[size]} />
        PRO TIER
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 ${sizeClasses[size]} ${className}`}
    >
      <Shield className={iconSizes[size]} />
      FREE TIER
    </span>
  );
};
