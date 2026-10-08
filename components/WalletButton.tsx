import React, { useState, useRef, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useReadContract } from "wagmi";
import {
  Wallet,
  ChevronDown,
  Copy,
  ExternalLink,
  LogOut,
  Check,
  Shield,
  Layers,
} from "lucide-react";
import { formatAddress, formatNumber } from "@/lib/format";
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from "@/lib/contracts";
import { getChainById } from "@/lib/chains";
import { formatUnits } from "viem";

export const WalletButton: React.FC = () => {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Read ELP Balance if token contract is configured
  const { data: elpBalanceRaw } = useReadContract({
    address: CONTRACT_ADDRESSES.elpToken as `0x${string}`,
    abi: CONTRACT_ABIS.elpToken,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address && !!CONTRACT_ADDRESSES.elpToken,
    },
  });

  // Read User Staking Tier
  const { data: userTierRaw } = useReadContract({
    address: CONTRACT_ADDRESSES.staking as `0x${string}`,
    abi: CONTRACT_ABIS.staking,
    functionName: "getTier",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address && !!CONTRACT_ADDRESSES.staking,
    },
  });

  const elpBalance =
    elpBalanceRaw !== undefined
      ? formatNumber(formatUnits(elpBalanceRaw as bigint, 18), 1)
      : null;

  const userTier =
    userTierRaw === 2 ? "ELITE" : userTierRaw === 1 ? "PRO" : "FREE";

  const chainConfig = chain ? getChainById(chain.id) : undefined;
  const explorerUrl = chainConfig?.explorerUrl || "https://sepolia.arbiscan.io";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => {
            const connector = connectors[0];
            if (connector) connect({ connector });
          }}
          disabled={isPending}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-sm disabled:opacity-50"
        >
          <Wallet className="w-4 h-4" />
          <span>{isPending ? "Connecting..." : "Connect Wallet"}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition shadow-sm text-sm"
      >
        {elpBalance !== null && (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
            {elpBalance} $ELP
          </span>
        )}
        <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{formatAddress(address || "")}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2 border-b border-slate-100 dark:border-slate-800 mb-2">
            <div className="text-xs text-slate-400">Connected Wallet</div>
            <div className="font-mono text-xs font-medium text-slate-900 dark:text-white truncate">
              {address}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500">Access Tier:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {userTier}
              </span>
            </div>
          </div>

          <div className="space-y-1 text-sm">
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-medium"
            >
              <div className="flex items-center gap-2">
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>{copied ? "Copied to clipboard!" : "Copy address"}</span>
              </div>
              {copied && <Check className="w-3.5 h-3.5 text-emerald-500" />}
            </button>

            <a
              href={`${explorerUrl}/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>View on Explorer</span>
            </a>

            <button
              onClick={() => {
                disconnect();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition text-xs font-medium pt-2 border-t border-slate-100 dark:border-slate-800 mt-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
