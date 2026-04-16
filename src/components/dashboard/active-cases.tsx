"use client";

import { Badge } from "@/components/ui/badge";
import type { CollectionCase } from "@/types";
import Link from "next/link";

const STAGE_LABELS: Record<string, string> = {
  pre_due: "Pre-Due",
  reminder: "Reminder",
  follow_up: "Follow Up",
  escalation: "Escalation",
  final_notice: "Final Notice",
  collections_team: "Collections Team",
  resolved: "Resolved",
};

const TIER_COLORS: Record<string, string> = {
  low: "bg-[#1DB954]/10 text-[#1DB954] border-[#1DB954]/20",
  medium: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20",
  high: "bg-[#f97316]/10 text-[#f97316] border-[#f97316]/20",
  critical: "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20",
};

function formatCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export function ActiveCases({ cases }: { cases: CollectionCase[] }) {
  return (
    <div className="space-y-2.5">
      {cases.map((c) => (
        <Link
          key={c.id}
          href={`/collections/${c.buyerId}`}
          className="block rounded-lg border border-[#262626] bg-[#1c1c1c] p-2.5 transition-colors hover:bg-[#1c1c1c]/80"
        >
          <div className="flex items-center justify-between">
            <span className="truncate text-xs font-semibold text-[#fafafa]">
              {c.buyerName}
            </span>
            <span className="text-xs font-bold text-white">
              {formatCurrency(c.amount)}
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 py-0 ${TIER_COLORS[c.riskTier]}`}
            >
              {c.riskTier}
            </Badge>
            <span className="text-[10px] text-[#6b7280]">
              {STAGE_LABELS[c.stage] ?? c.stage}
            </span>
            <span className="text-[10px] text-[#6b7280]">
              {c.daysOverdue}d overdue
            </span>
          </div>
          {c.recoveredAmount > 0 && (
            <div className="mt-1 text-[10px] text-[#1DB954]">
              Recovered: {formatCurrency(c.recoveredAmount)} (
              {Math.round((c.recoveredAmount / c.amount) * 100)}%)
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
