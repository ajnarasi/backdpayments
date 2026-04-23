import { NextRequest } from "next/server";
import { buyers, invoices, collectionCases } from "@/lib/data";
import {
  getHealthScore,
  getMerchantTickets,
  getMerchantActions,
  getMerchantExpansion,
} from "@/lib/cs-brain/data";
import type { QBRDeck, QBRSection } from "@/types/cs-brain";

// Deterministic QBR composition. Template + merchant-specific signal fills.
// No Claude call — the deck is composed from structured data the CSM can trust.

interface RequestBody {
  merchantId: string;
}

export async function POST(request: NextRequest) {
  try {
    const { merchantId } = (await request.json()) as RequestBody;
    if (!merchantId) {
      return Response.json({ error: "merchantId is required" }, { status: 400 });
    }
    const buyer = buyers.find((b) => b.id === merchantId);
    if (!buyer) {
      return Response.json({ error: "merchant not found" }, { status: 404 });
    }

    const health = getHealthScore(merchantId);
    const tickets = getMerchantTickets(merchantId);
    const actions = getMerchantActions(merchantId);
    const expansion = getMerchantExpansion(merchantId);
    const merchantInvoices = invoices.filter((i) => i.buyerId === merchantId);
    const paidInvoices = merchantInvoices.filter((i) => i.status === "paid");
    const overdueInvoices = merchantInvoices.filter(
      (i) => i.status === "overdue" || i.status === "defaulted",
    );
    const cases = collectionCases.filter((c) => c.buyerId === merchantId);
    const resolvedCases = cases.filter((c) => c.isResolved);

    const totalVolume = merchantInvoices.reduce((s, i) => s + i.amount, 0);
    const paidVolume = paidInvoices.reduce((s, i) => s + i.paidAmount, 0);
    const overdueVolume = overdueInvoices.reduce((s, i) => s + i.amount, 0);
    const supportVolume = tickets.length;
    const openEscalations = tickets.filter(
      (t) => !t.resolvedAt && (t.severity === "high" || t.severity === "critical"),
    ).length;

    const quarter = quarterLabel();
    const sections: QBRSection[] = [
      {
        id: "snapshot",
        title: "Quarter Snapshot",
        kicker: quarter,
        body: `${buyer.companyName} processed $${formatMoney(totalVolume)} in invoice volume across ${merchantInvoices.length} invoices and ${buyer.connectedSellers.length} Backd sellers. Current composite health: ${health?.composite ?? "n/a"}/100 (${health?.band ?? "n/a"}).`,
        bullets: [
          `Payment velocity: ${buyer.paymentVelocity} days (target 30)`,
          `On-time rate: ${Math.round(buyer.onTimeRate * 100)}% (${buyer.onTimeRate >= 0.85 ? "above" : buyer.onTimeRate >= 0.6 ? "at" : "below"} target)`,
          `Order frequency trend: ${(buyer.orderFrequencyTrend * 100).toFixed(0)}%`,
          `Connected sellers: ${buyer.connectedSellers.length}`,
        ],
        stat: {
          label: "Quarter Volume",
          value: `$${formatMoney(totalVolume)}`,
          delta: totalVolume > 0 ? `${merchantInvoices.length} invoices` : undefined,
        },
      },
      {
        id: "wins",
        title: "What Went Right",
        kicker: "Wins",
        body: `Your engagement with our CS team translated to ${resolvedCases.length} fully resolved cases and ${paidInvoices.length} paid invoices totaling $${formatMoney(paidVolume)}.`,
        bullets: buildWinsBullets(buyer, resolvedCases.length, actions.length, supportVolume - openEscalations),
        stat: {
          label: "Paid Volume",
          value: `$${formatMoney(paidVolume)}`,
          delta: paidInvoices.length > 0 ? `${paidInvoices.length} invoices` : undefined,
        },
      },
      {
        id: "friction",
        title: "Where We Lost Time",
        kicker: "Friction",
        body: openEscalations > 0
          ? `${openEscalations} escalated ticket${openEscalations === 1 ? " is" : "s are"} still open. That's the single biggest drag on your experience right now.`
          : `Friction was minimal this quarter — no open escalations. A few integration questions surfaced and were resolved within SLA.`,
        bullets: buildFrictionBullets(tickets, overdueInvoices.length, buyer.disputeRate),
        stat: {
          label: "Open Escalations",
          value: `${openEscalations}`,
          delta: openEscalations === 0 ? "clean" : "needs attention",
        },
      },
      {
        id: "expansion",
        title: expansion ? "Recommended Expansion" : "Steady-State Plan",
        kicker: expansion ? "Upside" : "Plan",
        body: expansion
          ? `Based on your cross-network payment behavior — ${buyer.connectedSellers.length} sellers on time, composite ${health?.composite}/100 — we're recommending a ${expansion.offerType.replace(/_/g, " ")} worth ~$${formatMoney(expansion.projectedLift)} in projected annual lift.`
          : `Maintain current cadence. Next scheduled QBR in 90 days; we'll re-evaluate expansion candidacy at that point.`,
        bullets: expansion
          ? [
              expansion.rationale,
              ...expansion.requiredActions.map((a) => `Required: ${a}`),
              `Confidence: ${Math.round(expansion.confidence * 100)}%`,
            ]
          : [
              "Keep invoice cadence consistent",
              "Close any open tickets within SLA",
              "Flag any planned volume changes early so we can pre-approve limit adjustments",
            ],
        stat: expansion
          ? {
              label: "Projected Lift",
              value: `$${formatMoney(expansion.projectedLift)}`,
              delta: `${Math.round(expansion.confidence * 100)}% confidence`,
            }
          : {
              label: "Next QBR",
              value: "90 days",
            },
      },
      {
        id: "next",
        title: "Commitments — Next 90 Days",
        kicker: "Plan",
        body: `Clear ownership on each side. Review at next QBR cycle.`,
        bullets: buildCommitments(buyer, !!expansion, openEscalations),
      },
    ];

    const deck: QBRDeck = {
      merchantId,
      merchantName: buyer.companyName,
      quarter,
      generatedAt: new Date().toISOString(),
      sections,
      isLive: true,
    };
    return Response.json(deck);
  } catch (error) {
    console.error("qbr compose error:", error);
    return Response.json({ error: "qbr generation failed" }, { status: 500 });
  }
}

function quarterLabel(): string {
  const now = new Date();
  const q = Math.floor(now.getMonth() / 3) + 1;
  return `Q${q} ${now.getFullYear()}`;
}

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n.toFixed(0)}`;
}

function buildWinsBullets(
  buyer: NonNullable<ReturnType<typeof buyers.find>>,
  resolvedCases: number,
  actionCount: number,
  resolvedTickets: number,
): string[] {
  const base: string[] = [];
  if (resolvedCases > 0) base.push(`${resolvedCases} collection case${resolvedCases === 1 ? "" : "s"} resolved without default`);
  if (resolvedTickets > 0) base.push(`${resolvedTickets} support ticket${resolvedTickets === 1 ? "" : "s"} resolved within SLA`);
  if (actionCount > 0) base.push(`${actionCount} CSM touchpoint${actionCount === 1 ? "" : "s"} in the last 90 days`);
  if (buyer.onTimeRate >= 0.85) base.push(`On-time rate ${Math.round(buyer.onTimeRate * 100)}% — above healthy threshold`);
  if (buyer.orderFrequencyTrend > 0) base.push(`Order frequency trending +${(buyer.orderFrequencyTrend * 100).toFixed(0)}%`);
  if (base.length === 0) base.push("Stable operating rhythm with no major disruptions");
  return base;
}

function buildFrictionBullets(
  tickets: ReturnType<typeof getMerchantTickets>,
  overdueCount: number,
  disputeRate: number,
): string[] {
  const open = tickets.filter((t) => !t.resolvedAt);
  const bullets: string[] = [];
  for (const t of open.slice(0, 3)) {
    bullets.push(`[${t.severity}/${t.category}] ${t.subject}`);
  }
  if (overdueCount > 0) bullets.push(`${overdueCount} overdue invoice${overdueCount === 1 ? "" : "s"} at quarter end`);
  if (disputeRate > 0.05) bullets.push(`Dispute rate elevated at ${(disputeRate * 100).toFixed(1)}% — above 5% flag`);
  if (bullets.length === 0) bullets.push("No friction worth flagging this quarter.");
  return bullets;
}

function buildCommitments(
  buyer: NonNullable<ReturnType<typeof buyers.find>>,
  hasExpansion: boolean,
  openEscalations: number,
): string[] {
  const bullets: string[] = [];
  if (openEscalations > 0) bullets.push(`Backd owns: Close ${openEscalations} open escalation within 14 days`);
  if (hasExpansion) {
    bullets.push("Backd owns: Prepare limit-increase paperwork + warm-intro to complementary seller");
    bullets.push(`${buyer.companyName} owns: Confirm target volume for next quarter`);
  } else {
    bullets.push("Backd owns: Continue monitoring, flag any anomaly within 48h");
    bullets.push(`${buyer.companyName} owns: Flag any planned volume changes in advance`);
  }
  bullets.push("Both: Schedule next QBR in 90 days");
  return bullets;
}
