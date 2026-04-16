// ============================================================================
// Backd CollectIQ — Synthetic Demo Data
// All data is in-memory, deterministic (seeded PRNG), no database needed.
// ============================================================================

import type {
  Seller, Buyer, Invoice, Payment, CollectionCase, CollectionActionEntry,
  RiskAlert, RiskSignal, NetworkNode, NetworkEdge, NetworkInsight,
  PortfolioMetrics, MonthlyTrend, ABComparison, DashboardStats, ScenarioInput,
  ScenarioResult, BuyerRiskTier, Industry, InvoiceStatus, CollectionStage,
  PaymentRail, CollectionAction,
} from "@/types";

// ── Seeded PRNG (mulberry32) ────────────────────────────────────────────────
let _seed = 42;
function rand(): number {
  _seed |= 0; _seed = (_seed + 0x6D2B79F5) | 0;
  let t = Math.imul(_seed ^ (_seed >>> 15), 1 | _seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function randInt(min: number, max: number) { return Math.floor(rand() * (max - min + 1)) + min; }
function randFloat(min: number, max: number, dec = 2) { return +(rand() * (max - min) + min).toFixed(dec); }
function pick<T>(arr: readonly T[]): T { return arr[Math.floor(rand() * arr.length)]; }
function pickN<T>(arr: readonly T[], n: number): T[] {
  const copy = [...arr]; const result: T[] = [];
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    const idx = Math.floor(rand() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}
function randDate(start: string, end: string): string {
  const s = new Date(start).getTime(), e = new Date(end).getTime();
  return new Date(s + rand() * (e - s)).toISOString().split("T")[0];
}
function uid(prefix: string, i: number) { return `${prefix}-${String(i).padStart(3, "0")}`; }

// ── Reference Data ──────────────────────────────────────────────────────────
const CITIES: [string, string][] = [
  ["Austin", "TX"], ["Houston", "TX"], ["Dallas", "TX"], ["San Antonio", "TX"],
  ["Chicago", "IL"], ["Atlanta", "GA"], ["Portland", "OR"], ["Denver", "CO"],
  ["Phoenix", "AZ"], ["Nashville", "TN"], ["Charlotte", "NC"], ["Minneapolis", "MN"],
  ["Kansas City", "MO"], ["Indianapolis", "IN"], ["Columbus", "OH"], ["Tampa", "FL"],
  ["Salt Lake City", "UT"], ["Raleigh", "NC"], ["Louisville", "KY"], ["Memphis", "TN"],
];

const BUYER_PREFIXES = [
  "Apex", "Summit", "Frontier", "Pacific", "Atlantic", "Midwest", "Southern",
  "Northern", "Central", "Western", "Eastern", "Coastal", "Mountain", "Valley",
  "Prairie", "Metro", "National", "American", "United", "Premier", "Elite",
  "Golden", "Silver", "Diamond", "Platinum", "Legacy", "Heritage", "Liberty",
  "Eagle", "Falcon", "Horizon", "Pinnacle", "Titan", "Atlas", "Sterling",
  "Crown", "Royal", "Capital", "Prime", "Select", "Superior", "Allied",
  "Continental", "Global", "Interstate", "Regional", "Delta", "Omega", "Phoenix",
  "Cornerstone",
];
const BUYER_SUFFIXES_BY_INDUSTRY: Record<Industry, string[]> = {
  food_beverage: ["Restaurant Group", "Food Co.", "Catering Supply", "Dining Services", "Gourmet Distributors", "Kitchen Supply", "Bakery Supply", "Food Market"],
  industrial_equipment: ["Equipment Rentals", "Machine Works", "Industrial Co.", "Fabrication Inc.", "Tooling Supply", "Heavy Equipment", "Power Systems", "Automation Inc."],
  construction_supply: ["Builders", "Construction Co.", "Contracting Inc.", "Concrete Works", "Masonry Supply", "Roofing Co.", "Plumbing Supply", "Electrical Supply"],
  manufacturing: ["Manufacturing", "Production Co.", "Assembly Inc.", "Components Ltd.", "Precision Mfg.", "Custom Fabrication", "Processing Inc."],
  wholesale_distribution: ["Wholesale", "Distribution Co.", "Trading Inc.", "Supply Chain Co.", "Logistics Group", "Warehousing Inc."],
  medical_supply: ["Medical Supply", "Healthcare Solutions", "Clinical Supply", "Surgical Instruments", "Lab Equipment Co.", "Pharma Distribution"],
  electronics: ["Electronics", "Tech Supply", "Component Distributors", "Circuit Systems", "Semiconductor Supply", "Digital Solutions"],
  agricultural: ["Farm Supply", "Agricultural Co.", "Agri-Products", "Seed & Feed", "Ranch Supply", "Harvest Equipment"],
};

// ── Sellers (30) ────────────────────────────────────────────────────────────
const SELLER_DEFS: { name: string; industry: Industry }[] = [
  // Food & Beverage (8)
  { name: "Great Lakes Food Service", industry: "food_beverage" },
  { name: "Pacific Provisions Co.", industry: "food_beverage" },
  { name: "Southern Harvest Distribution", industry: "food_beverage" },
  { name: "Midwest Dairy Supply", industry: "food_beverage" },
  { name: "Atlantic Seafood Wholesale", industry: "food_beverage" },
  { name: "Prairie Grain Distributors", industry: "food_beverage" },
  { name: "Gulf Coast Produce", industry: "food_beverage" },
  { name: "Mountain Valley Foods", industry: "food_beverage" },
  // Industrial Equipment (7)
  { name: "Summit Industrial Supply", industry: "industrial_equipment" },
  { name: "Ironclad Equipment Co.", industry: "industrial_equipment" },
  { name: "Precision Parts Wholesale", industry: "industrial_equipment" },
  { name: "Atlas Machinery Distribution", industry: "industrial_equipment" },
  { name: "Continental Industrial", industry: "industrial_equipment" },
  { name: "Pioneer Steel Supply", industry: "industrial_equipment" },
  { name: "Apex Manufacturing Supply", industry: "industrial_equipment" },
  // Construction Supply (6)
  { name: "Cornerstone Building Supply", industry: "construction_supply" },
  { name: "RedRock Construction Materials", industry: "construction_supply" },
  { name: "Cascade Lumber Wholesale", industry: "construction_supply" },
  { name: "Metro Concrete Supply", industry: "construction_supply" },
  { name: "Sunbelt Building Products", industry: "construction_supply" },
  { name: "Foundation Materials Co.", industry: "construction_supply" },
  // Others (9)
  { name: "MedLine Supply Network", industry: "medical_supply" },
  { name: "TechParts Distribution", industry: "electronics" },
  { name: "AgriFlow Supply Co.", industry: "agricultural" },
  { name: "NorthStar Wholesale Group", industry: "wholesale_distribution" },
  { name: "Heartland Distribution Co.", industry: "wholesale_distribution" },
  { name: "ClearPath Medical Devices", industry: "medical_supply" },
  { name: "CircuitMax Electronics", industry: "electronics" },
  { name: "Heritage Manufacturing Supply", industry: "manufacturing" },
  { name: "GreenField Agricultural", industry: "agricultural" },
];

export const sellers: Seller[] = SELLER_DEFS.map((def, i) => {
  const [city, state] = pick(CITIES);
  return {
    id: uid("seller", i + 1),
    name: def.name,
    industry: def.industry,
    avgMonthlyVolume: randInt(200000, 2000000),
    totalBuyers: 0, // filled after buyers generated
    city, state,
    joinedAt: randDate("2024-01-01", "2025-06-01"),
  };
});

// ── Industry → Seller index ─────────────────────────────────────────────────
const sellersByIndustry: Record<string, string[]> = {};
for (const s of sellers) {
  (sellersByIndustry[s.industry] ??= []).push(s.id);
}
const allSellerIds = sellers.map(s => s.id);

// ── Buyers (200) ────────────────────────────────────────────────────────────
interface TierParams {
  riskMin: number; riskMax: number; onTimeMin: number; onTimeMax: number;
  velMin: number; velMax: number; trendMin: number; trendMax: number;
  velTrendMin: number; velTrendMax: number; disputeMin: number; disputeMax: number;
  tier: BuyerRiskTier;
}
const TIER_PARAMS: TierParams[] = [
  { tier: "low", riskMin: 5, riskMax: 25, onTimeMin: 0.92, onTimeMax: 1.0, velMin: 15, velMax: 28, trendMin: 0.0, trendMax: 0.5, velTrendMin: -0.05, velTrendMax: 0.1, disputeMin: 0, disputeMax: 0.02 },
  { tier: "medium", riskMin: 30, riskMax: 50, onTimeMin: 0.65, onTimeMax: 0.90, velMin: 28, velMax: 45, trendMin: -0.2, trendMax: 0.1, velTrendMin: -0.15, velTrendMax: 0.0, disputeMin: 0.02, disputeMax: 0.08 },
  { tier: "high", riskMin: 55, riskMax: 75, onTimeMin: 0.40, onTimeMax: 0.65, velMin: 45, velMax: 70, trendMin: -0.6, trendMax: -0.1, velTrendMin: -0.3, velTrendMax: -0.1, disputeMin: 0.05, disputeMax: 0.15 },
  { tier: "critical", riskMin: 80, riskMax: 95, onTimeMin: 0.10, onTimeMax: 0.40, velMin: 70, velMax: 120, trendMin: -0.9, trendMax: -0.4, velTrendMin: -0.5, velTrendMax: -0.2, disputeMin: 0.15, disputeMax: 0.35 },
];
const TIER_COUNTS = [140, 30, 20, 10];

const _buyers: Buyer[] = [];
let buyerIdx = 1;
for (let t = 0; t < 4; t++) {
  const p = TIER_PARAMS[t];
  for (let i = 0; i < TIER_COUNTS[t]; i++) {
    const industry = pick(Object.keys(BUYER_SUFFIXES_BY_INDUSTRY) as Industry[]);
    const suffix = pick(BUYER_SUFFIXES_BY_INDUSTRY[industry]);
    const prefix = pick(BUYER_PREFIXES);
    const companyName = `${prefix} ${suffix}`;
    const [city, state] = pick(CITIES);

    // Connect to sellers — prefer same industry, allow cross-industry
    const numSellers = randInt(1, 4);
    const sameIndustry = sellersByIndustry[industry] ?? [];
    const connected: string[] = [];
    for (let s = 0; s < numSellers; s++) {
      const pool = (s < Math.ceil(numSellers * 0.7) && sameIndustry.length > 0) ? sameIndustry : allSellerIds;
      const sid = pick(pool);
      if (!connected.includes(sid)) connected.push(sid);
    }

    const creditLimit = randInt(25000, 500000);
    const exposure = randFloat(creditLimit * 0.1, creditLimit * 0.8, 0);
    _buyers.push({
      id: uid("buyer", buyerIdx),
      companyName,
      industry,
      creditLimit,
      currentExposure: +exposure,
      riskTier: p.tier,
      riskScore: randInt(p.riskMin, p.riskMax),
      paymentVelocity: randInt(p.velMin, p.velMax),
      avgOrderSize: randInt(5000, 200000),
      totalOrders: randInt(p.tier === "critical" ? 3 : 5, p.tier === "low" ? 50 : 25),
      onTimeRate: randFloat(p.onTimeMin, p.onTimeMax),
      daysSinceLastOrder: p.tier === "critical" ? randInt(30, 120) : randInt(1, 45),
      city, state,
      connectedSellers: connected,
      joinedAt: randDate("2024-06-01", "2025-12-01"),
      orderFrequencyTrend: randFloat(p.trendMin, p.trendMax),
      paymentVelocityTrend: randFloat(p.velTrendMin, p.velTrendMax),
      disputeRate: randFloat(p.disputeMin, p.disputeMax),
    });
    buyerIdx++;
  }
}
export const buyers: Buyer[] = _buyers;

// Update seller buyer counts
for (const b of buyers) {
  for (const sid of b.connectedSellers) {
    const s = sellers.find(x => x.id === sid);
    if (s) s.totalBuyers++;
  }
}

// ── Invoices (~800) ─────────────────────────────────────────────────────────
const TERMS: string[] = ["net_30", "net_30", "net_30", "net_60", "net_60", "net_90"];
function termDays(t: string) { return t === "net_90" ? 90 : t === "net_60" ? 60 : 30; }

function invoiceStatusForTier(tier: BuyerRiskTier): InvoiceStatus {
  const r = rand();
  switch (tier) {
    case "low": return r < 0.75 ? "paid" : r < 0.85 ? "pending" : r < 0.95 ? "issued" : "partial";
    case "medium": return r < 0.50 ? "paid" : r < 0.65 ? "partial" : r < 0.80 ? "pending" : r < 0.90 ? "overdue" : "issued";
    case "high": return r < 0.30 ? "paid" : r < 0.45 ? "partial" : r < 0.60 ? "overdue" : r < 0.75 ? "pending" : r < 0.85 ? "defaulted" : "issued";
    case "critical": return r < 0.15 ? "paid" : r < 0.25 ? "partial" : r < 0.45 ? "overdue" : r < 0.70 ? "defaulted" : r < 0.85 ? "written_off" : "pending";
  }
}

const _invoices: Invoice[] = [];
let invIdx = 1;
for (const buyer of buyers) {
  const count = buyer.riskTier === "critical" ? randInt(2, 5) : buyer.riskTier === "high" ? randInt(3, 6) : randInt(3, 8);
  for (let i = 0; i < count; i++) {
    const sellerId = pick(buyer.connectedSellers);
    const terms = pick(TERMS);
    const td = termDays(terms);
    const issuedAt = randDate("2025-04-01", "2026-03-15");
    const dueDate = new Date(new Date(issuedAt).getTime() + td * 86400000).toISOString().split("T")[0];
    const status = invoiceStatusForTier(buyer.riskTier);
    const amount = randInt(5000, Math.min(buyer.avgOrderSize * 2, 500000));
    const paidAmount = status === "paid" ? amount : status === "partial" ? Math.round(amount * randFloat(0.3, 0.7)) : 0;
    const paidAt = (status === "paid" || status === "partial")
      ? new Date(new Date(dueDate).getTime() + randInt(-10, buyer.paymentVelocity) * 86400000).toISOString().split("T")[0]
      : null;

    _invoices.push({
      id: uid("inv", invIdx),
      buyerId: buyer.id,
      sellerId,
      amount, issuedAt, dueDate, paidAt, paidAmount, status, terms,
      poNumber: `PO-${randInt(10000, 99999)}`,
    });
    invIdx++;
  }
}
export const invoices: Invoice[] = _invoices;

// ── Payments (~600) ─────────────────────────────────────────────────────────
const RAIL_WEIGHTS: [PaymentRail, number][] = [["ach", 70], ["rtp", 15], ["check", 10], ["fedwire", 4], ["virtual_card", 1]];
function pickRail(): PaymentRail {
  const total = RAIL_WEIGHTS.reduce((s, [, w]) => s + w, 0);
  let r = rand() * total;
  for (const [rail, w] of RAIL_WEIGHTS) { r -= w; if (r <= 0) return rail; }
  return "ach";
}

const _payments: Payment[] = [];
let payIdx = 1;
for (const inv of invoices) {
  if (!inv.paidAt) continue;
  const dueMs = new Date(inv.dueDate).getTime();
  const paidMs = new Date(inv.paidAt).getTime();
  const daysFromDue = Math.round((paidMs - dueMs) / 86400000);
  _payments.push({
    id: uid("pay", payIdx++),
    invoiceId: inv.id,
    buyerId: inv.buyerId,
    amount: inv.paidAmount,
    rail: pickRail(),
    processedAt: inv.paidAt,
    daysFromDue,
  });
}
export const payments: Payment[] = _payments;

// ── Collection Cases (45) ───────────────────────────────────────────────────

// --- 3 Showcase Cases (handwritten) ---

const showcaseCase1: CollectionCase = {
  id: "case-showcase-1",
  invoiceId: "inv-showcase-1",
  buyerId: "buyer-150",
  sellerId: "seller-001",
  buyerName: "Midwest Restaurant Group",
  sellerName: "Great Lakes Food Service",
  amount: 95000,
  dueDate: "2026-02-15",
  daysOverdue: 0,
  stage: "resolved",
  riskTier: "medium",
  actions: [
    {
      id: "act-s1-1", caseId: "case-showcase-1", action: "email_reminder",
      timestamp: "2026-02-10T09:00:00Z", channel: "email",
      reasoning: "Pre-due analysis: Buyer has paid 3 of last 5 invoices 5-10 days late. Pattern suggests cash flow timing issue around the 15th of each month when their own AR collections peak. Scheduling proactive reminder for day 25 of the 30-day term with personalized payment flexibility options.",
      outcome: "Email sent. Open rate tracked.", railUsed: null, isAgentAction: true,
    },
    {
      id: "act-s1-2", caseId: "case-showcase-1", action: "email_reminder",
      timestamp: "2026-02-15T08:00:00Z", channel: "email",
      reasoning: "Payment due today. No payment received. Sending personalized reminder emphasizing flexible payment options including ACH pull scheduling for next week. Tone: collaborative, not punitive — this buyer has strong lifetime value ($1.2M over 18 months).",
      outcome: "Email opened within 2 hours, no action taken.", railUsed: null, isAgentAction: true,
    },
    {
      id: "act-s1-3", caseId: "case-showcase-1", action: "phone_call",
      timestamp: "2026-02-18T14:30:00Z", channel: "phone",
      reasoning: "Buyer opened email but no action after 3 days. Analyzing buyer's network: they pay 2 other Backd sellers (Summit Industrial, Metro Concrete) on time. This invoice may be deprioritized due to amount. Escalating to direct phone call to AP department.",
      outcome: "Reached AP manager. Confirmed cash flow timing issue — their largest customer pays on the 20th.", railUsed: null, isAgentAction: true,
    },
    {
      id: "act-s1-4", caseId: "case-showcase-1", action: "payment_plan_offer",
      timestamp: "2026-02-20T10:00:00Z", channel: "phone",
      reasoning: "Phone call successful. Buyer confirmed cash flow timing issue — their largest customer pays on the 20th. Offering restructured payment: 50% immediate ACH pull ($47,500), 50% scheduled for the 22nd ($47,500). No late fees applied given proactive communication and strong payment history.",
      outcome: "Buyer accepted payment plan. ACH pull authorized for today and the 22nd.", railUsed: "ach", isAgentAction: true,
    },
    {
      id: "act-s1-5", caseId: "case-showcase-1", action: "pause",
      timestamp: "2026-02-20T16:00:00Z", channel: "system",
      reasoning: "Partial payment of $47,500 received via ACH. Monitoring for second installment on 2026-02-22.",
      outcome: "First payment confirmed. $47,500 received.", railUsed: "ach", isAgentAction: false,
    },
    {
      id: "act-s1-6", caseId: "case-showcase-1", action: "pause",
      timestamp: "2026-02-22T17:00:00Z", channel: "system",
      reasoning: "Remaining $47,500 received via scheduled ACH pull. Case resolved. Total recovery: 100%. Days to resolution: 7 from due date. Agent intervention saved an estimated 15-20 additional days vs. standard dunning sequence.",
      outcome: "Full payment received. Case closed.", railUsed: "ach", isAgentAction: true,
    },
  ],
  agentRecommendation: "Recovery complete. Recommend maintaining enhanced monitoring for this buyer's next 2 invoices to confirm cash flow pattern is stable.",
  isResolved: true,
  resolvedAt: "2026-02-22",
  recoveredAmount: 95000,
};

const showcaseCase2: CollectionCase = {
  id: "case-showcase-2",
  invoiceId: "inv-showcase-2",
  buyerId: "buyer-175",
  sellerId: "seller-009",
  buyerName: "Coastal Equipment Rentals",
  sellerName: "Summit Industrial Supply",
  amount: 127000,
  dueDate: "2026-01-20",
  daysOverdue: 76,
  stage: "escalation",
  riskTier: "high",
  actions: [
    {
      id: "act-s2-1", caseId: "case-showcase-2", action: "email_reminder",
      timestamp: "2026-01-10T08:00:00Z", channel: "system",
      reasoning: "Early warning triggered: Order frequency down 40% over last quarter. Payment velocity increased from avg 25 days to 42 days on recent invoices. Risk score elevated from 35 to 62. Initiating enhanced monitoring and pre-due engagement strategy.",
      outcome: "Enhanced monitoring active. Pre-due reminder scheduled.", railUsed: null, isAgentAction: true,
    },
    {
      id: "act-s2-2", caseId: "case-showcase-2", action: "email_reminder",
      timestamp: "2026-01-20T08:00:00Z", channel: "email",
      reasoning: "Invoice for $127,000 now due. Given elevated risk profile, sending priority reminder with payment plan options prominently featured. Including direct phone number for AR specialist.",
      outcome: "Email sent. No open detected after 48 hours.", railUsed: null, isAgentAction: true,
    },
    {
      id: "act-s2-3", caseId: "case-showcase-2", action: "phone_call",
      timestamp: "2026-01-27T11:00:00Z", channel: "phone",
      reasoning: "No response to email after 7 days. Switching to phone outreach. Buyer's industry (industrial equipment) showing sector-wide slowdown — equipment rental demand down 12% per BLS data. Contextualizing outreach with industry awareness.",
      outcome: "Left voicemail with AP department. Callback requested within 48 hours.", railUsed: null, isAgentAction: true,
    },
    {
      id: "act-s2-4", caseId: "case-showcase-2", action: "payment_plan_offer",
      timestamp: "2026-01-30T14:00:00Z", channel: "phone",
      reasoning: "Phone contact made with CFO. Buyer reports major client delayed $340K payment to them, creating cascading cash flow impact. Offering structured plan: $42,333 now, $42,333 in 30 days, $42,334 in 60 days. 0% additional cost for first 30 days as goodwill gesture to preserve long-term relationship (buyer has $890K lifetime volume).",
      outcome: "CFO accepted 3-installment plan. First payment via RTP to expedite.", railUsed: "rtp", isAgentAction: true,
    },
    {
      id: "act-s2-5", caseId: "case-showcase-2", action: "pause",
      timestamp: "2026-02-01T10:00:00Z", channel: "system",
      reasoning: "First installment of $42,333 received via RTP. Payment confirmed within 2 business days of agreement. Positive signal for plan adherence.",
      outcome: "First installment confirmed. $42,333 received.", railUsed: "rtp", isAgentAction: false,
    },
    {
      id: "act-s2-6", caseId: "case-showcase-2", action: "email_reminder",
      timestamp: "2026-02-25T08:00:00Z", channel: "system",
      reasoning: "Rule-based check: First installment confirmed. Second installment due 2026-03-01. Scheduling automated reminder 5 days before due date per payment plan terms.",
      outcome: "Automated reminder sent.", railUsed: null, isAgentAction: false,
    },
    {
      id: "act-s2-7", caseId: "case-showcase-2", action: "phone_call",
      timestamp: "2026-03-04T09:00:00Z", channel: "phone",
      reasoning: "Second installment 3 days overdue. Agent re-engaging: buyer's payment pattern on other invoices still showing stress signals. Sending empathetic follow-up emphasizing partnership and mutual benefit. Cross-referencing: buyer's largest client (referenced in initial call) has since made partial payment — cash flow may be improving.",
      outcome: "Reached buyer. Payment confirmed for processing.", railUsed: null, isAgentAction: true,
    },
    {
      id: "act-s2-8", caseId: "case-showcase-2", action: "pause",
      timestamp: "2026-03-08T15:00:00Z", channel: "system",
      reasoning: "Second installment of $42,333 received via ACH. 8 days late but within acceptable variance. Monitoring third installment due 2026-03-30. Current recovery: $84,666 of $127,000 (66.7%).",
      outcome: "Second installment confirmed. $84,666 total recovered so far.", railUsed: "ach", isAgentAction: true,
    },
  ],
  agentRecommendation: "Two of three installments collected. Third installment ($42,334) due 2026-03-30. Recommend continued enhanced monitoring. Buyer showing early signs of cash flow stabilization — their order frequency has ticked up 8% in the last 30 days.",
  isResolved: false,
  resolvedAt: null,
  recoveredAmount: 84666,
};

const showcaseCase3: CollectionCase = {
  id: "case-showcase-3",
  invoiceId: "inv-showcase-3",
  buyerId: "buyer-195",
  sellerId: "seller-016",
  buyerName: "Desert Valley Materials",
  sellerName: "Cornerstone Building Supply",
  amount: 215000,
  dueDate: "2026-01-05",
  daysOverdue: 91,
  stage: "collections_team",
  riskTier: "critical",
  actions: [
    {
      id: "act-s3-1", caseId: "case-showcase-3", action: "email_reminder",
      timestamp: "2025-12-20T08:00:00Z", channel: "system",
      reasoning: "CRITICAL ALERT: Buyer risk score at 87. Last 3 invoices averaged 55 days overdue. Dispute filed on previous invoice (INV-7823, $78K). Order volume down 65% year-over-year. Construction sector in buyer's region (Phoenix, AZ) showing 18% decline in new permits. Flagging for enhanced collection protocol with aggressive timeline.",
      outcome: "Enhanced monitoring activated. Collections priority: HIGH.", railUsed: null, isAgentAction: true,
    },
    {
      id: "act-s3-2", caseId: "case-showcase-3", action: "email_reminder",
      timestamp: "2026-01-05T08:00:00Z", channel: "email",
      reasoning: "Invoice for $215,000 due today. Given critical risk profile, sending formal payment demand via email with read receipt. Tone: firm but professional. Including explicit payment instructions for ACH and wire transfer.",
      outcome: "Email opened on 2026-01-06. No response.", railUsed: null, isAgentAction: true,
    },
    {
      id: "act-s3-3", caseId: "case-showcase-3", action: "phone_call",
      timestamp: "2026-01-08T10:00:00Z", channel: "phone",
      reasoning: "Email opened but no response after 3 days. Cross-referencing network: buyer has stopped ordering from 2 other Backd sellers (Metro Concrete Supply, Sunbelt Building Products) in the last 60 days. Combined outstanding: $340K across 3 sellers. Potential business distress signal. Escalating to direct phone outreach.",
      outcome: "Phone call — no answer. Voicemail left referencing specific invoice and requesting callback within 48 hours.", railUsed: null, isAgentAction: true,
    },
    {
      id: "act-s3-4", caseId: "case-showcase-3", action: "phone_call",
      timestamp: "2026-01-12T14:00:00Z", channel: "phone",
      reasoning: "No callback received after 4 days. Second phone attempt. Trying alternate contact (CFO direct line from company records).",
      outcome: "No answer on main line. Reached CFO on direct line.", railUsed: null, isAgentAction: true,
    },
    {
      id: "act-s3-5", caseId: "case-showcase-3", action: "payment_plan_offer",
      timestamp: "2026-01-12T14:30:00Z", channel: "phone",
      reasoning: "CFO acknowledged debt but cited severe cash flow constraints — two major construction projects delayed, subcontractor disputes pending. Offered emergency payment plan: $53,750/month over 4 months. CFO requested time to review with ownership.",
      outcome: "CFO agreed to discuss internally and respond by 2026-01-19.", railUsed: null, isAgentAction: true,
    },
    {
      id: "act-s3-6", caseId: "case-showcase-3", action: "term_extension",
      timestamp: "2026-01-17T09:00:00Z", channel: "system",
      reasoning: "Agent analysis: 7-day extension acceptable given direct CFO engagement and explicit acknowledgment of debt. Setting hard deadline at 2026-01-24 for first payment or confirmed payment plan. If no response by deadline, escalating to formal collections.",
      outcome: "Extension granted. Deadline set for 2026-01-24.", railUsed: null, isAgentAction: true,
    },
    {
      id: "act-s3-7", caseId: "case-showcase-3", action: "final_notice",
      timestamp: "2026-01-25T08:00:00Z", channel: "email",
      reasoning: "Deadline passed. No payment received, no communication from buyer. Sending formal final notice via email with 7-day cure period before escalation to external collections.",
      outcome: "Final notice sent. Read receipt confirmed 2026-01-26.", railUsed: null, isAgentAction: false,
    },
    {
      id: "act-s3-8", caseId: "case-showcase-3", action: "phone_call",
      timestamp: "2026-01-30T11:00:00Z", channel: "phone",
      reasoning: "Cure period expiring. Attempting final phone contact before human handoff.",
      outcome: "Call went to voicemail. No response.", railUsed: null, isAgentAction: true,
    },
    {
      id: "act-s3-9", caseId: "case-showcase-3", action: "human_handoff",
      timestamp: "2026-02-04T09:00:00Z", channel: "system",
      reasoning: "All automated collection attempts exhausted over 30 days. Summary: 3 emails (1 opened, no response), 3 phone attempts (1 successful contact with CFO), 1 formal final notice, 1 payment plan offered but not executed. Buyer has not made any payment. Dispute active on separate invoice. Recommending human handoff to senior collections specialist with full case file. Estimated recovery probability: 35% based on similar profiles. Network analysis suggests buyer may be approaching insolvency — recommend expedited legal review.",
      outcome: "Case transferred to senior collections team.", railUsed: null, isAgentAction: true,
    },
    {
      id: "act-s3-10", caseId: "case-showcase-3", action: "escalate",
      timestamp: "2026-02-05T08:00:00Z", channel: "system",
      reasoning: "Case formally escalated to human collections team. Agent monitoring suspended. All case documentation and communication history packaged for handoff.",
      outcome: "Human collections team acknowledged receipt. Case number: HC-2026-0089.", railUsed: null, isAgentAction: false,
    },
  ],
  agentRecommendation: "Case requires human intervention. Agent exhausted all automated options. Key concern: buyer's distress appears structural (regional construction downturn + subcontractor disputes), not temporary. Recommend engaging legal counsel to preserve lien rights within statutory deadline.",
  isResolved: false,
  resolvedAt: null,
  recoveredAmount: 0,
};

// --- Generated Collection Cases (42 more) ---
const AGENT_REASONINGS = [
  "Payment is {days} days overdue. Buyer has {onTimeRate}% on-time rate historically. Sending {channel} reminder with standard payment instructions.",
  "Buyer's payment velocity has increased by {velChange} days over the last quarter. Adjusting collection approach from automated to personalized outreach.",
  "Cross-network analysis: buyer maintains good standing with {otherSellers} other Backd sellers. This invoice may be a priority issue rather than systemic. Targeting direct AP contact.",
  "Industry sector ({industry}) showing {trend} signals. Adjusting dunning tone to be more collaborative given market conditions.",
  "Buyer dispute rate is {disputeRate}%. Preemptively reaching out to resolve any quality concerns before escalating collection efforts.",
  "Payment plan compliance at {compliance}% — buyer has made {made} of {total} agreed installments on time. Maintaining current monitoring cadence.",
];
const RULE_REASONINGS = [
  "Invoice {days} days past due. Sending standard reminder #{reminderNum} per collection policy.",
  "Automated follow-up: no response to previous reminder sent {daysSince} days ago. Escalating to next dunning stage.",
  "Payment plan installment due. Sending automated reminder per agreed schedule.",
  "30-day review: no payment received. Flagging for escalation per policy.",
];

const generatedCases: CollectionCase[] = [];
const overdueInvoices = invoices.filter(inv => inv.status === "overdue" || inv.status === "defaulted" || inv.status === "written_off");
const caseBuyers = new Set<string>();

for (let c = 0; c < Math.min(42, overdueInvoices.length); c++) {
  const inv = overdueInvoices[c];
  if (caseBuyers.has(inv.buyerId) && rand() > 0.3) continue;
  caseBuyers.add(inv.buyerId);

  const buyer = buyers.find(b => b.id === inv.buyerId)!;
  const seller = sellers.find(s => s.id === inv.sellerId)!;
  if (!buyer || !seller) continue;

  const daysOverdue = Math.max(1, Math.round((Date.now() - new Date(inv.dueDate).getTime()) / 86400000));
  const numActions = randInt(2, 4);
  const actions: CollectionActionEntry[] = [];
  const actionTypes: CollectionAction[] = ["email_reminder", "sms_reminder", "phone_call", "payment_plan_offer", "escalate"];

  for (let a = 0; a < numActions; a++) {
    const isAgent = rand() > 0.4;
    const action = pick(actionTypes.slice(0, Math.min(a + 2, actionTypes.length)));
    const dayOffset = Math.round((a / numActions) * daysOverdue);
    const ts = new Date(new Date(inv.dueDate).getTime() + dayOffset * 86400000).toISOString();

    const reasoning = isAgent
      ? pick(AGENT_REASONINGS)
          .replace("{days}", String(dayOffset))
          .replace("{onTimeRate}", String(Math.round(buyer.onTimeRate * 100)))
          .replace("{channel}", action === "phone_call" ? "phone" : "email")
          .replace("{velChange}", String(randInt(5, 20)))
          .replace("{otherSellers}", String(buyer.connectedSellers.length - 1))
          .replace("{industry}", buyer.industry.replace("_", " "))
          .replace("{trend}", rand() > 0.5 ? "mixed" : "challenging")
          .replace("{disputeRate}", String(Math.round(buyer.disputeRate * 100)))
          .replace("{compliance}", String(randInt(50, 100)))
          .replace("{made}", String(randInt(1, 3)))
          .replace("{total}", String(randInt(3, 4)))
      : pick(RULE_REASONINGS)
          .replace("{days}", String(dayOffset))
          .replace("{reminderNum}", String(a + 1))
          .replace("{daysSince}", String(randInt(3, 10)));

    actions.push({
      id: uid("act-g", c * 10 + a),
      caseId: uid("case-gen", c),
      action,
      timestamp: ts,
      channel: action === "phone_call" ? "phone" : action === "sms_reminder" ? "sms" : "email",
      reasoning,
      outcome: rand() > 0.5 ? "Pending response" : a === numActions - 1 && rand() > 0.6 ? "Partial payment received" : null,
      railUsed: rand() > 0.8 ? pickRail() : null,
      isAgentAction: isAgent,
    });
  }

  const stages: CollectionStage[] = ["reminder", "follow_up", "escalation", "final_notice", "collections_team"];
  const stageIdx = Math.min(Math.floor(daysOverdue / 15), stages.length - 1);
  const recovered = rand() > 0.6 ? Math.round(inv.amount * randFloat(0.2, 0.8)) : 0;

  generatedCases.push({
    id: uid("case-gen", c),
    invoiceId: inv.id,
    buyerId: inv.buyerId,
    sellerId: inv.sellerId,
    buyerName: buyer.companyName,
    sellerName: seller.name,
    amount: inv.amount,
    dueDate: inv.dueDate,
    daysOverdue,
    stage: stages[stageIdx],
    riskTier: buyer.riskTier,
    actions,
    agentRecommendation: daysOverdue > 60 ? "Recommend escalation to human collections team." : daysOverdue > 30 ? "Recommend payment plan negotiation." : "Continue standard follow-up cadence.",
    isResolved: recovered >= inv.amount,
    resolvedAt: recovered >= inv.amount ? new Date().toISOString().split("T")[0] : null,
    recoveredAmount: recovered,
  });

  if (generatedCases.length >= 42) break;
}

export const collectionCases: CollectionCase[] = [showcaseCase1, showcaseCase2, showcaseCase3, ...generatedCases];

// ── Risk Alerts (18) ────────────────────────────────────────────────────────
const highRiskBuyers = buyers.filter(b => b.riskTier === "high" || b.riskTier === "critical");

function makeSignals(type: string, buyer: Buyer): RiskSignal[] {
  const signals: RiskSignal[] = [];
  if (type.includes("slowdown") || type.includes("default")) {
    signals.push({ name: "Payment Velocity", value: buyer.paymentVelocity, trend: "declining", weight: 0.3 });
    signals.push({ name: "Velocity Trend", value: buyer.paymentVelocityTrend, trend: "declining", weight: 0.25 });
  }
  if (type.includes("decline") || type.includes("default")) {
    signals.push({ name: "Order Frequency", value: buyer.orderFrequencyTrend, trend: "declining", weight: 0.25 });
    signals.push({ name: "Days Since Last Order", value: buyer.daysSinceLastOrder, trend: "declining", weight: 0.2 });
  }
  if (type.includes("exposure")) {
    signals.push({ name: "Current Exposure", value: buyer.currentExposure, trend: "stable", weight: 0.35 });
    signals.push({ name: "Utilization Rate", value: +(buyer.currentExposure / buyer.creditLimit).toFixed(2), trend: "declining", weight: 0.3 });
  }
  if (type.includes("dispute")) {
    signals.push({ name: "Dispute Rate", value: buyer.disputeRate, trend: "declining", weight: 0.4 });
  }
  signals.push({ name: "Risk Score", value: buyer.riskScore, trend: "declining", weight: 0.15 });
  signals.push({ name: "On-Time Rate", value: buyer.onTimeRate, trend: buyer.onTimeRate > 0.5 ? "stable" : "declining", weight: 0.15 });
  return signals;
}

type AlertType = RiskAlert["alertType"];
const ALERT_DEFS: { type: AlertType; severity: RiskAlert["severity"]; count: number; msgTemplate: string }[] = [
  { type: "payment_slowdown", severity: "warning", count: 5, msgTemplate: "{buyer} payment velocity increased {pct}% over last 90 days. Average days to pay: {vel} days." },
  { type: "order_decline", severity: "warning", count: 4, msgTemplate: "{buyer} order frequency declined {pct}% over last quarter. {days} days since last order." },
  { type: "high_exposure", severity: "warning", count: 3, msgTemplate: "{buyer} current exposure ${exp} represents {util}% of credit limit. Concentration risk elevated." },
  { type: "industry_risk", severity: "info", count: 2, msgTemplate: "{buyer}'s industry ({industry}) showing macro headwinds. Recommend portfolio review for sector exposure." },
  { type: "dispute_spike", severity: "warning", count: 2, msgTemplate: "{buyer} dispute rate spiked to {rate}%. {count} disputes filed in last 60 days." },
  { type: "predicted_default", severity: "critical", count: 2, msgTemplate: "PREDICTIVE ALERT: {buyer} has 72% probability of default within 60 days based on multi-signal analysis. Immediate review recommended." },
];

const _alerts: RiskAlert[] = [];
let alertIdx = 0;
let hrIdx = 0;
for (const def of ALERT_DEFS) {
  for (let i = 0; i < def.count; i++) {
    const buyer = highRiskBuyers[hrIdx % highRiskBuyers.length];
    hrIdx++;
    const msg = def.msgTemplate
      .replace("{buyer}", buyer.companyName)
      .replace("{pct}", String(randInt(15, 60)))
      .replace("{vel}", String(buyer.paymentVelocity))
      .replace("{days}", String(buyer.daysSinceLastOrder))
      .replace("{exp}", buyer.currentExposure.toLocaleString())
      .replace("{util}", String(Math.round((buyer.currentExposure / buyer.creditLimit) * 100)))
      .replace("{industry}", buyer.industry.replace(/_/g, " "))
      .replace("{rate}", String(Math.round(buyer.disputeRate * 100)) + "%")
      .replace("{count}", String(randInt(2, 5)));

    _alerts.push({
      id: uid("alert", alertIdx++),
      buyerId: buyer.id,
      buyerName: buyer.companyName,
      alertType: def.type,
      severity: def.type === "predicted_default" ? "critical" : def.severity,
      message: msg,
      confidence: def.type === "predicted_default" ? randFloat(0.7, 0.85) : randFloat(0.55, 0.80),
      detectedAt: randDate("2026-02-01", "2026-04-05"),
      signals: makeSignals(def.type, buyer),
      isAcknowledged: rand() > 0.7,
    });
  }
}
export const riskAlerts: RiskAlert[] = _alerts;

// ── Network Data ────────────────────────────────────────────────────────────
export const networkNodes: NetworkNode[] = [
  ...sellers.map(s => ({
    id: s.id,
    type: "seller" as const,
    name: s.name,
    industry: s.industry,
    connections: s.totalBuyers,
  })),
  ...buyers.map(b => ({
    id: b.id,
    type: "buyer" as const,
    name: b.companyName,
    industry: b.industry,
    riskTier: b.riskTier,
    exposure: b.currentExposure,
    connections: b.connectedSellers.length,
  })),
];

const _edges: NetworkEdge[] = [];
const edgeMap = new Map<string, { volume: number; count: number; totalDays: number; onTimeCount: number }>();
for (const inv of invoices) {
  const key = `${inv.buyerId}-${inv.sellerId}`;
  const e = edgeMap.get(key) ?? { volume: 0, count: 0, totalDays: 0, onTimeCount: 0 };
  e.volume += inv.amount;
  e.count++;
  if (inv.paidAt) {
    const days = Math.round((new Date(inv.paidAt).getTime() - new Date(inv.dueDate).getTime()) / 86400000);
    e.totalDays += Math.max(0, days);
    if (days <= 0) e.onTimeCount++;
  }
  edgeMap.set(key, e);
}
for (const [key, e] of edgeMap) {
  const [source, target] = key.split("-").map((_, i) => key.split("-").slice(0, i === 0 ? 1 : undefined).join("-"));
  const parts = key.split("-");
  _edges.push({
    source: `${parts[0]}-${parts[1]}`,
    target: `${parts[2]}-${parts[3]}`,
    volume: e.volume,
    invoiceCount: e.count,
    avgPaymentDays: e.count > 0 ? Math.round(e.totalDays / e.count) : 0,
    onTimeRate: e.count > 0 ? +(e.onTimeCount / e.count).toFixed(2) : 0,
  });
}
export const networkEdges: NetworkEdge[] = _edges;

export const networkInsights: NetworkInsight[] = [
  {
    type: "expansion",
    title: "Food & Beverage Cluster Expansion",
    description: "12 buyers in the food & beverage cluster purchase from only 1 Backd seller. Cross-selling to 3+ sellers in this cluster could increase per-buyer volume by 180% based on multi-seller buyer patterns.",
    affectedNodes: buyers.filter(b => b.industry === "food_beverage" && b.connectedSellers.length === 1).slice(0, 12).map(b => b.id),
    impact: 2400000,
  },
  {
    type: "expansion",
    title: "Industrial Equipment Cross-Sell Opportunity",
    description: "8 high-volume industrial buyers ($50K+ avg orders) are connected to construction supply sellers but not industrial equipment sellers. Warm introductions could capture $1.8M in new annual volume.",
    affectedNodes: buyers.filter(b => b.industry === "construction_supply" && b.avgOrderSize > 50000).slice(0, 8).map(b => b.id),
    impact: 1800000,
  },
  {
    type: "risk_cluster",
    title: "Construction Supply Risk Concentration",
    description: "4 high/critical risk buyers are concentrated around 2 construction supply sellers. Combined exposure: $680K. Regional construction permits down 18% — systemic risk to this cluster.",
    affectedNodes: buyers.filter(b => b.industry === "construction_supply" && (b.riskTier === "high" || b.riskTier === "critical")).slice(0, 4).map(b => b.id),
    impact: -680000,
  },
  {
    type: "risk_cluster",
    title: "Single-Seller Dependency Risk",
    description: "23 buyers are connected to only 1 seller. If that seller churns, Backd loses all associated buyer relationships and credit data. Diversification priority: HIGH.",
    affectedNodes: buyers.filter(b => b.connectedSellers.length === 1).slice(0, 23).map(b => b.id),
    impact: -1200000,
  },
  {
    type: "network_credit",
    title: "Network-Enhanced Credit Scoring",
    description: "15 medium-risk buyers pay 3+ Backd sellers on time. Their network payment data suggests actual risk is lower than individual scoring indicates. Recommend credit limit increase of 20-30% for this cohort — projected incremental volume: $960K/year.",
    affectedNodes: buyers.filter(b => b.riskTier === "medium" && b.connectedSellers.length >= 3 && b.onTimeRate > 0.8).slice(0, 15).map(b => b.id),
    impact: 960000,
  },
];

// ── Portfolio Metrics ───────────────────────────────────────────────────────
const totalExposure = buyers.reduce((s, b) => s + b.currentExposure, 0);
const overdueInvs = invoices.filter(i => i.status === "overdue" || i.status === "defaulted");
const overdueAmount = overdueInvs.reduce((s, i) => s + i.amount, 0);
const paidInvs = invoices.filter(i => i.paidAt);
const avgDays = paidInvs.length > 0 ? Math.round(paidInvs.reduce((s, i) => {
  const d = Math.round((new Date(i.paidAt!).getTime() - new Date(i.dueDate).getTime()) / 86400000);
  return s + Math.max(0, d);
}, 0) / paidInvs.length) : 0;

const byRiskTier: Record<BuyerRiskTier, { count: number; exposure: number }> = {
  low: { count: 0, exposure: 0 },
  medium: { count: 0, exposure: 0 },
  high: { count: 0, exposure: 0 },
  critical: { count: 0, exposure: 0 },
};
const byIndustry: Record<string, { count: number; exposure: number }> = {};
for (const b of buyers) {
  byRiskTier[b.riskTier].count++;
  byRiskTier[b.riskTier].exposure += b.currentExposure;
  const ind = b.industry.replace(/_/g, " ");
  byIndustry[ind] ??= { count: 0, exposure: 0 };
  byIndustry[ind].count++;
  byIndustry[ind].exposure += b.currentExposure;
}

// ── Monthly Trends ──────────────────────────────────────────────────────────
export const monthlyTrends: MonthlyTrend[] = [
  { month: "Apr 2025", totalVolume: 4200000, overdueAmount: 630000, defaultAmount: 168000, recoveryRate: 0.72, avgDaysToPayment: 34, newBuyers: 18 },
  { month: "May 2025", totalVolume: 4450000, overdueAmount: 601000, defaultAmount: 156000, recoveryRate: 0.74, avgDaysToPayment: 33, newBuyers: 15 },
  { month: "Jun 2025", totalVolume: 4700000, overdueAmount: 564000, defaultAmount: 141000, recoveryRate: 0.76, avgDaysToPayment: 32, newBuyers: 21 },
  { month: "Jul 2025", totalVolume: 5000000, overdueAmount: 550000, defaultAmount: 130000, recoveryRate: 0.78, avgDaysToPayment: 31, newBuyers: 16 },
  { month: "Aug 2025", totalVolume: 5300000, overdueAmount: 477000, defaultAmount: 122000, recoveryRate: 0.80, avgDaysToPayment: 31, newBuyers: 19 },
  { month: "Sep 2025", totalVolume: 5600000, overdueAmount: 448000, defaultAmount: 112000, recoveryRate: 0.82, avgDaysToPayment: 30, newBuyers: 22 },
  { month: "Oct 2025", totalVolume: 5900000, overdueAmount: 413000, defaultAmount: 100000, recoveryRate: 0.84, avgDaysToPayment: 29, newBuyers: 17 },
  { month: "Nov 2025", totalVolume: 6100000, overdueAmount: 366000, defaultAmount: 91000, recoveryRate: 0.85, avgDaysToPayment: 29, newBuyers: 20 },
  { month: "Dec 2025", totalVolume: 6400000, overdueAmount: 352000, defaultAmount: 83000, recoveryRate: 0.86, avgDaysToPayment: 28, newBuyers: 14 },
  { month: "Jan 2026", totalVolume: 6800000, overdueAmount: 340000, defaultAmount: 75000, recoveryRate: 0.87, avgDaysToPayment: 28, newBuyers: 23 },
  { month: "Feb 2026", totalVolume: 7100000, overdueAmount: 320000, defaultAmount: 64000, recoveryRate: 0.88, avgDaysToPayment: 27, newBuyers: 19 },
  { month: "Mar 2026", totalVolume: 7500000, overdueAmount: 300000, defaultAmount: 53000, recoveryRate: 0.89, avgDaysToPayment: 27, newBuyers: 25 },
];

export const portfolioMetrics: PortfolioMetrics = {
  totalExposure: Math.round(totalExposure),
  totalBuyers: buyers.length,
  totalSellers: sellers.length,
  activeInvoices: invoices.filter(i => i.status !== "paid" && i.status !== "written_off").length,
  overdueAmount: Math.round(overdueAmount),
  overdueRate: +(overdueAmount / totalExposure).toFixed(3),
  avgDaysToPayment: avgDays + 27, // baseline adjustment
  defaultRate: 0.032,
  recoveryRate: 0.89,
  byRiskTier,
  byIndustry,
  monthlyTrends,
};

// ── A/B Comparisons ─────────────────────────────────────────────────────────
export const abComparisons: ABComparison[] = [
  { metric: "Recovery Rate", ruleBased: 72, agentManaged: 89, improvement: 23.6, unit: "%" },
  { metric: "Avg Days to Resolution", ruleBased: 45, agentManaged: 28, improvement: -37.8, unit: "days" },
  { metric: "Escalation Rate", ruleBased: 35, agentManaged: 18, improvement: -48.6, unit: "%" },
  { metric: "Payment Plan Acceptance", ruleBased: 22, agentManaged: 41, improvement: 86.4, unit: "%" },
  { metric: "Customer Retention", ruleBased: 61, agentManaged: 84, improvement: 37.7, unit: "%" },
  { metric: "Cost per Recovery", ruleBased: 142, agentManaged: 67, improvement: -52.8, unit: "$" },
];

// ── Dashboard Stats ─────────────────────────────────────────────────────────
export const dashboardStats: DashboardStats = {
  portfolioMetrics,
  activeAlerts: riskAlerts.filter(a => !a.isAcknowledged).length,
  activeCases: collectionCases.filter(c => !c.isResolved).length,
  agentActionsToday: 24,
  recoveryRate: 0.89,
  abComparisons,
};

// ── Scenario Calculator ─────────────────────────────────────────────────────
export function calculateScenario(input: ScenarioInput): ScenarioResult {
  const baseDefaultRate = 0.032;
  const baseVolume = 7500000; // monthly
  const baseRevenue = baseVolume * 0.028; // ~2.8% take rate
  const baseBuyers = buyers.length;

  const tierOrder: BuyerRiskTier[] = ["low", "medium", "high", "critical"];
  const cutoffIdx = tierOrder.indexOf(input.riskTierCutoff);
  const rejectedTiers = tierOrder.slice(cutoffIdx + 1);
  const rejectedBuyers = buyers.filter(b => rejectedTiers.includes(b.riskTier));
  const rejectedExposure = rejectedBuyers.reduce((s, b) => s + b.currentExposure, 0);

  const tighteningFactor = 1 - (input.creditTighteningPct / 100) * 0.6;
  const limitFactor = 1 + (input.maxCreditLimitChange / 100);
  const termFactor = 1 - (input.termLengthChange / 90) * 0.15;

  const projectedDefaultRate = Math.max(0.005, baseDefaultRate * tighteningFactor * termFactor);
  const volumeReduction = rejectedExposure * 12 + baseVolume * Math.abs(input.creditTighteningPct) * 0.005;
  const projectedVolume = Math.max(baseVolume * 0.5, baseVolume - volumeReduction / 12);
  const projectedRevenue = projectedVolume * 0.028;

  return {
    projectedDefaultRate: +projectedDefaultRate.toFixed(4),
    projectedVolume: Math.round(projectedVolume),
    projectedRevenue: Math.round(projectedRevenue),
    buyersAffected: rejectedBuyers.length,
    exposureChange: Math.round(-rejectedExposure + totalExposure * (input.maxCreditLimitChange / 100)),
    revenueImpact: Math.round(projectedRevenue - baseRevenue),
  };
}
