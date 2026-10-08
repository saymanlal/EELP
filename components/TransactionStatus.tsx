import React from "react";
import { Loader2, CheckCircle2, XCircle, ExternalLink, X } from "lucide-react";
import { getChainById } from "@/lib/chains";

export type TxState = "idle" | "preparing" | "waiting_wallet" | "confirming" | "confirmed" | "failed";

interface TransactionStatusProps {
  state: TxState;
  txHash?: string;
  chainId?: number;
  errorMessage?: string;
  onClose?: () => void;
  title?: string;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
  state,
  txHash,
  chainId = 421614,
  errorMessage,
  onClose,
  title = "Transaction Status",
}) => {
  if (state === "idle") return null;

  const chainConfig = getChainById(chainId);
  const explorerUrl = chainConfig?.explorerUrl || "https://sepolia.arbiscan.io";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex flex-col items-center text-center">
          {state === "preparing" && (
            <>
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Preparing Transaction
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Simulating on-chain parameters and gas estimate...
              </p>
            </>
          )}

          {state === "waiting_wallet" && (
            <>
              <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Waiting for Wallet Signature
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Please confirm the transaction prompt in your connected wallet.
              </p>
            </>
          )}

          {state === "confirming" && (
            <>
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Confirming On-Chain
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                Transaction submitted. Waiting for block confirmation...
              </p>
              {txHash && (
                <a
                  href={`${explorerUrl}/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>View on Explorer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </>
          )}

          {state === "confirmed" && (
            <>
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Transaction Confirmed
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Your on-chain action has been successfully processed.
              </p>
              {txHash && (
                <a
                  href={`${explorerUrl}/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition mb-3"
                >
                  <span>View on Explorer</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {onClose && (
                <button
                  onClick={onClose}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition"
                >
                  Done
                </button>
              )}
            </>
          )}

          {state === "failed" && (
            <>
              <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Transaction Failed
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                {errorMessage || "The transaction could not be completed. Check your token balance and try again."}
              </p>
              {txHash && (
                <a
                  href={`${explorerUrl}/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:underline mb-4"
                >
                  <span>View failed tx on Explorer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {onClose && (
                <button
                  onClick={onClose}
                  className="w-full py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg text-sm font-semibold transition"
                >
                  Close
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
