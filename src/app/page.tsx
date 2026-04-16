import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  dashboardStats,
  portfolioMetrics,
  abComparisons,
  monthlyTrends,
  riskAlerts,
  collectionCases,
} from "@/lib/data";
import { OverviewCharts } from "@/components/dashboard/overview-charts";
import { ABComparisonTable } from "@/components/dashboard/ab-comparison";
import { RecentAlerts } from "@/components/dashboard/recent-alerts";
import { ActiveCases } from "@/components/dashboard/active-cases";

function formatCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

const STATS = [
  {
    label: "Total Exposure",
    value: formatCurrency(portfolioMetrics.totalExposure),
    sub: `${portfolioMetrics.totalBuyers} buyers, ${portfolioMetrics.totalSellers} sellers`,
  },
  {
    label: "Recovery Rate",
    value: `${(dashboardStats.recoveryRate * 100).toFixed(0)}%`,
    sub: "Agent-managed",
    accent: true,
  },
  {
    label: "Overdue Amount",
    value: formatCurrency(portfolioMetrics.overdueAmount),
    sub: `${(portfolioMetrics.overdueRate * 100).toFixed(1)}% of exposure`,
    warn: true,
  },
  {
    label: "Avg Days to Payment",
    value: `${portfolioMetrics.avgDaysToPayment}`,
    sub: "Down from 45 days (rule-based)",
  },
  {
    label: "Active Alerts",
    value: String(dashboardStats.activeAlerts),
    sub: `${riskAlerts.filter((a) => a.severity === "critical").length} critical`,
    warn: dashboardStats.activeAlerts > 10,
  },
  {
    label: "Agent Actions Today",
    value: String(dashboardStats.agentActionsToday),
    sub: `${dashboardStats.activeCases} active cases`,
  },
];

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1DB954]/20 bg-[#1DB954]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1DB954] mb-3">
            Live Dashboard
          </span>
          <h1 className="text-2xl font-bold text-white">
            Portfolio Overview
          </h1>
          <p className="mt-1 text-sm text-[#9ca3af]">
            Real-time AI collections intelligence across Backd&apos;s B2B net
            terms portfolio
          </p>
        </div>
        <Badge
          variant="outline"
          className="border-[#1DB954]/20 bg-[#1DB954]/10 text-[#1DB954]"
        >
          AI Agent Active
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {STATS.map((stat) => (
          <Card key={stat.label} className={`bg-[#161616] border border-[#262626] ${stat.accent ? "border-t-2 border-t-[#1DB954]" : ""}`}>
            <CardContent className="pt-5 pb-4 px-4">
              <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">
                {stat.label}
              </p>
              <p
                className={`mt-1 text-2xl font-bold ${stat.accent ? "text-[#1DB954]" : stat.warn ? "text-[#f59e0b]" : "text-white"}`}
              >
                {stat.value}
              </p>
              <p className="mt-0.5 text-xs text-[#6b7280]">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <OverviewCharts trends={monthlyTrends} />

      {/* Bottom Row: A/B Comparison + Alerts + Cases */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="bg-[#161616] border border-[#262626] lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-[#d1d5db]">
              Agent vs. Rule-Based
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ABComparisonTable data={abComparisons} />
          </CardContent>
        </Card>
        <Card className="bg-[#161616] border border-[#262626]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-[#d1d5db]">
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentAlerts alerts={riskAlerts.slice(0, 6)} />
          </CardContent>
        </Card>
        <Card className="bg-[#161616] border border-[#262626]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-[#d1d5db]">
              Active Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ActiveCases cases={collectionCases.filter((c) => !c.isResolved).slice(0, 6)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
