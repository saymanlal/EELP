import React, { useState } from "react";
import { TokenXRayData } from "@/lib/data/types";
import { X, Download, FileText, Check, Copy } from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/format";

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TokenXRayData;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdownReport = () => {
    return `# EELP Token Intelligence & Forensic Report

**Token:** ${data.token.name} (${data.token.symbol})
**Chain:** ${data.token.chainSlug.toUpperCase()}
**Contract:** \`${data.token.address}\`
**Analysis Timestamp:** ${data.analyzedAt}

---

## 1. Executive Summary & Market Structure
- **EELP Intelligence Score:** ${data.elpIntelligenceScore.score}/100 (Confidence: ${data.elpIntelligenceScore.confidence})
- **Holder Quality Score:** ${data.holderQuality.score}/100 (${data.holderQuality.rating})
- **Market Regime:** ${data.marketRegime.regime}
- **Price (USD):** ${formatCurrency(data.market.priceUsd)}
- **Liquidity Depth:** ${formatCurrency(data.market.liquidityUsd)}
- **24H DEX Volume:** ${formatCurrency(data.market.volume24hUsd)}
- **24H Price Change:** ${formatPercent(data.market.priceChange24h)}

---

## 2. Ownership & Concentration Forensics
- **Top 10 Concentration:** ${data.ownership.top10Concentration.toFixed(1)}%
- **Top 20 Concentration:** ${data.ownership.top20Concentration.toFixed(1)}%
- **Independent Holder Estimate:** ${data.holderQuality.independentWalletsEstimatePercent}%
- **Deployer Holdings:** ${data.ownership.deployerHoldingPercentage.toFixed(1)}%

---

## 3. Flow Divergence & Liquidity Health
- **Divergence Detected:** ${data.flowDivergence.divergenceDetected ? "YES (" + data.flowDivergence.severity + ")" : "NO"}
- **Divergence Summary:** ${data.flowDivergence.summary}
- **Liquidity Rating:** ${data.liquidity.liquidityHealthRating}
- **LP Lock Status:** ${data.liquidity.isLpLocked ? "Locked (" + data.liquidity.lockedEstimatedPercent + "%)" : "Unverified"}

---

## 4. Wallet Clusters & Behavioral Fingerprint
- **Active Clusters Identified:** ${data.clusters.length}
${data.clusters.map((c) => `- **${c.name} (${c.id}):** ${c.walletCount} wallets controlling ${c.totalHeldPercentage.toFixed(1)}% supply. Shared signal: ${c.sharedSignal}`).join("\n")}

---

## 5. Contract Control & Privileges
- **Mint Capability:** ${data.contractControl.mintCapability}
- **Upgradeability:** ${data.contractControl.upgradeability}
- **Pause Mechanism:** ${data.contractControl.pauseMechanism}
- **Blacklist:** ${data.contractControl.blacklistMechanism}
- **Transfer Tax:** ${data.contractControl.transferTax}

---

## 6. Regulatory & Forensic Notice
*EELP provides blockchain data analysis and analytical signals for informational purposes only. EELP does not provide financial or investment advice.*
`;
  };

  const handleDownload = () => {
    const reportText = generateMarkdownReport();
    const element = document.createElement("a");
    const file = new Blob([reportText], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `EELP-Report-${data.token.symbol}-${data.token.address.slice(0, 8)}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Export Forensic Intelligence Report
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Generate a standardized, audit-grade Markdown report containing all verified on-chain telemetry, holder concentration metrics, cluster detections, and risk signals.
          </p>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300 max-h-48 overflow-y-auto space-y-1">
            <div># EELP Token Intelligence & Forensic Report</div>
            <div>**Token:** {data.token.name} ({data.token.symbol})</div>
            <div>**Score:** {data.elpIntelligenceScore.score}/100</div>
            <div>**Holder Quality:** {data.holderQuality.score}/100</div>
            <div>**Clusters:** {data.clusters.length} behaviorally linked groups</div>
            <div>**Contract:** {data.contractControl.mintCapability}</div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copied" : "Copy Markdown"}</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Report (.md)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
