import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  ArrowRight,
  Database,
  Cpu,
  TrendingUp,
  Network,
  Shield,
  Zap,
  RefreshCw,
  ChevronRight,
  BarChart3,
  Bot,
  FileText,
  Lightbulb,
} from "lucide-react";

const FLYWHEEL_STAGES = [
  {
    icon: Database,
    label: "Raw Data",
    description: "Payment events, buyer behavior, order patterns, disputes, macro signals",
    color: "text-[#ff6b1a]",
    bgColor: "bg-[#ff6b1a]/10 border-[#ff6b1a]/20",
    iconBg: "bg-[#ff6b1a]/10",
    detail: "Every transaction generates behavioral signals: payment velocity, order frequency, dispute patterns, rail preferences. 450+ applications/day creates a growing dataset that competitors don't have.",
  },
  {
    icon: Cpu,
    label: "Compiled Intelligence",
    description: "Risk scores, buyer profiles, network credit, early warnings",
    color: "text-[#ff6b1a]",
    bgColor: "bg-[#ff6b1a]/10 border-[#ff6b1a]/20",
    iconBg: "bg-[#ff6b1a]/10",
    detail: "Raw signals are compiled into structured intelligence: composite risk scores, behavioral trend analysis, network-enhanced credit assessments, and 30+ day default predictions. Knowledge doesn't reset — it compounds.",
  },
  {
    icon: Bot,
    label: "Agent Actions",
    description: "AI selects strategy, tone, timing, rail, and payment plan per case",
    color: "text-[#ff6b1a]",
    bgColor: "bg-[#ff6b1a]/10 border-[#ff6b1a]/20",
    iconBg: "bg-[#ff6b1a]/10",
    detail: "The CollectIQ agent synthesizes all compiled intelligence to take action: which buyer to contact, what tone to use, when to reach out, whether to offer a payment plan or escalate. Every decision is transparent and explainable.",
  },
  {
    icon: TrendingUp,
    label: "Outcomes",
    description: "Recovery results, buyer responses, payment plan compliance",
    color: "text-[#f59e0b]",
    bgColor: "bg-[#f59e0b]/10 border-[#f59e0b]/20",
    iconBg: "bg-[#f59e0b]/10",
    detail: "Every action produces an outcome: did the buyer respond? Did they pay? Did the payment plan hold? These outcomes are the most valuable data of all — they tell us which strategies work for which buyer profiles.",
  },
  {
    icon: RefreshCw,
    label: "Feed Back",
    description: "Outcomes improve predictions, predictions improve actions",
    color: "text-[#ef4444]",
    bgColor: "bg-[#ef4444]/10 border-[#ef4444]/20",
    iconBg: "bg-[#ef4444]/10",
    detail: "Outcomes feed back into the intelligence layer as new raw data. The model learns which collection strategies work for which buyer segments. Week over week, the system gets smarter. This is the compounding loop that creates Backd's moat.",
  },
];

const KARPATHY_PARALLELS = [
  {
    brain: "Raw sources (articles, research, interviews)",
    collectiq: "Raw transaction data (payments, orders, disputes)",
    icon: FileText,
  },
  {
    brain: "Wiki pages (compiled, interlinked knowledge)",
    collectiq: "Risk scores (compiled intelligence, cross-referenced signals)",
    icon: Brain,
  },
  {
    brain: "Queries (synthesis with citations)",
    collectiq: "Agent recommendations (synthesis with behavioral signals)",
    icon: Lightbulb,
  },
  {
    brain: "Good answers filed back into wiki",
    collectiq: "Recovery outcomes improve future predictions",
    icon: RefreshCw,
  },
];

const MOAT_METRICS = [
  {
    metric: "Data Density",
    value: "450+ apps/day",
    description: "Every application = new behavioral data point. Competitors starting from zero face a data gap that grows daily.",
    icon: Database,
  },
  {
    metric: "Network Effect",
    value: "3+ seller signal",
    description: "Buyers paying 3+ Backd sellers on-time are 20-30% lower risk than individual scoring suggests. More sellers = richer signal.",
    icon: Network,
  },
  {
    metric: "Agent Learning",
    value: "89% recovery",
    description: "AI agent learns which strategies work for which buyer profiles. Each case makes the next one smarter — rule-based systems can't do this.",
    icon: Bot,
  },
  {
    metric: "Prediction Lead",
    value: "30+ days early",
    description: "Early warning signals flag defaults before they happen. Every correct prediction trains the model. First-mover data advantage.",
    icon: Shield,
  },
];

export default function IntelligencePage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">
            Intelligence Flywheel
          </h1>
          <Badge
            variant="outline"
            className="border-[#ff6b1a]/20 bg-[#ff6b1a]/10 text-[#ff6b1a]"
          >
            Compounding Moat
          </Badge>
        </div>
        <p className="mt-1 text-sm text-[#9ca3af]">
          How CollectIQ turns every transaction into compounding intelligence
          — the same pattern that makes knowledge bases powerful, applied to
          collections.
        </p>
      </div>

      {/* The Flywheel */}
      <Card className="border border-[#262626]  overflow-hidden">
        <CardHeader className="pb-3 bg-gradient-to-r from-[#ff6b1a]/5 to-transparent">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-[#d1d5db]">
            <Zap className="h-4 w-4 text-[#ff6b1a]" />
            The Compounding Loop
          </CardTitle>
          <p className="text-xs text-[#9ca3af] mt-1">
            Knowledge doesn&apos;t reset between sessions. Every transaction makes
            the next decision smarter.
          </p>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="space-y-3">
            {FLYWHEEL_STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              const isLast = idx === FLYWHEEL_STAGES.length - 1;

              return (
                <div key={stage.label}>
                  <div className={`rounded-lg border p-4 ${stage.bgColor}`}>
                    <div className="flex items-start gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${stage.iconBg}`}>
                        <Icon className={`h-4 w-4 ${stage.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] font-bold border-[#3a3a3a]">
                            Stage {idx + 1}
                          </Badge>
                          <span className={`text-sm font-bold ${stage.color}`}>
                            {stage.label}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-[#9ca3af]">
                          {stage.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                  {!isLast && (
                    <div className="flex justify-center py-1">
                      <ChevronRight className="h-4 w-4 text-[#3a3a3a] rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Loop arrow back */}
          <div className="mt-4 rounded-lg border-2 border-dashed border-[#ff6b1a]/20 bg-[#ff6b1a]/10 p-3 text-center">
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 text-[#ff6b1a]" />
              <span className="text-xs font-bold text-[#ff6b1a]">
                The loop repeats — each cycle makes the system smarter
              </span>
            </div>
            <p className="mt-1 text-[10px] text-[#ff6b1a]">
              This is why intelligence compounds but capital doesn&apos;t. A
              competitor with more money starts at cycle 0. Backd is already
              at cycle N.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Karpathy Second Brain Parallel */}
      <Card className="border border-[#262626] ">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-[#d1d5db]">
            <Brain className="h-4 w-4 text-[#ff6b1a]" />
            The Pattern: Second Brain Architecture
          </CardTitle>
          <p className="text-xs text-[#9ca3af] mt-1">
            CollectIQ follows the same compounding knowledge pattern that
            powers the most effective AI systems — compile once, query many,
            file outcomes back.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                Knowledge System
              </p>
              {KARPATHY_PARALLELS.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.brain}
                    className="flex items-start gap-2 rounded-lg border border-[#262626] bg-[#1c1c1c] p-2.5 mb-2"
                  >
                    <Icon className="h-3.5 w-3.5 text-[#6b7280] mt-0.5 shrink-0" />
                    <span className="text-xs text-[#9ca3af]">{p.brain}</span>
                  </div>
                );
              })}
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[#ff6b1a] uppercase tracking-wider mb-2">
                CollectIQ System
              </p>
              {KARPATHY_PARALLELS.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.collectiq}
                    className="flex items-start gap-2 rounded-lg border border-[#ff6b1a]/20 bg-[#ff6b1a]/10 p-2.5 mb-2"
                  >
                    <Icon className="h-3.5 w-3.5 text-[#ff6b1a] mt-0.5 shrink-0" />
                    <span className="text-xs text-[#ff6b1a]">{p.collectiq}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-[#161616] border border-[#262626] p-3">
            <ArrowRight className="h-4 w-4 text-[#6b7280]" />
            <p className="text-xs font-medium text-[#9ca3af]">
              Same pattern, different domain. Knowledge compounds instead of
              resetting — that&apos;s the moat.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Why This Creates a Moat */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">
          Why Intelligence Compounds But Capital Doesn&apos;t
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {MOAT_METRICS.map((m) => {
            const Icon = m.icon;
            return (
              <Card key={m.metric} className="border border-[#262626] ">
                <CardContent className="pt-5 pb-5 px-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff6b1a]/10">
                      <Icon className="h-5 w-5 text-[#ff6b1a]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          {m.metric}
                        </span>
                        <Badge className="bg-[#ff6b1a]/100 text-white text-[10px]">
                          {m.value}
                        </Badge>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-[#9ca3af]">
                        {m.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Strategic Implication */}
      <Card className="border border-[#262626] bg-[#0d0d0d] text-white">
        <CardContent className="pt-6 pb-6 px-6">
          <h3 className="text-lg font-bold">
            The Strategic Implication
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#d1d5db]">
            A competitor with $100M in capital can match Backd&apos;s credit
            terms tomorrow. But they can&apos;t match Backd&apos;s intelligence
            layer — because that requires the historical behavioral data that
            only comes from processing 450+ applications per day, watching
            how buyers pay across multiple sellers, and learning which
            collection strategies work for which profiles.
          </p>
          <Separator className="my-4 bg-[#161616]/10" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              [
                "Capital Moat",
                "Commodity. Credit Key raised $90M. BILL has billions. Racing on capital alone means margin compression.",
                "Fragile",
              ],
              [
                "Network Moat",
                "Defensible. Cross-seller payment data creates credit signals only Backd possesses. More sellers = better data = more sellers.",
                "Compounding",
              ],
              [
                "Intelligence Moat",
                "Structural. Every transaction trains the model. Every collection teaches what works. The gap widens daily.",
                "Antifragile",
              ],
            ].map(([title, desc, badge]) => (
              <div key={title}>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-[#ff6b1a]">{title}</p>
                  <Badge
                    variant="outline"
                    className={`text-[9px] ${badge === "Fragile" ? "border-[#ef4444]/20 text-[#ef4444]" : badge === "Compounding" ? "border-emerald-400 text-emerald-300" : "border-[#ff6b1a]/20 text-[#ff6b1a]"}`}
                  >
                    {badge}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-[#9ca3af]">{desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
