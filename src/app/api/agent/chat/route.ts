import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `You are CollectIQ, Backd's AI collections intelligence agent. Backd is a B2B net terms platform — pays sellers upfront and extends Net 30/60/90 terms to buyers, assuming the credit risk.

You are having a conversation with a collections manager about a specific buyer and their collection case. You have deep expertise in:

1. BEHAVIORAL SIGNAL ANALYSIS: Interpreting payment velocity trends, order frequency changes, dispute patterns, on-time rates, and how they predict default risk
2. NETWORK INTELLIGENCE: Using cross-seller payment data to assess true credit risk. A buyer paying 3+ sellers on-time is demonstrably lower risk than individual scoring suggests
3. ADAPTIVE COLLECTION STRATEGY: Selecting the right tone (collaborative vs firm vs urgent), channel (email, phone, SMS), timing, and payment plan structure based on the buyer's specific situation
4. PAYMENT RAIL OPTIMIZATION: Recommending ACH, RTP, or wire based on amount, urgency, and buyer payment history on each rail
5. RISK PREDICTION: Identifying early warning signals 30+ days before default — payment slowdown, order decline, dispute spikes

Your responses should be:
- Conversational but substantive — explain your reasoning, cite specific data points
- Actionable — always tie analysis to a concrete next step
- Transparent — show which signals drive your recommendations and how confident you are
- Concise — 2-4 paragraphs max unless asked for more detail

When the manager asks follow-up questions, refine your analysis. If they challenge your recommendation, consider their perspective and explain trade-offs. You can change your recommendation if presented with new context.

Never break character. You are an AI agent embedded in Backd's collections platform, not a general assistant.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function buildContextBlock(buyer: Record<string, unknown>, collectionCase: Record<string, unknown>, invoices: Record<string, unknown>[], networkContext?: Record<string, unknown>) {
  let ctx = `BUYER PROFILE:
- Company: ${buyer.companyName}
- Industry: ${(buyer.industry as string)?.replace(/_/g, " ")}
- Risk Tier: ${buyer.riskTier} (Score: ${buyer.riskScore}/100)
- Credit Limit: $${Number(buyer.creditLimit).toLocaleString()}
- Current Exposure: $${Number(buyer.currentExposure).toLocaleString()}
- Payment Velocity: ${buyer.paymentVelocity} days avg
- On-Time Rate: ${(Number(buyer.onTimeRate) * 100).toFixed(0)}%
- Order Frequency Trend: ${(Number(buyer.orderFrequencyTrend) * 100).toFixed(0)}% (${Number(buyer.orderFrequencyTrend) > 0 ? "growing" : "declining"})
- Payment Velocity Trend: ${(Number(buyer.paymentVelocityTrend) * 100).toFixed(0)}% (${Number(buyer.paymentVelocityTrend) < 0 ? "slowing" : "stable"})
- Dispute Rate: ${(Number(buyer.disputeRate) * 100).toFixed(1)}%
- Connected Sellers: ${(buyer.connectedSellers as string[])?.length ?? 0}
- Total Orders: ${buyer.totalOrders}
- Days Since Last Order: ${buyer.daysSinceLastOrder}

COLLECTION CASE:
- Invoice Amount: $${Number(collectionCase.amount).toLocaleString()}
- Due Date: ${collectionCase.dueDate}
- Days Overdue: ${collectionCase.daysOverdue}
- Current Stage: ${collectionCase.stage}
- Actions Taken: ${(collectionCase.actions as unknown[])?.length ?? 0}
- Amount Recovered: $${Number(collectionCase.recoveredAmount).toLocaleString()}
- Previous Actions: ${(collectionCase.actions as { action: string; reasoning: string }[])?.slice(-3).map(a => `${a.action}: ${a.reasoning?.slice(0, 80)}`).join(" | ") || "None"}

RECENT INVOICES:
${invoices?.slice(0, 5).map((inv) => `- ${inv.poNumber}: $${Number(inv.amount).toLocaleString()} (${inv.status}, ${inv.terms})`).join("\n") || "No recent invoices"}`;

  if (networkContext) {
    const edges = networkContext.edges as { sellerName: string; volume: number; onTimeRate: number; avgPaymentDays: number }[];
    const insights = networkContext.insights as { title: string; description: string }[];

    if (edges?.length) {
      ctx += `\n\nNETWORK DATA (Cross-Seller Payment Behavior):`;
      for (const edge of edges.slice(0, 8)) {
        ctx += `\n- Pays ${edge.sellerName}: $${Number(edge.volume).toLocaleString()} total, ${(edge.onTimeRate * 100).toFixed(0)}% on-time, avg ${edge.avgPaymentDays} days`;
      }
    }
    if (insights?.length) {
      ctx += `\n\nNETWORK INSIGHTS:`;
      for (const insight of insights.slice(0, 3)) {
        ctx += `\n- ${insight.title}: ${insight.description.slice(0, 150)}`;
      }
    }
  }

  return ctx;
}

// Pre-scripted demo responses for showcase cases
const DEMO_RESPONSES: Record<string, string[]> = {
  default: [
    "Based on the behavioral signals I'm seeing, this buyer shows a pattern worth watching closely. Let me break down what the data tells us.\n\nThe payment velocity trend is the most telling signal here — when a buyer starts taking longer to pay across multiple sellers, it usually indicates cash flow pressure rather than a one-off delay. Combined with the order frequency data, I can see whether this is a temporary squeeze or a structural shift.\n\nMy recommendation would be to take a proactive approach: reach out with a collaborative tone before the situation escalates. In my experience managing similar cases, early engagement when the signals first appear leads to significantly better outcomes than waiting for the invoice to go past due.",
    "That's a great question. Let me walk through the reasoning.\n\nThe network data gives us a significant advantage here. When I look at how this buyer pays other Backd sellers, I get a much richer picture than the individual risk score suggests. A buyer who pays 3+ sellers consistently on time has a fundamentally different risk profile than one who's only connected to a single seller — even if their individual metrics look similar.\n\nThis is the core of what makes CollectIQ different from rule-based systems: we're not just looking at this buyer in isolation. We're leveraging the entire network's payment data to make smarter decisions about tone, timing, and whether to offer flexibility or escalate.",
    "Looking at the recovery probability from multiple angles, here's what I see.\n\nThe most important factor is the buyer's response pattern to our previous actions. When a buyer engages — even to push back or negotiate — the recovery probability is substantially higher than when they go silent. The data shows that payment plan offers timed to when the buyer's own receivables arrive have an 86% higher acceptance rate than generic payment demands.\n\nFor this specific case, I'd structure a plan that aligns with their cash flow cycle rather than our standard 15/30 day splits. It's a small adjustment that dramatically changes the buyer's ability to comply.",
  ],
};

function getDemoResponse(messageIndex: number): string {
  const responses = DEMO_RESPONSES.default;
  return responses[Math.min(messageIndex, responses.length - 1)];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, buyer, collectionCase, invoices, networkContext } = body as {
      messages: ChatMessage[];
      buyer: Record<string, unknown>;
      collectionCase: Record<string, unknown>;
      invoices: Record<string, unknown>[];
      networkContext?: Record<string, unknown>;
    };

    if (!buyer || !collectionCase || !messages?.length) {
      return Response.json(
        { error: "Missing required data" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // Demo mode: return pre-scripted responses
      const assistantCount = messages.filter(m => m.role === "assistant").length;
      const demoText = getDemoResponse(assistantCount);

      // Simulate streaming with a single response
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          const words = demoText.split(" ");
          let i = 0;

          function pushWord() {
            if (i < words.length) {
              const chunk = (i === 0 ? "" : " ") + words[i];
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "content_block_delta", text: chunk })}\n\n`));
              i++;
              setTimeout(pushWord, 20 + Math.random() * 30);
            } else {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "message_stop" })}\n\n`));
              controller.close();
            }
          }

          // Send metadata first
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "metadata", isLive: false })}\n\n`));
          pushWord();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Live mode: stream from Claude
    const client = new Anthropic({ apiKey });
    const contextBlock = buildContextBlock(buyer, collectionCase, invoices, networkContext);

    // Build messages with context injected into the first user message
    const anthropicMessages = messages.map((msg, idx) => ({
      role: msg.role as "user" | "assistant",
      content: idx === 0
        ? `[CASE CONTEXT]\n${contextBlock}\n\n[MANAGER QUESTION]\n${msg.content}`
        : msg.content,
    }));

    const stream = client.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: anthropicMessages,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "metadata", isLive: true })}\n\n`));

        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "content_block_delta", text: event.delta.text })}\n\n`)
            );
          }
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "message_stop" })}\n\n`));
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Agent chat error:", error);
    return Response.json(
      { error: "Chat failed", details: String(error) },
      { status: 500 }
    );
  }
}
