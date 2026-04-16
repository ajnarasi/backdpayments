"use client";

import {
  AreaChart,
  Area,
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
import type { MonthlyTrend } from "@/types";

function formatMoney(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export function OverviewCharts({ trends }: { trends: MonthlyTrend[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Volume & Recovery */}
      <Card className="border border-[#262626] ">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-[#d1d5db]">
            Monthly Volume & Recovery Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                tickFormatter={formatMoney}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0.6, 1]}
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(v, name) => {
                  const n = Number(v);
                  return name === "Recovery Rate"
                    ? `${(n * 100).toFixed(0)}%`
                    : formatMoney(n);
                }}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="totalVolume"
                name="Volume"
                stroke="#1DB954"
                fill="#1DB954"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="recoveryRate"
                name="Recovery Rate"
                stroke="#158a3e"
                fill="#158a3e"
                fillOpacity={0.05}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Overdue & Default Amounts */}
      <Card className="border border-[#262626] ">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-[#d1d5db]">
            Overdue & Default Amounts (Trending Down)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                tickFormatter={formatMoney}
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
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Bar
                dataKey="overdueAmount"
                name="Overdue"
                fill="#F59E0B"
                radius={[3, 3, 0, 0]}
              />
              <Bar
                dataKey="defaultAmount"
                name="Defaults"
                fill="#EF4444"
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
