"use client";

import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { calculateScenario } from "@/lib/data";
import type { BuyerRiskTier, ScenarioInput } from "@/types";

function formatCurrency(n: number) {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

const TIER_OPTIONS: { value: BuyerRiskTier; label: string }[] = [
  { value: "low", label: "Low only" },
  { value: "medium", label: "Up to Medium" },
  { value: "high", label: "Up to High" },
  { value: "critical", label: "All tiers" },
];

export function ScenarioModeler() {
  const [creditTightening, setCreditTightening] = useState(0);
  const [creditLimitChange, setCreditLimitChange] = useState(0);
  const [termChange, setTermChange] = useState(0);
  const [tierCutoff, setTierCutoff] = useState<BuyerRiskTier>("critical");

  const input: ScenarioInput = useMemo(
    () => ({
      creditTighteningPct: creditTightening,
      maxCreditLimitChange: creditLimitChange,
      termLengthChange: termChange,
      riskTierCutoff: tierCutoff,
    }),
    [creditTightening, creditLimitChange, termChange, tierCutoff]
  );

  const result = useMemo(() => calculateScenario(input), [input]);

  return (
    <div className="space-y-5">
      <p className="text-xs text-[#9ca3af]">
        Adjust credit policy parameters to model impact on portfolio
        performance.
      </p>

      {/* Sliders */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-[#d1d5db]">
              Credit Tightening
            </label>
            <span className="text-xs font-bold text-white">
              {creditTightening > 0 ? "+" : ""}
              {creditTightening}%
            </span>
          </div>
          <Slider
            value={[creditTightening]}
            onValueChange={(v) => setCreditTightening(Array.isArray(v) ? v[0] : v)}
            min={-50}
            max={50}
            step={5}
          />
          <div className="flex justify-between text-[10px] text-[#6b7280] mt-1">
            <span>Loosen (-50%)</span>
            <span>Tighten (+50%)</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-[#d1d5db]">
              Credit Limit Adjustment
            </label>
            <span className="text-xs font-bold text-white">
              {creditLimitChange > 0 ? "+" : ""}
              {creditLimitChange}%
            </span>
          </div>
          <Slider
            value={[creditLimitChange]}
            onValueChange={(v) => setCreditLimitChange(Array.isArray(v) ? v[0] : v)}
            min={-50}
            max={50}
            step={5}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-[#d1d5db]">
              Term Length Change
            </label>
            <span className="text-xs font-bold text-white">
              {termChange > 0 ? "+" : ""}
              {termChange} days
            </span>
          </div>
          <Slider
            value={[termChange]}
            onValueChange={(v) => setTermChange(Array.isArray(v) ? v[0] : v)}
            min={-30}
            max={30}
            step={5}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-[#d1d5db] block mb-2">
            Accept Risk Tiers
          </label>
          <div className="flex gap-1">
            {TIER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTierCutoff(opt.value)}
                className={`rounded px-2.5 py-1.5 text-[10px] font-medium transition-colors ${
                  tierCutoff === opt.value
                    ? "bg-[#1DB954]/100 text-white"
                    : "bg-[#1c1c1c] text-[#9ca3af] hover:bg-[#262626]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      {/* Results */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">
          Projected Impact
        </p>
        {[
          [
            "Default Rate",
            `${(result.projectedDefaultRate * 100).toFixed(2)}%`,
            result.projectedDefaultRate < 0.032,
          ],
          [
            "Monthly Volume",
            formatCurrency(result.projectedVolume),
            result.projectedVolume >= 7500000,
          ],
          [
            "Monthly Revenue",
            formatCurrency(result.projectedRevenue),
            result.revenueImpact >= 0,
          ],
          [
            "Buyers Affected",
            String(result.buyersAffected),
            result.buyersAffected === 0,
          ],
          [
            "Revenue Impact",
            `${result.revenueImpact >= 0 ? "+" : ""}${formatCurrency(result.revenueImpact)}/mo`,
            result.revenueImpact >= 0,
          ],
        ].map(([label, value, isPositive]) => (
          <div key={label as string} className="flex items-center justify-between">
            <span className="text-xs text-[#9ca3af]">{label as string}</span>
            <span
              className={`text-xs font-bold ${isPositive ? "text-[#1DB954]" : "text-[#ef4444]"}`}
            >
              {value as string}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
