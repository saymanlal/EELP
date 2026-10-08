"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useAccount, useSwitchChain } from "wagmi";
import { SUPPORTED_CHAINS } from "@/lib/chains";

interface NetworkWarningProps {
  requiredChainId?: number;
}

export const NetworkWarning: React.FC<NetworkWarningProps> = ({
  requiredChainId = 421614, // Default Arbitrum Sepolia
}) => {
  const { chain, isConnected } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected) return null;

  const targetChain = Object.values(SUPPORTED_CHAINS).find(
    (c) => c.id === requiredChainId
  ) || SUPPORTED_CHAINS["arbitrum-sepolia"];

  const isWrong = chain && chain.id !== requiredChainId;

  if (!isWrong) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 text-sm text-amber-800 dark:text-amber-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            You are connected to <strong>{chain?.name || "an unsupported network"}</strong>.
            Switch to <strong>{targetChain.name}</strong> to interact with $ELP utility contracts.
          </span>
        </div>
        <button
          onClick={() => switchChain?.({ chainId: targetChain.id as any })}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-xs font-semibold transition shrink-0 disabled:opacity-50"
        >
          {isPending && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
          Switch to {targetChain.name}
        </button>
      </div>
    </div>
  );
};
