import Link from "next/link";
import { loopStats } from "@/lib/cs-brain/data";

const STAGES = [
  {
    id: "ingest",
    title: "Ingest",
    subtitle: "Signals flow in",
    body:
      "Every support ticket, webhook event, invoice state change, and CSM note streams into the merchant's Second Brain entity page.",
    color: "#8b5cf6",
  },
  {
    id: "compile",
    title: "Compile",
    subtitle: "Entity page updates",
    body:
      "Signals are synthesized into TLDR, jobs-to-be-done, language-that-lands, contradictions. The page stays queryable in 60 seconds.",
    color: "#3b82f6",
  },
  {
    id: "act",
    title: "Act",
    subtitle: "Agent recommends",
    body:
      "Next-best-action is generated — channel, tone, script, timing. CSM reviews, adjusts, and executes. Playbook ID tags the intervention.",
    color: "#ff6b1a",
  },
  {
    id: "observe",
    title: "Observe",
    subtitle: "Outcome logged",
    body:
      "Result is captured — accepted, partial, declined, no-response. Outcome attaches to the merchant, to the playbook, and to the prompt variant used.",
    color: "#f59e0b",
  },
  {
    id: "feedback",
    title: "Feedback",
    subtitle: "Loop closes",
    body:
      "Outcomes train the next cycle — prompt variants are re-weighted, playbook win-rates update, new patterns get named. Every cycle, acceptance goes up.",
    color: "#10b981",
  },
];

export default function KarpathyLoopPage() {
  const latest = loopStats.cycles[loopStats.cycles.length - 1];
  const baseline = loopStats.cycles[0];
  const acceptancePts = ((latest.acceptanceRate - baseline.acceptanceRate) * 100).toFixed(1);
  const accuracyPts = ((latest.promptAccuracyScore - baseline.promptAccuracyScore) * 100).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#6b7280]">
        <Link href="/cs-brain" className="hover:text-[#ff6b1a] transition-colors">
          Merchant Compass
        </Link>
        <span>/</span>
        <span className="text-white">Karpathy Loop</span>
      </div>

      {/* Hero */}
      <header>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ff6b1a]/20 bg-[#ff6b1a]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ff6b1a] mb-4">
          The Compounding Moat
        </span>
        <h1 className="deck-h1" style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)" }}>
          Capital doesn&apos;t compound.
          <br />
          <span style={{ color: "#ff6b1a" }}>Intelligence does.</span>
        </h1>
        <div className="gradient-bar wide" />
        <p className="text-lg text-[#9ca3af] leading-relaxed max-w-3xl">
          Merchant Compass runs on Karpathy&apos;s loop. Every CS intervention — from a payment-plan call to a
          QBR — becomes a training example that improves the next recommendation. A competitor with $100M in
          capital still starts at cycle 0. Backd is on cycle {loopStats.currentCycle}.
        </p>
      </header>

      {/* Flywheel visual (SVG) */}
      <section className="deck-card" style={{ padding: 48 }}>
        <div className="flex items-center justify-center">
          <svg viewBox="0 0 840 420" className="w-full max-w-4xl h-auto" role="img" aria-label="Karpathy loop flywheel">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" fill="#ff6b1a" />
              </marker>
            </defs>
            {/* Stages arranged in a pentagon/arc */}
            {STAGES.map((stage, i) => {
              const angle = (i / STAGES.length) * Math.PI * 2 - Math.PI / 2;
              const cx = 420 + Math.cos(angle) * 170;
              const cy = 210 + Math.sin(angle) * 150;
              return (
                <g key={stage.id}>
                  <circle cx={cx} cy={cy} r={56} fill="#161616" stroke={stage.color} strokeWidth={2} />
                  <text x={cx} y={cy - 8} textAnchor="middle" fill={stage.color} fontSize={13} fontWeight="800" letterSpacing="0.1em">
                    {stage.title.toUpperCase()}
                  </text>
                  <text x={cx} y={cy + 10} textAnchor="middle" fill="#9ca3af" fontSize={10}>
                    {stage.subtitle}
                  </text>
                </g>
              );
            })}
            {/* Arc connectors */}
            {STAGES.map((_, i) => {
              const a1 = (i / STAGES.length) * Math.PI * 2 - Math.PI / 2;
              const a2 = ((i + 1) / STAGES.length) * Math.PI * 2 - Math.PI / 2;
              const x1 = 420 + Math.cos(a1) * 170;
              const y1 = 210 + Math.sin(a1) * 150;
              const x2 = 420 + Math.cos(a2) * 170;
              const y2 = 210 + Math.sin(a2) * 150;
              // Pull slightly inward for curve handle
              const mid = 420 + Math.cos((a1 + a2) / 2) * 110;
              const midY = 210 + Math.sin((a1 + a2) / 2) * 95;
              return (
                <path
                  key={`arc-${i}`}
                  d={`M ${x1} ${y1} Q ${mid} ${midY} ${x2} ${y2}`}
                  fill="none"
                  stroke="#ff6b1a"
                  strokeWidth={2}
                  strokeDasharray="6 6"
                  markerEnd="url(#arrow)"
                  opacity={0.7}
                />
              );
            })}
            {/* Center label */}
            <text x={420} y={205} textAnchor="middle" fill="#fafafa" fontSize={18} fontWeight="900" letterSpacing="-0.02em">
              Cycle {loopStats.currentCycle}
            </text>
            <text x={420} y={228} textAnchor="middle" fill="#6b7280" fontSize={11}>
              {loopStats.totalInterventions} interventions
            </text>
          </svg>
        </div>

        {/* Stage detail cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-8">
          {STAGES.map((s) => (
            <div
              key={s.id}
              className="p-3 rounded-lg bg-[#0e0e0e]/50 border"
              style={{ borderColor: `${s.color}44` }}
            >
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: s.color }}>
                {s.title}
              </p>
              <p className="text-xs text-[#d1d5db] leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Telemetry: cycles */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-2" style={{ letterSpacing: "-0.015em" }}>
          Cycle Telemetry
        </h2>
        <p className="text-sm text-[#9ca3af] max-w-2xl mb-6">
          Six cycles to date. Acceptance is up +{acceptancePts} pts. Agent prompt accuracy is up +{accuracyPts} pts.
          Every cycle made the next CSM ramp faster.
        </p>

        <div className="deck-card" style={{ padding: 32 }}>
          <div className="space-y-5">
            {loopStats.cycles.map((c) => (
              <div key={c.id} className="pb-5 border-b border-[#262626] last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#6b7280]">C{c.cycle}</span>
                    <span className="text-sm font-bold text-white">
                      {new Date(c.timestamp).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#9ca3af]">
                    <span>
                      <span className="text-[#6b7280]">Interventions</span>{" "}
                      <span className="text-white font-semibold tabular-nums">{c.interventionsCount}</span>
                    </span>
                    <span>
                      <span className="text-[#6b7280]">Acceptance</span>{" "}
                      <span className="text-[#ff6b1a] font-semibold tabular-nums">
                        {Math.round(c.acceptanceRate * 100)}%
                      </span>
                    </span>
                    <span>
                      <span className="text-[#6b7280]">Time-to-outcome</span>{" "}
                      <span className="text-white font-semibold tabular-nums">{c.avgTimeToOutcomeHrs}h</span>
                    </span>
                    <span>
                      <span className="text-[#6b7280]">Prompt acc</span>{" "}
                      <span className="text-[#10b981] font-semibold tabular-nums">
                        {Math.round(c.promptAccuracyScore * 100)}%
                      </span>
                    </span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-[#1c1c1c] overflow-hidden mb-2">
                  <div
                    className="h-full bg-[#ff6b1a]"
                    style={{ width: `${c.acceptanceRate * 100}%` }}
                  />
                </div>
                <p className="text-xs text-[#d1d5db] leading-relaxed">
                  <span className="text-[#ff6b1a] font-semibold">Learning:</span>{" "}
                  {c.notableLearnings.join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing narrative */}
      <section className="deck-card green" style={{ padding: 40 }}>
        <p className="text-[10px] font-semibold text-[#ff6b1a] uppercase tracking-wider mb-3">
          Why This Matters to Customer Success
        </p>
        <h3 className="deck-h3 mb-4">
          Every call a CSM makes gets encoded.
          <br />
          Every outcome re-weights the agent.
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-[#d1d5db] leading-relaxed">
              A new CSM hire doesn&apos;t need 3 months to learn your book — they read the Second Brain for
              each at-risk merchant and get the same context a senior CSM would build in a week.
            </p>
          </div>
          <div>
            <p className="text-sm text-[#d1d5db] leading-relaxed">
              A senior CSM&apos;s judgment doesn&apos;t disappear when they leave. It&apos;s in the playbook
              library, it&apos;s in the language-that-lands signals, it&apos;s in the agent prompt.
            </p>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Link
            href="/cs-brain"
            className="px-4 py-2 rounded-lg bg-[#ff6b1a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#ff7f33] transition-colors"
          >
            Back to Compass
          </Link>
          <Link
            href="/cs-brain/playbooks"
            className="px-4 py-2 rounded-lg bg-[#1c1c1c] border border-[#3a3a3a] text-[#d1d5db] text-xs font-bold uppercase tracking-wider hover:border-[#ff6b1a]/40"
          >
            See Playbooks
          </Link>
        </div>
      </section>
    </div>
  );
}
