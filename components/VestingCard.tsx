"use client";

import React, { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { Shield, Clock, CheckCircle2, Lock, ArrowRight, ExternalLink } from "lucide-react";
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from "@/lib/contracts";
import { formatNumber, formatTimestamp, formatAddress } from "@/lib/format";
import { formatUnits } from "viem";
import { TransactionStatus, TxState } from "./TransactionStatus";

export const VestingCard: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [txState, setTxState] = useState<TxState>("idle");
  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [txError, setTxError] = useState<string | undefined>(undefined);

  const { data: totalAllocRaw } = useReadContract({
    address: CONTRACT_ADDRESSES.vesting as `0x${string}`,
    abi: CONTRACT_ABIS.vesting,
    functionName: "totalAllocation",
    query: { enabled: !!CONTRACT_ADDRESSES.vesting },
  });

  const { data: vestedRaw } = useReadContract({
    address: CONTRACT_ADDRESSES.vesting as `0x${string}`,
    abi: CONTRACT_ABIS.vesting,
    functionName: "vestedAmount",
    query: { enabled: !!CONTRACT_ADDRESSES.vesting },
  });

  const { data: releasedRaw, refetch: refetchReleased } = useReadContract({
    address: CONTRACT_ADDRESSES.vesting as `0x${string}`,
    abi: CONTRACT_ABIS.vesting,
    functionName: "released",
    query: { enabled: !!CONTRACT_ADDRESSES.vesting },
  });

  const { data: releasableRaw, refetch: refetchReleasable } = useReadContract({
    address: CONTRACT_ADDRESSES.vesting as `0x${string}`,
    abi: CONTRACT_ABIS.vesting,
    functionName: "releasableAmount",
    query: { enabled: !!CONTRACT_ADDRESSES.vesting },
  });

  const { data: cliffTimestampRaw } = useReadContract({
    address: CONTRACT_ADDRESSES.vesting as `0x${string}`,
    abi: CONTRACT_ABIS.vesting,
    functionName: "cliffTimestamp",
    query: { enabled: !!CONTRACT_ADDRESSES.vesting },
  });

  const { data: endTimestampRaw } = useReadContract({
    address: CONTRACT_ADDRESSES.vesting as `0x${string}`,
    abi: CONTRACT_ABIS.vesting,
    functionName: "endTimestamp",
    query: { enabled: !!CONTRACT_ADDRESSES.vesting },
  });

  const { data: beneficiaryRaw } = useReadContract({
    address: CONTRACT_ADDRESSES.vesting as `0x${string}`,
    abi: CONTRACT_ABIS.vesting,
    functionName: "beneficiary",
    query: { enabled: !!CONTRACT_ADDRESSES.vesting },
  });

  const { writeContractAsync } = useWriteContract();

  const totalAllocation = totalAllocRaw ? Number(formatUnits(totalAllocRaw as bigint, 18)) : 100_000_000;
  const vestedAmount = vestedRaw ? Number(formatUnits(vestedRaw as bigint, 18)) : 0;
  const released = releasedRaw ? Number(formatUnits(releasedRaw as bigint, 18)) : 0;
  const releasable = releasableRaw ? Number(formatUnits(releasableRaw as bigint, 18)) : 0;
  const cliffTs = cliffTimestampRaw ? Number(cliffTimestampRaw) : 0;
  const endTs = endTimestampRaw ? Number(endTimestampRaw) : 0;
  const beneficiary = beneficiaryRaw ? (beneficiaryRaw as string) : "";

  const vestedPercent = totalAllocation > 0 ? (vestedAmount / totalAllocation) * 100 : 0;
  const isBeneficiary = isConnected && address && beneficiary && address.toLowerCase() === beneficiary.toLowerCase();

  const handleRelease = async () => {
    try {
      setTxState("waiting_wallet");
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESSES.vesting as `0x${string}`,
        abi: CONTRACT_ABIS.vesting,
        functionName: "release",
      });
      setTxHash(tx);
      setTxState("confirmed");
      refetchReleased();
      refetchReleasable();
    } catch (err: any) {
      setTxState("failed");
      setTxError(err.shortMessage || err.message || "Release transaction failed.");
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-500" />
              <span>Team Vesting Vault (Public & Verifiable)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Non-custodial smart contract enforcing a 3-Month Cliff followed by 12-Month Linear Vesting.
            </p>
          </div>
          <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            100M $EELP Vault
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-semibold mb-2">
            <span className="text-slate-700 dark:text-slate-300">Vesting Completion</span>
            <span className="font-mono text-emerald-600">{vestedPercent.toFixed(1)}% Vested</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(2, vestedPercent)}%` }}
            />
          </div>
        </div>

        {/* Schedule Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
            <div className="text-[11px] text-slate-400">Total Allocation</div>
            <div className="text-sm font-bold font-mono text-slate-900 dark:text-white">
              {formatNumber(totalAllocation)} $EELP
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
            <div className="text-[11px] text-slate-400">Vested So Far</div>
            <div className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {formatNumber(vestedAmount)} $EELP
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
            <div className="text-[11px] text-slate-400">Released / Claimed</div>
            <div className="text-sm font-bold font-mono text-slate-900 dark:text-white">
              {formatNumber(released)} $EELP
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
            <div className="text-[11px] text-slate-400">Releasable Now</div>
            <div className="text-sm font-bold font-mono text-amber-600 dark:text-amber-400">
              {formatNumber(releasable)} $EELP
            </div>
          </div>
        </div>

        {/* Details & Actions */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Cliff Expiration:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {cliffTs > 0 ? formatTimestamp(cliffTs) : "3 Months Post-Deploy"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Vesting End Date:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {endTs > 0 ? formatTimestamp(endTs) : "15 Months Post-Deploy"}
              </span>
            </div>
            {beneficiary && (
              <div className="flex items-center gap-2 font-mono">
                <span className="text-slate-500">Beneficiary:</span>
                <span className="text-slate-700 dark:text-slate-300">{formatAddress(beneficiary, 6)}</span>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={handleRelease}
              disabled={releasable <= 0 || !CONTRACT_ADDRESSES.vesting}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm transition disabled:opacity-40"
            >
              Release Vested Tokens
            </button>
          </div>
        </div>
      </div>

      <TransactionStatus
        state={txState}
        txHash={txHash}
        errorMessage={txError}
        onClose={() => {
          setTxState("idle");
          setTxHash(undefined);
          setTxError(undefined);
        }}
      />
    </>
  );
};
