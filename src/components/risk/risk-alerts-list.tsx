"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

const ALERT_LABELS: Record<string, string> = {
  payment_slowdown: "Payment Slowdown",
  order_decline: "Order Decline",
  high_exposure: "High Exposure",
  industry_risk: "Industry Risk",
  dispute_spike: "Dispute Spike",
  predicted_default: "Predicted Default",
};

export function RiskAlertsList({ alerts }: { alerts: RiskAlert[] }) {
  const sorted = [...alerts].sort((a, b) => {
    const sev = { critical: 0, warning: 1, info: 2 };
    return (sev[a.severity] ?? 3) - (sev[b.severity] ?? 3);
  });

  return (
    <div className="space-y-3 max-h-[500px] overflow-auto pr-1">
      {sorted.map((alert) => {
        const Icon = ALERT_ICONS[alert.alertType] ?? AlertTriangle;
        return (
          <div
            key={alert.id}
            className={`rounded-lg border p-3 ${
              alert.severity === "critical"
                ? "border-[#ef4444]/20 bg-[#ef4444]/10/50"
                : alert.severity === "warning"
                  ? "border-[#f59e0b]/20 bg-[#f59e0b]/10/30"
                  : "border-[#ff6b1a]/20 bg-[#ff6b1a]/10"
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  alert.severity === "critical"
                    ? "bg-red-100 text-[#ef4444]"
                    : alert.severity === "warning"
                      ? "bg-[#f59e0b]/10 text-[#f59e0b]"
                      : "bg-[#ff6b1a]/10 text-[#ff6b1a]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#fafafa]">
                    {alert.buyerName}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[9px] px-1 py-0 ${
                      alert.severity === "critical"
                        ? "border-red-300 text-[#ef4444]"
                        : alert.severity === "warning"
                          ? "border-[#f59e0b]/20 text-[#f59e0b]"
                          : "border-[#ff6b1a]/20 text-[#ff6b1a]"
                    }`}
                  >
                    {ALERT_LABELS[alert.alertType]}
                  </Badge>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-[#9ca3af]">
                  {alert.message}
                </p>

                {/* Confidence */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] text-[#9ca3af]">Confidence:</span>
                  <div className="flex-1 max-w-[120px]">
                    <Progress
                      value={alert.confidence * 100}
                      className="h-1.5"
                    />
                  </div>
                  <span className="text-[10px] font-medium text-[#d1d5db]">
                    {(alert.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                {/* Signals */}
                {alert.signals.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {alert.signals.slice(0, 4).map((sig, i) => (
                      <span
                        key={i}
                        className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] ${
                          sig.trend === "declining"
                            ? "bg-red-100 text-[#ef4444]"
                            : sig.trend === "improving"
                              ? "bg-[#ff6b1a]/10 text-[#ff6b1a]"
                              : "bg-[#1c1c1c] text-[#9ca3af]"
                        }`}
                      >
                        {sig.name}: {typeof sig.value === "number" && sig.value < 1 ? `${(sig.value * 100).toFixed(0)}%` : sig.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
