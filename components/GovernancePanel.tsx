"use client";

import React, { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { Vote, CheckCircle2, XCircle, Minus, Users, ArrowRight, Sparkles } from "lucide-react";
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from "@/lib/contracts";
import { formatNumber, formatAddress } from "@/lib/format";
import { formatUnits } from "viem";
import { TransactionStatus, TxState } from "./TransactionStatus";

interface SignalProposal {
  id: string;
  title: string;
  category: "Feature Priority" | "Ecosystem Integration" | "Forensics Parameters";
  description: string;
  forVotes: number;
  againstVotes: number;
  abstainVotes: number;
  status: "Active" | "Passed" | "Closed";
  endsIn: string;
}

const INITIAL_PROPOSALS: SignalProposal[] = [
  {
    id: "ELP-SIG-01",
    title: "Prioritize Cross-Chain Solana & Sui Forensic Adapters",
    category: "Ecosystem Integration",
    description: "Expand ELP X-Ray engine beyond EVM chains into high-throughput non-EVM ecosystems with dedicated cluster detection.",
    forVotes: 14200000,
    againstVotes: 1800000,
    abstainVotes: 320000,
    status: "Active",
    endsIn: "3 days",
  },
  {
    id: "ELP-SIG-02",
    title: "Integrate Real-Time Liquidity Shock Webhook Alerts",
    category: "Feature Priority",
    description: "Enable Elite Tier users to receive automated push notifications upon severe LP withdrawals (>15% pool depth).",
    forVotes: 28400000,
    againstVotes: 420000,
    abstainVotes: 150000,
    status: "Active",
    endsIn: "5 days",
  },
];

export const GovernancePanel: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [proposals, setProposals] = useState<SignalProposal[]>(INITIAL_PROPOSALS);
  const [votedProposals, setVotedProposals] = useState<Record<string, number>>({});
  const [delegateAddress, setDelegateAddress] = useState("");

  const [txState, setTxState] = useState<TxState>("idle");
  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [txError, setTxError] = useState<string | undefined>(undefined);

  // Read User Voting Power
  const { data: votesRaw, refetch: refetchVotes } = useReadContract({
    address: CONTRACT_ADDRESSES.elpToken as `0x${string}`,
    abi: CONTRACT_ABIS.elpToken,
    functionName: "getVotes",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address && !!CONTRACT_ADDRESSES.elpToken,
    },
  });

  const { writeContractAsync } = useWriteContract();

  const votingPower = votesRaw ? Number(formatUnits(votesRaw as bigint, 18)) : 0;

  const handleDelegate = async () => {
    if (!delegateAddress) return;
    try {
      setTxState("waiting_wallet");
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESSES.elpToken as `0x${string}`,
        abi: CONTRACT_ABIS.elpToken,
        functionName: "delegate",
        args: [delegateAddress as `0x${string}`],
      });
      setTxHash(tx);
      setTxState("confirmed");
      setDelegateAddress("");
      refetchVotes();
    } catch (err: any) {
      setTxState("failed");
      setTxError(err.shortMessage || err.message || "Delegation failed.");
    }
  };

  const handleVote = (proposalId: string, support: number) => {
    const power = votingPower > 0 ? votingPower : 10000;
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id !== proposalId) return p;
        return {
          ...p,
          forVotes: support === 1 ? p.forVotes + power : p.forVotes,
          againstVotes: support === 0 ? p.againstVotes + power : p.againstVotes,
          abstainVotes: support === 2 ? p.abstainVotes + power : p.abstainVotes,
        };
      })
    );
    setVotedProposals((prev) => ({ ...prev, [proposalId]: support }));
  };

  return (
    <>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Vote className="w-5 h-5 text-emerald-500" />
              <span>Community Signal Governance</span>
            </h3>
            <p className="text-xs text-slate-500">
              ERC20Votes signal voting for feature prioritization and ecosystem forensic adapters.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Your Voting Power: {formatNumber(votingPower)} $ELP
            </span>
          </div>
        </div>

        {/* Self-Delegation Quick Prompt if 0 voting power but has tokens */}
        {votingPower === 0 && isConnected && (
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="text-blue-800 dark:text-blue-300">
              <strong>Activate Voting Power: </strong>
              Under ERC20Votes, you must delegate your votes to yourself once to participate in on-chain signals.
            </div>
            <button
              onClick={() => {
                if (address) {
                  setDelegateAddress(address);
                  handleDelegate();
                }
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shrink-0"
            >
              Delegate to Self
            </button>
          </div>
        )}

        {/* Proposals List */}
        <div className="space-y-6">
          {proposals.map((p) => {
            const total = p.forVotes + p.againstVotes + p.abstainVotes;
            const forPercent = total > 0 ? (p.forVotes / total) * 100 : 0;
            const againstPercent = total > 0 ? (p.againstVotes / total) * 100 : 0;
            const hasVoted = votedProposals[p.id] !== undefined;

            return (
              <div
                key={p.id}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {p.id}
                    </span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {p.title}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">Ends in {p.endsIn}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                  {p.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-xs text-slate-500 font-mono">
                    <span className="text-emerald-600">For: {forPercent.toFixed(1)}% ({formatNumber(p.forVotes)})</span>
                    <span className="text-rose-600">Against: {againstPercent.toFixed(1)}% ({formatNumber(p.againstVotes)})</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 flex overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${forPercent}%` }}
                    />
                    <div
                      className="bg-rose-500 h-full transition-all duration-300"
                      style={{ width: `${againstPercent}%` }}
                    />
                  </div>
                </div>

                {/* Vote Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/80">
                  <div className="text-xs text-slate-400">
                    {hasVoted ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Signal Recorded</span>
                      </span>
                    ) : (
                      <span>Cast your signal vote:</span>
                    )}
                  </div>

                  {!hasVoted && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVote(p.id, 1)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition border border-emerald-200 dark:border-emerald-800"
                      >
                        For
                      </button>
                      <button
                        onClick={() => handleVote(p.id, 0)}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-semibold transition border border-rose-200 dark:border-rose-800"
                      >
                        Against
                      </button>
                      <button
                        onClick={() => handleVote(p.id, 2)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
                      >
                        Abstain
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
