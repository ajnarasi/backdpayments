import Link from "next/link";
import type { CSSegmentSummary } from "@/types/cs-brain";

interface SegmentCardProps {
  segment: CSSegmentSummary;
}

const SEGMENT_META: Record<
  CSSegmentSummary["segment"],
  { title: string; color: string; hint: string; emoji: string }
> = {
  onboarding: {
    title: "Onboarding",
    color: "#8b5cf6",
    hint: "First 60 days — activation at stake",
    emoji: "⚡",
  },
  activated: {
    title: "Activated",
    color: "#10b981",
    hint: "Healthy, transacting, on cadence",
    emoji: "✓",
  },
  at_risk: {
    title: "At Risk",
    color: "#ef4444",
    hint: "Deterioration signals — intervene soon",
    emoji: "⚠",
  },
  expansion_ready: {
    title: "Expansion Ready",
    color: "#ff6b1a",
    hint: "Network-validated — pitch bigger",
    emoji: "↑",
  },
};

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export function SegmentCard({ segment }: SegmentCardProps) {
  const meta = SEGMENT_META[segment.segment];
  const trendSymbol = segment.recentTrend === "up" ? "▲" : segment.recentTrend === "down" ? "▼" : "■";
  const trendColor =
    segment.recentTrend === "up" ? "#10b981" : segment.recentTrend === "down" ? "#ef4444" : "#9ca3af";

  return (
    <Link
      href={`/cs-brain?segment=${segment.segment}`}
      className="deck-card block no-underline hover:border-[#ff6b1a]/40 transition-colors"
      style={{ padding: 24, borderLeft: `3px solid ${meta.color}` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg" style={{ color: meta.color }}>
            {meta.emoji}
          </span>
          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: meta.color }}>
            {meta.title}
          </p>
        </div>
        <span className="text-sm tabular-nums" style={{ color: trendColor }}>
          {trendSymbol}
        </span>
      </div>
      <p className="text-4xl font-black text-white leading-none mb-1" style={{ letterSpacing: "-0.03em" }}>
        {segment.count}
      </p>
      <p className="text-xs text-[#6b7280] mb-3">merchants · {formatMoney(segment.exposure)} exposure</p>
      <p className="text-xs text-[#9ca3af] leading-relaxed">{segment.headline}</p>
    </Link>
  );
}
