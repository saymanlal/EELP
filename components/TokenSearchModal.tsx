import React, { useState } from "react";
import { Search, X, Layers, ExternalLink, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { SUPPORTED_CHAINS } from "@/lib/chains";

interface TokenSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_TOKENS = [
  {
    symbol: "EELP",
    name: "EELP Terminal",
    chain: "arbitrum-sepolia",
    address: process.env.NEXT_PUBLIC_EELP_TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000",
    isTestnet: true,
  },
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    chain: "ethereum",
    address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  },
  {
    symbol: "ARB",
    name: "Arbitrum",
    chain: "arbitrum",
    address: "0x912ce59144191c1204e64559fe8253a0e49e6548",
  },
  {
    symbol: "PEPE",
    name: "Pepe Token",
    chain: "ethereum",
    address: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
  },
  {
    symbol: "BRETT",
    name: "Brett",
    chain: "base",
    address: "0x532f27101965dd16442e59d40670faf5ebb142e4",
  },
];

export const TokenSearchModal: React.FC<TokenSearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedChain, setSelectedChain] = useState<string>("all");

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const trimmed = query.trim();
    const chainSlug = selectedChain === "all" ? "arbitrum-sepolia" : selectedChain;

    if (trimmed.startsWith("0x") && trimmed.length === 42) {
      router.push(`/analyze/${chainSlug}/${trimmed}`);
      onClose();
    } else {
      // Find matching popular token or route
      const match = POPULAR_TOKENS.find(
        (t) => t.symbol.toLowerCase() === trimmed.toLowerCase() || t.name.toLowerCase().includes(trimmed.toLowerCase())
      );
      if (match) {
        router.push(`/analyze/${match.chain}/${match.address}`);
        onClose();
      } else {
        router.push(`/analyze/${chainSlug}/${trimmed}`);
        onClose();
      }
    }
  };

  const handleSelectToken = (chain: string, address: string) => {
    router.push(`/analyze/${chain}/${address}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
        {/* Search Header */}
        <form onSubmit={handleSearch} className="flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Paste token address (0x...) or symbol..."
            autoFocus
            className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm outline-none font-mono"
          />
          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value)}
            className="text-xs bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 font-medium outline-none cursor-pointer"
          >
            <option value="all">Any Chain</option>
            {Object.values(SUPPORTED_CHAINS).map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Quick Launch & Popular Tokens */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-950/40 max-h-96 overflow-y-auto">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1">
            Quick Forensic Launchers
          </div>

          <div className="space-y-1">
            {POPULAR_TOKENS.map((token) => (
              <button
                key={`${token.chain}-${token.symbol}`}
                onClick={() => handleSelectToken(token.chain, token.address)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/80 transition group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {token.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">
                        {token.symbol}
                      </span>
                      <span className="text-xs text-slate-500">{token.name}</span>
                      {token.isTestnet && (
                        <span className="px-1.5 py-0.2 text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-600 rounded">
                          Testnet
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 truncate max-w-xs">
                      {token.chain} • {token.address}
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  <span className="text-xs mr-1 opacity-0 group-hover:opacity-100 transition">
                    X-Ray
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400">
          Enter any EVM contract address to run on-chain forensic inspection.
        </div>
      </div>
    </div>
  );
};
