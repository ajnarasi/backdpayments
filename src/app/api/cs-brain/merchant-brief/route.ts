import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { buyers } from "@/lib/data";
import {
  getHealthScore,
  getMerchantTickets,
  getMerchantActions,
  getMerchantExpansion,
} from "@/lib/cs-brain/data";
import type { MerchantBrief } from "@/types/cs-brain";

const SYSTEM_PROMPT = `You are Merchant Compass, the Customer Success copilot for Backd Payments — a B2B net-terms lender (Austin Business Finance / FinWise Bank). Backd's Customer Success team manages merchant (buyer) onboarding, health, retention, QBRs, expansion, and escalations.

Your job is to turn a merchant's signals into a "Second Brain" entity page that a CSM can read in 60 seconds to decide what to do next.

For the given merchant, produce a JSON object with this exact shape:

{
  "tldr": "One sentence in plain English. What defines this merchant right now?",
  "jobsToBeDone": ["3-5 short JTBD statements, each starting with a verb. What is the merchant trying to accomplish with Backd?"],
  "languageThatLands": [
    {
      "framing": "Short directive — how to frame the next outreach",
      "why": "Why this framing lands, based on evidence",
      "evidence": "Specific signal or past-interaction citation"
    }
  ],
  "contradictions": ["Signals that point in conflicting directions — where the CSM should dig"],
  "nextBestAction": {
    "channel": "email" | "phone" | "in_app" | "qbr" | "note",
    "tone": "collaborative" | "firm" | "urgent" | "empathetic",
    "playbookId": "pb-01" | "pb-02" | "pb-03" | "pb-04" | null,
    "script": "3-5 sentence draft the CSM can send/say. Personalized, not generic.",
    "suggestedTiming": "When to act — specific. e.g. 'within 24 hours', 'before Friday EOD'"
  }
}

Rules:
- Be specific. Reference the merchant's actual numbers, industry, tickets, actions.
- NEVER produce generic advice. If you'd say it about any merchant, rewrite it.
- Prefer preservation of relationship over aggressive dunning for high-LTV merchants.
- If the merchant's health is 'thriving' or 'activated' AND they have an expansion signal, nextBestAction should be expansion-oriented (qbr), not retention.
- Response must be a single JSON object — no prose before or after.`;

interface RequestBody {
  merchantId: string;
}

export async function POST(request: NextRequest) {
  let merchantId = "";
  try {
    const body = (await request.json()) as RequestBody;
    merchantId = body.merchantId;
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

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json(mockBrief(merchantId, buyer, health, tickets.length, !!expansion));
    }

    const userPrompt = buildPrompt(buyer, health, tickets, actions, expansion);
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1200,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("no text content from Claude");
    }
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("no JSON in Claude response");
    const parsed = JSON.parse(jsonMatch[0]);

    const brief: MerchantBrief = {
      merchantId,
      merchantName: buyer.companyName,
      tldr: parsed.tldr,
      jobsToBeDone: parsed.jobsToBeDone ?? [],
      languageThatLands: parsed.languageThatLands ?? [],
      contradictions: parsed.contradictions ?? [],
      nextBestAction: parsed.nextBestAction,
      isLive: true,
    };
    return Response.json(brief);
  } catch (error) {
    console.error("merchant-brief error:", error);
    const buyer = buyers.find((b) => b.id === merchantId);
    if (buyer) {
      const health = getHealthScore(merchantId);
      const tickets = getMerchantTickets(merchantId);
      const expansion = getMerchantExpansion(merchantId);
      return Response.json(mockBrief(merchantId, buyer, health, tickets.length, !!expansion));
    }
    return Response.json({ error: "brief generation failed" }, { status: 500 });
  }
}

function buildPrompt(
  buyer: ReturnType<typeof buyers.find>,
  health: ReturnType<typeof getHealthScore>,
  tickets: ReturnType<typeof getMerchantTickets>,
  actions: ReturnType<typeof getMerchantActions>,
  expansion: ReturnType<typeof getMerchantExpansion>,
): string {
  if (!buyer) return "";
  return `MERCHANT PROFILE
Company: ${buyer.companyName}
Industry: ${buyer.industry}
Risk tier: ${buyer.riskTier} (score ${buyer.riskScore}/100)
Credit limit: $${buyer.creditLimit.toLocaleString()}
Current exposure: $${buyer.currentExposure.toLocaleString()}
Payment velocity: ${buyer.paymentVelocity} days (trend ${(buyer.paymentVelocityTrend * 100).toFixed(0)}%)
On-time rate: ${(buyer.onTimeRate * 100).toFixed(0)}%
Order frequency trend: ${(buyer.orderFrequencyTrend * 100).toFixed(0)}%
Dispute rate: ${(buyer.disputeRate * 100).toFixed(1)}%
Connected sellers: ${buyer.connectedSellers.length}
Days since last order: ${buyer.daysSinceLastOrder}
Total orders: ${buyer.totalOrders}

HEALTH SCORE
Composite: ${health?.composite ?? "n/a"}/100 — band: ${health?.band ?? "n/a"}
Trajectory 30d: ${health?.trajectory30d ?? 0}
Top drivers: ${health?.drivers.slice(0, 3).map((d) => `${d.name}=${d.value} (${d.direction})`).join(", ")}

SUPPORT TICKETS (last ${tickets.length}):
${tickets
  .slice(0, 5)
  .map(
    (t) =>
      `- [${t.severity}/${t.category}] ${t.subject} — ${t.resolvedAt ? "resolved" : "OPEN"}. "${t.body.slice(0, 140)}"`,
  )
  .join("\n") || "none"}

RECENT CSM ACTIONS (last ${actions.length}):
${actions
  .slice(0, 5)
  .map((a) => `- ${a.channel} by ${a.csm} — ${a.summary} [${a.outcome}]`)
  .join("\n") || "none"}

EXPANSION SIGNAL:
${
  expansion
    ? `${expansion.offerType} — confidence ${Math.round(expansion.confidence * 100)}%, projected lift $${expansion.projectedLift.toLocaleString()}. ${expansion.rationale}`
    : "none detected"
}

Produce the JSON object. Be concrete and specific to this merchant.`;
}

// ── Mock fallbacks ─────────────────────────────────────────────────────────
function mockBrief(
  merchantId: string,
  buyer: NonNullable<ReturnType<typeof buyers.find>>,
  health: ReturnType<typeof getHealthScore>,
  ticketCount: number,
  hasExpansion: boolean,
): MerchantBrief {
  if (merchantId === "buyer-150") return showcaseMidwest(buyer);
  if (merchantId === "buyer-175") return showcaseCoastal(buyer);
  if (merchantId === "buyer-195") return showcaseDesertValley(buyer);

  const band = health?.band ?? "activated";
  const composite = health?.composite ?? 60;

  if (band === "at_risk" || band === "churning") {
    return {
      merchantId,
      merchantName: buyer.companyName,
      isLive: false,
      tldr: `${buyer.companyName} is drifting — health at ${composite}/100, on-time rate down to ${(buyer.onTimeRate * 100).toFixed(0)}%. Intervene this week before it becomes a collections case.`,
      jobsToBeDone: [
        "Preserve their seller relationships without triggering a default",
        "Buy time to resolve downstream cash flow",
        "Avoid late fees that signal broken trust to their internal finance team",
      ],
      languageThatLands: [
        {
          framing: "Lead with partnership, not dunning",
          why: "They're ${buyer.riskTier}-tier with declining velocity — a firm tone locks them into adversarial posture.",
          evidence: `Last ${ticketCount} tickets include payment-plan and reconciliation categories, not feature complaints.`,
        },
      ],
      contradictions: [
        `Order frequency trend ${(buyer.orderFrequencyTrend * 100).toFixed(0)}% but payment velocity worsening — usage is up yet they're slipping.`,
      ],
      nextBestAction: {
        channel: "phone",
        tone: "empathetic",
        playbookId: "pb-02",
        script: `Hi — quick check-in, not about any specific invoice. I noticed your payment cadence shifted recently and wanted to hear what's going on before anything becomes an issue. No action on your end today unless there's something we can help with.`,
        suggestedTiming: "within 72 hours",
      },
    };
  }

  if (hasExpansion) {
    return {
      merchantId,
      merchantName: buyer.companyName,
      isLive: false,
      tldr: `${buyer.companyName} is thriving — ${buyer.connectedSellers.length} sellers on time, composite ${composite}/100. Network-validated credit says they're ready for more.`,
      jobsToBeDone: [
        "Scale purchasing without adding more AP overhead",
        "Consolidate multiple seller relationships through Backd",
        "Access larger credit lines without renegotiating each time",
      ],
      languageThatLands: [
        {
          framing: "Lead with network-validated credit, not individual score",
          why: "Merchant sees network effect in action — multiple sellers reinforcing each other's confidence.",
          evidence: `Paying ${buyer.connectedSellers.length} sellers on time for ${buyer.totalOrders} invoices.`,
        },
      ],
      contradictions: [],
      nextBestAction: {
        channel: "qbr",
        tone: "collaborative",
        playbookId: "pb-04",
        script: `Want to run a 20-min review with you — your across-network payment data is strong enough that we can extend limit 25% and warm-intro you to 2 complementary sellers in your cluster. Share a 30-min window next week?`,
        suggestedTiming: "this quarter",
      },
    };
  }

  return {
    merchantId,
    merchantName: buyer.companyName,
    isLive: false,
    tldr: `${buyer.companyName} is healthy and active — composite ${composite}/100, no critical escalations. Maintain cadence.`,
    jobsToBeDone: [
      "Keep the flow of POs without friction",
      "Close any open tickets within SLA",
      "Preserve optionality for future expansion",
    ],
    languageThatLands: [
      {
        framing: "Brief, outcomes-focused updates",
        why: "Healthy merchants don't need hand-holding — they value brevity.",
        evidence: "Low ticket volume, consistent on-time payment.",
      },
    ],
    contradictions: [],
    nextBestAction: {
      channel: "in_app",
      tone: "collaborative",
      playbookId: null,
      script: `No action required. Log next QBR for 60 days.`,
      suggestedTiming: "next QBR cycle",
    },
  };
}

function showcaseMidwest(buyer: NonNullable<ReturnType<typeof buyers.find>>): MerchantBrief {
  return {
    merchantId: "buyer-150",
    merchantName: buyer.companyName,
    isLive: false,
    tldr: `${buyer.companyName} is a reliable mid-market food-service buyer with a predictable cash-flow pattern — their largest customer pays on the 20th, so Backd ACH pulls should align there. Ready for a credit-limit increase.`,
    jobsToBeDone: [
      "Keep predictable terms with every Backd seller they work with",
      "Align payment timing with their own inbound cash on the 20th of each month",
      "Scale into 2–3 additional Backd sellers as they open new restaurant locations",
      "Avoid any late fees that signal broken trust to their CFO",
    ],
    languageThatLands: [
      {
        framing: "Reference their timing pattern explicitly — 'we see your inbound cash lands on the 20th'",
        why: "They felt heard when Priya validated the pattern in the Feb call. That framing is now load-bearing.",
        evidence: "Ticket tkt-XXXX (Feb) — payment plan request explicitly tied to the 20th. Accepted realignment within 48h.",
      },
      {
        framing: "Lead with network data when offering expansion",
        why: "They respond to quantified peer benchmarks, not qualitative pitches.",
        evidence: "Requested 90-day CSV for their CFO's liquidity model — they model in spreadsheets.",
      },
    ],
    contradictions: [
      "Risk score still says medium-tier, but network breadth (3 sellers on time) says their true risk is lower — the single-entity model under-weights this.",
    ],
    nextBestAction: {
      channel: "qbr",
      tone: "collaborative",
      playbookId: "pb-04",
      script: `Hey — wanted to propose a short review. Looking at your last 90 days across ${buyer.connectedSellers.length} Backd sellers, your on-time rate is ${Math.round(buyer.onTimeRate * 100)}% and you've made every realigned pull. We'd like to raise your limit by 25% and warm-intro you to Apex Manufacturing Supply, who fits your expansion into packaged-food ops. 20 minutes next Tuesday?`,
      suggestedTiming: "within 14 days — current expansion window",
    },
  };
}

function showcaseCoastal(buyer: NonNullable<ReturnType<typeof buyers.find>>): MerchantBrief {
  return {
    merchantId: "buyer-175",
    merchantName: buyer.companyName,
    isLive: false,
    tldr: `${buyer.companyName} is mid-installment on a 3-payment rescue plan — 2 of 3 paid, third due in 14 days. Macro sector is stressed but their own early signals (+8% order frequency last 30d) suggest stabilization.`,
    jobsToBeDone: [
      "Finish the 3-installment plan without further slippage",
      "Avoid triggering any seller to pause outstanding orders",
      "Rebuild Backd trust for future equipment-rental financing",
      "Signal to their CFO that they handled this the right way",
    ],
    languageThatLands: [
      {
        framing: "Partnership-first, explicit acknowledgement of macro context",
        why: "Their CFO disclosed a $340K client delay in confidence — that trust is the whole relationship now.",
        evidence: "Ticket tkt-XXXX referenced BLS equipment-rental data proactively. They think in sector terms.",
      },
      {
        framing: "RTP for the final installment as goodwill",
        why: "First installment on RTP signaled urgency and compliance — staying on RTP closes the loop with intent.",
        evidence: "First installment ($42,333) cleared within 24h via RTP, ahead of schedule.",
      },
    ],
    contradictions: [
      "Their sector BLS data is flat-to-negative, but their order frequency on Backd ticked +8% in last 30 days. They may be shifting share TO Backd from competitors.",
    ],
    nextBestAction: {
      channel: "phone",
      tone: "empathetic",
      playbookId: "pb-02",
      script: `Hi — just confirming the final installment of $42,334 on the 30th. First two were clean, really appreciate that. If RTP is still workable on your end, we'll match. Also wanted to let you know your recent order frequency ticked up — that's a good sign we want to preserve momentum on. What's the right time to circle back after the last installment?`,
      suggestedTiming: "T-5 days before installment due",
    },
  };
}

function showcaseDesertValley(buyer: NonNullable<ReturnType<typeof buyers.find>>): MerchantBrief {
  return {
    merchantId: "buyer-195",
    merchantName: buyer.companyName,
    isLive: false,
    tldr: `${buyer.companyName} has exhausted automated collections. 91 days overdue, active dispute, two sector-wide stress signals. This is a human-plus-legal case — preserve lien rights within the statutory window.`,
    jobsToBeDone: [
      "Settle subcontractor disputes on their own side (blocks their ability to pay)",
      "Avoid formal default that damages their bonding capacity",
      "Keep at least one Backd seller relationship alive for future recovery",
    ],
    languageThatLands: [
      {
        framing: "Direct and structural — this is not a tone problem",
        why: "Their distress is structural (regional construction downturn + subcontractor disputes). Empathy alone does not move them.",
        evidence: "CFO engaged once, agreed to discuss with ownership, missed the follow-up deadline.",
      },
    ],
    contradictions: [
      "CFO was engaged and collaborative on the 12th, then zero communication after the 19th — something changed internally.",
    ],
    nextBestAction: {
      channel: "note",
      tone: "firm",
      playbookId: null,
      script: `Internal handoff only: transfer to senior collections with full case file (10 agent actions, 3 phone contacts, dispute cross-ref). Engage outside counsel within 7 days to preserve mechanic's-lien rights in Arizona. Do not initiate merchant outreach until legal reviews.`,
      suggestedTiming: "within 48 hours",
    },
  };
}
