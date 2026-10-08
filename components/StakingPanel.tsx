"use client";

import React, { useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { Coins, Lock, Unlock, ArrowRight, Clock, Check, AlertCircle, RefreshCw } from "lucide-react";
import { CONTRACT_ADDRESSES, CONTRACT_ABIS, STAKING_TIERS_CONFIG } from "@/lib/contracts";
import { formatNumber, formatCurrency, formatTimestamp, formatTimeAgo } from "@/lib/format";
import { formatUnits, parseUnits } from "viem";
import { TransactionStatus, TxState } from "./TransactionStatus";
import { TierBadge } from "./TierBadge";

export const StakingPanel: React.FC = () => {
  const { address, isConnected, chain } = useAccount();

  const [activeTab, setActiveTab] = useState<"stake" | "unstake" | "requests">("stake");
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");

  const [txState, setTxState] = useState<TxState>("idle");
  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [txErrorMessage, setTxErrorMessage] = useState<string | undefined>(undefined);

  // Read User ELP Balance
  const { data: elpBalanceRaw, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.elpToken as `0x${string}`,
    abi: CONTRACT_ABIS.elpToken,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address && !!CONTRACT_ADDRESSES.elpToken,
    },
  });

  // Read User Staked Balance
  const { data: stakedBalanceRaw, refetch: refetchStake } = useReadContract({
    address: CONTRACT_ADDRESSES.staking as `0x${string}`,
    abi: CONTRACT_ABIS.staking,
    functionName: "stakedBalance",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address && !!CONTRACT_ADDRESSES.staking,
    },
  });

  // Read User Current Tier
  const { data: currentTierRaw } = useReadContract({
    address: CONTRACT_ADDRESSES.staking as `0x${string}`,
    abi: CONTRACT_ABIS.staking,
    functionName: "getTier",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address && !!CONTRACT_ADDRESSES.staking,
    },
  });

  // Read Total Platform Staked
  const { data: totalStakedRaw } = useReadContract({
    address: CONTRACT_ADDRESSES.staking as `0x${string}`,
    abi: CONTRACT_ABIS.staking,
    functionName: "totalStaked",
    query: {
      enabled: !!CONTRACT_ADDRESSES.staking,
    },
  });

  // Read User Unstake Requests
  const { data: unstakeRequestsRaw, refetch: refetchRequests } = useReadContract({
    address: CONTRACT_ADDRESSES.staking as `0x${string}`,
    abi: CONTRACT_ABIS.staking,
    functionName: "getUserUnstakeRequests",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address && !!CONTRACT_ADDRESSES.staking,
    },
  });

  // Read Allowance
  const { data: allowanceRaw, refetch: refetchAllowance } = useReadContract({
    address: CONTRACT_ADDRESSES.elpToken as `0x${string}`,
    abi: CONTRACT_ABIS.elpToken,
    functionName: "allowance",
    args: address && CONTRACT_ADDRESSES.staking ? [address, CONTRACT_ADDRESSES.staking as `0x${string}`] : undefined,
    query: {
      enabled: isConnected && !!address && !!CONTRACT_ADDRESSES.elpToken && !!CONTRACT_ADDRESSES.staking,
    },
  });

  const { writeContractAsync } = useWriteContract();

  const elpBalance = elpBalanceRaw ? Number(formatUnits(elpBalanceRaw as bigint, 18)) : 0;
  const stakedBalance = stakedBalanceRaw ? Number(formatUnits(stakedBalanceRaw as bigint, 18)) : 0;
  const totalStaked = totalStakedRaw ? Number(formatUnits(totalStakedRaw as bigint, 18)) : 0;
  const allowance = allowanceRaw ? (allowanceRaw as bigint) : 0n;

  const currentTier =
    currentTierRaw === 2 ? "ELITE" : currentTierRaw === 1 ? "PRO" : "FREE";

  const nextTier =
    currentTier === "FREE"
      ? { name: "PRO", needed: Math.max(0, 10_000 - stakedBalance) }
      : currentTier === "PRO"
      ? { name: "ELITE", needed: Math.max(0, 100_000 - stakedBalance) }
      : null;

  const unstakeRequests = (unstakeRequestsRaw as any[]) || [];

  const handleStake = async () => {
    if (!stakeAmount || Number(stakeAmount) <= 0) return;
    try {
      setTxState("preparing");
      const amountBigInt = parseUnits(stakeAmount, 18);

      // Check allowance
      if (allowance < amountBigInt) {
        setTxState("waiting_wallet");
        const approveTx = await writeContractAsync({
          address: CONTRACT_ADDRESSES.elpToken as `0x${string}`,
          abi: CONTRACT_ABIS.elpToken,
          functionName: "approve",
          args: [CONTRACT_ADDRESSES.staking as `0x${string}`, amountBigInt * 10n],
        });
        setTxHash(approveTx);
        setTxState("confirming");
        await new Promise((r) => setTimeout(r, 2000));
        refetchAllowance();
      }

      setTxState("waiting_wallet");
      const stakeTx = await writeContractAsync({
        address: CONTRACT_ADDRESSES.staking as `0x${string}`,
        abi: CONTRACT_ABIS.staking,
        functionName: "stake",
        args: [amountBigInt],
      });

      setTxHash(stakeTx);
      setTxState("confirmed");
      setStakeAmount("");
      refetchBalance();
      refetchStake();
    } catch (err: any) {
      console.error(err);
      setTxState("failed");
      setTxErrorMessage(err.shortMessage || err.message || "Staking transaction failed.");
    }
  };

  const handleRequestUnstake = async () => {
    if (!unstakeAmount || Number(unstakeAmount) <= 0) return;
    try {
      setTxState("waiting_wallet");
      const amountBigInt = parseUnits(unstakeAmount, 18);

      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESSES.staking as `0x${string}`,
        abi: CONTRACT_ABIS.staking,
        functionName: "requestUnstake",
        args: [amountBigInt],
      });

      setTxHash(tx);
      setTxState("confirmed");
      setUnstakeAmount("");
      refetchStake();
      refetchRequests();
    } catch (err: any) {
      console.error(err);
      setTxState("failed");
      setTxErrorMessage(err.shortMessage || err.message || "Unstake request failed.");
    }
  };

  const handleWithdraw = async (index: number) => {
    try {
      setTxState("waiting_wallet");
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESSES.staking as `0x${string}`,
        abi: CONTRACT_ABIS.staking,
        functionName: "withdraw",
        args: [BigInt(index)],
      });

      setTxHash(tx);
      setTxState("confirmed");
      refetchBalance();
      refetchRequests();
    } catch (err: any) {
      console.error(err);
      setTxState("failed");
      setTxErrorMessage(err.shortMessage || err.message || "Withdrawal failed.");
    }
  };

  const handleCancelUnstake = async (index: number) => {
    try {
      setTxState("waiting_wallet");
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESSES.staking as `0x${string}`,
        abi: CONTRACT_ABIS.staking,
        functionName: "cancelUnstake",
        args: [BigInt(index)],
      });

      setTxHash(tx);
      setTxState("confirmed");
      refetchStake();
      refetchRequests();
    } catch (err: any) {
      console.error(err);
      setTxState("failed");
      setTxErrorMessage(err.shortMessage || err.message || "Cancellation failed.");
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-emerald-500" />
              <span>$ELP Utility Access Staking</span>
            </h3>
            <p className="text-xs text-slate-500">
              Stake $ELP to unlock advanced platform forensics and cluster intelligence tiers.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TierBadge tier={currentTier} size="md" />
          </div>
        </div>

        {/* User Balance Overview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-400 mb-0.5">Wallet Balance</div>
            <div className="text-base font-bold font-mono text-slate-900 dark:text-white">
              {formatNumber(elpBalance)} $ELP
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-400 mb-0.5">Currently Staked</div>
            <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {formatNumber(stakedBalance)} $ELP
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-400 mb-0.5">Current Tier</div>
            <div className="text-base font-bold text-slate-900 dark:text-white">
              {currentTier}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-400 mb-0.5">Next Tier Target</div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {nextTier ? `+${formatNumber(nextTier.needed)} for ${nextTier.name}` : "Max Tier Unlocked"}
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mb-6 pb-2">
          <button
            onClick={() => setActiveTab("stake")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === "stake"
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Stake $ELP
          </button>
          <button
            onClick={() => setActiveTab("unstake")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === "unstake"
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Request Unstake
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === "requests"
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <span>Unstake Queue</span>
            {unstakeRequests.filter((r) => !r.claimed).length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                {unstakeRequests.filter((r) => !r.claimed).length}
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: Stake */}
        {activeTab === "stake" && (
          <div className="space-y-4 max-w-lg">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Amount to Stake
                </label>
                <button
                  onClick={() => setStakeAmount(elpBalance.toString())}
                  className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
                >
                  Max: {formatNumber(elpBalance)} $ELP
                </button>
              </div>
              <div className="relative flex items-center">
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white font-mono text-base outline-none focus:border-emerald-500 transition"
                />
                <span className="absolute right-4 text-xs font-bold text-slate-400">
                  $ELP
                </span>
              </div>
            </div>

            <button
              onClick={handleStake}
              disabled={!isConnected || !stakeAmount || Number(stakeAmount) <= 0 || !CONTRACT_ADDRESSES.staking}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm shadow-sm transition disabled:opacity-50"
            >
              {!CONTRACT_ADDRESSES.staking
                ? "Staking Contract Not Deployed"
                : !isConnected
                ? "Connect Wallet to Stake"
                : "Stake $ELP to Upgrade Tier"}
            </button>
          </div>
        )}

        {/* Tab 2: Request Unstake */}
        {activeTab === "unstake" && (
          <div className="space-y-4 max-w-lg">
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 leading-relaxed flex items-start gap-2">
              <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong>Cooldown Flow: </strong>
                Unstaking initiates a mandatory 7-day cooldown period. Once the timer completes, tokens can be withdrawn directly to your wallet in the Unstake Queue tab.
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Amount to Unstake
                </label>
                <button
                  onClick={() => setUnstakeAmount(stakedBalance.toString())}
                  className="text-amber-600 dark:text-amber-400 font-medium hover:underline"
                >
                  Max: {formatNumber(stakedBalance)} $ELP
                </button>
              </div>
              <div className="relative flex items-center">
                <input
                  type="number"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white font-mono text-base outline-none focus:border-amber-500 transition"
                />
                <span className="absolute right-4 text-xs font-bold text-slate-400">
                  $ELP
                </span>
              </div>
            </div>

            <button
              onClick={handleRequestUnstake}
              disabled={!isConnected || !unstakeAmount || Number(unstakeAmount) <= 0 || !CONTRACT_ADDRESSES.staking}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-sm shadow-sm transition disabled:opacity-50"
            >
              {!CONTRACT_ADDRESSES.staking
                ? "Staking Contract Not Deployed"
                : "Initiate Unstake Request"}
            </button>
          </div>
        )}

        {/* Tab 3: Unstake Queue */}
        {activeTab === "requests" && (
          <div className="space-y-3">
            {unstakeRequests.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 dark:bg-slate-950/40 rounded-xl">
                No active or historical unstake requests found for this wallet.
              </div>
            ) : (
              unstakeRequests.map((req, idx) => {
                const amountFormatted = formatUnits(req.amount, 18);
                const unlockTs = Number(req.unlockTime);
                const isReady = Date.now() / 1000 >= unlockTs;

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold font-mono text-sm text-slate-900 dark:text-white">
                        {formatNumber(amountFormatted)} $ELP
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        {req.claimed ? (
                          <span className="text-emerald-600 font-semibold">Withdrawn</span>
                        ) : isReady ? (
                          <span className="text-emerald-600 font-semibold">Cooldown Finished (Ready to withdraw)</span>
                        ) : (
                          <span>Unlocks at {formatTimestamp(unlockTs)}</span>
                        )}
                      </div>
                    </div>

                    {!req.claimed && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCancelUnstake(idx)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleWithdraw(idx)}
                          disabled={!isReady}
                          className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition disabled:opacity-40"
                        >
                          Withdraw
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      <TransactionStatus
        state={txState}
        txHash={txHash}
        errorMessage={txErrorMessage}
        onClose={() => {
          setTxState("idle");
          setTxHash(undefined);
          setTxErrorMessage(undefined);
        }}
      />
    </>
  );
};
