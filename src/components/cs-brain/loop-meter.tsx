import Link from "next/link";
import type { LoopStats } from "@/types/cs-brain";

interface LoopMeterProps {
  stats: LoopStats;
  compact?: boolean;
}

export function LoopMeter({ stats, compact = false }: LoopMeterProps) {
  const latest = stats.cycles[stats.cycles.length - 1];
  const baseline = stats.cycles[0];
  const acceptanceDelta = ((latest.acceptanceRate - baseline.acceptanceRate) * 100).toFixed(1);
  const accuracyDelta = ((latest.promptAccuracyScore - baseline.promptAccuracyScore) * 100).toFixed(1);

  return (
    <div className="deck-card" style={{ padding: compact ? 20 : 28, borderLeft: "3px solid #ff6b1a" }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-semibold text-[#ff6b1a] uppercase tracking-wider">
          Karpathy Loop · Cycle {stats.currentCycle}
        </p>
        <span className="text-[9px] text-[#6b7280] uppercase tracking-wider">Telemetry preview</span>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-3">
        <Metric
          label="Interventions"
          value={stats.totalInterventions.toString()}
          sub={`last ${stats.currentCycle} cycles`}
        />
        <Metric
          label="Acceptance"
          value={`${Math.round(stats.cumulativeAcceptance * 100)}%`}
          sub={`+${acceptanceDelta} pts vs baseline`}
          accent
        />
        <Metric
          label="Prompt Δ"
          value={`+${accuracyDelta} pts`}
          sub="agent quality gain"
        />
      </div>
      {!compact && (
        <>
          <div className="mt-5 space-y-2">
            {stats.cycles.map((c) => (
              <div key={c.id} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-mono text-[#6b7280]">C{c.cycle}</span>
                <div className="flex-1 h-1.5 rounded-full bg-[#1c1c1c] overflow-hidden">
                  <div
                    className="h-full bg-[#ff6b1a] transition-all"
                    style={{ width: `${c.acceptanceRate * 100}%` }}
                  />
                </div>
                <span className="w-12 text-right text-[#d1d5db] tabular-nums">
                  {Math.round(c.acceptanceRate * 100)}%
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/cs-brain/loop"
            className="mt-4 inline-block text-xs text-[#ff6b1a] font-semibold hover:underline"
          >
            See full loop telemetry →
          </Link>
        </>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="text-[9px] font-semibold text-[#6b7280] uppercase tracking-wider mb-1">
        {label}
      </p>
      <p
        className="text-2xl font-black leading-none tabular-nums"
        style={{ color: accent ? "#ff6b1a" : "#fafafa", letterSpacing: "-0.025em" }}
      >
        {value}
      </p>
      <p className="text-[10px] text-[#6b7280] mt-1">{sub}</p>
    </div>
  );
}
