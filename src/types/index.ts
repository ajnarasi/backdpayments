// ============================================================================
// Backd CollectIQ — Core Types
// ============================================================================

// --- Enums ---

export type BuyerRiskTier = "low" | "medium" | "high" | "critical";
export type InvoiceStatus = "issued" | "pending" | "paid" | "partial" | "overdue" | "defaulted" | "written_off";
export type CollectionStage = "pre_due" | "reminder" | "follow_up" | "escalation" | "final_notice" | "collections_team" | "resolved";
export type CollectionAction = "email_reminder" | "sms_reminder" | "phone_call" | "payment_plan_offer" | "term_extension" | "escalate" | "final_notice" | "human_handoff" | "pause";
export type PaymentRail = "ach" | "rtp" | "fedwire" | "virtual_card" | "check";
export type Industry = "wholesale_distribution" | "manufacturing" | "construction_supply" | "food_beverage" | "industrial_equipment" | "medical_supply" | "electronics" | "agricultural";

// --- Core Entities ---

export interface Seller {
  id: string;
  name: string;
  industry: Industry;
  avgMonthlyVolume: number;
  totalBuyers: number;
  city: string;
  state: string;
  joinedAt: string;
}

export interface Buyer {
  id: string;
  companyName: string;
  industry: Industry;
  creditLimit: number;
  currentExposure: number;
  riskTier: BuyerRiskTier;
  riskScore: number; // 0-100, higher = riskier
  paymentVelocity: number; // avg days to pay
  avgOrderSize: number;
  totalOrders: number;
  onTimeRate: number; // 0-1
  daysSinceLastOrder: number;
  city: string;
  state: string;
  connectedSellers: string[]; // seller IDs
  joinedAt: string;
  // Behavioral signals
  orderFrequencyTrend: number; // -1 to 1 (declining to growing)
  paymentVelocityTrend: number; // negative = slowing down
  disputeRate: number; // 0-1
}

export interface Invoice {
  id: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  issuedAt: string;
  dueDate: string;
  paidAt: string | null;
  paidAmount: number;
  status: InvoiceStatus;
  terms: string; // "net_30", "net_60", etc.
  poNumber: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  buyerId: string;
  amount: number;
  rail: PaymentRail;
  processedAt: string;
  daysFromDue: number; // negative = early, positive = late
}

// --- Collections ---

export interface CollectionCase {
  id: string;
  invoiceId: string;
  buyerId: string;
  sellerId: string;
  buyerName: string;
  sellerName: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
  stage: CollectionStage;
  riskTier: BuyerRiskTier;
  actions: CollectionActionEntry[];
  agentRecommendation: string | null;
  isResolved: boolean;
  resolvedAt: string | null;
  recoveredAmount: number;
}

export interface CollectionActionEntry {
  id: string;
  caseId: string;
  action: CollectionAction;
  timestamp: string;
  channel: string;
  reasoning: string;
  outcome: string | null;
  railUsed: PaymentRail | null;
  isAgentAction: boolean; // true = AI agent, false = rule-based
}

// --- Risk ---

export interface RiskAlert {
  id: string;
  buyerId: string;
  buyerName: string;
  alertType: "payment_slowdown" | "order_decline" | "high_exposure" | "industry_risk" | "dispute_spike" | "predicted_default";
  severity: "info" | "warning" | "critical";
  message: string;
  confidence: number; // 0-1
  detectedAt: string;
  signals: RiskSignal[];
  isAcknowledged: boolean;
}

export interface RiskSignal {
  name: string;
  value: number;
  trend: "improving" | "stable" | "declining";
  weight: number; // contribution to risk score
}

export interface PortfolioMetrics {
  totalExposure: number;
  totalBuyers: number;
  totalSellers: number;
  activeInvoices: number;
  overdueAmount: number;
  overdueRate: number;
  avgDaysToPayment: number;
  defaultRate: number;
  recoveryRate: number;
  byRiskTier: Record<BuyerRiskTier, { count: number; exposure: number }>;
  byIndustry: Record<string, { count: number; exposure: number }>;
  monthlyTrends: MonthlyTrend[];
}

export interface MonthlyTrend {
  month: string;
  totalVolume: number;
  overdueAmount: number;
  defaultAmount: number;
  recoveryRate: number;
  avgDaysToPayment: number;
  newBuyers: number;
}

// --- Network ---

export interface NetworkNode {
  id: string;
  type: "buyer" | "seller";
  name: string;
  industry: Industry;
  riskTier?: BuyerRiskTier;
  exposure?: number;
  connections: number;
}

export interface NetworkEdge {
  source: string;
  target: string;
  volume: number; // total transaction volume
  invoiceCount: number;
  avgPaymentDays: number;
  onTimeRate: number;
}

export interface NetworkInsight {
  type: "expansion" | "risk_cluster" | "network_credit";
  title: string;
  description: string;
  affectedNodes: string[];
  impact: number; // estimated dollar impact
}

// --- Scenario Modeling ---

export interface ScenarioInput {
  creditTighteningPct: number; // -50 to +50
  maxCreditLimitChange: number; // -50 to +50
  termLengthChange: number; // -30 to +30 days
  riskTierCutoff: BuyerRiskTier; // reject buyers above this tier
}

export interface ScenarioResult {
  projectedDefaultRate: number;
  projectedVolume: number;
  projectedRevenue: number;
  buyersAffected: number;
  exposureChange: number;
  revenueImpact: number;
}

// --- A/B Comparison ---

export interface ABComparison {
  metric: string;
  ruleBased: number;
  agentManaged: number;
  improvement: number; // percentage improvement
  unit: string;
}

// --- Dashboard ---

export interface DashboardStats {
  portfolioMetrics: PortfolioMetrics;
  activeAlerts: number;
  activeCases: number;
  agentActionsToday: number;
  recoveryRate: number;
  abComparisons: ABComparison[];
}
