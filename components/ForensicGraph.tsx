"use client";

import React, { useState } from "react";
import { GraphNode, GraphEdge } from "@/lib/data/types";
import { Layers, Shield, ArrowRight, Info, ExternalLink } from "lucide-react";
import { formatAddress } from "@/lib/format";

interface ForensicGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onSelectNode?: (node: GraphNode) => void;
}

export const ForensicGraph: React.FC<ForensicGraphProps> = ({
  nodes,
  edges,
  onSelectNode,
}) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(nodes[0] || null);

  const getNodeColor = (type: GraphNode["type"]) => {
    switch (type) {
      case "token":
        return "bg-emerald-500 text-white border-emerald-600";
      case "pool":
        return "bg-blue-500 text-white border-blue-600";
      case "deployer":
        return "bg-amber-500 text-white border-amber-600";
      case "exchange":
        return "bg-purple-500 text-white border-purple-600";
      default:
        return "bg-slate-800 text-slate-100 border-slate-700";
    }
  };

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
    if (onSelectNode) onSelectNode(node);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-500" />
            <span>Wallet & Ecosystem Relationship Graph</span>
          </h3>
          <p className="text-xs text-slate-500">
            Interactive topology mapping observed token transfers, funding links, DEX pools and wallet clusters.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Token
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Pool
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Deployer
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-700" /> Wallet
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Visual Graph Canvas (SVG) */}
        <div className="lg:col-span-2 relative min-h-[300px] sm:min-h-[340px] rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 p-4 flex flex-col justify-between overflow-hidden">
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-300 dark:stroke-slate-700 stroke-[1.5] stroke-dasharray-[4,4]">
            <line x1="20%" y1="20%" x2="50%" y2="50%" />
            <line x1="20%" y1="20%" x2="80%" y2="30%" />
            <line x1="50%" y1="50%" x2="30%" y2="80%" />
            <line x1="80%" y1="30%" x2="70%" y2="80%" />
            <line x1="50%" y1="50%" x2="70%" y2="80%" />
          </svg>

          {/* Node Grid Layout */}
          <div className="grid grid-cols-3 gap-4 relative z-10 my-auto py-2">
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition transform hover:scale-105 ${
                    isSelected
                      ? "ring-2 ring-emerald-500 shadow-md bg-white dark:bg-slate-800"
                      : "bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold border mb-1.5 ${getNodeColor(
                      node.type
                    )}`}
                  >
                    {node.type.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate w-full">
                    {node.label}
                  </span>
                  {node.balance && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                      {node.balance}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/50 pt-2 z-10">
            <span>Click any node to inspect relationship telemetry</span>
            <span>{edges.length} On-chain links mapped</span>
          </div>
        </div>

        {/* Selected Node Forensic Card */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-4 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Node Forensics
            </div>
            {selectedNode ? (
              <div className="space-y-3">
                <div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedNode.label}
                  </div>
                  <div className="text-xs font-medium text-slate-500 capitalize">
                    Entity Type: {selectedNode.type}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Holdings:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {selectedNode.balance || "Distributed"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Risk Assessment:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {selectedNode.risk === "high" ? "Elevated Concentration" : "Normal Baseline"}
                    </span>
                  </div>
                  {selectedNode.clusterId && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cluster ID:</span>
                      <span className="font-mono font-semibold text-amber-500">
                        {selectedNode.clusterId}
                      </span>
                    </div>
                  )}
                </div>

                {/* Connected Relationships for this node */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Observed Edges
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                    {edges
                      .filter(
                        (e) => e.source === selectedNode.id || e.target === selectedNode.id
                      )
                      .map((edge, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                        >
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {edge.type}
                          </span>
                          <span className="text-slate-500 text-[11px]">{edge.value}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400">Select a node to inspect relationships.</div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400">
            Source: Multi-hop transaction trace & bytecode logs
          </div>
        </div>
      </div>
    </div>
  );
};
