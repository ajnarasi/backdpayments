// ============================================================================
// Merchant Compass — Synthetic CS Data Seed
// Reads the existing CollectIQ buyers/invoices/cases and overlays:
//   - synthetic support tickets
//   - CSM action history
//   - health scores (derived from real signals + noise)
//   - playbook library with real outcomes
//   - expansion signals
//   - Karpathy loop telemetry
// All derived deterministically from the seeded PRNG equivalents below.
// ============================================================================

import { buyers, invoices, collectionCases, networkEdges } from "@/lib/data";
import type { Buyer } from "@/types";
import type {
  SupportTicket,
  CSMAction,
  HealthScore,
  HealthBand,
  HealthDriver,
  Playbook,
  PlaybookOutcome,
  ExpansionSignal,
  CSSegment,
  CSSegmentSummary,
  AgentQueueItem,
  LoopStats,
  LoopCycle,
  CSDashboardData,
  TicketCategory,
  TicketSeverity,
  CSMActionChannel,
  InterventionOutcome,
} from "@/types/cs-brain";

// ── Deterministic PRNG (separate seed from core data.ts) ───────────────────
let _seed = 917;
function rand(): number {
  _seed |= 0;
  _seed = (_seed + 0x6d2b79f5) | 0;
  let t = Math.imul(_seed ^ (_seed >>> 15), 1 | _seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function randInt(min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min;
}
function randFloat(min: number, max: number, dec = 2) {
  return +(rand() * (max - min) + min).toFixed(dec);
}
function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}
function daysAgo(n: number): string {
  return new Date(Date.now() - n * 86400000).toISOString();
}
function uid(prefix: string, i: number): string {
  return `${prefix}-${String(i).padStart(4, "0")}`;
}

// ── CSM Roster ─────────────────────────────────────────────────────────────
export const CSM_ROSTER = [
  "Scott Gardner",
  "Priya Rao",
  "Daniel Kim",
  "Morgan Reyes",
  "Jess Lindholm",
];

// ── Showcase merchant IDs (flagship demo path) ─────────────────────────────
export const SHOWCASE_MERCHANT_IDS = ["buyer-150", "buyer-175", "buyer-195"];

// Align PRNG-generated names on the showcase buyers with the hand-written
// Collections showcase cases. Done at module load so every downstream read
// of `buyers` sees the showcase names. Mutation is deterministic and additive.
const SHOWCASE_NAME_OVERRIDES: Record<
  string,
  { name: string; industry: Buyer["industry"]; city: string; state: string }
> = {
  "buyer-150": {
    name: "Midwest Restaurant Group",
    industry: "food_beverage",
    city: "Chicago",
    state: "IL",
  },
  "buyer-175": {
    name: "Coastal Equipment Rentals",
    industry: "industrial_equipment",
    city: "Tampa",
    state: "FL",
  },
  "buyer-195": {
    name: "Desert Valley Materials",
    industry: "construction_supply",
    city: "Phoenix",
    state: "AZ",
  },
};

function applyShowcaseOverrides(): void {
  for (const id of SHOWCASE_MERCHANT_IDS) {
    const override = SHOWCASE_NAME_OVERRIDES[id];
    const b = buyers.find((x) => x.id === id);
    if (!b || !override) continue;
    b.companyName = override.name;
    b.industry = override.industry;
    b.city = override.city;
    b.state = override.state;
  }
}
applyShowcaseOverrides();

// Resolver — always returns the authoritative name, safe against any module
// load-order issue. Pages should prefer this over `buyer.companyName` for
// showcase IDs to guarantee consistent demo rendering.
export function resolveMerchantName(id: string, fallback: string): string {
  return SHOWCASE_NAME_OVERRIDES[id]?.name ?? fallback;
}

// ── Support Tickets ────────────────────────────────────────────────────────
const TICKET_TEMPLATES: {
  category: TicketCategory;
  severity: TicketSeverity;
  subjects: string[];
  bodies: string[];
}[] = [
  {
    category: "onboarding",
    severity: "medium",
    subjects: [
      "ERP integration — QuickBooks mapping question",
      "Webhook signature validation failing",
      "First invoice not syncing to portal",
    ],
    bodies: [
      "Our AR team is trying to map Backd invoices to our QuickBooks memo lines and the reference field is truncating at 30 chars. Can you confirm the field length limit?",
      "We're getting 401s on the webhook endpoint. Signature mismatch on the HMAC header. Sample payload attached.",
      "Pushed first 3 POs yesterday, portal shows 2 of them. Third one hasn't appeared after 18 hours.",
    ],
  },
  {
    category: "reconciliation",
    severity: "medium",
    subjects: [
      "ACH pull date mismatch on INV-{n}",
      "Partial payment applied twice in statement",
      "Unknown $1,250 credit on account — source?",
    ],
    bodies: [
      "Pull hit our bank on the 22nd but your statement shows 21st. Need to confirm for month-end close.",
      "$18,500 partial payment showing twice on the Feb statement. Only one ACH cleared our side.",
      "Random credit appeared. No refund requested. Can you trace source?",
    ],
  },
  {
    category: "dispute",
    severity: "high",
    subjects: [
      "Dispute: damaged goods on PO-{n}",
      "Short-ship claim not resolved after 21 days",
      "Invoice disputed — terms changed post-delivery",
    ],
    bodies: [
      "Half the shipment arrived damaged. Seller acknowledged but hasn't issued credit. Withholding payment until resolved.",
      "Filed 3 weeks ago. No update. Escalating.",
      "Seller updated terms from Net 30 to Net 15 after shipment. Not in the signed agreement.",
    ],
  },
  {
    category: "payment_plan",
    severity: "high",
    subjects: [
      "Need 30-day extension on INV-{n}",
      "Can we restructure current balance?",
      "Cash flow tight — partial payment this cycle?",
    ],
    bodies: [
      "Our largest customer pushed their payment to the 28th. Can we get a 2-week courtesy without late fees?",
      "Current balance $340K. Can we spread into 3 installments?",
      "Rough month. Can we do 60% this week, 40% in 21 days?",
    ],
  },
  {
    category: "billing_question",
    severity: "low",
    subjects: [
      "How is the 2.8% take rate calculated?",
      "Invoice footer reference — what is 'CEBS'?",
      "Monthly statement — where to find?",
    ],
    bodies: [
      "Finance team asking for a breakdown of the fee structure for audit.",
      "New footer text showed up last month. What does CEBS stand for?",
      "Can't find statement download in portal. Is it emailed?",
    ],
  },
  {
    category: "feature_request",
    severity: "low",
    subjects: [
      "Can we get CSV export of aging report?",
      "SSO with Okta please",
      "Bulk invoice upload via CSV?",
    ],
    bodies: [
      "Manual export is painful at month-end.",
      "IT is requiring SSO for all vendors by Q3.",
      "We push 400 POs/month, clicking through the UI is too slow.",
    ],
  },
  {
    category: "escalation",
    severity: "critical",
    subjects: [
      "Urgent — funds on hold 5 days past promise",
      "Seller cutting us off — need immediate review",
      "ACH pull failed, seller cancelling order",
    ],
    bodies: [
      "Promised funding by Tuesday, it's Friday. We have payroll to run.",
      "Seller says Backd hasn't confirmed credit line. They're pausing our next order.",
      "Failed ACH pull. Seller got the notice and is cancelling the $180K order. Please help.",
    ],
  },
  {
    category: "integration",
    severity: "medium",
    subjects: [
      "API rate limit — hitting 429s",
      "Sandbox credentials not provisioned",
      "Webhook retry policy question",
    ],
    bodies: [
      "Bulk sync job is getting throttled. What's the sustained RPS ceiling?",
      "Requested sandbox access 5 days ago. No creds yet.",
      "If a webhook fails 3 times, do you stop retrying? Docs unclear.",
    ],
  },
];

function interp(s: string): string {
  return s.replace("{n}", String(randInt(10000, 99999)));
}

const _tickets: SupportTicket[] = [];
let ticketIdx = 1;

// Weight tickets toward at-risk / critical buyers — realistic distribution.
function ticketCountForBuyer(b: Buyer): number {
  if (b.riskTier === "critical") return randInt(3, 6);
  if (b.riskTier === "high") return randInt(2, 4);
  if (b.riskTier === "medium") return randInt(0, 2);
  return rand() < 0.35 ? 1 : 0;
}

for (const b of buyers) {
  const count = ticketCountForBuyer(b);
  for (let i = 0; i < count; i++) {
    const tpl = pick(TICKET_TEMPLATES);
    const openedDaysAgo = randInt(1, 90);
    const resolved = rand() < (b.riskTier === "critical" ? 0.45 : 0.78);
    const firstResp = resolved ? randInt(12, 480) : null;
    _tickets.push({
      id: uid("tkt", ticketIdx++),
      merchantId: b.id,
      merchantName: b.companyName,
      category: tpl.category,
      severity: tpl.severity,
      subject: interp(pick(tpl.subjects)),
      body: pick(tpl.bodies),
      openedAt: daysAgo(openedDaysAgo),
      resolvedAt: resolved ? daysAgo(Math.max(0, openedDaysAgo - randInt(1, 7))) : null,
      firstResponseMinutes: firstResp,
      assignedCsm: pick(CSM_ROSTER),
    });
  }
}

// Guarantee high-signal tickets on the 3 showcase buyers.
const SHOWCASE_TICKETS: Omit<SupportTicket, "id">[] = [
  {
    merchantId: "buyer-150",
    merchantName: "Midwest Restaurant Group",
    category: "payment_plan",
    severity: "high",
    subject: "Cash flow timing — can we pull on the 22nd?",
    body:
      "Our largest customer (Hospitality Partners Inc.) pays us on the 20th every month. That's been our pattern for 2 years. Could we align your ACH pull to the 22nd instead of the 15th? Happy to confirm in writing.",
    openedAt: daysAgo(18),
    resolvedAt: daysAgo(16),
    firstResponseMinutes: 42,
    assignedCsm: "Priya Rao",
  },
  {
    merchantId: "buyer-150",
    merchantName: "Midwest Restaurant Group",
    category: "feature_request",
    severity: "low",
    subject: "CSV of 90-day invoice history for our CFO",
    body: "Our CFO is building a liquidity model, needs last 90 days of Backd activity as CSV. Portal only shows 30d.",
    openedAt: daysAgo(42),
    resolvedAt: daysAgo(42),
    firstResponseMinutes: 18,
    assignedCsm: "Priya Rao",
  },
  {
    merchantId: "buyer-175",
    merchantName: "Coastal Equipment Rentals",
    category: "payment_plan",
    severity: "high",
    subject: "3-installment plan — large client delayed $340K on us",
    body:
      "One of our biggest clients pushed a $340K payment 45 days. That's cascading into our AP. Can we restructure the $127K invoice into 3 installments over 60 days? First installment we can do tomorrow via RTP.",
    openedAt: daysAgo(84),
    resolvedAt: daysAgo(83),
    firstResponseMinutes: 36,
    assignedCsm: "Daniel Kim",
  },
  {
    merchantId: "buyer-175",
    merchantName: "Coastal Equipment Rentals",
    category: "dispute",
    severity: "medium",
    subject: "Equipment rental sector — macro concerns for Q2",
    body:
      "Heads up — BLS reported rental demand down 12% in our sector. We're tightening internally. Wanted to flag so we're not surprising you with payment timing shifts.",
    openedAt: daysAgo(30),
    resolvedAt: null,
    firstResponseMinutes: null,
    assignedCsm: "Daniel Kim",
  },
  {
    merchantId: "buyer-195",
    merchantName: "Desert Valley Materials",
    category: "dispute",
    severity: "critical",
    subject: "Dispute filed on INV-7823 — short-ship",
    body:
      "We received 60% of the materials ordered. Seller says full shipment went out but BOL shows partial. Not paying until resolved.",
    openedAt: daysAgo(72),
    resolvedAt: null,
    firstResponseMinutes: 120,
    assignedCsm: "Morgan Reyes",
  },
  {
    merchantId: "buyer-195",
    merchantName: "Desert Valley Materials",
    category: "escalation",
    severity: "critical",
    subject: "Project delays — need emergency credit review",
    body:
      "Two major construction projects delayed by 60 days. Subcontractor disputes pending. Cash flow severely impacted. Need to discuss options before month-end.",
    openedAt: daysAgo(45),
    resolvedAt: null,
    firstResponseMinutes: 20,
    assignedCsm: "Morgan Reyes",
  },
];

for (const t of SHOWCASE_TICKETS) {
  _tickets.push({ ...t, id: uid("tkt", ticketIdx++) });
}

export const supportTickets: SupportTicket[] = _tickets;

// ── CSM Action History ─────────────────────────────────────────────────────
const _csmActions: CSMAction[] = [];
let csmActionIdx = 1;

const ACTION_CHANNELS: CSMActionChannel[] = ["email", "phone", "in_app", "qbr", "note"];
const ACTION_OUTCOMES: InterventionOutcome[] = [
  "accepted",
  "accepted",
  "accepted",
  "partially_accepted",
  "declined",
  "no_response",
  "pending",
];

function actionCountForBuyer(b: Buyer): number {
  if (b.riskTier === "critical") return randInt(5, 10);
  if (b.riskTier === "high") return randInt(4, 8);
  if (b.riskTier === "medium") return randInt(2, 5);
  return randInt(1, 3);
}

const ACTION_SUMMARIES: Record<CSMActionChannel, string[]> = {
  email: [
    "Sent pre-due reminder with flexible payment options",
    "Followed up on open support ticket — reconciliation question",
    "Shared network-benchmarked pricing breakdown",
    "Confirmed ACH pull schedule alignment",
  ],
  phone: [
    "15-min check-in with AP manager — cash flow cadence",
    "Negotiated installment plan with CFO",
    "Walked through new webhook retry behavior",
    "Discussed macro headwinds and partnership posture",
  ],
  in_app: [
    "Nudged merchant to enable SSO",
    "Prompted CSV export of 90-day history",
    "Showed new aging-report export",
  ],
  qbr: [
    "Quarterly Business Review — wins, risks, expansion plan",
    "Mid-quarter touchpoint with executive sponsor",
  ],
  note: [
    "Internal: Cash flow timing linked to buyer's largest customer paying on the 20th",
    "Internal: Dispute pattern suggests seller quality issue — cross-ref with other buyers",
    "Internal: Expansion signal — 3 on-time cycles, ready for limit increase",
  ],
};

for (const b of buyers) {
  const count = actionCountForBuyer(b);
  for (let i = 0; i < count; i++) {
    const channel = pick(ACTION_CHANNELS);
    _csmActions.push({
      id: uid("csm", csmActionIdx++),
      merchantId: b.id,
      csm: pick(CSM_ROSTER),
      channel,
      timestamp: daysAgo(randInt(1, 90)),
      summary: pick(ACTION_SUMMARIES[channel]),
      outcome: pick(ACTION_OUTCOMES),
      isAgentSuggested: rand() > 0.35,
      playbookId: rand() > 0.5 ? `pb-${randInt(1, 4).toString().padStart(2, "0")}` : null,
    });
  }
}

export const csmActions: CSMAction[] = _csmActions;

// ── Playbook Library ───────────────────────────────────────────────────────
export const playbooks: Playbook[] = [
  {
    id: "pb-01",
    title: "Seasonal Cash Crunch — Food & Beverage",
    triggerSummary:
      "Restaurant or hospitality buyer slipping 5–10 days on payment with a predictable monthly pattern.",
    triggerSignals: [
      "Payment velocity +5–10 days vs 90-day baseline",
      "Lifetime on-time rate >85%",
      "Industry: food_beverage or hospitality",
      "Support ticket mentions 'timing' or 'cash flow'",
    ],
    recommendedSteps: [
      {
        order: 1,
        channel: "email",
        instruction:
          "Pre-due (T-5 days) personalized reminder. Lead with flexibility, NOT late-fee risk. Reference their historical on-time rate.",
        expectedOutcome: "Merchant replies with specific alignment request OR pays on time.",
      },
      {
        order: 2,
        channel: "phone",
        instruction: "If no payment at T+3, call AP directly. Ask about their downstream collection cadence.",
        expectedOutcome: "Identify root cause — almost always a specific end-customer paying on a predictable date.",
      },
      {
        order: 3,
        channel: "in_app",
        instruction: "Offer to realign ACH pull date with their inbound cash date. No late fees for first realignment.",
        expectedOutcome: "Merchant accepts realignment, pays within 72h of new date.",
      },
      {
        order: 4,
        channel: "note",
        instruction:
          "Document the merchant's inbound cash cadence in Merchant Compass. Feed back to loop so future invoices default to aligned pull date.",
        expectedOutcome: "Playbook telemetry updated — this merchant now auto-aligned.",
      },
    ],
    createdBy: "Priya Rao",
    lastUpdated: daysAgo(14),
    tags: ["food_beverage", "timing", "low_effort_high_save"],
    outcomes: [],
  },
  {
    id: "pb-02",
    title: "Deteriorating Buyer — Preserve Relationship",
    triggerSummary:
      "High-value buyer with elevating risk score (55+) who has historically been reliable. Preserve LTV, don't default to aggressive dunning.",
    triggerSignals: [
      "Risk score crossed 55 in last 30 days",
      "Lifetime volume >$500K",
      "Order frequency declining >30%",
      "Industry sector showing macro headwinds",
    ],
    recommendedSteps: [
      {
        order: 1,
        channel: "phone",
        instruction:
          "Proactive CFO-level call BEFORE any collection event. Frame as 'partnership check-in', not dunning.",
        expectedOutcome: "Disclosure of root cause (major client delay, sector stress, etc.).",
      },
      {
        order: 2,
        channel: "qbr",
        instruction: "Offer restructured multi-installment plan with first-installment-now-via-RTP for goodwill.",
        expectedOutcome: "CFO accepts 3-installment plan, first via RTP within 48h.",
      },
      {
        order: 3,
        channel: "note",
        instruction:
          "Flag merchant for enhanced monitoring. Rebuild trust through 2 completed cycles before re-extending limit.",
        expectedOutcome: "Merchant stabilizes, re-qualifies for expansion in 60–90 days.",
      },
    ],
    createdBy: "Daniel Kim",
    lastUpdated: daysAgo(8),
    tags: ["at_risk", "high_ltv", "preserve_relationship"],
    outcomes: [],
  },
  {
    id: "pb-03",
    title: "First-90-Day Activation Stall",
    triggerSummary:
      "Newly onboarded merchant hasn't hit second invoice within 60 days. Activation at risk.",
    triggerSignals: [
      "Joined 60–90 days ago",
      "Only 1 invoice processed",
      "Support ticket volume elevated",
      "Integration health < 80%",
    ],
    recommendedSteps: [
      {
        order: 1,
        channel: "in_app",
        instruction: "Trigger onboarding health widget. Highlight specific integration gap.",
        expectedOutcome: "Merchant resolves integration blocker within 7 days.",
      },
      {
        order: 2,
        channel: "phone",
        instruction:
          "Direct call with their AP lead. Offer white-glove setup for their next 3 POs.",
        expectedOutcome: "Merchant processes 2+ invoices in next 14 days.",
      },
      {
        order: 3,
        channel: "qbr",
        instruction: "30-day activation review. Benchmark their volume vs cohort. Show expansion path.",
        expectedOutcome: "Merchant commits to quarterly volume target.",
      },
    ],
    createdBy: "Morgan Reyes",
    lastUpdated: daysAgo(21),
    tags: ["onboarding", "activation", "time_to_value"],
    outcomes: [],
  },
  {
    id: "pb-04",
    title: "Expansion-Ready — Network-Validated",
    triggerSummary:
      "Medium-risk buyer paying 3+ sellers on time across the network. True risk is lower than individual scoring shows.",
    triggerSignals: [
      "Connected to 3+ Backd sellers",
      "Network on-time rate >80%",
      "Individual risk score: medium tier",
      "No open disputes last 90 days",
    ],
    recommendedSteps: [
      {
        order: 1,
        channel: "qbr",
        instruction:
          "Lead with network-validated credit story. Offer 20–30% limit increase contingent on a second seller expansion.",
        expectedOutcome: "Merchant accepts limit increase, introduces to second Backd seller.",
      },
      {
        order: 2,
        channel: "in_app",
        instruction: "Activate cross-sell surface — show 2 complementary sellers in their industry.",
        expectedOutcome: "Merchant clicks through to at least 1 seller.",
      },
      {
        order: 3,
        channel: "note",
        instruction: "Track network expansion. Feed outcome back to loop for future expansion scoring.",
        expectedOutcome: "Incremental annual volume +$60–120K per merchant.",
      },
    ],
    createdBy: "Jess Lindholm",
    lastUpdated: daysAgo(5),
    tags: ["expansion", "network_credit", "revenue"],
    outcomes: [],
  },
];

// Seed outcomes per playbook (12–16 each) using real buyers.
let poIdx = 1;
const OUTCOME_NOTES: Record<string, string[]> = {
  "pb-01": [
    "Aligned ACH pull to +7 days, paid in full within 48h.",
    "Declined first realignment, accepted on round 2.",
    "Paid on time after pre-due call — no plan needed.",
    "Partial payment now + full next cycle. Continuing monitoring.",
  ],
  "pb-02": [
    "3-installment plan accepted via CFO call. First via RTP within 24h.",
    "CFO declined plan, human handoff triggered.",
    "Relationship preserved — merchant re-qualified in 74 days.",
    "Partial recovery (67%), ongoing monitoring.",
  ],
  "pb-03": [
    "Integration blocker resolved, activation hit within 11 days.",
    "Merchant churned despite outreach — wrong ICP fit.",
    "Hit 2 invoices in 14 days, QBR set for 60d.",
    "Completed white-glove onboarding, processing weekly now.",
  ],
  "pb-04": [
    "Limit +25%, introduced to second seller — $94K incremental ARR.",
    "Declined expansion, still good standing.",
    "Accepted limit increase, second seller intro pending.",
    "Cross-sell to 2 new sellers — $180K incremental volume.",
  ],
};

for (const pb of playbooks) {
  const outcomeCount = randInt(12, 16);
  const notes = OUTCOME_NOTES[pb.id] ?? ["Outcome recorded."];
  for (let i = 0; i < outcomeCount; i++) {
    const b = pick(buyers);
    const result = pick<InterventionOutcome>([
      "accepted",
      "accepted",
      "accepted",
      "partially_accepted",
      "declined",
      "no_response",
    ]);
    const recoveredBase = pb.id === "pb-04" ? randInt(40000, 240000) : randInt(15000, 180000);
    pb.outcomes.push({
      id: uid("po", poIdx++),
      playbookId: pb.id,
      merchantId: b.id,
      merchantName: b.companyName,
      appliedAt: daysAgo(randInt(5, 120)),
      result,
      recoveredValue:
        result === "accepted"
          ? recoveredBase
          : result === "partially_accepted"
            ? Math.round(recoveredBase * 0.55)
            : 0,
      notes: pick(notes),
    });
  }
}

// ── Health Scores (derived) ────────────────────────────────────────────────
function bandFromScore(score: number, tenureDays: number): HealthBand {
  if (tenureDays < 60) return "onboarding";
  if (score >= 80) return "thriving";
  if (score >= 60) return "activated";
  if (score >= 35) return "at_risk";
  return "churning";
}

function healthForBuyer(b: Buyer): HealthScore {
  const ticketLoad = supportTickets.filter((t) => t.merchantId === b.id).length;
  const openCritical = supportTickets.filter(
    (t) => t.merchantId === b.id && !t.resolvedAt && (t.severity === "high" || t.severity === "critical"),
  ).length;
  const recentCases = collectionCases.filter((c) => c.buyerId === b.id && !c.isResolved).length;
  const networkBreadth = b.connectedSellers.length;

  const drivers: HealthDriver[] = [
    {
      name: "On-Time Rate",
      value: Math.round(b.onTimeRate * 100),
      weight: 0.25,
      contribution: +(b.onTimeRate * 25).toFixed(1),
      direction: b.onTimeRate >= 0.8 ? "positive" : b.onTimeRate >= 0.6 ? "neutral" : "negative",
    },
    {
      name: "Payment Velocity",
      value: b.paymentVelocity,
      weight: 0.15,
      contribution: +(Math.max(0, 45 - b.paymentVelocity) / 45 * 15).toFixed(1),
      direction: b.paymentVelocity <= 30 ? "positive" : b.paymentVelocity <= 45 ? "neutral" : "negative",
    },
    {
      name: "Order Frequency Trend",
      value: +(b.orderFrequencyTrend * 100).toFixed(0),
      weight: 0.2,
      contribution: +((b.orderFrequencyTrend + 1) / 2 * 20).toFixed(1),
      direction: b.orderFrequencyTrend > 0 ? "positive" : b.orderFrequencyTrend > -0.2 ? "neutral" : "negative",
    },
    {
      name: "Dispute Rate",
      value: +(b.disputeRate * 100).toFixed(1),
      weight: 0.1,
      contribution: +((1 - b.disputeRate) * 10).toFixed(1),
      direction: b.disputeRate < 0.05 ? "positive" : b.disputeRate < 0.1 ? "neutral" : "negative",
    },
    {
      name: "Open Escalations",
      value: openCritical,
      weight: 0.15,
      contribution: openCritical === 0 ? 15 : openCritical === 1 ? 7 : 0,
      direction: openCritical === 0 ? "positive" : "negative",
    },
    {
      name: "Network Breadth",
      value: networkBreadth,
      weight: 0.15,
      contribution: Math.min(networkBreadth, 4) / 4 * 15,
      direction: networkBreadth >= 3 ? "positive" : networkBreadth >= 2 ? "neutral" : "negative",
    },
  ];

  const composite = Math.max(
    5,
    Math.min(
      98,
      Math.round(
        drivers.reduce((s, d) => s + d.contribution, 0) -
          recentCases * 3 -
          ticketLoad * 0.8 +
          (rand() - 0.5) * 4,
      ),
    ),
  );
  const tenureDays = Math.max(1, Math.round((Date.now() - new Date(b.joinedAt).getTime()) / 86400000));
  const band = bandFromScore(composite, tenureDays);
  const trajectory30d = +((b.orderFrequencyTrend - b.paymentVelocityTrend) / 2).toFixed(2);

  return {
    merchantId: b.id,
    band,
    composite,
    trajectory30d,
    drivers,
    lastComputed: new Date().toISOString(),
  };
}

export const healthScores: HealthScore[] = buyers.map(healthForBuyer);

// ── Expansion Signals ──────────────────────────────────────────────────────
const _expansionSignals: ExpansionSignal[] = [];
for (const b of buyers) {
  const hs = healthScores.find((h) => h.merchantId === b.id)!;
  if (hs.band === "activated" && b.connectedSellers.length >= 3 && b.onTimeRate >= 0.8) {
    _expansionSignals.push({
      merchantId: b.id,
      offerType: "credit_limit_increase",
      confidence: randFloat(0.72, 0.92),
      projectedLift: Math.round(b.avgOrderSize * 6 + b.creditLimit * 0.25),
      rationale:
        `Network-validated credit: ${b.connectedSellers.length} sellers on time, ` +
        `composite health ${hs.composite}, order-frequency trend +${(b.orderFrequencyTrend * 100).toFixed(0)}%.`,
      requiredActions: ["Run QBR", "Approve +25% limit", "Intro to second-industry seller"],
    });
  } else if (hs.band === "activated" && b.connectedSellers.length === 1) {
    _expansionSignals.push({
      merchantId: b.id,
      offerType: "new_seller_intro",
      confidence: randFloat(0.55, 0.75),
      projectedLift: Math.round(b.avgOrderSize * 4),
      rationale: "Healthy single-seller merchant — multi-seller buyers see +180% volume lift.",
      requiredActions: ["Identify 2 complementary sellers", "Warm intro email"],
    });
  } else if (hs.band === "thriving" && b.industry === "medical_supply") {
    _expansionSignals.push({
      merchantId: b.id,
      offerType: "line_of_credit_upgrade",
      confidence: randFloat(0.65, 0.88),
      projectedLift: Math.round(b.creditLimit * 0.4),
      rationale: "Thriving vertical, thick payment history, candidate for LOC product upgrade.",
      requiredActions: ["Credit-review pull", "Product team handoff"],
    });
  }
}
// Seed explicit showcase expansion signals so the demo story is consistent
// across merchant brief, QBR, agent queue, and loop.
const SHOWCASE_EXPANSION: ExpansionSignal[] = [
  {
    merchantId: "buyer-150",
    offerType: "credit_limit_increase",
    confidence: 0.84,
    projectedLift: 180000,
    rationale:
      "3 on-time cycles across 3 Backd sellers, composite health in the thriving band, predictable cash-flow pattern aligned to the 20th. Network data says true risk is lower than individual score.",
    requiredActions: [
      "Run QBR",
      "Approve +25% limit ($62.5K → $78K)",
      "Warm-intro to Apex Manufacturing Supply",
    ],
  },
];
for (const sig of SHOWCASE_EXPANSION) {
  const idx = _expansionSignals.findIndex((e) => e.merchantId === sig.merchantId);
  if (idx >= 0) _expansionSignals[idx] = sig;
  else _expansionSignals.push(sig);
}

export const expansionSignals: ExpansionSignal[] = _expansionSignals;

// ── Segment Bucketing ──────────────────────────────────────────────────────
export function segmentForBuyer(b: Buyer): CSSegment {
  const hs = healthScores.find((h) => h.merchantId === b.id);
  if (!hs) return "activated";
  if (hs.band === "onboarding") return "onboarding";
  if (hs.band === "at_risk" || hs.band === "churning") return "at_risk";
  const hasExpansion = expansionSignals.some((e) => e.merchantId === b.id);
  if (hasExpansion) return "expansion_ready";
  return "activated";
}

function headlineForSegment(segment: CSSegment, count: number): string {
  switch (segment) {
    case "onboarding":
      return `${count} merchants in first 60 days — watch for activation stall`;
    case "activated":
      return `${count} merchants healthy and growing`;
    case "at_risk":
      return `${count} merchants showing deterioration — intervene within 7 days`;
    case "expansion_ready":
      return `${count} merchants with network-validated expansion signal`;
  }
}

function trendForSegment(segment: CSSegment): "up" | "down" | "flat" {
  switch (segment) {
    case "expansion_ready":
    case "onboarding":
      return "up";
    case "at_risk":
      return "down";
    default:
      return "flat";
  }
}

function buildSegmentSummary(): CSSegmentSummary[] {
  const segments: CSSegment[] = ["onboarding", "activated", "at_risk", "expansion_ready"];
  return segments.map((seg) => {
    const members = buyers.filter((b) => segmentForBuyer(b) === seg);
    const exposure = members.reduce((s, b) => s + b.currentExposure, 0);
    return {
      segment: seg,
      count: members.length,
      exposure,
      recentTrend: trendForSegment(seg),
      headline: headlineForSegment(seg, members.length),
    };
  });
}

// ── Agent Queue (ranked next-best-actions) ─────────────────────────────────
function buildAgentQueue(): AgentQueueItem[] {
  const items: AgentQueueItem[] = [];

  // 1. Critical at-risk: showcase merchants + top-3 at-risk by open-critical-ticket count
  const showcaseItems: AgentQueueItem[] = SHOWCASE_MERCHANT_IDS.map<AgentQueueItem | null>((id) => {
    const b = buyers.find((x) => x.id === id);
    if (!b) return null;
    const hs = healthScores.find((h) => h.merchantId === id)!;
    const priority: AgentQueueItem["priority"] =
      b.riskTier === "critical" ? "critical" : b.riskTier === "high" ? "high" : "medium";
    return {
      merchantId: id,
      merchantName: b.companyName,
      priority,
      segment: segmentForBuyer(b),
      title:
        b.id === "buyer-150"
          ? "Offer limit increase — 3 on-time cycles + cross-seller signal"
          : b.id === "buyer-175"
            ? "Check installment plan adherence — 2 of 3 paid"
            : "Legal review — insolvency risk, preserve lien rights",
      rationale:
        b.id === "buyer-150"
          ? `Composite health ${hs.composite}, connected to ${b.connectedSellers.length} sellers, on-time rate ${Math.round(b.onTimeRate * 100)}%. Network validates credit.`
          : b.id === "buyer-175"
            ? "Third installment ($42,334) due within 14 days. Early signs of cash flow stabilization. Continue enhanced monitoring."
            : "No payment after 91d. Dispute active. Agent exhausted automated options — refer to human + legal within 48h.",
      playbookId:
        b.id === "buyer-150"
          ? "pb-04"
          : b.id === "buyer-175"
            ? "pb-02"
            : null,
      suggestedAction:
        b.id === "buyer-150"
          ? "qbr"
          : b.id === "buyer-175"
            ? "phone"
            : "note",
    };
  })
    .filter((x): x is AgentQueueItem => x !== null);

  items.push(...showcaseItems);

  // 2. Other at-risk buyers with open critical tickets
  const additionalAtRisk = buyers
    .filter(
      (b) =>
        !SHOWCASE_MERCHANT_IDS.includes(b.id) &&
        (segmentForBuyer(b) === "at_risk" ||
          supportTickets.some((t) => t.merchantId === b.id && !t.resolvedAt && t.severity === "critical")),
    )
    .slice(0, 5)
    .map<AgentQueueItem>((b) => {
      const openEscalation = supportTickets.find(
        (t) => t.merchantId === b.id && !t.resolvedAt && t.severity === "critical",
      );
      return {
        merchantId: b.id,
        merchantName: b.companyName,
        priority: b.riskTier === "critical" ? "critical" : "high",
        segment: segmentForBuyer(b),
        title: openEscalation
          ? `Resolve open escalation: ${openEscalation.subject}`
          : `Retention call — health declining 30 days`,
        rationale:
          openEscalation?.body.slice(0, 180) ??
          `On-time rate dropped to ${Math.round(b.onTimeRate * 100)}%, frequency trend ${(b.orderFrequencyTrend * 100).toFixed(0)}%.`,
        playbookId: "pb-02",
        suggestedAction: openEscalation ? "phone" : "email",
      };
    });

  items.push(...additionalAtRisk);

  // 3. Top expansion opportunities
  const topExpansion = expansionSignals
    .sort((a, b) => b.projectedLift - a.projectedLift)
    .slice(0, 4)
    .map<AgentQueueItem>((e) => {
      const b = buyers.find((x) => x.id === e.merchantId)!;
      return {
        merchantId: e.merchantId,
        merchantName: b.companyName,
        priority: "medium",
        segment: "expansion_ready",
        title: `Expansion: ${e.offerType.replace(/_/g, " ")} — $${(e.projectedLift / 1000).toFixed(0)}K lift`,
        rationale: e.rationale,
        playbookId: "pb-04",
        suggestedAction: "qbr",
      };
    });

  items.push(...topExpansion);

  // 4. Onboarding stall watchlist
  const stalls = buyers
    .filter((b) => segmentForBuyer(b) === "onboarding")
    .slice(0, 3)
    .map<AgentQueueItem>((b) => ({
      merchantId: b.id,
      merchantName: b.companyName,
      priority: "medium",
      segment: "onboarding",
      title: `Activation watch — only ${b.totalOrders} invoice(s) in first 60d`,
      rationale: `New merchant, ${supportTickets.filter((t) => t.merchantId === b.id).length} support ticket(s) open. Book white-glove onboarding call.`,
      playbookId: "pb-03",
      suggestedAction: "phone",
    }));

  items.push(...stalls);

  return items.slice(0, 16);
}

// ── Karpathy Loop Telemetry ────────────────────────────────────────────────
function buildLoopStats(): LoopStats {
  const cycles: LoopCycle[] = [];
  const now = Date.now();
  let runningAcceptance = 0.58;
  let runningAccuracy = 0.66;
  for (let c = 1; c <= 6; c++) {
    const interventions = randInt(28, 62);
    runningAcceptance = Math.min(0.86, runningAcceptance + randFloat(0.01, 0.04));
    runningAccuracy = Math.min(0.92, runningAccuracy + randFloat(0.01, 0.035));
    cycles.push({
      id: `cycle-${c}`,
      cycle: c,
      timestamp: new Date(now - (6 - c) * 15 * 86400000).toISOString(),
      interventionsCount: interventions,
      acceptanceRate: +runningAcceptance.toFixed(2),
      avgTimeToOutcomeHrs: +randFloat(4, 38).toFixed(1),
      promptAccuracyScore: +runningAccuracy.toFixed(2),
      notableLearnings: [
        c === 1
          ? "Baseline: rule-based dunning. 58% acceptance."
          : c === 2
            ? "Added tone-match by industry. +4 pts acceptance in food_beverage."
            : c === 3
              ? "Pull-date realignment pattern learned. Cut avg time-to-outcome by 9h."
              : c === 4
                ? "Network-context added to expansion prompts. Cross-sell acceptance +11 pts."
                : c === 5
                  ? "Critical-tier early-handoff rule learned — reduced wasted agent cycles."
                  : "CFO-vs-AP routing learned. High-LTV accounts hit CFO path by default.",
      ],
    });
  }
  const totalInterventions = cycles.reduce((s, c) => s + c.interventionsCount, 0);
  const cumulativeAcceptance =
    cycles.reduce((s, c) => s + c.acceptanceRate * c.interventionsCount, 0) / totalInterventions;
  const promptDelta = (cycles[cycles.length - 1].promptAccuracyScore - cycles[0].promptAccuracyScore) * 100;
  return {
    currentCycle: cycles.length,
    cycles,
    totalInterventions,
    cumulativeAcceptance: +cumulativeAcceptance.toFixed(2),
    promptDeltaSinceBaseline: +promptDelta.toFixed(1),
    lastUpdated: new Date().toISOString(),
  };
}

export const loopStats: LoopStats = buildLoopStats();

// ── CS Dashboard Data ──────────────────────────────────────────────────────
export const csDashboardData: CSDashboardData = {
  segments: buildSegmentSummary(),
  agentQueue: buildAgentQueue(),
  loopStats,
  ticketsOpen: supportTickets.filter((t) => !t.resolvedAt).length,
  qbrsDueNext30Days: healthScores.filter((h) => h.band === "thriving" || h.band === "activated").length,
  expansionOpportunities: expansionSignals.length,
  expansionValue: expansionSignals.reduce((s, e) => s + e.projectedLift, 0),
};

// ── Lookup helpers ─────────────────────────────────────────────────────────
export function getHealthScore(merchantId: string): HealthScore | undefined {
  return healthScores.find((h) => h.merchantId === merchantId);
}

export function getMerchantTickets(merchantId: string): SupportTicket[] {
  return supportTickets
    .filter((t) => t.merchantId === merchantId)
    .sort((a, b) => (b.openedAt > a.openedAt ? 1 : -1));
}

export function getMerchantActions(merchantId: string): CSMAction[] {
  return csmActions
    .filter((a) => a.merchantId === merchantId)
    .sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1));
}

export function getMerchantExpansion(merchantId: string): ExpansionSignal | undefined {
  return expansionSignals.find((e) => e.merchantId === merchantId);
}

export function getMerchantNetworkEdges(merchantId: string) {
  return networkEdges.filter((e) => e.source === merchantId || e.target === merchantId);
}

export function getMerchantInvoicesSummary(merchantId: string) {
  const list = invoices.filter((i) => i.buyerId === merchantId);
  const paid = list.filter((i) => i.status === "paid").length;
  const overdue = list.filter((i) => i.status === "overdue" || i.status === "defaulted").length;
  return { total: list.length, paid, overdue, invoices: list };
}
