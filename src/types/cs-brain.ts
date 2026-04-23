// ============================================================================
// Merchant Compass — Customer Success Second Brain Types
// Extends the core CollectIQ types with CS-specific signals, actions, and
// playbook/loop structures. All additive; no edits to src/types/index.ts.
// ============================================================================

export type HealthBand = "thriving" | "activated" | "at_risk" | "churning" | "onboarding";

export type CSSegment = "onboarding" | "activated" | "at_risk" | "expansion_ready";

export type TicketCategory =
  | "onboarding"
  | "reconciliation"
  | "dispute"
  | "payment_plan"
  | "integration"
  | "billing_question"
  | "feature_request"
  | "escalation";

export type TicketSeverity = "low" | "medium" | "high" | "critical";

export type CSMActionChannel = "email" | "phone" | "in_app" | "qbr" | "note";

export type InterventionOutcome =
  | "accepted"
  | "partially_accepted"
  | "declined"
  | "no_response"
  | "pending";

export type ExpansionOfferType =
  | "credit_limit_increase"
  | "term_extension_upgrade"
  | "mca_cross_sell"
  | "line_of_credit_upgrade"
  | "new_seller_intro";

// ── Support Tickets (synthetic signal feed) ────────────────────────────────
export interface SupportTicket {
  id: string;
  merchantId: string; // buyer or seller id
  merchantName: string;
  category: TicketCategory;
  severity: TicketSeverity;
  subject: string;
  body: string;
  openedAt: string;
  resolvedAt: string | null;
  firstResponseMinutes: number | null;
  assignedCsm: string | null;
}

// ── CSM Action Timeline ────────────────────────────────────────────────────
export interface CSMAction {
  id: string;
  merchantId: string;
  csm: string;
  channel: CSMActionChannel;
  timestamp: string;
  summary: string;
  outcome: InterventionOutcome;
  isAgentSuggested: boolean;
  playbookId: string | null;
}

// ── Health Score ───────────────────────────────────────────────────────────
export interface HealthScore {
  merchantId: string;
  band: HealthBand;
  composite: number; // 0-100, higher = healthier
  trajectory30d: number; // -1..1, positive = improving
  drivers: HealthDriver[];
  lastComputed: string;
}

export interface HealthDriver {
  name: string;
  value: number;
  weight: number; // 0-1
  contribution: number; // value * weight, signed
  direction: "positive" | "negative" | "neutral";
}

// ── Playbook (concept page) ────────────────────────────────────────────────
export interface Playbook {
  id: string;
  title: string;
  triggerSummary: string; // one-line "when to use"
  triggerSignals: string[];
  recommendedSteps: PlaybookStep[];
  createdBy: string;
  lastUpdated: string;
  tags: string[];
  outcomes: PlaybookOutcome[];
}

export interface PlaybookStep {
  order: number;
  channel: CSMActionChannel;
  instruction: string;
  expectedOutcome: string;
}

export interface PlaybookOutcome {
  id: string;
  playbookId: string;
  merchantId: string;
  merchantName: string;
  appliedAt: string;
  result: InterventionOutcome;
  recoveredValue: number; // $ preserved or expanded
  notes: string;
}

// ── Expansion Signals ──────────────────────────────────────────────────────
export interface ExpansionSignal {
  merchantId: string;
  offerType: ExpansionOfferType;
  confidence: number; // 0-1
  projectedLift: number; // $ incremental annual volume
  rationale: string;
  requiredActions: string[];
}

// ── Merchant Second Brain (entity page data) ───────────────────────────────
export interface MerchantBrief {
  merchantId: string;
  merchantName: string;
  tldr: string;
  jobsToBeDone: string[];
  languageThatLands: LanguageCue[];
  contradictions: string[];
  nextBestAction: NextBestAction;
  isLive: boolean; // true = live Claude call, false = mock fallback
}

export interface LanguageCue {
  framing: string; // e.g. "lead with cash-flow timing, not late-fee risk"
  why: string;
  evidence: string;
}

export interface NextBestAction {
  channel: CSMActionChannel;
  tone: "collaborative" | "firm" | "urgent" | "empathetic";
  playbookId: string | null;
  script: string;
  suggestedTiming: string;
}

// ── Karpathy Loop Telemetry ────────────────────────────────────────────────
export interface LoopCycle {
  id: string;
  cycle: number;
  timestamp: string;
  interventionsCount: number;
  acceptanceRate: number; // 0-1
  avgTimeToOutcomeHrs: number;
  promptAccuracyScore: number; // 0-1
  notableLearnings: string[];
}

export interface LoopStats {
  currentCycle: number;
  cycles: LoopCycle[];
  totalInterventions: number;
  cumulativeAcceptance: number;
  promptDeltaSinceBaseline: number; // pct points
  lastUpdated: string;
}

// ── CS Dashboard ───────────────────────────────────────────────────────────
export interface CSSegmentSummary {
  segment: CSSegment;
  count: number;
  exposure: number;
  recentTrend: "up" | "down" | "flat";
  headline: string;
}

export interface AgentQueueItem {
  merchantId: string;
  merchantName: string;
  priority: "critical" | "high" | "medium" | "low";
  segment: CSSegment;
  title: string;
  rationale: string;
  playbookId: string | null;
  suggestedAction: CSMActionChannel;
}

export interface CSDashboardData {
  segments: CSSegmentSummary[];
  agentQueue: AgentQueueItem[];
  loopStats: LoopStats;
  ticketsOpen: number;
  qbrsDueNext30Days: number;
  expansionOpportunities: number;
  expansionValue: number;
}

// ── QBR (Quarterly Business Review) Deck ───────────────────────────────────
export interface QBRDeck {
  merchantId: string;
  merchantName: string;
  quarter: string;
  generatedAt: string;
  sections: QBRSection[];
  isLive: boolean;
}

export interface QBRSection {
  id: string;
  title: string;
  kicker: string;
  body: string;
  bullets: string[];
  stat?: {
    label: string;
    value: string;
    delta?: string;
  };
}
