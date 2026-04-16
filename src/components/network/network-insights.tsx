"use client";

import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, Zap } from "lucide-react";
import type { NetworkInsight } from "@/types";

const TYPE_CONFIG: Record<string, { icon: typeof TrendingUp; color: string; bgColor: string; label: string }> = {
  expansion: { icon: TrendingUp, color: "text-[#ff6b1a]", bgColor: "bg-[#ff6b1a]/10 border-[#ff6b1a]/20", label: "Expansion" },
  risk_cluster: { icon: AlertTriangle, color: "text-[#ef4444]", bgColor: "bg-[#ef4444]/10 border-[#ef4444]/20", label: "Risk" },
  network_credit: { icon: Zap, color: "text-[#ff6b1a]", bgColor: "bg-[#ff6b1a]/10 border-[#ff6b1a]/20", label: "Credit" },
};

function formatCurrency(n: number) {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(abs / 1_000).toFixed(0)}K`;
  return `$${abs}`;
}

export function NetworkInsightsList({ insights }: { insights: NetworkInsight[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {insights.map((insight, idx) => {
        const config = TYPE_CONFIG[insight.type] ?? TYPE_CONFIG.expansion;
        const Icon = config.icon;
        const isPositive = insight.impact > 0;

        return (
          <div
            key={idx}
            className={`rounded-lg border p-4 ${config.bgColor}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`h-4 w-4 ${config.color}`} />
              <Badge variant="outline" className="text-[10px]">
                {config.label}
              </Badge>
            </div>
            <h3 className="text-sm font-semibold text-white">
              {insight.title}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#9ca3af]">
              {insight.description}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] text-[#6b7280]">
                {insight.affectedNodes.length} nodes affected
              </span>
              <span
                className={`text-xs font-bold ${isPositive ? "text-[#ff6b1a]" : "text-[#ef4444]"}`}
              >
                {isPositive ? "+" : "-"}
                {formatCurrency(insight.impact)}/yr
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
