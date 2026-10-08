"use client";

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
  AlertCircle,
  X,
  Download,
  ArrowUpRight,
  Smartphone,
  Globe,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { formatAddress, formatNumber } from "@/lib/format";
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from "@/lib/contracts";
import { getChainById } from "@/lib/chains";
import { formatUnits } from "viem";

interface WalletOption {
  id: string;
  name: string;
  iconBg: string;
  downloadUrl: string;
  deepLink?: string;
  description: string;
  popular?: boolean;
}

const WALLET_LIST: WalletOption[] = [
  {
    id: "metaMask",
    name: "MetaMask",
    iconBg: "bg-orange-500",
    downloadUrl: "https://metamask.io/download/",
    deepLink: "https://metamask.app.link/dapp/",
    description: "Connect via browser extension or mobile app",
    popular: true,
  },
  {
    id: "coinbaseWallet",
    name: "Coinbase Wallet",
    iconBg: "bg-blue-600",
    downloadUrl: "https://www.coinbase.com/wallet/downloads",
    deepLink: "https://go.cb-w.com/dapp",
    description: "Self-custody crypto wallet & mobile app",
    popular: true,
  },
  {
    id: "rabby",
    name: "Rabby Wallet",
    iconBg: "bg-indigo-600",
    downloadUrl: "https://rabby.io/",
    description: "The game-changing Web3 wallet for EVM chains",
    popular: true,
  },
  {
    id: "trust",
    name: "Trust Wallet",
    iconBg: "bg-sky-500",
    downloadUrl: "https://trustwallet.com/browser-extension",
    deepLink: "https://link.trustwallet.com/open_url?coin_id=60&url=",
    description: "Multi-chain Web3 browser extension & app",
  },
  {
    id: "rainbow",
    name: "Rainbow",
    iconBg: "bg-emerald-600",
    downloadUrl: "https://rainbow.me/download",
    deepLink: "https://rnbwapp.com/",
    description: "Simple and secure Ethereum wallet",
  },
  {
    id: "zerion",
    name: "Zerion",
    iconBg: "bg-purple-600",
    downloadUrl: "https://zerion.io/download",
    description: "Smart Web3 wallet with portfolio tracking",
  },
];

export const WalletButton: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();

  const [isOpen, setIsOpen] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [missingWalletNotice, setMissingWalletNotice] = useState<WalletOption | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Read EELP Balance if token contract is configured
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

  const hasInjectedProvider = () => {
    if (typeof window === "undefined") return false;
    return !!(window as any).ethereum;
  };

  // Direct raw eth_requestAccounts fallback
  const directRequestAccounts = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      } catch (err: any) {
        console.warn("Direct eth_requestAccounts prompt error:", err);
      }
    }
  };

  const handleConnectClick = () => {
    setConnectionError(null);
    setMissingWalletNotice(null);
    setShowConnectModal(true);
  };

  const handleConnectWithConnector = async (connector: any) => {
    setConnectionError(null);
    try {
      // Trigger raw prompt first if extension is dormant
      await directRequestAccounts();
      await connect({ connector });
      setShowConnectModal(false);
    } catch (err: any) {
      console.error("Connect error:", err);
      setConnectionError(err?.message || "Connection was cancelled or rejected by user.");
    }
  };

  const handleSelectWallet = async (wallet: WalletOption) => {
    setConnectionError(null);
    setMissingWalletNotice(null);

    const hasEthereum = hasInjectedProvider();

    if (!hasEthereum) {
      // Check if on mobile device
      const isMobile = typeof navigator !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile && wallet.deepLink) {
        const currentUrl = encodeURIComponent(window.location.href);
        window.location.href = `${wallet.deepLink}${currentUrl.replace(/^https?:\/\//, '')}`;
        return;
      }

      // Show missing wallet prompt with install link
      setMissingWalletNotice(wallet);
      return;
    }

    // Try finding connector matching wallet ID or type
    const target =
      connectors.find((c) => c.id.toLowerCase().includes(wallet.id.toLowerCase())) ||
      connectors.find((c) => c.name.toLowerCase().includes(wallet.name.toLowerCase())) ||
      connectors.find((c) => c.type === "injected") ||
      connectors[0];

    if (target) {
      await handleConnectWithConnector(target);
    } else {
      // Direct raw window.ethereum trigger
      try {
        await directRequestAccounts();
        setShowConnectModal(false);
      } catch (err: any) {
        setConnectionError("Could not prompt wallet window. Please check your browser extension permissions.");
      }
    }
  };

  if (!mounted) {
    return (
      <div className="relative">
        <button
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm opacity-90 shadow-sm"
        >
          <Wallet className="w-4 h-4 text-emerald-500 dark:text-emerald-600" />
          <span>Connect Wallet</span>
        </button>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleConnectClick}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-sm disabled:opacity-50 active:scale-[0.98]"
          >
            {isPending ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 text-emerald-500 dark:text-emerald-600" />
                <span>Connect Wallet</span>
              </>
            )}
          </button>
        </div>

        {/* Modal: Universal Web3 Wallet Connection & Installer */}
        {showConnectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      Connect Web3 Wallet
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Select your wallet to interact with EELP platform
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowConnectModal(false);
                    setMissingWalletNotice(null);
                    setConnectionError(null);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Missing Wallet Notice Banner */}
              {missingWalletNotice && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs">
                    <p className="font-semibold text-amber-900 dark:text-amber-200">
                      {missingWalletNotice.name} not detected in your browser
                    </p>
                    <p className="text-amber-700 dark:text-amber-400/90 mt-0.5">
                      Please install the official browser extension or launch from the mobile wallet app.
                    </p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <a
                        href={missingWalletNotice.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-xs transition shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Install {missingWalletNotice.name}
                      </a>
                      <button
                        onClick={() => setMissingWalletNotice(null)}
                        className="px-2.5 py-1 text-amber-800 dark:text-amber-300 hover:underline text-xs"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Connection Error Banner */}
              {connectionError && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border-b border-rose-200 dark:border-rose-800/60 flex items-start gap-3 text-xs text-rose-800 dark:text-rose-300">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{connectionError}</p>
                  </div>
                  <button onClick={() => setConnectionError(null)} className="text-rose-500 hover:text-rose-700">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Wallet List */}
              <div className="p-4 space-y-2 max-h-[380px] overflow-y-auto">
                {/* 1. Direct Extension (If Injected) */}
                {hasInjectedProvider() && (
                  <button
                    onClick={() => {
                      const c = connectors.find((x) => x.type === "injected") || connectors[0];
                      if (c) handleConnectWithConnector(c);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-emerald-500/40 bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 transition text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                          Browser Extension Detected
                          <span className="text-[10px] bg-emerald-500 text-white font-bold px-1.5 py-0.2 rounded">
                            Ready
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Connect with your installed browser wallet
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition" />
                  </button>
                )}

                {/* 2. Detected Connectors list from wagmi */}
                {connectors
                  .filter((c) => c.type !== "injected" || !hasInjectedProvider())
                  .map((connector) => (
                    <button
                      key={connector.uid || connector.id}
                      onClick={() => handleConnectWithConnector(connector)}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 transition text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
                          <Wallet className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white text-sm">
                            {connector.name}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            Available Connector
                          </div>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition" />
                    </button>
                  ))}

                {/* 3. Popular Wallets with install & deep-links */}
                {WALLET_LIST.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => handleSelectWallet(wallet)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 transition text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${wallet.iconBg} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                          {wallet.name}
                          {wallet.popular && (
                            <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.2 rounded">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
                          {wallet.description}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition" />
                  </button>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Safe & Non-Custodial</span>
                <span>No private keys ever requested</span>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition shadow-sm text-sm active:scale-[0.98]"
      >
        {elpBalance !== null && (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
            {elpBalance} $EELP
          </span>
        )}
        <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
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
