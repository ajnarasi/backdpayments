"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, User, ChevronRight } from "lucide-react";
import type { CollectionCase } from "@/types";

const STAGE_LABELS: Record<string, string> = {
  pre_due: "Pre-Due",
  reminder: "Reminder",
  follow_up: "Follow Up",
  escalation: "Escalation",
  final_notice: "Final Notice",
  collections_team: "Collections Team",
  resolved: "Resolved",
};

const STAGE_COLORS: Record<string, string> = {
  pre_due: "bg-[#1DB954]/10 text-[#1DB954] border-[#1DB954]/20",
  reminder: "bg-sky-50 text-sky-700 border-sky-200",
  follow_up: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20",
  escalation: "bg-[#f97316]/10 text-[#f97316] border-[#f97316]/20",
  final_notice: "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20",
  collections_team: "bg-red-100 text-red-800 border-red-300",
  resolved: "bg-[#1DB954]/10 text-[#1DB954] border-[#1DB954]/20",
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

export function CollectionsList({ cases }: { cases: CollectionCase[] }) {
  const [filter, setFilter] = useState<"all" | "active" | "resolved" | "showcase">("showcase");

  const filtered =
    filter === "showcase"
      ? cases.filter((c) => c.id.startsWith("case-showcase"))
      : filter === "active"
        ? cases.filter((c) => !c.isResolved)
        : filter === "resolved"
          ? cases.filter((c) => c.isResolved)
          : cases;

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-4 flex gap-1">
        {(["showcase", "active", "resolved", "all"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter(f)}
            className="text-xs capitalize"
          >
            {f === "showcase" ? "Showcase Cases" : f}
          </Button>
        ))}
      </div>

      {/* Cases */}
      <div className="space-y-2">
        {filtered.map((c) => (
          <Link
            key={c.id}
            href={`/collections/${c.buyerId}`}
            className="flex items-center gap-4 rounded-lg border border-[#262626] bg-[#161616] p-3 transition-all hover:border-[#262626] hover:"
          >
            {/* Left: Icon */}
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                c.id.startsWith("case-showcase")
                  ? "bg-[#1DB954]/10 text-[#1DB954]"
                  : "bg-[#1c1c1c] text-[#9ca3af]"
              }`}
            >
              {c.actions.some((a) => a.isAgentAction) ? (
                <Bot className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>

            {/* Middle: Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white truncate">
                  {c.buyerName}
                </span>
                {c.id.startsWith("case-showcase") && (
                  <Badge className="bg-[#1DB954]/100 text-white text-[9px] px-1.5 py-0">
                    SHOWCASE
                  </Badge>
                )}
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-[#9ca3af]">
                <span>{c.sellerName}</span>
                <span className="text-[#3a3a3a]">|</span>
                <span>{c.daysOverdue}d overdue</span>
                <span className="text-[#3a3a3a]">|</span>
                <span>{c.actions.length} actions</span>
              </div>
            </div>

            {/* Right: Amount + badges */}
            <div className="flex shrink-0 items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-white">
                  {formatCurrency(c.amount)}
                </p>
                {c.recoveredAmount > 0 && (
                  <p className="text-[10px] text-[#1DB954]">
                    {Math.round((c.recoveredAmount / c.amount) * 100)}% recovered
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <Badge
                  variant="outline"
                  className={`text-[10px] px-1.5 py-0 ${TIER_COLORS[c.riskTier]}`}
                >
                  {c.riskTier}
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-[10px] px-1.5 py-0 ${STAGE_COLORS[c.stage]}`}
                >
                  {STAGE_LABELS[c.stage]}
                </Badge>
              </div>
              <ChevronRight className="h-4 w-4 text-[#3a3a3a]" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
