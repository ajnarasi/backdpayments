import Link from "next/link";
import {
  csDashboardData,
  SHOWCASE_MERCHANT_IDS,
  resolveMerchantName,
} from "@/lib/cs-brain/data";
import { buyers } from "@/lib/data";
import { SegmentCard } from "@/components/cs-brain/segment-card";
import { AgentQueue } from "@/components/cs-brain/agent-queue";
import { LoopMeter } from "@/components/cs-brain/loop-meter";

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export default function CSBrainDashboardPage() {
  const showcase = SHOWCASE_MERCHANT_IDS.map((id) => buyers.find((b) => b.id === id)).filter(
    (b): b is NonNullable<typeof b> => !!b,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ff6b1a]/20 bg-[#ff6b1a]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ff6b1a] mb-3">
            Merchant Compass · CS Second Brain
          </span>
          <h1 className="text-3xl font-black text-white" style={{ letterSpacing: "-0.02em" }}>
            Customer Success Operating Layer
          </h1>
          <p className="mt-1 text-sm text-[#9ca3af] max-w-2xl">
            An AI-compiled view of every merchant — health, jobs-to-be-done, next-best action — that ramps a new
            CSM in 10 minutes and compounds institutional memory with every outcome.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link
            href="/cs-brain/why"
            className="px-4 py-2 rounded-lg bg-[#1c1c1c] border border-[#3a3a3a] text-[#d1d5db] text-xs font-bold uppercase tracking-wider hover:border-[#ff6b1a]/40 transition-colors"
          >
            Why Compass
          </Link>
          <Link
            href="/cs-brain/playbooks"
            className="px-4 py-2 rounded-lg bg-[#1c1c1c] border border-[#3a3a3a] text-[#d1d5db] text-xs font-bold uppercase tracking-wider hover:border-[#ff6b1a]/40 transition-colors"
          >
            Playbooks
          </Link>
          <Link
            href="/cs-brain/loop"
            className="px-4 py-2 rounded-lg bg-[#ff6b1a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#ff7f33] transition-colors"
          >
            Karpathy Loop
          </Link>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Open Tickets"
          value={String(csDashboardData.ticketsOpen)}
          sub="Across all merchants"
        />
        <KpiCard
          label="QBRs Due (30d)"
          value={String(csDashboardData.qbrsDueNext30Days)}
          sub="Healthy merchants"
          accent
        />
        <KpiCard
          label="Expansion Opps"
          value={String(csDashboardData.expansionOpportunities)}
          sub="Network-validated"
        />
        <KpiCard
          label="Expansion Value"
          value={formatMoney(csDashboardData.expansionValue)}
          sub="Projected annual lift"
          accent
        />
      </div>

      {/* Segment lenses */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#d1d5db] uppercase tracking-wider">Book Health</h2>
          <span className="text-xs text-[#6b7280]">Segment lenses · click to drill in</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {csDashboardData.segments.map((seg) => (
            <SegmentCard key={seg.segment} segment={seg} />
          ))}
        </div>
      </section>

      {/* Main row: Agent queue + loop meter + ramp widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <AgentQueue items={csDashboardData.agentQueue} limit={10} />
        </div>
        <div className="space-y-5">
          <LoopMeter stats={csDashboardData.loopStats} />

          <div className="deck-card" style={{ padding: 24, borderLeft: "3px solid #8b5cf6" }}>
            <p className="text-[10px] font-semibold text-[#8b5cf6] uppercase tracking-wider mb-2">
              Ramp in 10 Minutes
            </p>
            <p className="text-sm text-[#d1d5db] leading-relaxed mb-3">
              A new CSM joining Monday? Walk this path:
            </p>
            <ol className="space-y-2 text-xs text-[#9ca3af]">
              <li className="flex gap-2">
                <span className="text-[#8b5cf6] font-bold">1.</span>
                <span>Read the top 3 playbooks in <Link href="/cs-brain/playbooks" className="text-[#ff6b1a] hover:underline">Playbook Library</Link>.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#8b5cf6] font-bold">2.</span>
                <span>Open any merchant in the agent queue — every Second Brain page is a ramp document.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#8b5cf6] font-bold">3.</span>
                <span>Take the first recommended action. Log outcome. The <Link href="/cs-brain/loop" className="text-[#ff6b1a] hover:underline">Karpathy loop</Link> teaches the agent from your call.</span>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Showcase merchants — direct-click entry points for the demo path */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#d1d5db] uppercase tracking-wider">
            Showcase Merchants
          </h2>
          <span className="text-xs text-[#6b7280]">Start here for a guided demo</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {showcase.map((b, i) => (
            <Link
              key={b.id}
              href={`/cs-brain/merchant/${b.id}`}
              className="deck-card block no-underline hover:border-[#ff6b1a]/40 transition-colors"
              style={{ padding: 24 }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#ff6b1a] mb-2">
                Scenario {i + 1}
              </p>
              <h3 className="text-lg font-bold text-white mb-1" style={{ letterSpacing: "-0.015em" }}>
                {resolveMerchantName(b.id, b.companyName)}
              </h3>
              <p className="text-xs text-[#9ca3af] leading-relaxed mb-3">
                {b.id === "buyer-150"
                  ? "Expansion-ready. 3 sellers on time, healthy cadence, ready for limit increase."
                  : b.id === "buyer-175"
                    ? "At risk — mid-rescue. 2 of 3 installments paid, macro stress, early stabilization."
                    : "Critical. 91d overdue, active dispute, human-plus-legal path."}
              </p>
              <p className="text-xs text-[#6b7280]">
                {b.industry.replace(/_/g, " ")} · {b.city}, {b.state}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function KpiCard({
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
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p
        className="stat-value"
        style={{ color: accent ? "#ff6b1a" : "#fafafa" }}
      >
        {value}
      </p>
      <p className="stat-sub">{sub}</p>
    </div>
  );
}
