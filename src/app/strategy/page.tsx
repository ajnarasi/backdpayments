import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Target,
  Zap,
  TrendingUp,
  Shield,
  Network,
  Bot,
  CheckCircle,
  ArrowRight,
  Calendar,
  Users,
  DollarSign,
  BarChart3,
} from "lucide-react";

const PHASES = [
  {
    phase: "Days 1-30",
    title: "Foundation: Collections Intelligence",
    color: "blue",
    icon: Bot,
    items: [
      "Deploy AI-powered collections agent for top 20% of overdue invoices",
      "Implement predictive risk scoring using behavioral signals (payment velocity, order frequency, dispute patterns)",
      "Build collections dashboard with agent decision transparency",
      "Measure: target 5-8% improvement in recovery rate within first 30 days",
      "Establish baseline metrics for agent vs. rule-based A/B comparison",
    ],
    metric: "Recovery rate: 72% -> 78%",
    risk: "Agent calibration — ensure conservative initial parameters to avoid over-aggressive collections",
  },
  {
    phase: "Days 31-60",
    title: "Scale: Risk Intelligence & Automation",
    color: "violet",
    icon: Shield,
    items: [
      "Expand agent coverage to all overdue invoices",
      "Launch early warning system — flag potential defaults 30+ days before due date",
      "Build scenario modeling tool for credit policy optimization",
      "Integrate multi-rail payment collection (ACH, RTP, wire) with intelligent rail selection",
      "Ship seller-facing portfolio health dashboard",
    ],
    metric: "Recovery rate: 78% -> 85%, Avg resolution: 45 -> 32 days",
    risk: "False positive alerts — tune sensitivity to avoid alert fatigue",
  },
  {
    phase: "Days 61-90",
    title: "Vision: Network Intelligence Platform",
    color: "emerald",
    icon: Network,
    items: [
      "Launch buyer-seller network graph for internal analytics",
      "Implement network-enhanced credit scoring (cross-seller payment data improves individual risk)",
      "Build expansion recommendation engine (identify growth opportunities through network analysis)",
      "Prototype developer API for self-serve seller integrations",
      "Present board-ready metrics: projected $2M+ annual savings from improved collections",
    ],
    metric: "Recovery rate: 85% -> 89%, Network-scored buyers: 20% lower default rate",
    risk: "Network effects require density — focus on existing wholesale/distribution cluster first",
  },
];

const SUCCESS_METRICS = [
  { metric: "Recovery Rate", before: "72%", after: "89%", icon: TrendingUp },
  { metric: "Avg Days to Resolution", before: "45 days", after: "28 days", icon: Calendar },
  { metric: "Cost per Recovery", before: "$142", after: "$67", icon: DollarSign },
  { metric: "Customer Retention", before: "61%", after: "84%", icon: Users },
];

const STRATEGIC_BETS = [
  {
    title: "From Lender to Network",
    description:
      "Backd's hidden asset is its buyer-seller network. Every transaction generates data that improves credit decisions across the network. Competitors see individual transactions; Backd can see the system. This transforms the business from a lending company (capital-constrained) to a platform (network-effect defensible).",
    icon: Network,
  },
  {
    title: "AI as Core Competency",
    description:
      "Collections is where B2B lending companies win or die. An AI agent that adapts collection strategy per-buyer — analyzing behavioral signals, network data, and macro indicators — creates a capability moat that compounds with every transaction. The model gets better as the portfolio grows.",
    icon: Bot,
  },
  {
    title: "Data Flywheel",
    description:
      "Better data leads to better predictions, which lead to lower defaults, which lead to more competitive pricing, which lead to more sellers, which lead to more data. Each layer of intelligence (collections, risk, network) reinforces the others. Year 2 focus: make this flywheel the company's primary growth engine.",
    icon: Zap,
  },
];

export default function StrategyPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">
            90-Day Product Roadmap
          </h1>
          <Badge
            variant="outline"
            className="border-[#ff6b1a]/20 bg-[#ff6b1a]/10 text-[#ff6b1a]"
          >
            Head of Product Vision
          </Badge>
        </div>
        <p className="mt-1 text-sm text-[#9ca3af]">
          How I would build CollectIQ as Backd&apos;s first product-led intelligence layer
          — from collections engine to network platform.
        </p>
      </div>

      {/* Phase Timeline */}
      <div className="space-y-4">
        {PHASES.map((phase, idx) => {
          const Icon = phase.icon;
          const colors = {
            blue: { bg: "bg-[#ff6b1a]/10", border: "border-[#ff6b1a]/20", text: "text-[#ff6b1a]", iconBg: "bg-[#ff6b1a]/10 text-[#ff6b1a]", badge: "border-[#ff6b1a]/20 bg-[#ff6b1a]/10 text-[#ff6b1a]" },
            violet: { bg: "bg-[#ff6b1a]/10", border: "border-[#ff6b1a]/20", text: "text-[#ff6b1a]", iconBg: "bg-[#ff6b1a]/10 text-[#ff6b1a]", badge: "border-[#ff6b1a]/20 bg-[#ff6b1a]/10 text-[#ff6b1a]" },
            emerald: { bg: "bg-[#ff6b1a]/10", border: "border-[#ff6b1a]/20", text: "text-[#ff6b1a]", iconBg: "bg-[#ff6b1a]/10 text-[#ff6b1a]", badge: "border-emerald-300 bg-[#ff6b1a]/10 text-[#ff6b1a]" },
          }[phase.color]!;

          return (
            <Card key={idx} className={`border ${colors.border} ${colors.bg} `}>
              <CardContent className="pt-5 pb-5 px-5">
                <div className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colors.iconBg}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`text-xs font-bold ${colors.badge}`}>
                        {phase.phase}
                      </Badge>
                      <h3 className={`text-lg font-bold ${colors.text}`}>
                        {phase.title}
                      </h3>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {phase.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[#d1d5db]">
                          <CheckCircle className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${colors.text}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <BarChart3 className="h-3.5 w-3.5 text-[#6b7280]" />
                        <span className="text-xs font-medium text-[#9ca3af]">
                          Target: {phase.metric}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Shield className="h-3.5 w-3.5 text-[#6b7280]" />
                        <span className="text-xs text-[#9ca3af]">
                          Risk: {phase.risk}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Success Metrics */}
      <Card className="border border-[#262626] ">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-[#d1d5db]">
            Projected 90-Day Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {SUCCESS_METRICS.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.metric}
                  className="rounded-lg border border-[#262626] bg-[#1c1c1c] p-4 text-center"
                >
                  <Icon className="mx-auto h-5 w-5 text-[#6b7280]" />
                  <p className="mt-2 text-xs font-medium text-[#9ca3af]">
                    {m.metric}
                  </p>
                  <div className="mt-1 flex items-center justify-center gap-2">
                    <span className="text-sm text-[#6b7280] line-through">
                      {m.before}
                    </span>
                    <ArrowRight className="h-3 w-3 text-[#3a3a3a]" />
                    <span className="text-lg font-bold text-[#ff6b1a]">
                      {m.after}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Strategic Bets */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">
          Strategic Bets: Beyond 90 Days
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {STRATEGIC_BETS.map((bet, idx) => {
            const Icon = bet.icon;
            return (
              <Card key={idx} className="border border-[#262626] ">
                <CardContent className="pt-5 pb-5 px-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1c1c1c]">
                    <Icon className="h-5 w-5 text-[#9ca3af]" />
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-white">
                    {bet.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#9ca3af]">
                    {bet.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Why Me */}
      <Card className="border border-[#262626] bg-[#0d0d0d] text-white">
        <CardContent className="pt-6 pb-6 px-6">
          <h3 className="text-lg font-bold">Why This Matters — And Why Me</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#d1d5db]">
            Backd&apos;s value proposition is powerful: pay sellers upfront, extend terms
            to buyers. But the real business is managing the credit risk in
            between. CollectIQ transforms that risk management from a cost center
            into Backd&apos;s deepest competitive moat.
          </p>
          <Separator className="my-4 bg-[#161616]/10" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              ["BNPL 0-to-1", "Built Visa Installments from scratch — the first Visa BNPL product. Understand the full lifecycle from underwriting through collections."],
              ["Payment Orchestration", "Led global APM strategy across NA/EMEA/APAC/LATAM at Fiserv. 50+ engineers, 100+ feature backlog. Deep multi-rail expertise."],
              ["Agentic AI + Engineering", "Currently building agentic payment flows. 8 years as a software engineer before PM. I don't just spec — I build."],
            ].map(([title, desc]) => (
              <div key={title}>
                <p className="text-sm font-bold text-[#ff6b1a]">{title}</p>
                <p className="mt-1 text-xs text-[#9ca3af]">{desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
