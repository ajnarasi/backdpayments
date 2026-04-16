# Backd CollectIQ

AI-Powered Collections & Risk Intelligence for B2B Net Terms

## What Is This?

CollectIQ is a working prototype demonstrating how AI agents can transform Backd's collections from reactive to predictive. It addresses Backd's #1 business risk: credit losses on underwritten net terms.

**Built by Ajay Narasimma** as a Head of Product interview project for BackdPayments.

## The Problem

Backd pays sellers upfront and extends net terms (Net 30/60/90) to B2B buyers, assuming credit risk. Collections is where B2B lending companies win or die. Current approaches are manual, reactive, and poorly instrumented.

## The Solution: 3 Modules

### 1. Agentic Collections Engine (Core)
- AI agent autonomously manages the collections lifecycle
- Adaptive dunning sequences, payment plan negotiation, intelligent escalation
- Decision transparency: see WHY the agent chose each action
- Multi-rail awareness (ACH, RTP, wire) for payment collection
- A/B comparison: agent-managed vs. rule-based recovery rates

### 2. Predictive Risk Dashboard
- Early warning system flags potential defaults 30+ days before due date
- Portfolio health visualization by risk tier, industry, geography
- Interactive scenario modeling for credit policy optimization

### 3. Network Intelligence (Strategic Vision)
- Buyer-seller network graph visualization
- Network-enhanced credit scoring (cross-seller payment data)
- Expansion recommendations and risk cluster identification

## Tech Stack

- **Next.js 16** + TypeScript + App Router
- **Tailwind CSS v4** + shadcn/ui
- **Recharts** for data visualization
- **react-force-graph-2d** for network graph
- **Claude API** (Anthropic SDK) for live agent analysis
- In-memory synthetic data (200 buyers, 30 sellers, 800+ invoices)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Enable Live AI Agent

Set your Anthropic API key to enable live Claude analysis on collection cases:

```bash
echo "ANTHROPIC_API_KEY=your-key-here" > .env.local
```

Without the API key, the agent runs in demo mode with pre-computed responses.

## Pages

| Page | Description |
|------|-------------|
| `/` | Portfolio overview with KPIs, charts, A/B comparison |
| `/collections` | Collection cases list with showcase cases |
| `/collections/[buyerId]` | Agent action timeline with live analysis |
| `/risk` | Risk alerts, portfolio charts, scenario modeling |
| `/network` | Buyer-seller network graph and insights |
| `/checkout` | Mock B2B net terms checkout flow |
| `/strategy` | 90-day product roadmap for Backd |

## Key Showcase Cases

Three handcrafted collection cases demonstrate the agent's capabilities:

1. **Midwest Restaurant Group** -- Agent detected cash flow timing pattern, offered restructured payment, achieved 100% recovery in 7 days
2. **Coastal Equipment Rentals** -- Deteriorating buyer with sector headwinds, agent adapted strategy across 8 actions, 67% recovered via installment plan
3. **Desert Valley Materials** -- Critical default path, agent exhausted all options over 30 days before recommending human handoff with 35% recovery probability

## Deploy

```bash
npm run build
```

Deploy to Vercel, Netlify, or any Node.js hosting. No database required.
