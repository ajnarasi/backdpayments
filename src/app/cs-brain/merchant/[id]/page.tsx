import Link from "next/link";
import { notFound } from "next/navigation";
import { buyers, sellers } from "@/lib/data";
import {
  getHealthScore,
  getMerchantTickets,
  getMerchantActions,
  getMerchantExpansion,
  getMerchantInvoicesSummary,
  resolveMerchantName,
  SHOWCASE_MERCHANT_IDS,
} from "@/lib/cs-brain/data";
import { HealthGauge } from "@/components/cs-brain/health-gauge";
import { MerchantBriefPanel } from "@/components/cs-brain/merchant-brief-panel";
import { MerchantSignals } from "@/components/cs-brain/merchant-signals";

export function generateStaticParams() {
  // Pre-render showcase merchants + a small slice for fast navigation.
  const ids = new Set<string>(SHOWCASE_MERCHANT_IDS);
  for (const b of buyers.slice(0, 24)) ids.add(b.id);
  return Array.from(ids).map((id) => ({ id }));
}

export default async function MerchantBrainPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const buyer = buyers.find((b) => b.id === id);
  if (!buyer) notFound();
  const merchantName = resolveMerchantName(id, buyer.companyName);

  const health = getHealthScore(id);
  const tickets = getMerchantTickets(id);
  const actions = getMerchantActions(id);
  const expansion = getMerchantExpansion(id);
  const invSummary = getMerchantInvoicesSummary(id);
  const connectedSellerNames = buyer.connectedSellers
    .map((sid) => sellers.find((s) => s.id === sid)?.name)
    .filter(Boolean)
    .slice(0, 4) as string[];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#6b7280]">
        <Link href="/cs-brain" className="hover:text-[#ff6b1a] transition-colors">
          Merchant Compass
        </Link>
        <span>/</span>
        <span className="text-[#9ca3af]">Merchant</span>
        <span>/</span>
        <span className="text-white">{merchantName}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ff6b1a]/20 bg-[#ff6b1a]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ff6b1a] mb-3">
            CS Second Brain
          </span>
          <h1 className="text-3xl font-black text-white" style={{ letterSpacing: "-0.02em" }}>
            {merchantName}
          </h1>
          <p className="mt-1 text-sm text-[#9ca3af]">
            {buyer.industry.replace(/_/g, " ")} · {buyer.city}, {buyer.state} · {buyer.totalOrders} lifetime orders · ${buyer.currentExposure.toLocaleString()} exposure / ${buyer.creditLimit.toLocaleString()} limit
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/cs-brain/qbr/${id}`}
            className="px-4 py-2 rounded-lg bg-[#ff6b1a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#ff7f33] transition-colors"
          >
            Generate QBR
          </Link>
          <Link
            href={`/collections/${id}`}
            className="px-4 py-2 rounded-lg bg-[#1c1c1c] border border-[#3a3a3a] text-[#d1d5db] text-xs font-bold uppercase tracking-wider hover:border-[#ff6b1a]/40 transition-colors"
          >
            Collections View →
          </Link>
        </div>
      </div>

      {/* Main grid: 2 cols — left is brief + signals; right is health + invoice stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left two-thirds */}
        <div className="lg:col-span-2 space-y-5">
          <MerchantBriefPanel merchantId={id} merchantName={merchantName} />
          <MerchantSignals
            buyer={buyer}
            tickets={tickets}
            actions={actions}
            expansion={expansion}
          />
        </div>

        {/* Right third */}
        <div className="space-y-5">
          {health && <HealthGauge health={health} />}

          <div className="deck-card" style={{ padding: 24 }}>
            <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider mb-3">
              Invoice Book
            </p>
            <div className="space-y-2.5">
              <Stat label="Total" value={String(invSummary.total)} />
              <Stat label="Paid" value={String(invSummary.paid)} color="#10b981" />
              <Stat label="Overdue / Defaulted" value={String(invSummary.overdue)} color={invSummary.overdue > 0 ? "#f59e0b" : undefined} />
            </div>
          </div>

          <div className="deck-card" style={{ padding: 24 }}>
            <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider mb-3">
              Network Position
            </p>
            {connectedSellerNames.length === 0 ? (
              <p className="text-sm text-[#6b7280]">No connected sellers.</p>
            ) : (
              <ul className="space-y-1.5">
                {connectedSellerNames.map((name, i) => (
                  <li key={i} className="text-sm text-[#d1d5db] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b1a]" />
                    {name}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-xs text-[#6b7280] leading-relaxed">
              {buyer.connectedSellers.length >= 3
                ? "Network breadth validates credit beyond individual scoring."
                : buyer.connectedSellers.length === 1
                  ? "Single-seller dependency — diversification opportunity."
                  : "Limited network — monitor for expansion signals."}
            </p>
          </div>

          <div className="deck-card" style={{ padding: 24 }}>
            <p className="text-[10px] font-semibold text-[#ff6b1a] uppercase tracking-wider mb-3">
              Karpathy Loop
            </p>
            <p className="text-xs text-[#9ca3af] leading-relaxed">
              Each intervention you log feeds back into the agent&apos;s next recommendation. This page is the
              &ldquo;entity&rdquo; in the Second Brain — outcomes compile, patterns compound, ramp time shrinks.
            </p>
            <Link
              href="/cs-brain/loop"
              className="mt-3 inline-block text-xs text-[#ff6b1a] font-semibold hover:underline"
            >
              See loop telemetry →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[#6b7280]">{label}</span>
      <span
        className="text-lg font-bold tabular-nums"
        style={{ color: color ?? "#fafafa" }}
      >
        {value}
      </span>
    </div>
  );
}
