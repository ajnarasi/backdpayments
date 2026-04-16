"use client";

import { Badge } from "@/components/ui/badge";
import type { RiskAlert } from "@/types";
import { AlertTriangle, TrendingDown, DollarSign, Shield, AlertCircle } from "lucide-react";

const ALERT_ICONS: Record<string, typeof AlertTriangle> = {
  payment_slowdown: TrendingDown,
  order_decline: TrendingDown,
  high_exposure: DollarSign,
  industry_risk: Shield,
  dispute_spike: AlertCircle,
  predicted_default: AlertTriangle,
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20",
  warning: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20",
  info: "bg-[#ff6b1a]/10 text-[#ff6b1a] border-[#ff6b1a]/20",
};

export function RecentAlerts({ alerts }: { alerts: RiskAlert[] }) {
  return (
    <div className="space-y-2.5">
      {alerts.map((alert) => {
        const Icon = ALERT_ICONS[alert.alertType] ?? AlertTriangle;
        return (
          <div
            key={alert.id}
            className="flex items-start gap-2.5 rounded-lg border border-[#262626] bg-[#1c1c1c] p-2.5"
          >
            <div
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                alert.severity === "critical"
                  ? "bg-red-100 text-[#ef4444]"
                  : alert.severity === "warning"
                    ? "bg-[#f59e0b]/10 text-[#f59e0b]"
                    : "bg-[#ff6b1a]/10 text-[#ff6b1a]"
              }`}
            >
              <Icon className="h-3 w-3" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-xs font-semibold text-[#fafafa]">
                  {alert.buyerName}
                </span>
                <Badge
                  variant="outline"
                  className={`shrink-0 text-[10px] px-1.5 py-0 ${SEVERITY_COLORS[alert.severity]}`}
                >
                  {alert.severity}
                </Badge>
              </div>
              <p className="mt-0.5 text-[11px] leading-tight text-[#9ca3af] line-clamp-2">
                {alert.message}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
