import type { HealthScore } from "@/types/cs-brain";

interface HealthGaugeProps {
  health: HealthScore;
}

const BAND_COLORS: Record<HealthScore["band"], { bg: string; text: string; label: string }> = {
  thriving: { bg: "#10b981", text: "#065f46", label: "Thriving" },
  activated: { bg: "#ff6b1a", text: "#7a2d00", label: "Activated" },
  at_risk: { bg: "#f59e0b", text: "#78350f", label: "At Risk" },
  churning: { bg: "#ef4444", text: "#7f1d1d", label: "Churning" },
  onboarding: { bg: "#8b5cf6", text: "#4c1d95", label: "Onboarding" },
};

export function HealthGauge({ health }: HealthGaugeProps) {
  const color = BAND_COLORS[health.band];
  const pct = Math.max(0, Math.min(100, health.composite));
  const trajectoryPct = Math.round(health.trajectory30d * 100);
  const trajectoryLabel = trajectoryPct > 5 ? "improving" : trajectoryPct < -5 ? "declining" : "stable";
  const trajectoryColor = trajectoryPct > 5 ? "#10b981" : trajectoryPct < -5 ? "#ef4444" : "#9ca3af";

  return (
    <div className="deck-card" style={{ padding: 28 }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">
            Composite Health
          </p>
          <p className="text-4xl font-black text-white leading-none mt-1" style={{ letterSpacing: "-0.03em" }}>
            {pct}
            <span className="text-base font-semibold text-[#6b7280] ml-1">/100</span>
          </p>
        </div>
        <div
          className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
          style={{ background: `${color.bg}22`, color: color.bg, border: `1px solid ${color.bg}66` }}
        >
          {color.label}
        </div>
      </div>

      <div className="h-2 rounded-full bg-[#1c1c1c] overflow-hidden mb-4">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: color.bg }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-[#6b7280]">30-day trajectory</span>
        <span style={{ color: trajectoryColor, fontWeight: 700 }}>
          {trajectoryPct > 0 ? "+" : ""}
          {trajectoryPct}% · {trajectoryLabel}
        </span>
      </div>

      <div className="mt-6 space-y-2">
        <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
          Top Drivers
        </p>
        {health.drivers.slice(0, 4).map((d) => {
          const driverColor =
            d.direction === "positive" ? "#10b981" : d.direction === "negative" ? "#ef4444" : "#9ca3af";
          return (
            <div key={d.name} className="flex items-center justify-between text-xs">
              <span className="text-[#d1d5db]">{d.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-[#9ca3af] tabular-nums">{d.value}</span>
                <span
                  className="tabular-nums font-semibold"
                  style={{ color: driverColor }}
                >
                  {d.contribution > 0 ? "+" : ""}
                  {d.contribution.toFixed(1)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
