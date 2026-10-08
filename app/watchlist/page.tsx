"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bookmark, Plus, Trash2, ArrowRight, User, Activity, ExternalLink } from "lucide-react";
import {
  WatchedToken,
  WatchedWallet,
  getWatchedTokens,
  getWatchedWallets,
  removeWatchedToken,
  removeWatchedWallet,
  saveWatchedWallet,
} from "@/lib/data/storage";
import { formatAddress, formatCurrency, formatTimestamp } from "@/lib/format";
import { SUPPORTED_CHAINS } from "@/lib/chains";

export default function WatchlistPage() {
  const [tokens, setTokens] = useState<WatchedToken[]>([]);
  const [wallets, setWallets] = useState<WatchedWallet[]>([]);
  const [activeTab, setActiveTab] = useState<"tokens" | "wallets">("tokens");

  // New Wallet form
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [newWalletChain, setNewWalletChain] = useState("arbitrum-sepolia");
  const [newWalletLabel, setNewWalletLabel] = useState("");
  const [newWalletPattern, setNewWalletPattern] = useState<WatchedWallet["observedPattern"]>("Accumulation");

  useEffect(() => {
    setTokens(getWatchedTokens());
    setWallets(getWatchedWallets());
  }, []);

  const handleRemoveToken = (addr: string, chain: string) => {
    removeWatchedToken(addr, chain);
    setTokens(getWatchedTokens());
  };

  const handleRemoveWallet = (addr: string, chain: string) => {
    removeWatchedWallet(addr, chain);
    setWallets(getWatchedWallets());
  };

  const handleAddWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWalletAddress.trim()) return;
    saveWatchedWallet({
      address: newWalletAddress.trim(),
      chain: newWalletChain,
      label: newWalletLabel.trim() || "Observed Wallet",
      observedPattern: newWalletPattern,
      addedAt: Math.floor(Date.now() / 1000),
    });
    setWallets(getWatchedWallets());
    setNewWalletAddress("");
    setNewWalletLabel("");
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Local Vault Watchlist</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Forensic Watchlist
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Persisted securely in your local browser storage without requiring an external database or user account.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("tokens")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === "tokens"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Tracked Tokens ({tokens.length})
          </button>
          <button
            onClick={() => setActiveTab("wallets")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === "wallets"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Tracked Wallets ({wallets.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Tokens */}
      {activeTab === "tokens" && (
        <div className="space-y-4">
          {tokens.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 space-y-3">
              <Activity className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="font-bold text-base text-slate-700 dark:text-slate-300">
                No Tracked Tokens
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click &ldquo;Watchlist&rdquo; on any Token X-Ray page to pin tokens to your local dashboard.
              </p>
              <Link
                href="/discover"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-xl"
              >
                <span>Browse Tokens</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tokens.map((t) => (
                <div
                  key={`${t.chain}-${t.address}`}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-base text-slate-900 dark:text-white">
                        {t.name}
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        ${t.symbol} • {t.chain}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveToken(t.address, t.chain)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex justify-between text-xs py-2 border-y border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Last Score:</span>
                    <span className="font-bold font-mono text-emerald-600">
                      {t.lastIntelligenceScore || "--"}/100
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">
                      Added {formatTimestamp(t.addedAt)}
                    </span>
                    <Link
                      href={`/analyze/${t.chain}/${t.address}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      <span>Open X-Ray</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Wallets */}
      {activeTab === "wallets" && (
        <div className="space-y-6">
          {/* Add Wallet Form */}
          <form
            onSubmit={handleAddWallet}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row items-center gap-3 text-xs"
          >
            <input
              type="text"
              value={newWalletAddress}
              onChange={(e) => setNewWalletAddress(e.target.value)}
              placeholder="Wallet address (0x...)"
              className="flex-1 w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono outline-none"
            />
            <input
              type="text"
              value={newWalletLabel}
              onChange={(e) => setNewWalletLabel(e.target.value)}
              placeholder="Label (e.g. Whale Accumulator)"
              className="w-full sm:w-48 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none"
            />
            <select
              value={newWalletPattern}
              onChange={(e) => setNewWalletPattern(e.target.value as any)}
              className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold outline-none cursor-pointer"
            >
              <option value="Accumulation">Accumulation</option>
              <option value="Distribution">Distribution</option>
              <option value="DEX Trader">DEX Trader</option>
              <option value="Cluster Node">Cluster Node</option>
              <option value="Deployer">Deployer</option>
              <option value="Whale">Whale</option>
            </select>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition shrink-0 flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Track Wallet</span>
            </button>
          </form>

          {/* Wallets List */}
          {wallets.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 space-y-2">
              <User className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="font-bold text-base text-slate-700 dark:text-slate-300">
                No Tracked Wallets
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Add suspicious or high-conviction wallets to watch their transfer activities.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wallets.map((w) => (
                <div
                  key={`${w.chain}-${w.address}`}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">
                        {w.label}
                      </div>
                      <div className="font-mono text-slate-500 font-medium mt-0.5">
                        {formatAddress(w.address, 4)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveWallet(w.address, w.chain)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 flex justify-between">
                    <span className="text-slate-500">Observed Pattern:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {w.observedPattern}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span>Added {formatTimestamp(w.addedAt)}</span>
                    <a
                      href={`https://sepolia.arbiscan.io/address/${w.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-slate-600 dark:hover:text-slate-200 inline-flex items-center gap-1"
                    >
                      <span>Explorer</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
