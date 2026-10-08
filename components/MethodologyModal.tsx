import React from "react";
import { X, BookOpen, CheckCircle2 } from "lucide-react";

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              EELP Analytical Methodology
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-600 dark:text-slate-300">
          <div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              1. Holder Quality Score (0 - 100)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
              Holder Quality evaluates the resilience of the holder base rather than merely counting raw addresses. It combines four transparent on-chain factors:
            </p>
            <ul className="space-y-1.5 text-xs bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <li>• <strong>Supply Dispersion (35% weight):</strong> Top 10/20 concentration penalization.</li>
              <li>• <strong>Wallet Independence (25% weight):</strong> Distinct funding source analysis.</li>
              <li>• <strong>Holding Horizon (25% weight):</strong> Weighted days since first acquisition.</li>
              <li>• <strong>Organic Retention (15% weight):</strong> Low turnover vs cyclical wash trading.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              2. Behavioral Wallet Clustering
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              We do not claim wallets belong to a single human. Instead, we detect <em>behaviorally linked clusters</em> based on mathematical evidence: common gas funder addresses, synchronized entry within identical block spans, identical slippage and gas configurations, and cascading multi-hop transfer paths.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              3. Flow Divergence Engine
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Flow divergence occurs when spot price expands while underlying on-chain liquidity depth contracts or whale net flows turn negative. This flags structural vulnerabilities where spot buying is unsupported by balance sheet commitments.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              4. EELP Intelligence Score (0 - 100)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              A composite metric aggregating data completeness, contract immutability, liquidity depth, flow consistency, and anomaly control. It is an analytical health score, NOT a financial return prediction.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-semibold"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
