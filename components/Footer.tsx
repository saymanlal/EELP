import React from "react";
import Link from "next/link";
import { Shield, ExternalLink, Activity } from "lucide-react";
import { Disclaimer } from "./Disclaimer";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/80 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-emerald-500 flex items-center justify-center text-white dark:text-slate-950 font-bold text-sm">
                EELP
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-white">
                EELP
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Crypto Market Intelligence, Built From On-Chain Reality. Turn raw blockchain activity into understandable forensic intelligence.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Multi-Chain Forensic Node Active</span>
            </div>
          </div>

          {/* Col 2: Platform */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Forensic Intelligence
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/discover" className="hover:text-slate-900 dark:hover:text-white transition">
                  Emerging Discoveries
                </Link>
              </li>
              <li>
                <Link href="/analyze" className="hover:text-slate-900 dark:hover:text-white transition">
                  Token X-Ray Analyzer
                </Link>
              </li>
              <li>
                <Link href="/markets" className="hover:text-slate-900 dark:hover:text-white transition">
                  Global Crypto Overview
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-slate-900 dark:hover:text-white transition">
                  Forensic Token Comparison
                </Link>
              </li>
              <li>
                <Link href="/watchlist" className="hover:text-slate-900 dark:hover:text-white transition">
                  Local Watchlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: $EELP Utility */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              $EELP Ecosystem
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/dashboard" className="hover:text-slate-900 dark:hover:text-white transition">
                  Holder Dashboard
                </Link>
              </li>
              <li>
                <Link href="/staking" className="hover:text-slate-900 dark:hover:text-white transition">
                  Tier Staking
                </Link>
              </li>
              <li>
                <Link href="/tokenomics" className="hover:text-slate-900 dark:hover:text-white transition">
                  Tokenomics & Vesting
                </Link>
              </li>
              <li>
                <Link href="/contracts" className="hover:text-slate-900 dark:hover:text-white transition">
                  Verified Contracts
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="hover:text-slate-900 dark:hover:text-white transition">
                  Forensic Methodology
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Documentation & Legal */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Resources & Security
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/docs" className="hover:text-slate-900 dark:hover:text-white transition">
                  Documentation & Architecture
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-slate-900 dark:hover:text-white transition">
                  Security Checklist & Slither
                </Link>
              </li>
              <li>
                <a
                  href="https://sepolia.arbiscan.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-900 dark:hover:text-white transition inline-flex items-center gap-1"
                >
                  <span>Arbitrum Sepolia Explorer</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://faucets.chain.link/arbitrum-sepolia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-900 dark:hover:text-white transition inline-flex items-center gap-1"
                >
                  <span>Arbitrum Testnet Faucet</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Reusable Legal & Forensic Disclaimer */}
        <Disclaimer className="mb-8" />

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} EELP Platform. Powered by on-chain telemetry.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/docs" className="hover:underline">
              Litepaper
            </Link>
            <span>•</span>
            <Link href="/methodology" className="hover:underline">
              Methodology
            </Link>
            <span>•</span>
            <Link href="/security" className="hover:underline">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
