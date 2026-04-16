"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bot, Zap, Loader2 } from "lucide-react";
import type { CollectionCase, Buyer, Invoice } from "@/types";

interface AgentAnalysis {
  riskAssessment: string;
  recommendedAction: string;
  reasoning: string;
  suggestedTone: string;
  suggestedRail: string | null;
  paymentPlanDetails: string | null;
  recoveryProbability: number;
  escalationUrgency: string;
  isLive: boolean;
  note?: string;
}

const ACTION_LABELS: Record<string, string> = {
  email_reminder: "Send Email Reminder",
  phone_call: "Make Phone Call",
  payment_plan_offer: "Offer Payment Plan",
  term_extension: "Extend Terms",
  escalate: "Escalate",
  human_handoff: "Hand Off to Human",
};

const TONE_COLORS: Record<string, string> = {
  collaborative: "bg-[#1DB954]/10 text-[#1DB954]",
  firm: "bg-[#f59e0b]/10 text-[#f59e0b]",
  urgent: "bg-[#ef4444]/10 text-[#ef4444]",
  empathetic: "bg-[#a78bfa]/10 text-[#a78bfa]",
};

const URGENCY_COLORS: Record<string, string> = {
  low: "bg-[#1DB954]/10 text-[#1DB954]",
  medium: "bg-[#f59e0b]/10 text-[#f59e0b]",
  high: "bg-[#ef4444]/10 text-[#ef4444]",
};

export function LiveAgent({
  collectionCase,
  buyer,
  invoices,
}: {
  collectionCase: CollectionCase;
  buyer: Buyer | null;
  invoices: Invoice[];
}) {
  const [analysis, setAnalysis] = useState<AgentAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAnalysis() {
    if (!buyer) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/agent/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyer, collectionCase, invoices }),
      });
      if (!res.ok) throw new Error("API request failed");
      const data = await res.json();
      setAnalysis(data);
    } catch (e) {
      setError("Failed to run analysis. Check console for details.");
    } finally {
      setLoading(false);
    }
  }

  if (!analysis) {
    return (
      <Card className="border-2 border-dashed border-[#1DB954]/20 bg-[#161616]">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1DB954]/10">
            <Zap className="h-6 w-6 text-[#1DB954]" />
          </div>
          <h3 className="mt-3 text-sm font-bold text-white">
            Live Agent Analysis
          </h3>
          <p className="mt-1 text-xs text-[#9ca3af] text-center max-w-xs">
            Run the AI agent in real-time to analyze this buyer and recommend
            the optimal next collection action.
          </p>
          <Button
            className="mt-4 bg-[#1DB954] hover:bg-[#1ed760] gap-2"
            onClick={runAnalysis}
            disabled={loading || !buyer}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Bot className="h-4 w-4" />
                Run Live Analysis
              </>
            )}
          </Button>
          {error && (
            <p className="mt-2 text-xs text-[#ef4444]">{error}</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-[#1DB954]/30 bg-[#161616]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-[#1DB954]">
            <Bot className="h-4 w-4" />
            Live Agent Analysis
          </CardTitle>
          <div className="flex items-center gap-2">
            {analysis.isLive ? (
              <Badge className="bg-[#1DB954] text-white text-[10px]">
                LIVE CLAUDE
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] border-[#f59e0b] text-[#f59e0b]">
                DEMO MODE
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={runAnalysis}
              disabled={loading}
              className="text-xs text-[#9ca3af] hover:text-white"
            >
              {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Re-run"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {analysis.note && (
          <p className="text-[10px] text-[#f59e0b] italic">{analysis.note}</p>
        )}

        <div>
          <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider mb-1">
            Risk Assessment
          </p>
          <p className="text-xs leading-relaxed text-[#d1d5db]">
            {analysis.riskAssessment}
          </p>
        </div>

        <Separator className="bg-[#262626]" />

        <div>
          <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider mb-1">
            Recommended Action
          </p>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge className="bg-[#1DB954] text-white text-xs">
              {ACTION_LABELS[analysis.recommendedAction] ?? analysis.recommendedAction}
            </Badge>
            <Badge className={`text-[10px] ${TONE_COLORS[analysis.suggestedTone] ?? "bg-[#1c1c1c] text-[#9ca3af]"}`}>
              {analysis.suggestedTone} tone
            </Badge>
            {analysis.suggestedRail && (
              <Badge variant="outline" className="text-[10px] border-[#1DB954]/20 text-[#1DB954]">
                Rail: {analysis.suggestedRail.toUpperCase()}
              </Badge>
            )}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider mb-1">
            Agent Reasoning
          </p>
          <p className="text-xs leading-relaxed text-[#d1d5db] bg-[#1c1c1c] border border-[#262626] rounded-lg p-2.5">
            {analysis.reasoning}
          </p>
        </div>

        {analysis.paymentPlanDetails && (
          <div>
            <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider mb-1">
              Suggested Payment Plan
            </p>
            <p className="text-xs text-[#d1d5db] bg-[#1DB954]/10 border border-[#1DB954]/20 rounded-lg p-2.5">
              {analysis.paymentPlanDetails}
            </p>
          </div>
        )}

        <Separator className="bg-[#262626]" />

        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] text-[#6b7280]">Recovery Probability</p>
            <p className={`text-sm font-bold ${analysis.recoveryProbability > 0.7 ? "text-[#1DB954]" : analysis.recoveryProbability > 0.4 ? "text-[#f59e0b]" : "text-[#ef4444]"}`}>
              {(analysis.recoveryProbability * 100).toFixed(0)}%
            </p>
          </div>
          <div>
            <p className="text-[10px] text-[#6b7280]">Escalation Urgency</p>
            <Badge className={`text-[10px] ${URGENCY_COLORS[analysis.escalationUrgency] ?? "bg-[#1c1c1c] text-[#9ca3af]"}`}>
              {analysis.escalationUrgency}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
