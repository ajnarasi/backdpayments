"use client";

import type { ABComparison } from "@/types";

export function ABComparisonTable({ data }: { data: ABComparison[] }) {
  return (
    <div className="space-y-3">
      {data.map((row) => {
        const isPositive =
          (row.metric === "Avg Days to Resolution" ||
            row.metric === "Escalation Rate" ||
            row.metric === "Cost per Recovery")
            ? row.improvement < 0
            : row.improvement > 0;
        return (
          <div key={row.metric} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#9ca3af]">{row.metric}</span>
              <span
                className={`font-bold ${isPositive ? "text-[#1DB954]" : "text-[#ef4444]"}`}
              >
                {row.improvement > 0 ? "+" : ""}
                {row.improvement.toFixed(1)}%
              </span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="flex items-center justify-between text-[10px] text-[#6b7280] mb-0.5">
                  <span>Rule-based</span>
                  <span>
                    {row.unit === "$" ? `$${row.ruleBased}` : `${row.ruleBased}${row.unit}`}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[#262626]">
                  <div
                    className="h-1.5 rounded-full bg-[#3a3a3a]"
                    style={{
                      width: `${Math.min(100, (row.ruleBased / Math.max(row.ruleBased, row.agentManaged)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-[10px] text-[#6b7280] mb-0.5">
                  <span>Agent</span>
                  <span>
                    {row.unit === "$" ? `$${row.agentManaged}` : `${row.agentManaged}${row.unit}`}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[#1DB954]/10">
                  <div
                    className="h-1.5 rounded-full bg-[#1DB954]"
                    style={{
                      width: `${Math.min(100, (row.agentManaged / Math.max(row.ruleBased, row.agentManaged)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
