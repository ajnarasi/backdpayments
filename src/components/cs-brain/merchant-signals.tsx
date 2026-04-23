import type { Buyer } from "@/types";
import type { SupportTicket, CSMAction, ExpansionSignal } from "@/types/cs-brain";

interface MerchantSignalsProps {
  buyer: Buyer;
  tickets: SupportTicket[];
  actions: CSMAction[];
  expansion: ExpansionSignal | undefined;
}

function daysAgoLabel(ts: string): string {
  const days = Math.round((Date.now() - new Date(ts).getTime()) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "1d ago";
  return `${days}d ago`;
}

const SEVERITY_COLOR: Record<SupportTicket["severity"], string> = {
  low: "#9ca3af",
  medium: "#ffa061",
  high: "#f59e0b",
  critical: "#ef4444",
};

const OUTCOME_COLOR: Record<CSMAction["outcome"], string> = {
  accepted: "#10b981",
  partially_accepted: "#ffa061",
  declined: "#ef4444",
  no_response: "#6b7280",
  pending: "#9ca3af",
};

export function MerchantSignals({ buyer, tickets, actions, expansion }: MerchantSignalsProps) {
  const openTickets = tickets.filter((t) => !t.resolvedAt);

  return (
    <div className="space-y-4">
      {/* Payment & Usage row */}
      <div className="deck-card" style={{ padding: 24 }}>
        <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider mb-3">
          Payment & Usage
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <SignalRow label="On-time rate" value={`${Math.round(buyer.onTimeRate * 100)}%`} band={buyer.onTimeRate >= 0.85 ? "good" : buyer.onTimeRate >= 0.6 ? "neutral" : "bad"} />
          <SignalRow label="Payment velocity" value={`${buyer.paymentVelocity}d`} band={buyer.paymentVelocity <= 30 ? "good" : buyer.paymentVelocity <= 45 ? "neutral" : "bad"} />
          <SignalRow label="Order freq trend" value={`${buyer.orderFrequencyTrend > 0 ? "+" : ""}${(buyer.orderFrequencyTrend * 100).toFixed(0)}%`} band={buyer.orderFrequencyTrend > 0 ? "good" : buyer.orderFrequencyTrend > -0.2 ? "neutral" : "bad"} />
          <SignalRow label="Dispute rate" value={`${(buyer.disputeRate * 100).toFixed(1)}%`} band={buyer.disputeRate < 0.05 ? "good" : buyer.disputeRate < 0.1 ? "neutral" : "bad"} />
          <SignalRow label="Connected sellers" value={String(buyer.connectedSellers.length)} band={buyer.connectedSellers.length >= 3 ? "good" : buyer.connectedSellers.length >= 2 ? "neutral" : "bad"} />
          <SignalRow label="Days since last order" value={`${buyer.daysSinceLastOrder}d`} band={buyer.daysSinceLastOrder <= 15 ? "good" : buyer.daysSinceLastOrder <= 45 ? "neutral" : "bad"} />
        </div>
      </div>

      {/* Expansion signal */}
      {expansion && (
        <div className="deck-card green" style={{ padding: 24 }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-[#ff6b1a] uppercase tracking-wider">
              Expansion Signal
            </p>
            <span className="text-xs text-[#9ca3af]">
              {Math.round(expansion.confidence * 100)}% confidence
            </span>
          </div>
          <p className="text-lg font-bold text-white mb-1" style={{ letterSpacing: "-0.015em" }}>
            {expansion.offerType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </p>
          <p className="text-2xl font-black text-[#ff6b1a] mb-3" style={{ letterSpacing: "-0.03em" }}>
            +${expansion.projectedLift.toLocaleString()}
            <span className="text-sm font-semibold text-[#9ca3af] ml-2">projected annual lift</span>
          </p>
          <p className="text-sm text-[#d1d5db] leading-relaxed mb-3">{expansion.rationale}</p>
          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">
              Required Actions
            </p>
            {expansion.requiredActions.map((a, i) => (
              <p key={i} className="text-xs text-[#9ca3af]">
                <span className="text-[#ff6b1a] mr-2">→</span>
                {a}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Tickets */}
      <div className="deck-card" style={{ padding: 24 }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">
            Support Tickets
          </p>
          <span className="text-xs text-[#9ca3af]">
            {openTickets.length} open · {tickets.length} total
          </span>
        </div>
        {tickets.length === 0 ? (
          <p className="text-sm text-[#6b7280]">No tickets in the last 90 days.</p>
        ) : (
          <div className="space-y-3">
            {tickets.slice(0, 5).map((t) => (
              <div key={t.id} className="flex gap-3 border-l-2 pl-3" style={{ borderColor: SEVERITY_COLOR[t.severity] }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider"
                      style={{ color: SEVERITY_COLOR[t.severity] }}
                    >
                      {t.severity}
                    </span>
                    <span className="text-[9px] text-[#6b7280] uppercase tracking-wider">{t.category}</span>
                    <span className="text-[9px] text-[#6b7280] ml-auto">
                      {t.resolvedAt ? "resolved" : "open"} · {daysAgoLabel(t.openedAt)}
                    </span>
                  </div>
                  <p className="text-sm text-white font-medium leading-snug">{t.subject}</p>
                  <p className="text-xs text-[#9ca3af] leading-relaxed mt-1 line-clamp-2">{t.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CSM actions */}
      <div className="deck-card" style={{ padding: 24 }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">
            CSM Action Log (90d)
          </p>
          <span className="text-xs text-[#9ca3af]">{actions.length} touchpoints</span>
        </div>
        {actions.length === 0 ? (
          <p className="text-sm text-[#6b7280]">No CSM actions logged yet.</p>
        ) : (
          <div className="space-y-2">
            {actions.slice(0, 6).map((a) => (
              <div key={a.id} className="flex items-start gap-3 py-1.5">
                <span
                  className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: OUTCOME_COLOR[a.outcome] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#d1d5db]">
                      {a.channel}
                    </span>
                    <span className="text-[9px] text-[#6b7280]">by {a.csm}</span>
                    {a.isAgentSuggested && (
                      <span className="text-[9px] font-semibold text-[#ff6b1a]">• agent-suggested</span>
                    )}
                    <span className="ml-auto text-[9px] text-[#6b7280]">{daysAgoLabel(a.timestamp)}</span>
                  </div>
                  <p className="text-xs text-[#d1d5db] leading-snug mt-0.5">{a.summary}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SignalRow({ label, value, band }: { label: string; value: string; band: "good" | "neutral" | "bad" }) {
  const color = band === "good" ? "#10b981" : band === "bad" ? "#ef4444" : "#9ca3af";
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[#6b7280]">{label}</span>
      <span className="text-sm font-semibold tabular-nums" style={{ color }}>
        {value}
      </span>
    </div>
  );
}
