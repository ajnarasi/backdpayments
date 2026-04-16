import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `You are CollectIQ, an AI-powered collections intelligence agent for Backd, a B2B net terms platform. Backd pays sellers upfront and extends net terms (Net 30/60/90) to B2B buyers, assuming credit risk.

Your role is to analyze a buyer's payment behavior and current collection case, then recommend the optimal next action. You should consider:

1. BEHAVIORAL SIGNALS: Payment velocity trends, order frequency changes, dispute patterns, on-time rates
2. NETWORK CONTEXT: How the buyer pays other Backd sellers, cross-seller data
3. RELATIONSHIP VALUE: Lifetime volume, tenure, growth trajectory
4. COLLECTION STRATEGY: Adaptive dunning (tone, channel, timing), payment plan structuring, escalation decisions
5. RAIL SELECTION: Which payment rail (ACH, RTP, wire) to use for collection based on amount/urgency

Respond with a JSON object containing:
{
  "riskAssessment": "Brief assessment of buyer's current risk level and trajectory",
  "recommendedAction": "email_reminder" | "phone_call" | "payment_plan_offer" | "term_extension" | "escalate" | "human_handoff",
  "reasoning": "Detailed reasoning for the recommendation (2-3 sentences explaining WHY this action, referencing specific signals)",
  "suggestedTone": "collaborative" | "firm" | "urgent" | "empathetic",
  "suggestedRail": "ach" | "rtp" | "fedwire" | null,
  "paymentPlanDetails": "If recommending a payment plan, describe the structure (e.g., '50% now, 50% in 15 days')" | null,
  "recoveryProbability": 0.0 to 1.0,
  "escalationUrgency": "low" | "medium" | "high"
}`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { buyer, collectionCase, invoices } = body;

    if (!buyer || !collectionCase) {
      return Response.json(
        { error: "Missing buyer or collectionCase data" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // Return a realistic mock response when no API key is configured
      return Response.json({
        riskAssessment: `${buyer.companyName} shows ${buyer.riskTier} risk indicators. Payment velocity at ${buyer.paymentVelocity} days with ${(buyer.onTimeRate * 100).toFixed(0)}% on-time rate. Order frequency trend is ${buyer.orderFrequencyTrend > 0 ? "positive" : "declining"} at ${(buyer.orderFrequencyTrend * 100).toFixed(0)}%.`,
        recommendedAction: buyer.riskTier === "critical" ? "human_handoff" : buyer.riskTier === "high" ? "payment_plan_offer" : "phone_call",
        reasoning: `Based on ${buyer.companyName}'s behavioral signals — payment velocity of ${buyer.paymentVelocity} days (${buyer.paymentVelocityTrend < -0.1 ? "slowing" : "stable"}), ${(buyer.onTimeRate * 100).toFixed(0)}% on-time rate, and ${buyer.connectedSellers?.length || 0} connected sellers — the agent recommends ${buyer.riskTier === "critical" ? "immediate human escalation given exhausted automated options" : buyer.riskTier === "high" ? "a structured payment plan to preserve the relationship while securing partial recovery" : "direct phone outreach to understand the delay and offer flexible options"}. The buyer's ${buyer.industry?.replace(/_/g, " ")} sector context and lifetime volume inform the recommended tone.`,
        suggestedTone: buyer.riskTier === "critical" ? "firm" : buyer.riskTier === "high" ? "empathetic" : "collaborative",
        suggestedRail: collectionCase.amount > 100000 ? "fedwire" : "ach",
        paymentPlanDetails: buyer.riskTier === "high" || buyer.riskTier === "critical"
          ? `Split into ${Math.ceil(collectionCase.amount / 50000)} installments of ~$${Math.round(collectionCase.amount / Math.ceil(collectionCase.amount / 50000)).toLocaleString()} each, spaced 15 days apart. First installment via ${collectionCase.amount > 100000 ? "wire" : "ACH"}.`
          : null,
        recoveryProbability: buyer.riskTier === "critical" ? 0.35 : buyer.riskTier === "high" ? 0.62 : 0.85,
        escalationUrgency: buyer.riskTier === "critical" ? "high" : buyer.riskTier === "high" ? "medium" : "low",
        isLive: false,
        note: "Demo mode — set ANTHROPIC_API_KEY to enable live Claude analysis",
      });
    }

    const client = new Anthropic({ apiKey });

    const userPrompt = `Analyze this B2B buyer and their current collection case:

BUYER PROFILE:
- Company: ${buyer.companyName}
- Industry: ${buyer.industry}
- Risk Tier: ${buyer.riskTier} (Score: ${buyer.riskScore}/100)
- Credit Limit: $${buyer.creditLimit?.toLocaleString()}
- Current Exposure: $${buyer.currentExposure?.toLocaleString()}
- Payment Velocity: ${buyer.paymentVelocity} days avg
- On-Time Rate: ${(buyer.onTimeRate * 100).toFixed(0)}%
- Order Frequency Trend: ${(buyer.orderFrequencyTrend * 100).toFixed(0)}% (${buyer.orderFrequencyTrend > 0 ? "growing" : "declining"})
- Payment Velocity Trend: ${(buyer.paymentVelocityTrend * 100).toFixed(0)}% (${buyer.paymentVelocityTrend < 0 ? "slowing" : "stable"})
- Dispute Rate: ${(buyer.disputeRate * 100).toFixed(1)}%
- Connected Sellers: ${buyer.connectedSellers?.length || 0}
- Total Orders: ${buyer.totalOrders}
- Days Since Last Order: ${buyer.daysSinceLastOrder}

COLLECTION CASE:
- Invoice Amount: $${collectionCase.amount?.toLocaleString()}
- Due Date: ${collectionCase.dueDate}
- Days Overdue: ${collectionCase.daysOverdue}
- Current Stage: ${collectionCase.stage}
- Actions Taken: ${collectionCase.actions?.length || 0}
- Amount Recovered: $${collectionCase.recoveredAmount?.toLocaleString()}
- Previous Actions: ${collectionCase.actions?.slice(-3).map((a: { action: string; reasoning: string }) => `${a.action}: ${a.reasoning?.slice(0, 100)}`).join(" | ") || "None"}

RECENT INVOICES (last 3):
${invoices?.slice(0, 3).map((inv: { poNumber: string; amount: number; status: string; terms: string }) => `- ${inv.poNumber}: $${inv.amount?.toLocaleString()} (${inv.status}, ${inv.terms})`).join("\n") || "No recent invoices"}

What is the optimal next action? Respond with the JSON object only.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from Claude");
    }

    // Parse the JSON response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from Claude response");
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return Response.json({ ...analysis, isLive: true });
  } catch (error) {
    console.error("Agent analysis error:", error);
    return Response.json(
      { error: "Failed to analyze buyer", details: String(error) },
      { status: 500 }
    );
  }
}
