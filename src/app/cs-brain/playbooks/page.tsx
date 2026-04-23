import Link from "next/link";
import { playbooks } from "@/lib/cs-brain/data";
import type { Playbook, InterventionOutcome } from "@/types/cs-brain";

function daysAgoLabel(ts: string): string {
  const days = Math.round((Date.now() - new Date(ts).getTime()) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function summarizeOutcomes(pb: Playbook) {
  const total = pb.outcomes.length;
  const accepted = pb.outcomes.filter((o) => o.result === "accepted").length;
  const partial = pb.outcomes.filter((o) => o.result === "partially_accepted").length;
  const winRate = total === 0 ? 0 : Math.round(((accepted + partial * 0.5) / total) * 100);
  const recovered = pb.outcomes.reduce((s, o) => s + o.recoveredValue, 0);
  return { total, accepted, partial, winRate, recovered };
}

const RESULT_COLOR: Record<InterventionOutcome, string> = {
  accepted: "#10b981",
  partially_accepted: "#ffa061",
  declined: "#ef4444",
  no_response: "#6b7280",
  pending: "#9ca3af",
};

export default function PlaybooksPage() {
  const totalOutcomes = playbooks.reduce((s, pb) => s + pb.outcomes.length, 0);
  const totalValue = playbooks.reduce(
    (s, pb) => s + pb.outcomes.reduce((v, o) => v + o.recoveredValue, 0),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#6b7280]">
        <Link href="/cs-brain" className="hover:text-[#ff6b1a] transition-colors">
          Merchant Compass
        </Link>
        <span>/</span>
        <span className="text-white">Playbooks</span>
      </div>

      {/* Header */}
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ff6b1a]/20 bg-[#ff6b1a]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ff6b1a] mb-3">
          Institutional Memory as Code
        </span>
        <h1 className="text-3xl font-black text-white" style={{ letterSpacing: "-0.02em" }}>
          Playbook Library
        </h1>
        <p className="mt-1 text-sm text-[#9ca3af] max-w-2xl">
          Every playbook here started as one CSM&apos;s judgment call. Now it&apos;s a trigger, a sequence, and a
          shared win-rate. New hires ramp by reading these. Outcomes feed back into the loop.
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="stat-label">Active Playbooks</p>
          <p className="stat-value">{playbooks.length}</p>
          <p className="stat-sub">Each with 3-4 steps</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Logged Outcomes</p>
          <p className="stat-value" style={{ color: "#ff6b1a" }}>
            {totalOutcomes}
          </p>
          <p className="stat-sub">Across last 120 days</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Value Preserved / Expanded</p>
          <p className="stat-value">${(totalValue / 1000).toFixed(0)}K</p>
          <p className="stat-sub">Attributed to these plays</p>
        </div>
      </div>

      {/* Playbook list */}
      <div className="space-y-5">
        {playbooks.map((pb) => {
          const sum = summarizeOutcomes(pb);
          return (
            <article key={pb.id} className="deck-card" style={{ padding: 32 }}>
              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff6b1a]">
                      {pb.id}
                    </span>
                    {pb.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[9px] px-2 py-0.5 rounded-full bg-[#1c1c1c] border border-[#3a3a3a] text-[#9ca3af] uppercase tracking-wider"
                      >
                        {t.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1" style={{ letterSpacing: "-0.015em" }}>
                    {pb.title}
                  </h2>
                  <p className="text-sm text-[#d1d5db] leading-relaxed max-w-2xl">{pb.triggerSummary}</p>
                  <p className="mt-2 text-[10px] text-[#6b7280] uppercase tracking-wider">
                    By {pb.createdBy} · updated {daysAgoLabel(pb.lastUpdated)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="text-3xl font-black text-[#ff6b1a] leading-none" style={{ letterSpacing: "-0.03em" }}>
                    {sum.winRate}%
                  </p>
                  <p className="text-[10px] text-[#6b7280] uppercase tracking-wider">Win rate</p>
                  <p className="text-xs text-[#9ca3af] mt-1">
                    ${(sum.recovered / 1000).toFixed(0)}K · {sum.total} outcomes
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
                {/* Trigger signals */}
                <div>
                  <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                    Trigger Signals
                  </p>
                  <ul className="space-y-1.5">
                    {pb.triggerSignals.map((t, i) => (
                      <li key={i} className="text-xs text-[#9ca3af] leading-relaxed flex gap-2">
                        <span className="text-[#ff6b1a] shrink-0">◆</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Steps */}
                <div>
                  <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                    Recommended Steps
                  </p>
                  <ol className="space-y-2">
                    {pb.recommendedSteps.map((step) => (
                      <li key={step.order} className="text-xs text-[#d1d5db] leading-relaxed">
                        <div className="flex items-start gap-2">
                          <span className="font-bold text-[#ff6b1a] shrink-0">{step.order}.</span>
                          <div>
                            <span className="font-semibold text-white uppercase tracking-wide text-[10px] mr-1">
                              {step.channel}
                            </span>
                            <span>{step.instruction}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Recent outcomes */}
              <div className="mt-5 pt-5 border-t border-[#262626]">
                <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider mb-3">
                  Recent Outcomes
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {pb.outcomes.slice(0, 4).map((o) => (
                    <div
                      key={o.id}
                      className="flex items-start gap-2 p-2.5 rounded bg-[#1c1c1c]/50 border border-[#262626]"
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: RESULT_COLOR[o.result] }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/cs-brain/merchant/${o.merchantId}`}
                            className="text-xs font-semibold text-white hover:text-[#ff6b1a]"
                          >
                            {o.merchantName}
                          </Link>
                          <span
                            className="text-[9px] uppercase tracking-wider font-bold"
                            style={{ color: RESULT_COLOR[o.result] }}
                          >
                            {o.result.replace(/_/g, " ")}
                          </span>
                          {o.recoveredValue > 0 && (
                            <span className="text-[10px] text-[#10b981] font-semibold ml-auto tabular-nums">
                              +${(o.recoveredValue / 1000).toFixed(0)}K
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#9ca3af] leading-snug mt-0.5 line-clamp-1">
                          {o.notes}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
