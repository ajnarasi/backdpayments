"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Bot,
  User,
  ArrowLeft,
  Mail,
  Phone,
  MessageSquare,
  CreditCard,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import type { CollectionCase, Buyer, Invoice, NetworkEdge, NetworkInsight } from "@/types";
import { LiveAgent } from "./live-agent";
import { AgentChat } from "./agent-chat";

const ACTION_ICONS: Record<string, typeof Mail> = {
  email_reminder: Mail,
  sms_reminder: MessageSquare,
  phone_call: Phone,
  payment_plan_offer: CreditCard,
  term_extension: Clock,
  escalate: AlertTriangle,
  final_notice: AlertTriangle,
  human_handoff: User,
  pause: CheckCircle,
};

const ACTION_LABELS: Record<string, string> = {
  email_reminder: "Email Reminder",
  sms_reminder: "SMS Reminder",
  phone_call: "Phone Call",
  payment_plan_offer: "Payment Plan Offer",
  term_extension: "Term Extension",
  escalate: "Escalation",
  final_notice: "Final Notice",
  human_handoff: "Human Handoff",
  pause: "Status Update",
};

const TIER_COLORS: Record<string, string> = {
  low: "bg-[#1DB954]/10 text-[#1DB954] border-[#1DB954]/20",
  medium: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20",
  high: "bg-[#f97316]/10 text-[#f97316] border-[#f97316]/20",
  critical: "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20",
};

function formatCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CaseDetail({
  cases,
  buyer,
  invoices,
  networkEdges = [],
  networkInsights = [],
  sellers = [],
}: {
  cases: CollectionCase[];
  buyer: Buyer | null;
  invoices: Invoice[];
  networkEdges?: NetworkEdge[];
  networkInsights?: NetworkInsight[];
  sellers?: { id: string; name: string }[];
}) {
  const primaryCase = cases[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/collections">
          <Button variant="ghost" size="sm" className="gap-1 text-[#9ca3af] hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">
              {primaryCase.buyerName}
            </h1>
            <Badge
              variant="outline"
              className={TIER_COLORS[primaryCase.riskTier]}
            >
              {primaryCase.riskTier} risk
            </Badge>
            {primaryCase.id.startsWith("case-showcase") && (
              <Badge className="bg-[#1DB954] text-white">SHOWCASE</Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-[#9ca3af]">
            Seller: {primaryCase.sellerName} | Invoice:{" "}
            {formatCurrency(primaryCase.amount)} | Due:{" "}
            {formatDate(primaryCase.dueDate)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Action Timeline */}
        <div className="lg:col-span-2">
          <Card className="bg-[#161616] border border-[#262626]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-[#d1d5db]">
                Agent Action Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-[19px] top-0 bottom-0 w-px bg-[#262626]" />

                <div className="space-y-4">
                  {primaryCase.actions.map((action, idx) => {
                    const Icon =
                      ACTION_ICONS[action.action] ?? CheckCircle;

                    return (
                      <div key={action.id} className="relative flex gap-4">
                        <div
                          className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
                            action.isAgentAction
                              ? "border-[#1DB954]/30 bg-[#1DB954]/10"
                              : "border-[#3a3a3a] bg-[#1c1c1c]"
                          }`}
                        >
                          {action.isAgentAction ? (
                            <Bot className="h-4 w-4 text-[#1DB954]" />
                          ) : (
                            <Icon className="h-4 w-4 text-[#9ca3af]" />
                          )}
                        </div>

                        <div
                          className={`flex-1 rounded-lg border p-3 ${
                            action.isAgentAction
                              ? "border-[#1DB954]/10 bg-[#1DB954]/5"
                              : "border-[#262626] bg-[#1c1c1c]/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`text-[10px] ${
                                  action.isAgentAction
                                    ? "border-[#1DB954]/20 bg-[#1DB954]/10 text-[#1DB954]"
                                    : "border-[#3a3a3a] bg-[#1c1c1c] text-[#9ca3af]"
                                }`}
                              >
                                {action.isAgentAction
                                  ? "AI Agent"
                                  : "Rule-Based"}
                              </Badge>
                              <span className="text-xs font-medium text-[#d1d5db]">
                                {ACTION_LABELS[action.action] ?? action.action}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#6b7280]">
                              {formatDate(action.timestamp)}
                            </span>
                          </div>

                          <p className="mt-2 text-sm leading-relaxed text-[#d1d5db]">
                            {action.reasoning}
                          </p>

                          {action.outcome && (
                            <div className="mt-2 flex items-center gap-1.5 rounded border border-[#1DB954]/20 bg-[#1DB954]/10 px-2 py-1">
                              <CheckCircle className="h-3 w-3 text-[#1DB954]" />
                              <span className="text-xs text-[#1DB954]">
                                {action.outcome}
                              </span>
                            </div>
                          )}

                          {action.railUsed && (
                            <div className="mt-1">
                              <Badge
                                variant="outline"
                                className="text-[10px] border-[#1DB954]/20 bg-[#1DB954]/10 text-[#1DB954]"
                              >
                                Rail: {action.railUsed.toUpperCase()}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {primaryCase.agentRecommendation && (
                <>
                  <Separator className="my-4 bg-[#262626]" />
                  <div className="rounded-lg border border-[#1DB954]/20 bg-[#1DB954]/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="h-4 w-4 text-[#1DB954]" />
                      <span className="text-sm font-semibold text-[#1DB954]">
                        Agent Recommendation
                      </span>
                    </div>
                    <p className="text-sm text-[#d1d5db] leading-relaxed">
                      {primaryCase.agentRecommendation}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Buyer Info + Metrics */}
        <div className="space-y-4">
          <Card className="bg-[#161616] border border-[#262626]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[#d1d5db]">
                Case Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9ca3af]">Amount</span>
                <span className="text-sm font-bold text-white">
                  {formatCurrency(primaryCase.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9ca3af]">Recovered</span>
                <span className="text-sm font-bold text-[#1DB954]">
                  {formatCurrency(primaryCase.recoveredAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9ca3af]">Outstanding</span>
                <span className="text-sm font-bold text-[#ef4444]">
                  {formatCurrency(
                    primaryCase.amount - primaryCase.recoveredAmount
                  )}
                </span>
              </div>
              <Separator className="bg-[#262626]" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9ca3af]">Days Overdue</span>
                <span className="text-sm font-bold text-white">
                  {primaryCase.daysOverdue}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9ca3af]">Stage</span>
                <Badge variant="outline" className="text-xs capitalize border-[#3a3a3a] text-[#9ca3af]">
                  {primaryCase.stage.replace(/_/g, " ")}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9ca3af]">Agent Actions</span>
                <span className="text-sm text-white">
                  {primaryCase.actions.filter((a) => a.isAgentAction).length}
                </span>
              </div>
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#9ca3af]">Recovery Progress</span>
                  <span className="font-bold text-[#1DB954]">
                    {primaryCase.amount > 0
                      ? Math.round(
                          (primaryCase.recoveredAmount / primaryCase.amount) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#262626]">
                  <div
                    className="h-2 rounded-full bg-[#1DB954] transition-all"
                    style={{
                      width: `${Math.min(100, primaryCase.amount > 0 ? (primaryCase.recoveredAmount / primaryCase.amount) * 100 : 0)}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <LiveAgent
            collectionCase={primaryCase}
            buyer={buyer}
            invoices={invoices}
          />

          <AgentChat
            collectionCase={primaryCase}
            buyer={buyer}
            invoices={invoices}
            networkEdges={networkEdges}
            networkInsights={networkInsights}
            sellers={sellers}
          />

          {buyer && (
            <Card className="bg-[#161616] border border-[#262626]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-[#d1d5db]">
                  Buyer Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  ["Industry", buyer.industry.replace(/_/g, " ")],
                  ["Location", `${buyer.city}, ${buyer.state}`],
                  ["Credit Limit", formatCurrency(buyer.creditLimit)],
                  ["Exposure", formatCurrency(buyer.currentExposure)],
                  ["Risk Score", `${buyer.riskScore}/100`],
                  ["On-Time Rate", `${(buyer.onTimeRate * 100).toFixed(0)}%`],
                  ["Avg Payment", `${buyer.paymentVelocity} days`],
                  ["Total Orders", String(buyer.totalOrders)],
                  ["Connected Sellers", String(buyer.connectedSellers.length)],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-[#9ca3af] capitalize">
                      {label}
                    </span>
                    <span className="text-xs font-medium text-white capitalize">
                      {value}
                    </span>
                  </div>
                ))}
                <Separator className="my-2 bg-[#262626]" />
                <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Behavioral Signals
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#9ca3af]">Order Trend</span>
                  <span
                    className={`text-xs font-medium ${buyer.orderFrequencyTrend > 0 ? "text-[#1DB954]" : buyer.orderFrequencyTrend < -0.2 ? "text-[#ef4444]" : "text-[#f59e0b]"}`}
                  >
                    {buyer.orderFrequencyTrend > 0 ? "+" : ""}
                    {(buyer.orderFrequencyTrend * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#9ca3af]">
                    Payment Velocity Trend
                  </span>
                  <span
                    className={`text-xs font-medium ${buyer.paymentVelocityTrend > 0 ? "text-[#1DB954]" : buyer.paymentVelocityTrend < -0.15 ? "text-[#ef4444]" : "text-[#f59e0b]"}`}
                  >
                    {buyer.paymentVelocityTrend > 0 ? "+" : ""}
                    {(buyer.paymentVelocityTrend * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#9ca3af]">Dispute Rate</span>
                  <span
                    className={`text-xs font-medium ${buyer.disputeRate > 0.1 ? "text-[#ef4444]" : "text-white"}`}
                  >
                    {(buyer.disputeRate * 100).toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-[#161616] border border-[#262626]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[#d1d5db]">
                Recent Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {invoices.slice(0, 5).map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between rounded border border-[#262626] p-2"
                  >
                    <div>
                      <p className="text-xs font-medium text-[#fafafa]">
                        {inv.poNumber}
                      </p>
                      <p className="text-[10px] text-[#6b7280]">
                        Due: {formatDate(inv.dueDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-white">
                        {formatCurrency(inv.amount)}
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-[9px] ${
                          inv.status === "paid"
                            ? "border-[#1DB954]/20 text-[#1DB954]"
                            : inv.status === "overdue" ||
                                inv.status === "defaulted"
                              ? "border-[#ef4444]/20 text-[#ef4444]"
                              : "border-[#3a3a3a] text-[#9ca3af]"
                        }`}
                      >
                        {inv.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
