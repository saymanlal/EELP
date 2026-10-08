import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string, chars = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2 + 2) return address;
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

export function formatNumber(value: number | string | bigint | undefined | null, decimals = 2): string {
  if (value === undefined || value === null) return "0";
  const num = typeof value === "bigint" ? Number(value) : Number(value);
  if (isNaN(num)) return "0";

  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(decimals) + "B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(decimals) + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(decimals) + "K";
  }
  return num.toLocaleString("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals > 2 ? 0 : 0,
  });
}

export function formatCurrency(value: number | string | undefined | null, decimals = 2): string {
  if (value === undefined || value === null) return "$0.00";
  const num = Number(value);
  if (isNaN(num)) return "$0.00";

  if (num === 0) return "$0.00";
  if (num < 0.000001) return `<$0.000001`;
  if (num < 0.01) return `$${num.toFixed(6)}`;
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(decimals)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(decimals)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(decimals)}K`;

  return `$${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatPercent(value: number | undefined | null, showSign = true): string {
  if (value === undefined || value === null || isNaN(value)) return "0.0%";
  const sign = showSign && value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function formatTimestamp(timestamp: number | bigint): string {
  const ts = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
  const date = new Date(ts * 1000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTimeAgo(timestamp: number | bigint): string {
  const ts = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
  const now = Math.floor(Date.now() / 1000);
  const diff = Math.max(0, now - ts);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return `${Math.floor(diff / 2592000)}mo ago`;
}
