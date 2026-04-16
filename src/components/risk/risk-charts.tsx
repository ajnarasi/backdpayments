"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PortfolioMetrics } from "@/types";

const TIER_COLORS: Record<string, string> = {
  low: "#1DB954",
  medium: "#F59E0B",
  high: "#F97316",
  critical: "#EF4444",
};

function formatMoney(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export function RiskCharts({ metrics }: { metrics: PortfolioMetrics }) {
  const tierData = Object.entries(metrics.byRiskTier).map(([tier, data]) => ({
    name: tier.charAt(0).toUpperCase() + tier.slice(1),
    value: data.exposure,
    count: data.count,
    color: TIER_COLORS[tier] ?? "#6B7280",
  }));

  const industryData = Object.entries(metrics.byIndustry)
    .sort((a, b) => b[1].exposure - a[1].exposure)
    .slice(0, 8)
    .map(([industry, data]) => ({
      name: industry
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      exposure: data.exposure,
      count: data.count,
    }));

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Exposure by Risk Tier */}
      <Card className="border border-[#262626] ">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-[#d1d5db]">
            Exposure by Risk Tier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={tierData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  stroke="none"
                >
                  {tierData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => formatMoney(Number(v))}
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {tierData.map((t) => (
                <div key={t.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: t.color }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-[#d1d5db]">
                        {t.name}
                      </span>
                      <span className="text-xs text-[#9ca3af]">
                        {t.count} buyers
                      </span>
                    </div>
                    <p className="text-xs text-[#6b7280]">
                      {formatMoney(t.value)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exposure by Industry */}
      <Card className="border border-[#262626] ">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-[#d1d5db]">
            Exposure by Industry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={industryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                tickFormatter={formatMoney}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fontSize: 10, fill: "#6B7280" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(v) => formatMoney(Number(v))}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              />
              <Bar dataKey="exposure" fill="#1DB954" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
