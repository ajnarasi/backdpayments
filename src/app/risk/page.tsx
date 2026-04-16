import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { riskAlerts, portfolioMetrics, buyers } from "@/lib/data";
import { RiskAlertsList } from "@/components/risk/risk-alerts-list";
import { RiskCharts } from "@/components/risk/risk-charts";
import { ScenarioModeler } from "@/components/risk/scenario-modeler";

export default function RiskPage() {
  const criticalAlerts = riskAlerts.filter((a) => a.severity === "critical");
  const warningAlerts = riskAlerts.filter((a) => a.severity === "warning");
  const highRiskBuyers = buyers.filter(
    (b) => b.riskTier === "high" || b.riskTier === "critical"
  );
  const highRiskExposure = highRiskBuyers.reduce(
    (s, b) => s + b.currentExposure,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Predictive Risk Intelligence
        </h1>
        <p className="mt-1 text-sm text-[#9ca3af]">
          Early warning system powered by behavioral signals, network analysis,
          and predictive modeling.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Card className="bg-[#161616] border border-[#262626]">
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">Critical Alerts</p>
            <p className="mt-1 text-2xl font-bold text-[#ef4444]">{criticalAlerts.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#161616] border border-[#262626]">
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">Warnings</p>
            <p className="mt-1 text-2xl font-bold text-[#f59e0b]">{warningAlerts.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#161616] border border-[#262626]">
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">High-Risk Buyers</p>
            <p className="mt-1 text-2xl font-bold text-[#f97316]">{highRiskBuyers.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#161616] border border-[#262626]">
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">At-Risk Exposure</p>
            <p className="mt-1 text-2xl font-bold text-[#ef4444]">
              ${(highRiskExposure / 1_000_000).toFixed(1)}M
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#161616] border border-[#262626]">
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">Default Rate</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {(portfolioMetrics.defaultRate * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <RiskCharts metrics={portfolioMetrics} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="bg-[#161616] border border-[#262626]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-[#d1d5db]">
                Risk Alerts
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline" className="border-[#ef4444]/20 bg-[#ef4444]/10 text-[#ef4444] text-[10px]">
                  {criticalAlerts.length} critical
                </Badge>
                <Badge variant="outline" className="border-[#f59e0b]/20 bg-[#f59e0b]/10 text-[#f59e0b] text-[10px]">
                  {warningAlerts.length} warnings
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <RiskAlertsList alerts={riskAlerts} />
          </CardContent>
        </Card>

        <Card className="bg-[#161616] border border-[#262626]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-[#d1d5db]">
              Scenario Modeling
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScenarioModeler />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
